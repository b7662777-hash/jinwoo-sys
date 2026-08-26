# 💻 Coding Agent Runtimes & Adapters

Jinwoo Sys decouples role orchestration from the physical coding agent runtimes executing tasks.

---

## 1. Supported Runtimes & Status

| Runtime | Status | Executable / Port | TUI Support | Multi-Agent Messaging | Context Injection |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **OpenCode** | **IMPLEMENTED & TESTED** | `opencode.cmd` (v1.18.18) | Dedicated Terminal Window | Correlated Bus | Injected `.opencode_role_context.md` |
| **Hermes** | **IMPLEMENTED & TESTED** | Python Daemon (Port 20129) | SSE Stream | REST / SSE | Injected Task Prompts |
| **Codex** | **IMPLEMENTED & TESTED** | Node SDK Adapter | Subprocess | REST / SSE | Direct Prompt Passing |
| **Claude Code** | **SUPPORTED** | `claude` CLI | Subprocess | Bus Handoff | CLI Parameter Injection |
| **OpenClaw** | **NOT INSTALLED** | `openclaw` binary | Unsupported | Unsupported | Unsupported |

---

## 2. OpenCode Integration Details
- **Role Assignment**: Before launch, users choose an explicit role (e.g. `DEVELOPER`, `FRONTEND_DEVELOPER`, `QA`).
- **Configuration Generation**: Automatically generates `opencode.json` pointing to OmniRoute (`http://127.0.0.1:20128/api/v1`).
- **Process Management**: Spawns an interactive console window on Windows and records the PID and session ID in SQLite `agents` table.
- **Message Handling**: Receives tasks from other agents, performs real workspace file edits, and dispatches review requests back to the communication bus.

---

## 3. The Adapter Contract (`CodingAgentAdapter`)

```typescript
export interface CodingAgentAdapter {
  id: string;
  name: string;
  detectInstallation(): Promise<CodingAgentDetectionResult>;
  getCapabilities(): CodingAgentCapabilities;
  startSession(params: WorkerSessionParams, onEvent: (e: NormalizedAgentEvent) => void): Promise<{ sessionId: string; stop: () => Promise<void> }>;
  stopSession(sessionId: string): Promise<boolean>;
}
```

---

## 4. Lifecycle & Process Cleanup
When a session is stopped or a workflow is cancelled:
1. `stopSession(sessionId)` terminates the child process and its process tree.
2. Active atomic file locks in `file_locks` held by the session are released.
3. The session status in SQLite is updated to `STOPPED`.
