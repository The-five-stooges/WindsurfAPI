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