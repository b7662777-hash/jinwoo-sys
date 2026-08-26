# ✅ Public Release Checklist

Verify all checklist items before tagging and publishing a new release of **Jinwoo Sys**.

---

## 1. Secrets & Privacy Audit
- [x] Zero API keys, private tokens, or secrets committed in git history or tracked files.
- [x] Zero hardcoded absolute developer paths (`C:\Users\...`, `R:\...`).
- [x] `.env.example` contains only sanitized placeholder keys.
- [x] Private SQLite databases (`data/*.sqlite`) are strictly ignored in `.gitignore`.

---

## 2. Code Quality & Verification
- [x] All 104 Jinwoo routes return `HTTP 200` (`node scratch/fast_test_routes.js`).
- [x] All 9 automated Multi-Agent Communication Bus and OpenCode tests pass with 100% success (`node scratch/run_all_bus_tests.js`).
- [x] Zero orphaned worker processes lingering after test completion.
- [x] `WorkspaceGuard` enforces strict filesystem containment.

---

## 3. Documentation & Attributions
- [x] `README.md` provides 2-minute quickstart, architecture overview, and links to `docs/`.
- [x] Complete 12-part handbook available at `docs/JINWOO_SYS_USER_GUIDE.md`.
- [x] `CREDITS.md` and `THIRD_PARTY_NOTICES.md` credit OmniRoute, Hermes, OpenCode, and upstream ecosystems.
- [x] `CONTRIBUTING.md`, `SECURITY.md`, and `CHANGELOG.md` created.
