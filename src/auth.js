/**
 * Multi-account authentication pool for Codeium/Windsurf.
 *
 * Features:
 *   - Multiple accounts with round-robin load balancing
 *   - Account health tracking (error count, auto-disable)
 *   - Dynamic add/remove via API
 *   - Token-based registration via api.codeium.com
 *   - Optional sticky sessions (STICKY_SESSION_ENABLED=1) for multi-turn
 *     conversation continuity (#93, #133)
 */

import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { isStickyEnabled, getStickyBinding, setStickyBinding, clearStickyBinding } from './account/sticky-session.js';
import { isExperimentalEnabled } from './runtime-config.js';
import { readFileSync, writeFileSync, existsSync, renameSync, unlinkSync, readdirSync } from 'fs';
import { config, log } from './config.js';
import { getEffectiveProxy } from './dashboard/proxy-config.js';
import { getTierModels, getModelKeysByEnum, MODELS, registerDiscoveredFreeModel } from './models.js';

import { join } from 'path';
// accounts.json lives in the cluster-shared dir so add-account writes from
// one replica survive future restarts and are visible to every replica.
// See `src/config.js` (sharedDataDir vs dataDir) and issue #67.
const ACCOUNTS_FILE = join(config.sharedDataDir || config.dataDir, 'accounts.json');

// ─── Account pool ──────────────────────────────────────────

const accounts = [];
let _roundRobinIndex = 0;
let _bindHost = '0.0.0.0';

// Per-tier requests-per-minute limits. Used for both filter-by-cap and
// weighted selection (accounts with more headroom are preferred).
const TIER_RPM = { pro: 60, free: 10, unknown: 20, expired: 0 };
const RPM_WINDOW_MS = 60 * 1000;

// Monotonic per-process counter so two reservations landing in the same
// millisecond produce distinct `_rpmHistory` tokens. Without this,
// `refundReservation()` could remove the wrong reservation under
// concurrent traffic. The fractional offset stays well below 1ms so
// numerical comparisons against ms-based cutoffs still work as expected.
let reservationSeq = 0;
function nextReservationToken(now) {
  reservationSeq = (reservationSeq + 1) % 1000;
  return now + reservationSeq / 1000;
}

