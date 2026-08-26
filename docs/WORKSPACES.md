# 📁 Workspace Safety, Containment & File Locking

Jinwoo Sys allows users to point autonomous agents to any project folder on their host filesystem while providing strict containment and concurrency protections.

---

## 1. Directory Containment (`WorkspaceGuard`)

All filesystem accesses are gated by `WorkspaceGuard`:
- **Directory Traversal Protection**: Enforces that paths never escape the designated workspace root via `../` sequences or symlink spoofing.
- **Verification API**:
  ```typescript
  WorkspaceGuard.assertInsideWorkspace(baseWorkspace, targetPath);
  ```

---

## 2. Atomic File Locking (`file_locks`)

To prevent two concurrent workers (e.g. Developer and QA) from overwriting the same file simultaneously:
1. When an agent begins modifying a file, it requests an atomic lock in the `file_locks` SQLite table.
2. If another agent holds an active lock, the requesting agent's task is placed in a `BLOCKED` state until the lock is released or times out.
3. Locks are automatically released when the agent acknowledges completion or when the workflow is cancelled.

---

## 3. External Workspace Isolation
User project files are never stored inside the Jinwoo Sys application repository. Users select an external workspace path (e.g. `D:\Projects\MyWebApp`), and Jinwoo Sys stores only operational metadata in `data/jinwoo_state.sqlite`.
