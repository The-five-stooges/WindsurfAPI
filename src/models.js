/**
 * Model catalog — merged from hardcoded enum values + live GetCascadeModelConfigs.
 *
 * Routing logic:
 *   modelUid present  → Cascade flow (StartCascade → SendUserCascadeMessage)
 *   only enumValue>0  → RawGetChatMessage (legacy)
 *
 * Credit multipliers sourced from GetCascadeModelConfigs (server.codeium.com).
 * Enum values sourced from Windsurf extension.js decompilation.
 */

export const MODELS = {
  // ── Claude ──────────────────────────────────────────────
  // Legacy 3.5 / 3.7 series — only have enumValue (legacy RawGetChatMessage flow), no modelUid.
  // Cascade upstream returns "neither PlanModel nor RequestedModel specified" for all three;
  // chat.js translates that to 410 model_deprecated when the catalog flag is set. issue #109.
  'claude-3.5-sonnet':              { name: 'claude-3.5-sonnet',              provider: 'anthropic', enumValue: 166, credit: 2, deprecated: true },
  'claude-3.7-sonnet':              { name: 'claude-3.7-sonnet',              provider: 'anthropic', enumValue: 226, credit: 2, deprecated: true },
  'claude-3.7-sonnet-thinking':     { name: 'claude-3.7-sonnet-thinking',     provider: 'anthropic', enumValue: 227, credit: 3, deprecated: true },
  'claude-4-sonnet':                { name: 'claude-4-sonnet',                provider: 'anthropic', enumValue: 281, modelUid: 'MODEL_CLAUDE_4_SONNET', credit: 2 },
  'claude-4-sonnet-thinking':       { name: 'claude-4-sonnet-thinking',       provider: 'anthropic', enumValue: 282, modelUid: 'MODEL_CLAUDE_4_SONNET_THINKING', credit: 3 },
  'claude-4-opus':                  { name: 'claude-4-opus',                  provider: 'anthropic', enumValue: 290, modelUid: 'MODEL_CLAUDE_4_OPUS', credit: 4 },
  'claude-4-opus-thinking':         { name: 'claude-4-opus-thinking',         provider: 'anthropic', enumValue: 291, modelUid: 'MODEL_CLAUDE_4_OPUS_THINKING', credit: 5 },
  'claude-4.1-opus':                { name: 'claude-4.1-opus',                provider: 'anthropic', enumValue: 328, modelUid: 'MODEL_CLAUDE_4_1_OPUS', credit: 4 },
  'claude-4.1-opus-thinking':       { name: 'claude-4.1-opus-thinking',       provider: 'anthropic', enumValue: 329, modelUid: 'MODEL_CLAUDE_4_1_OPUS_THINKING', credit: 5 },
  'claude-4.5-haiku':               { name: 'claude-4.5-haiku',               provider: 'anthropic', enumValue: 0,   modelUid: 'MODEL_PRIVATE_11', credit: 1 },
  'claude-4.5-sonnet':              { name: 'claude-4.5-sonnet',              provider: 'anthropic', enumValue: 353, modelUid: 'MODEL_PRIVATE_2', credit: 2 },
  'claude-4.5-sonnet-thinking':     { name: 'claude-4.5-sonnet-thinking',     provider: 'anthropic', enumValue: 354, modelUid: 'MODEL_PRIVATE_3', credit: 3 },
  'claude-4.5-opus':                { name: 'claude-4.5-opus',                provider: 'anthropic', enumValue: 391, modelUid: 'MODEL_CLAUDE_4_5_OPUS', credit: 4 },
  'claude-4.5-opus-thinking':       { name: 'claude-4.5-opus-thinking',       provider: 'anthropic', enumValue: 392, modelUid: 'MODEL_CLAUDE_4_5_OPUS_THINKING', credit: 5 },
  'claude-sonnet-4.6':              { name: 'claude-sonnet-4.6',              provider: 'anthropic', enumValue: 0,   modelUid: 'claude-sonnet-4-6', credit: 4 },
  'claude-sonnet-4.6-thinking':     { name: 'claude-sonnet-4.6-thinking',     provider: 'anthropic', enumValue: 0,   modelUid: 'claude-sonnet-4-6-thinking', credit: 6 },
  'claude-sonnet-4.6-1m':           { name: 'claude-sonnet-4.6-1m',           provider: 'anthropic', enumValue: 0,   modelUid: 'claude-sonnet-4-6-1m', credit: 12 },
  'claude-sonnet-4.6-thinking-1m':  { name: 'claude-sonnet-4.6-thinking-1m',  provider: 'anthropic', enumValue: 0,   modelUid: 'claude-sonnet-4-6-thinking-1m', credit: 16 },
  'claude-opus-4.6':                 { name: 'claude-opus-4.6',                 provider: 'anthropic', enumValue: 104, modelUid: 'claude-opus-4-6', credit: 6 },
  'claude-opus-4-6-fast':           { name: 'claude-opus-4-6-fast',           provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-6-fast', credit: 12 },
  'claude-opus-4.6-thinking':       { name: 'claude-opus-4.6-thinking',       provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-6-thinking', credit: 8 },
  'claude-opus-4-6-1m-max':         { name: 'claude-opus-4-6-1m-max',         provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-6-1m-max', credit: 24 },
  'claude-opus-4-6-thinking-1m-max': { name: 'claude-opus-4-6-thinking-1m-max', provider: 'anthropic', enumValue: 0, modelUid: 'claude-opus-4-6-thinking-1m-max', credit: 32 },
  // Claude Opus 4.7 — Windsurf changelog 2026-04-16; new xhigh effort tier vs 4.6.
  // `medium` is the canonical default; low/high/xhigh/max are reasoning tiers,
  // each can be paired with -thinking for visible chain-of-thought.
  'claude-opus-4-7-medium':         { name: 'claude-opus-4-7-medium',         provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-medium', credit: 8 },
  'claude-opus-4-7-low':            { name: 'claude-opus-4-7-low',            provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-low', credit: 6 },
  'claude-opus-4-7-high':           { name: 'claude-opus-4-7-high',           provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-high', credit: 10 },
  'claude-opus-4-7-xhigh':          { name: 'claude-opus-4-7-xhigh',          provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-xhigh', credit: 12 },
  'claude-opus-4-7-medium-thinking': { name: 'claude-opus-4-7-medium-thinking', provider: 'anthropic', enumValue: 0, modelUid: 'claude-opus-4-7-medium-thinking', credit: 10 },
  'claude-opus-4-7-high-thinking':  { name: 'claude-opus-4-7-high-thinking',  provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-high-thinking', credit: 12 },
  'claude-opus-4-7-xhigh-thinking': { name: 'claude-opus-4-7-xhigh-thinking', provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-xhigh-thinking', credit: 16 },
  // `max` reasoning tier appeared in GetCascadeModelConfigs after the 4.7 launch — sits
  // above xhigh in the effort ladder. No -thinking sibling in cloud catalog yet.
  'claude-opus-4-7-max':            { name: 'claude-opus-4-7-max',            provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-max', credit: 16 },
  // Opus 4.7 fast (priority) lane — 2× credit for reduced latency.
  'claude-opus-4-7-low-fast':       { name: 'claude-opus-4-7-low-fast',       provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-low-fast', credit: 12 },
  'claude-opus-4-7-medium-fast':    { name: 'claude-opus-4-7-medium-fast',    provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-medium-fast', credit: 16 },
  'claude-opus-4-7-high-fast':      { name: 'claude-opus-4-7-high-fast',      provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-high-fast', credit: 20 },
  'claude-opus-4-7-xhigh-fast':     { name: 'claude-opus-4-7-xhigh-fast',     provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-xhigh-fast', credit: 24 },
  'claude-opus-4-7-max-fast':       { name: 'claude-opus-4-7-max-fast',       provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-7-max-fast', credit: 32 },
  // Claude Opus 4.8 — not yet deployed on Cascade server (absent from LS v2.3.15).
  'claude-opus-4-8-medium':         { name: 'claude-opus-4-8-medium',         provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-medium', credit: 8, deprecated: true },
  'claude-opus-4-8-low':            { name: 'claude-opus-4-8-low',            provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-low', credit: 6, deprecated: true },
  'claude-opus-4-8-high':           { name: 'claude-opus-4-8-high',           provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-high', credit: 10, deprecated: true },
  'claude-opus-4-8-xhigh':          { name: 'claude-opus-4-8-xhigh',          provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-xhigh', credit: 12, deprecated: true },
  'claude-opus-4-8-medium-thinking': { name: 'claude-opus-4-8-medium-thinking', provider: 'anthropic', enumValue: 0, modelUid: 'claude-opus-4-8-medium-thinking', credit: 10, deprecated: true },
  'claude-opus-4-8-high-thinking':  { name: 'claude-opus-4-8-high-thinking',  provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-high-thinking', credit: 12, deprecated: true },
  'claude-opus-4-8-xhigh-thinking': { name: 'claude-opus-4-8-xhigh-thinking', provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-xhigh-thinking', credit: 16, deprecated: true },
  'claude-opus-4-8-max':            { name: 'claude-opus-4-8-max',            provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-max', credit: 16, deprecated: true },
  'claude-opus-4-8-low-fast':       { name: 'claude-opus-4-8-low-fast',       provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-low-fast', credit: 12, deprecated: true },
  'claude-opus-4-8-medium-fast':    { name: 'claude-opus-4-8-medium-fast',    provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-medium-fast', credit: 16, deprecated: true },
  'claude-opus-4-8-high-fast':      { name: 'claude-opus-4-8-high-fast',      provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-high-fast', credit: 20, deprecated: true },
  'claude-opus-4-8-xhigh-fast':     { name: 'claude-opus-4-8-xhigh-fast',     provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-xhigh-fast', credit: 24, deprecated: true },
  'claude-opus-4-8-max-fast':       { name: 'claude-opus-4-8-max-fast',       provider: 'anthropic', enumValue: 0,   modelUid: 'claude-opus-4-8-max-fast', credit: 32, deprecated: true },

  // ── GPT ─────────────────────────────────────────────────
  'gpt-4o':                         { name: 'gpt-4o',                         provider: 'openai', enumValue: 109, modelUid: 'MODEL_CHAT_GPT_4O_2024_08_06', credit: 1 },
  'gpt-4o-mini':                    { name: 'gpt-4o-mini',                    provider: 'openai', enumValue: 113, credit: 0.5, deprecated: true },
  'gpt-4.1':                        { name: 'gpt-4.1',                        provider: 'openai', enumValue: 259, modelUid: 'MODEL_CHAT_GPT_4_1_2025_04_14', credit: 1 },
  'gpt-4.1-mini':                   { name: 'gpt-4.1-mini',                   provider: 'openai', enumValue: 260, credit: 0.5, deprecated: true },
  'gpt-4.1-nano':                   { name: 'gpt-4.1-nano',                   provider: 'openai', enumValue: 261, credit: 0.25, deprecated: true },
  'gpt-5':                          { name: 'gpt-5',                          provider: 'openai', enumValue: 340, modelUid: 'MODEL_PRIVATE_6', credit: 0.5 },
  'gpt-5-medium':                   { name: 'gpt-5-medium',                   provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_7', credit: 1 },
  'gpt-5-high':                     { name: 'gpt-5-high',                     provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_8', credit: 2 },
  'gpt-5-mini':                     { name: 'gpt-5-mini',                     provider: 'openai', enumValue: 337, credit: 0.25, deprecated: true },
  'gpt-5-codex':                    { name: 'gpt-5-codex',                    provider: 'openai', enumValue: 346, modelUid: 'MODEL_CHAT_GPT_5_CODEX', credit: 0.5 },

  // GPT-5.1
  'gpt-5.1':                        { name: 'gpt-5.1',                        provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_12', credit: 0.5 },
  'gpt-5.1-low':                    { name: 'gpt-5.1-low',                    provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_13', credit: 0.5 },
  'gpt-5.1-medium':                 { name: 'gpt-5.1-medium',                 provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_14', credit: 1 },
  'gpt-5.1-high':                   { name: 'gpt-5.1-high',                   provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_15', credit: 2 },
  'gpt-5.1-fast':                   { name: 'gpt-5.1-fast',                   provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_20', credit: 1 },
  'gpt-5.1-low-fast':               { name: 'gpt-5.1-low-fast',               provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_21', credit: 1 },
  'gpt-5.1-medium-fast':            { name: 'gpt-5.1-medium-fast',            provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_22', credit: 2 },
  'gpt-5.1-high-fast':              { name: 'gpt-5.1-high-fast',              provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_23', credit: 4 },

  // GPT-5.1 Codex
  'gpt-5.1-codex-low':              { name: 'gpt-5.1-codex-low',              provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_1_CODEX_LOW', credit: 0.5 },
  'gpt-5.1-codex-medium':           { name: 'gpt-5.1-codex-medium',           provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_9', credit: 1 },
  'gpt-5.1-codex-mini-low':         { name: 'gpt-5.1-codex-mini-low',         provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_1_CODEX_MINI_LOW', credit: 0.25 },
  'gpt-5.1-codex-mini':             { name: 'gpt-5.1-codex-mini',             provider: 'openai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_19', credit: 0.5 },
  'gpt-5.1-codex-max-low':          { name: 'gpt-5.1-codex-max-low',          provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_1_CODEX_MAX_LOW', credit: 1 },
  'gpt-5.1-codex-max-medium':       { name: 'gpt-5.1-codex-max-medium',       provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_1_CODEX_MAX_MEDIUM', credit: 1.25 },
  'gpt-5.1-codex-max-high':         { name: 'gpt-5.1-codex-max-high',         provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_1_CODEX_MAX_HIGH', credit: 1.5 },

  // GPT-5.2
  'gpt-5.2':                        { name: 'gpt-5.2',                        provider: 'openai', enumValue: 401, modelUid: 'MODEL_GPT_5_2_MEDIUM', credit: 2 },
  'gpt-5.2-none':                   { name: 'gpt-5.2-none',                   provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_NONE', credit: 1 },
  'gpt-5.2-low':                    { name: 'gpt-5.2-low',                    provider: 'openai', enumValue: 400, modelUid: 'MODEL_GPT_5_2_LOW', credit: 1 },
  'gpt-5.2-high':                   { name: 'gpt-5.2-high',                   provider: 'openai', enumValue: 402, modelUid: 'MODEL_GPT_5_2_HIGH', credit: 3 },
  'gpt-5.2-xhigh':                  { name: 'gpt-5.2-xhigh',                  provider: 'openai', enumValue: 403, modelUid: 'MODEL_GPT_5_2_XHIGH', credit: 8 },
  'gpt-5.2-none-fast':              { name: 'gpt-5.2-none-fast',              provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_NONE_PRIORITY', credit: 2 },
  'gpt-5.2-low-fast':               { name: 'gpt-5.2-low-fast',               provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_LOW_PRIORITY', credit: 2 },
  'gpt-5.2-medium-fast':            { name: 'gpt-5.2-medium-fast',            provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_MEDIUM_PRIORITY', credit: 4 },
  'gpt-5.2-high-fast':              { name: 'gpt-5.2-high-fast',              provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_HIGH_PRIORITY', credit: 6 },
  'gpt-5.2-xhigh-fast':             { name: 'gpt-5.2-xhigh-fast',             provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_XHIGH_PRIORITY', credit: 16 },

  // GPT-5.2 Codex
  'gpt-5.2-codex-low':              { name: 'gpt-5.2-codex-low',              provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_LOW', credit: 1 },
  'gpt-5.2-codex-medium':           { name: 'gpt-5.2-codex-medium',           provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_MEDIUM', credit: 1 },
  'gpt-5.2-codex-high':             { name: 'gpt-5.2-codex-high',             provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_HIGH', credit: 2 },
  'gpt-5.2-codex-xhigh':            { name: 'gpt-5.2-codex-xhigh',            provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_XHIGH', credit: 3 },
  'gpt-5.2-codex-low-fast':         { name: 'gpt-5.2-codex-low-fast',         provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_LOW_PRIORITY', credit: 2 },
  'gpt-5.2-codex-medium-fast':      { name: 'gpt-5.2-codex-medium-fast',      provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_MEDIUM_PRIORITY', credit: 2 },
  'gpt-5.2-codex-high-fast':        { name: 'gpt-5.2-codex-high-fast',        provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_HIGH_PRIORITY', credit: 4 },
  'gpt-5.2-codex-xhigh-fast':       { name: 'gpt-5.2-codex-xhigh-fast',       provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_5_2_CODEX_XHIGH_PRIORITY', credit: 6 },

  // GPT-5.3 Codex (legacy key)
  'gpt-5.3-codex':                  { name: 'gpt-5.3-codex',                  provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-medium', credit: 1 },

  // GPT-5.4
  'gpt-5.4-none':                   { name: 'gpt-5.4-none',                   provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-none', credit: 0.5 },
  'gpt-5.4-low':                    { name: 'gpt-5.4-low',                    provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-low', credit: 1 },
  'gpt-5.4-medium':                 { name: 'gpt-5.4-medium',                 provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-medium', credit: 2 },
  'gpt-5.4-high':                   { name: 'gpt-5.4-high',                   provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-high', credit: 4 },
  'gpt-5.4-xhigh':                  { name: 'gpt-5.4-xhigh',                  provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-xhigh', credit: 8 },
  'gpt-5.4-mini-low':               { name: 'gpt-5.4-mini-low',               provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-mini-low', credit: 1.5 },
  'gpt-5.4-mini-medium':            { name: 'gpt-5.4-mini-medium',            provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-mini-medium', credit: 1.5 },
  'gpt-5.4-mini-high':              { name: 'gpt-5.4-mini-high',              provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-mini-high', credit: 4.5 },
  'gpt-5.4-mini-xhigh':             { name: 'gpt-5.4-mini-xhigh',             provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-4-mini-xhigh', credit: 12 },

  // GPT-5.5 — Windsurf catalog 2026-04-30. Same effort ladder as 5.2/5.4 (none/low/medium/high/xhigh)
  // with priority (=fast) lane equivalents. Bare `gpt-5.5` defaults to medium.
  'gpt-5.5':                        { name: 'gpt-5.5',                        provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-medium', credit: 2 },
  'gpt-5.5-none':                   { name: 'gpt-5.5-none',                   provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-none', credit: 1 },
  'gpt-5.5-low':                    { name: 'gpt-5.5-low',                    provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-low', credit: 1 },
  'gpt-5.5-medium':                 { name: 'gpt-5.5-medium',                 provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-medium', credit: 2 },
  'gpt-5.5-high':                   { name: 'gpt-5.5-high',                   provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-high', credit: 4 },
  'gpt-5.5-xhigh':                  { name: 'gpt-5.5-xhigh',                  provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-xhigh', credit: 8 },
  'gpt-5.5-none-fast':              { name: 'gpt-5.5-none-fast',              provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-none-priority', credit: 2 },
  'gpt-5.5-low-fast':               { name: 'gpt-5.5-low-fast',               provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-low-priority', credit: 2 },
  'gpt-5.5-medium-fast':            { name: 'gpt-5.5-medium-fast',            provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-medium-priority', credit: 4 },
  'gpt-5.5-high-fast':              { name: 'gpt-5.5-high-fast',              provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-high-priority', credit: 8 },
  'gpt-5.5-xhigh-fast':             { name: 'gpt-5.5-xhigh-fast',             provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-5-xhigh-priority', credit: 16 },

  // GPT-5.3 Codex — already had bare `gpt-5.3-codex` (legacy alias), now expose tier variants.
  'gpt-5.3-codex-low':              { name: 'gpt-5.3-codex-low',              provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-low', credit: 0.5 },
  'gpt-5.3-codex-high':             { name: 'gpt-5.3-codex-high',             provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-high', credit: 2 },
  'gpt-5.3-codex-xhigh':            { name: 'gpt-5.3-codex-xhigh',            provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-xhigh', credit: 4 },
  'gpt-5.3-codex-low-fast':         { name: 'gpt-5.3-codex-low-fast',         provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-low-priority', credit: 1 },
  'gpt-5.3-codex-medium-fast':      { name: 'gpt-5.3-codex-medium-fast',      provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-medium-priority', credit: 2 },
  'gpt-5.3-codex-high-fast':        { name: 'gpt-5.3-codex-high-fast',        provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-high-priority', credit: 4 },
  'gpt-5.3-codex-xhigh-fast':       { name: 'gpt-5.3-codex-xhigh-fast',       provider: 'openai', enumValue: 0,   modelUid: 'gpt-5-3-codex-xhigh-priority', credit: 6 },

  // GPT-OSS
  'gpt-oss-120b':                   { name: 'gpt-oss-120b',                   provider: 'openai', enumValue: 0,   modelUid: 'MODEL_GPT_OSS_120B', credit: 0.25 },

  // ── O-series ────────────────────────────────────────────
  'o3-mini':                        { name: 'o3-mini',                        provider: 'openai', enumValue: 207, credit: 0.5 },
  'o3':                             { name: 'o3',                             provider: 'openai', enumValue: 218, modelUid: 'MODEL_CHAT_O3', credit: 1 },
  'o3-high':                        { name: 'o3-high',                        provider: 'openai', enumValue: 0,   modelUid: 'MODEL_CHAT_O3_HIGH', credit: 1 },
  'o3-pro':                         { name: 'o3-pro',                         provider: 'openai', enumValue: 294, credit: 4 },
  'o4-mini':                        { name: 'o4-mini',                        provider: 'openai', enumValue: 264, credit: 0.5 },

  // ── Astraflow (UCloud) ─────────────────────────────────────
  // Astraflow is an OpenAI-compatible aggregation platform supporting 200+ models.
  // Global endpoint: https://api-us-ca.umodelverse.ai/v1  (ASTRAFLOW_API_KEY)
  // China  endpoint: https://api.modelverse.cn/v1         (ASTRAFLOW_CN_API_KEY)
  // Website: https://astraflow.ucloud-global.com (global) / https://astraflow.ucloud.cn (CN)
  // These entries use provider:'astraflow' and set enumValue:0 / modelUid equal to the
  // upstream model ID so the passthrough layer can forward them to the Astraflow base URL.
  'astraflow/gpt-4o':               { name: 'astraflow/gpt-4o',               provider: 'astraflow', enumValue: 0, modelUid: 'gpt-4o',                    credit: 1 },
  'astraflow/gpt-4.1':              { name: 'astraflow/gpt-4.1',              provider: 'astraflow', enumValue: 0, modelUid: 'gpt-4.1',                   credit: 1 },
  'astraflow/gpt-4o-mini':          { name: 'astraflow/gpt-4o-mini',          provider: 'astraflow', enumValue: 0, modelUid: 'gpt-4o-mini',               credit: 0.5 },
  'astraflow/claude-3.5-sonnet':    { name: 'astraflow/claude-3.5-sonnet',    provider: 'astraflow', enumValue: 0, modelUid: 'claude-3-5-sonnet-20241022', credit: 2 },
  'astraflow/claude-3.7-sonnet':    { name: 'astraflow/claude-3.7-sonnet',    provider: 'astraflow', enumValue: 0, modelUid: 'claude-3-7-sonnet-20250219', credit: 2 },
  'astraflow/deepseek-v3':          { name: 'astraflow/deepseek-v3',          provider: 'astraflow', enumValue: 0, modelUid: 'deepseek-v3',               credit: 1 },
  'astraflow/deepseek-r1':          { name: 'astraflow/deepseek-r1',          provider: 'astraflow', enumValue: 0, modelUid: 'deepseek-r1',               credit: 2 },
  'astraflow/llama-3.3-70b':        { name: 'astraflow/llama-3.3-70b',        provider: 'astraflow', enumValue: 0, modelUid: 'llama-3.3-70b-instruct',    credit: 0.5 },
  'astraflow/gemini-2.0-flash':     { name: 'astraflow/gemini-2.0-flash',     provider: 'astraflow', enumValue: 0, modelUid: 'gemini-2.0-flash',          credit: 0.5 },

  // ── Gemini ──────────────────────────────────────────────
  'gemini-2.5-pro':                 { name: 'gemini-2.5-pro',                 provider: 'google', enumValue: 246, modelUid: 'MODEL_GOOGLE_GEMINI_2_5_PRO', credit: 1 },
  'gemini-2.5-flash':               { name: 'gemini-2.5-flash',               provider: 'google', enumValue: 312, modelUid: 'MODEL_GOOGLE_GEMINI_2_5_FLASH', credit: 0.5 },
  'gemini-3.0-pro':                 { name: 'gemini-3.0-pro',                 provider: 'google', enumValue: 412, modelUid: 'MODEL_GOOGLE_GEMINI_3_0_PRO_LOW', credit: 1 },
  'gemini-3.0-flash-minimal':       { name: 'gemini-3.0-flash-minimal',       provider: 'google', enumValue: 0,   modelUid: 'MODEL_GOOGLE_GEMINI_3_0_FLASH_MINIMAL', credit: 0.75 },
  'gemini-3.0-flash-low':           { name: 'gemini-3.0-flash-low',           provider: 'google', enumValue: 0,   modelUid: 'MODEL_GOOGLE_GEMINI_3_0_FLASH_LOW', credit: 1 },
  'gemini-3.0-flash':               { name: 'gemini-3.0-flash',               provider: 'google', enumValue: 415, modelUid: 'MODEL_GOOGLE_GEMINI_3_0_FLASH_MEDIUM', credit: 1 },
  'gemini-3.0-flash-high':          { name: 'gemini-3.0-flash-high',          provider: 'google', enumValue: 0,   modelUid: 'MODEL_GOOGLE_GEMINI_3_0_FLASH_HIGH', credit: 1.75 },
  'gemini-3.1-pro-low':             { name: 'gemini-3.1-pro-low',             provider: 'google', enumValue: 0,   modelUid: 'gemini-3-1-pro-low', credit: 1 },
  'gemini-3.1-pro-high':            { name: 'gemini-3.1-pro-high',            provider: 'google', enumValue: 0,   modelUid: 'gemini-3-1-pro-high', credit: 2 },

  // ── DeepSeek ────────────────────────────────────────────
  'deepseek-v3':                    { name: 'deepseek-v3',                    provider: 'deepseek', enumValue: 205, credit: 0.5, deprecated: true },
  'deepseek-v3-2':                  { name: 'deepseek-v3-2',                  provider: 'deepseek', enumValue: 409, credit: 0.5, deprecated: true },
  'deepseek-v4-pro':                { name: 'deepseek-v4-pro',                provider: 'deepseek', enumValue: 0,   modelUid: 'deepseek-v4-pro', credit: 2 },
  'deepseek-r1':                    { name: 'deepseek-r1',                    provider: 'deepseek', enumValue: 206, credit: 1, deprecated: true },

  // ── Grok ────────────────────────────────────────────────
  'grok-3':                         { name: 'grok-3',                         provider: 'xai', enumValue: 217, modelUid: 'MODEL_XAI_GROK_3', credit: 1 },
  'grok-3-mini':                    { name: 'grok-3-mini',                    provider: 'xai', enumValue: 234, credit: 0.5, deprecated: true },
  'grok-3-mini-thinking':           { name: 'grok-3-mini-thinking',           provider: 'xai', enumValue: 0,   modelUid: 'MODEL_XAI_GROK_3_MINI_REASONING', credit: 0.125 },
  'grok-code-fast-1':               { name: 'grok-code-fast-1',               provider: 'xai', enumValue: 0,   modelUid: 'MODEL_PRIVATE_4', credit: 0.5 },

  // ── Qwen ────────────────────────────────────────────────
  'qwen-3':                         { name: 'qwen-3',                         provider: 'alibaba', enumValue: 324, credit: 0.5, deprecated: true },
  // qwen-3-coder + qwen-3-coder-fast: exist in binary enum (325/327)
  // but cascade server doesn't have any routing registered for them —
  // both enum-only and explicit UIDs fail with 'model not found'.
  // Removed from catalog until upstream registers them.

  // ── Kimi ────────────────────────────────────────────────
  'kimi-k2':                        { name: 'kimi-k2',                        provider: 'moonshot', enumValue: 323, modelUid: 'MODEL_KIMI_K2', credit: 0.5 },
  'kimi-k2-thinking':               { name: 'kimi-k2-thinking',               provider: 'moonshot', enumValue: 394, modelUid: 'MODEL_KIMI_K2_THINKING', credit: 1 },
  'kimi-k2.5':                      { name: 'kimi-k2.5',                      provider: 'moonshot', enumValue: 0,   modelUid: 'kimi-k2-5', credit: 1 },
  'kimi-k2-6':                      { name: 'kimi-k2-6',                      provider: 'moonshot', enumValue: 0,   modelUid: 'kimi-k2-6', credit: 1 },

  // ── GLM ─────────────────────────────────────────────────
  'glm-4.7':                        { name: 'glm-4.7',                        provider: 'zhipu', enumValue: 417, modelUid: 'MODEL_GLM_4_7', credit: 0.25 },
  'glm-4.7-fast':                   { name: 'glm-4.7-fast',                   provider: 'zhipu', enumValue: 418, modelUid: 'MODEL_GLM_4_7_FAST', credit: 0.5 },
  'glm-5':                          { name: 'glm-5',                          provider: 'zhipu', enumValue: 0,   modelUid: 'glm-5', credit: 1.5 },
  'glm-5.1':                        { name: 'glm-5.1',                        provider: 'zhipu', enumValue: 0,   modelUid: 'glm-5-1', credit: 1.5 },

  // ── MiniMax ─────────────────────────────────────────────
  // proto enum 419 = MODEL_MINIMAX_M2_1; the canonical name in cloud configs is m2.5.
  'minimax-m2.5':                   { name: 'minimax-m2.5',                   provider: 'minimax', enumValue: 419, modelUid: 'MODEL_MINIMAX_M2_1', credit: 1 },

  // ── Windsurf SWE ────────────────────────────────────────
  // Proto canonical enums: 359=MODEL_SWE_1_5 (fast), 369=THINKING, 377=SLOW, 420=1_6, 421=1_6_FAST.
  // The default `swe-1.5` UID alias in upstream cloud config maps to the SLOW tier (377).
  'swe-1.5':                        { name: 'swe-1.5',                        provider: 'windsurf', enumValue: 377, modelUid: 'MODEL_SWE_1_5_SLOW', credit: 0.5 },
  'swe-1.5-fast':                   { name: 'swe-1.5-fast',                   provider: 'windsurf', enumValue: 359, modelUid: 'MODEL_SWE_1_5', credit: 0.5 },
  'swe-1.5-thinking':               { name: 'swe-1.5-thinking',               provider: 'windsurf', enumValue: 369, modelUid: 'MODEL_SWE_1_5_THINKING', credit: 0.75 },
  'swe-1.6':                        { name: 'swe-1.6',                        provider: 'windsurf', enumValue: 420, modelUid: 'MODEL_SWE_1_6', credit: 0.5 },
  'swe-1.6-fast':                   { name: 'swe-1.6-fast',                   provider: 'windsurf', enumValue: 421, modelUid: 'MODEL_SWE_1_6_FAST', credit: 0.5 },
  'swe-1.6-self-hosted':            { name: 'swe-1.6-self-hosted',            provider: 'windsurf', enumValue: 0,   modelUid: 'swe-1p6-self-hosted', credit: 0.5 },

  // ── Adaptive (Windsurf 2026-04-06 changelog) ────────────
  // Adaptive Model Router + Arena models live in the cloud catalog but their
  // UIDs aren't recognized by SendUserCascadeMessage's direct-call path —
  // upstream returns "unknown model UID adaptive: model not found". They only
  // work through the Windsurf IDE's special routing layer that Cascade-direct
  // doesn't expose. Mark deprecated so they stop showing in /v1/models. #109.
  'adaptive':                       { name: 'adaptive',                       provider: 'windsurf', enumValue: 0,   modelUid: 'adaptive', credit: 1, deprecated: true },
  'arena-fast':                     { name: 'arena-fast',                     provider: 'windsurf', enumValue: 0,   modelUid: 'arena-fast', credit: 0.5, deprecated: true },
  'arena-smart':                    { name: 'arena-smart',                    provider: 'windsurf', enumValue: 0,   modelUid: 'arena-smart', credit: 1, deprecated: true },
};