// Strict positive int env reader (mirrors the helper in client.js /
// conversation-pool.js). Used by the dynamic cloud probe path below; when
// this was missing the probe path crashed with "positiveIntEnv is not
// defined" on every refresh cycle and free-account model discovery
// silently stopped working.
function positiveIntEnv(name, fallback) {
  const n = parseInt(process.env[name] || '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function rpmLimitFor(account) {
  return TIER_RPM[account.tier || 'unknown'] ?? 20;
}

// v2.0.57 Fix 4 — quota headroom score. Reads the min of daily% and
// weekly% from the account's last refreshed credits snapshot. When both
// are unknown (probe never landed), assume 100 so unprobed accounts
// don't get demoted to last-pick. Returns 0..100.
export function quotaScore(account) {
  const c = account?.credits;
  if (!c || typeof c !== 'object') return 100;
  const d = typeof c.dailyPercent === 'number' ? c.dailyPercent : 100;
  const w = typeof c.weeklyPercent === 'number' ? c.weeklyPercent : 100;
  return Math.max(0, Math.min(100, Math.min(d, w)));
}

// v2.0.57 Fix 5 — drought mode. True iff every active account has
// weeklyPercent < threshold. Operators see this on the dashboard so
// they can buy more accounts / wait for reset rather than chasing
// individual rate-limit errors.
const DROUGHT_THRESHOLD = 5;

export function isDroughtMode() {
  const eligible = accounts.filter(a => a.status === 'active');
  if (!eligible.length) return false;
  let knownCount = 0;
  let droughtCount = 0;
  for (const a of eligible) {
    const c = a?.credits;
    const w = c && typeof c.weeklyPercent === 'number' ? c.weeklyPercent : null;
    if (w == null) continue;
    knownCount++;
    if (w < DROUGHT_THRESHOLD) droughtCount++;
  }
  if (!knownCount) return false; // no quota data yet — assume not drought
  return droughtCount === knownCount;
}

// v2.0.58 — drought-mode premium-model gate. Default ON (changes
// behaviour but drought is exceptional, and operators reported wanting
// the proxy to stop wasting upstream calls when no quota remains).
// Toggle via env DROUGHT_RESTRICT_PREMIUM=0 to disable globally, or via
// the dashboard experimental flag `droughtRestrictPremium` (which the
// chat path reads through runtime-config).
function _droughtRestrictEnvDefault() {
  return process.env.DROUGHT_RESTRICT_PREMIUM !== '0';
}

export function isDroughtRestrictEnabled() {
  // env override wins; otherwise consult runtime-config (deferred import
  // to avoid the same load-order issue documented in validateApiKey).
  if (process.env.DROUGHT_RESTRICT_PREMIUM === '0') return false;
  if (process.env.DROUGHT_RESTRICT_PREMIUM === '1') return true;
  // No explicit env → use runtime-config default (true).
  if (_droughtRestrictResolver) {
    try { return !!_droughtRestrictResolver(); } catch { /* fall through */ }
  }
  return _droughtRestrictEnvDefault();
}

let _droughtRestrictResolver = null;
export function setDroughtRestrictResolver(fn) {
  _droughtRestrictResolver = typeof fn === 'function' ? fn : null;
}

/**
 * True when drought mode is active AND the operator has restriction
 * enabled AND the requested model is NOT in the free-tier allowlist.
 * Free-tier models keep running because they don't burn weekly quota
 * the way premium models do.
 */
export function isModelBlockedByDrought(modelKey) {
  if (!modelKey) return false;
  if (!isDroughtRestrictEnabled()) return false;
  if (!isDroughtMode()) return false;
  const freeModels = new Set(getTierModels('free'));
  return !freeModels.has(modelKey);
}

export function getDroughtSummary() {
  const eligible = accounts.filter(a => a.status === 'active');
  let lowestWeekly = null;
  let lowestDaily = null;
  let knownAccounts = 0;
  for (const a of eligible) {
    const c = a?.credits;
    if (!c) continue;
    knownAccounts++;
    if (typeof c.weeklyPercent === 'number') {
      lowestWeekly = lowestWeekly == null ? c.weeklyPercent : Math.min(lowestWeekly, c.weeklyPercent);
    }
    if (typeof c.dailyPercent === 'number') {
      lowestDaily = lowestDaily == null ? c.dailyPercent : Math.min(lowestDaily, c.dailyPercent);
    }
  }
  return {
    drought: isDroughtMode(),
    threshold: DROUGHT_THRESHOLD,
    activeAccounts: eligible.length,
    knownAccounts,
    lowestWeeklyPercent: lowestWeekly,
    lowestDailyPercent: lowestDaily,
    restrictEnabled: isDroughtRestrictEnabled(),
    freeTierModels: getTierModels('free'),
  };
}

function pruneRpmHistory(account, now) {
  if (!account._rpmHistory) account._rpmHistory = [];
  const cutoff = now - RPM_WINDOW_MS;
  while (account._rpmHistory.length && account._rpmHistory[0] < cutoff) {
    account._rpmHistory.shift();
  }
  return account._rpmHistory.length;
}

// Serialize concurrent saveAccounts calls — multiple async paths
// (reportSuccess / markRateLimited / updateCapability / probe) can fire
// together; without a mutex the last writer wins on stale memory state.
let _saveInFlight = false;
let _savePending = false;
function _serializeAccounts() {
  return accounts.map(a => ({
    id: a.id, email: a.email, apiKey: a.apiKey,
    apiServerUrl: a.apiServerUrl, method: a.method,
    status: a.status, addedAt: a.addedAt,
    tier: a.tier, tierManual: !!a.tierManual,
    capabilities: a.capabilities, lastProbed: a.lastProbed,
    credits: a.credits || null,
    blockedModels: a.blockedModels || [],
    refreshToken: a.refreshToken || '',
    // From GetUserStatus — the authoritative tier/entitlement snapshot.
    userStatus: a.userStatus || null,
    userStatusLastFetched: a.userStatusLastFetched || 0,
  }));
}

function saveAccounts() {
  if (_saveInFlight) { _savePending = true; return; }
  _saveInFlight = true;
  const tempFile = ACCOUNTS_FILE + '.tmp';
  try {
    // Atomic write: write to .tmp then rename so a crash mid-write can't
    // leave accounts.json truncated/corrupt. Node's renameSync is atomic
    // on POSIX and replaces the target on Windows (fs.rename behavior).
    writeFileSync(tempFile, JSON.stringify(_serializeAccounts(), null, 2));
    renameSync(tempFile, ACCOUNTS_FILE);
  } catch (e) {
    log.error('Failed to save accounts:', e.message);
    try { unlinkSync(tempFile); } catch {}
  } finally {
    _saveInFlight = false;
    if (_savePending) { _savePending = false; setImmediate(saveAccounts); }
  }
}

/**
 * Synchronous last-resort flush for the shutdown path. Bypasses the
 * _saveInFlight mutex (any queued async save would be killed by
 * process.exit before it finished anyway). Tolerates being called after
 * an in-flight save — the rename on top of a partial temp file is still
 * atomic.
 */
export function saveAccountsSync() {
  const tempFile = ACCOUNTS_FILE + '.shutdown.tmp';
  try {
    writeFileSync(tempFile, JSON.stringify(_serializeAccounts(), null, 2));
    renameSync(tempFile, ACCOUNTS_FILE);
  } catch (e) {
    log.error('Shutdown: failed to flush accounts:', e.message);
    try { unlinkSync(tempFile); } catch {}
  }
}

// Issue #67 — accounts.json used to live under `dataDir` which became
// per-replica when REPLICA_ISOLATE=1 shipped (commit 35700bb). Each
// docker-compose upgrade gets a fresh container HOSTNAME so the previous
// run's accounts ended up orphaned under a stale `replica-<old>/` subdir.
// On startup, if the shared accounts.json is missing but one or more
// replica-local copies exist, union them by apiKey and write into the
// shared path. Survives multiple stale subdirs across upgrade cycles.
//
// Pure-function form is exported so tests can drive it without booting
// the whole auth module against a real config.
export function migrateReplicaAccountsTo({ sharedDir, accountsFile, logger = log }) {
  if (existsSync(accountsFile)) return { migrated: 0, scanned: 0, skipped: true };
  let entries;
  try {
    entries = readdirSync(sharedDir).filter(n => n.startsWith('replica-'));
  } catch { return { migrated: 0, scanned: 0, skipped: true }; }
  if (!entries.length) return { migrated: 0, scanned: 0, skipped: true };
  const merged = new Map();
  let scanned = 0;
  for (const entry of entries) {
    const legacyPath = join(sharedDir, entry, 'accounts.json');
    if (!existsSync(legacyPath)) continue;
    scanned++;
    try {
      const data = JSON.parse(readFileSync(legacyPath, 'utf-8'));
      if (!Array.isArray(data)) continue;
      for (const a of data) {
        if (a?.apiKey && !merged.has(a.apiKey)) merged.set(a.apiKey, a);
      }
    } catch (e) {
      logger.warn?.(`Account migration: skipped ${legacyPath}: ${e.message}`);
    }
  }
  if (!merged.size) return { migrated: 0, scanned, skipped: false };
  const tempFile = accountsFile + '.migrate.tmp';
  try {
    writeFileSync(tempFile, JSON.stringify([...merged.values()], null, 2));
    renameSync(tempFile, accountsFile);
    logger.warn?.(`Migrated ${merged.size} account(s) from ${scanned} replica-* subdir(s) into ${accountsFile} (issue #67)`);
    return { migrated: merged.size, scanned, skipped: false };
  } catch (e) {
    logger.error?.(`Account migration write failed: ${e.message}`);
    try { unlinkSync(tempFile); } catch {}
    return { migrated: 0, scanned, skipped: false, error: e.message };
  }
}

function loadAccounts() {
  try {
    migrateReplicaAccountsTo({
      sharedDir: config.sharedDataDir || config.dataDir,
      accountsFile: ACCOUNTS_FILE,
    });
    if (!existsSync(ACCOUNTS_FILE)) return;
    const data = JSON.parse(readFileSync(ACCOUNTS_FILE, 'utf-8'));

    // Per-instance account allowlist. When set, only accounts whose email or
    // id match one of the comma-separated entries are loaded. This lets
    // multi-port deployments (e.g. port 3003 for account A, port 3004 for
    // account B) share a single accounts.json while keeping each port
    // isolated to its own account subset.
    const allowlist = (process.env.WAPI_ACCOUNTS_ONLY || '').split(',').map(s => s.trim()).filter(Boolean);

    for (const a of data) {
      if (accounts.find(x => x.apiKey === a.apiKey)) continue;
      if (allowlist.length > 0) {
        const ok = allowlist.some(w => a.email === w || a.id === w);
        if (!ok) {
          log.debug(`Account ${a.email} (${a.id || '?'}) filtered out by WAPI_ACCOUNTS_ONLY`);
          continue;
        }
      }
      accounts.push({
        id: a.id || randomUUID().slice(0, 8),
        email: a.email, apiKey: a.apiKey,
        apiServerUrl: a.apiServerUrl || '',
        method: a.method || 'api_key',
        status: a.status || 'active',
        lastUsed: 0, errorCount: 0,
        refreshToken: a.refreshToken || '', expiresAt: 0, refreshTimer: null,
        addedAt: a.addedAt || Date.now(),
        tier: a.tier || 'unknown',
        capabilities: a.capabilities || {},
        lastProbed: a.lastProbed || 0,
        credits: a.credits || null,
        blockedModels: Array.isArray(a.blockedModels) ? a.blockedModels : [],
        tierManual: !!a.tierManual,
        userStatus: a.userStatus || null,
        userStatusLastFetched: a.userStatusLastFetched || 0,
      });
    }
    if (data.length > 0) log.info(`Loaded ${accounts.length} account(s) from disk${allowlist.length > 0 ? ' (filtered by WAPI_ACCOUNTS_ONLY)' : ''}`);
  } catch (e) {
    log.error('Failed to load accounts:', e.message);
  }
}