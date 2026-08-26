# 🛡️ Administrator Guide

This guide details deployment options, database management, security policies, and resource accounting in **Jinwoo Sys**.

---

## 1. Local Database Management

Jinwoo Sys utilizes SQLite via `better-sqlite3`:
- **Database Path**: `data/jinwoo_state.sqlite`
- **Journal Mode**: WAL (Write-Ahead Logging) for high concurrency
- **Migrations**: Auto-applied on application boot in `src/lib/jinwoo/db/schema.ts`.

### Backing Up State
To backup local Jinwoo state:
```bash
# Safely copy the SQLite database
cp data/jinwoo_state.sqlite backups/jinwoo_state_$(date +%Y%m%d).sqlite
```

---

## 2. Resource & Token Accounting

Jinwoo Sys categorizes token usage into 3 explicit tiers:
1. **Provider-Reported Usage**: Exact usage reported by upstream provider HTTP headers or response bodies.
2. **Estimated Usage**: Calculated via tokenizer heuristics when upstream returns incomplete data.
3. **Unknown Usage**: Explicitly labeled as unknown rather than assuming zero cost.

---

## 3. Process Containment & Cleanup

- External subprocesses (OpenCode, Python daemons) are managed by PID.
- If an agent terminates unexpectedly, `CodingAgentManager.reapDeadProcesses()` cleans up stale entries and releases active file locks.
