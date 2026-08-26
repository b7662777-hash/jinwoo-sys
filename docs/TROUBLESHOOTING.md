# 🛠️ Troubleshooting & Diagnostics Guide

This guide covers common issues, failure scenarios, and their verified solutions in **Jinwoo Sys**.

---

## 1. Common Scenarios

### Scenario A: OpenCode CLI Not Detected
- **Symptoms**: Coding Agents page shows `NOT INSTALLED` for OpenCode.
- **Root Cause**: `opencode` is not present in `%PATH%` or `node_modules\.bin`.
- **Solution**:
  ```bash
  npm install -g opencode-ai
  # or verify local installation
  npx opencode --version
  ```

### Scenario B: Worker Offline / Messages Queued
- **Symptoms**: Messages sent to Python worker remain in `QUEUED` status and do not transition to `DELIVERED`.
- **Root Cause**: Python daemon on port 20129 is stopped.
- **Solution**:
  ```bash
  python runtimes/jinwoo_worker_server.py
  ```

### Scenario C: Port 20128 Already in Use
- **Symptoms**: `EADDRINUSE: address already in use :::20128`.
- **Solution**: Terminate existing Node instances or start on an alternate port:
  ```bash
  npm run dev -- -p 20128
  ```

### Scenario D: File Write Blocked / Conflict
- **Symptoms**: Task status shows `BLOCKED` on file modification.
- **Root Cause**: Another active agent holds a lock in `file_locks`.
- **Solution**: Check `/jinwoo/changes` or terminate the conflicting worker session in `/jinwoo/agents`.
