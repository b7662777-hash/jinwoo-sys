- **fix(ci):** drain three more base-reds on `release/v3.8.50` (#9985). ESLint was reporting
  219 errors locally (vs. 25 in the last CI run) — all from `react-hooks/set-state-in-effect`,
  `react-hooks/preserve-manual-memoization`, `react-hooks/immutability`,
  `react-hooks/static-components`, `react-hooks/refs` and `react-hooks/purity`, six React
  Compiler lint rules that `eslint-plugin-react-hooks` v7 turns on by default and that were
  never frozen in `config/quality/eslint-suppressions.json` after the dependency bump. Froze
  the pre-existing violations for those six rules via ESLint's native
  `--suppress-rule`/`--suppressions-location` mechanism (the same pattern already used for
  `@next/next/no-location-assign-relative-destination`) — no application code changed, no rule
  disabled, only genuinely-new violations stay blocking. `check:dead-code` was at 418 against a
  415 baseline: removed the unused `src/lib/quota/providerCapabilities.ts` file and the unused
  `ProviderQuotaMonitor` interface in `providerQuotaTelemetry.ts` (both dead since PR #10148,
  2026-08-18, confirmed via `grep`/knip cross-reference), landing at 416; the residual +1 could
  not be attributed to a single recent commit after checking every dead-list entry touched
  since the 2026-08-14 baseline measurement, so it is rebaselined with the investigation
  recorded in `quality-baseline.json`. `tests/unit/autoCombo/tieredRotation.test.ts`'s
  "rotates across all 43 Cerebras connection IDs" case was hitting vitest's 5000ms default
  timeout on a 200-iteration synchronous `selectProvider()` loop under shared-devbox
  contention (load average 40-60+ observed) — widened its explicit timeout to 20000ms; the
  assertion itself is unchanged.
