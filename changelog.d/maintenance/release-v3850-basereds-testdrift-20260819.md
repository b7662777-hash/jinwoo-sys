- **fix(tests):** drain several base-reds on `release/v3.8.50` (#9985) that were all instances
  of the same pattern — a legitimate product change landed without updating the test that
  asserted the old behavior: `tests/unit/glm-provider-model-import-route.test.ts` (12 tests)
  and `tests/unit/model-sync-route.test.ts` (2 tests) predate #10603's "upstream model sync is
  opt-in and manual overrides are preserved" change; `tests/unit/antigravity-model-aliases.test.ts`
  predated #10537 retiring the collapsed `gemini-3.7-flash` alias in favor of its three tiered
  ids. Also fixes a real data drift in `open-sse/config/freeModelCatalog.data.ts` (the `qwen-web`
  free-catalog entry still pointed at the retired `qwen3.8-max-preview` id instead of the
  current `qwen3.8-max`), corrects the zh-TW `providers.autoFetchModelsTooltip` string to the
  glossary-canonical 快取 instead of 緩存, and removes an unused default export from
  `src/lib/oauth/providers/zed-hosted.ts` (the named export already covers every consumer) to
  shave one symbol off the `check:dead-code` ratchet regression.
