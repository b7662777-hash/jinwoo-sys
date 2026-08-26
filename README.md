# ⚡ Jinwoo Sys

> **Local-First Autonomous Multi-Agent Orchestration & Control Plane**  
> Unified AI Gateway • Dynamic Workforce Roles • Correlated Communication Bus • Coding Agent Adapters

---

## 1. Overview

**Jinwoo Sys** is a local-first control plane and operating system for coordinating multiple autonomous AI worker roles. It decouples **high-level orchestration and role governance** from **underlying worker runtimes** and **model routing infrastructure**.

```
                       JINWOO SYS
                    CONTROL PLANE
                          |
                  Workflow Scheduler
                          |
             MULTI-AGENT COMMUNICATION BUS
             (AgentMessageBus & Inboxes)
                          |
        ┌─────────────────┼─────────────────┐
        |                 |                 |
    ARCHITECT          DEVELOPER           QA
        |                 |                 |
   Python Worker       OpenCode        Codex / Worker
   (Port 20129)     (v1.18.18 CLI)      (Port 20129)
        |                 |                 |
        └─────────────────┼─────────────────┘
                          |
                    Jinwoo Gateway
                    (Port 20128/v1)
                          |
             OpenAI / Anthropic / Google /
             OpenRouter / Ollama / Local
```

---

## 2. Core Architectural Separation

Jinwoo Sys enforces strict conceptual separation between four distinct layers:

| Concept | Definition | Example |
| :--- | :--- | :--- |
| **Role** | Organizational responsibility and objective in a workflow | `ARCHITECT`, `DEVELOPER`, `QA`, `SECURITY` |
| **Runtime** | The execution environment or CLI agent performing work | `OpenCode v1.18.18`, `Hermes Python Daemon`, `Codex` |
| **Gateway / Router** | The local AI proxy handling rate limits, failover, and combos | `OmniRoute / Jinwoo Gateway (Port 20128)` |
| **Model & Provider** | The upstream intelligence provider supplying inference | `Claude 3.7 Sonnet`, `GPT-4o`, `Claude Opus` via `Antigravity` |

> [!IMPORTANT]
> **Role $\neq$ Runtime $\neq$ Provider $\neq$ Model.** An OpenCode worker can be dynamically assigned to operate as a `DEVELOPER`, `FRONTEND_DEVELOPER`, or `QA` role without changing its underlying CLI execution architecture.

---

## 3. Coding Agent Runtimes Matrix

| Runtime | Status | Detection | Workspace Binding | Interactive TUI | Agent Messaging | Session Injection |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **OpenCode** | **IMPLEMENTED & TESTED** | `opencode.cmd` (v1.18.18) | Native (`opencode.json`) | Windows Console / PTY | Correlated Bus | Injected Role Context |
| **Hermes / Python** | **IMPLEMENTED & TESTED** | Port 20129 Daemon | Path Containment | SSE Stream | REST / SSE | Direct Prompt Dispatch |
| **Codex** | **IMPLEMENTED & TESTED** | Node SDK Adapter | Native | Streamed | REST / SSE | Injected Task Prompt |
| **Claude Code** | **SUPPORTED** | `claude` CLI | Native | Terminal Window | Bus Handoff | CLI Prompt Passing |
| **OpenClaw** | **NOT INSTALLED** | `openclaw` binary | Unsupported | Unsupported | Unsupported | Unsupported |

---

## 4. OpenCode as a Real Jinwoo Role Worker

OpenCode is fully integrated as a first-class autonomous worker runtime:

1. **Role Assignment**: When launching OpenCode from `/jinwoo/coding-agents` or `/jinwoo/coding-agents/opencode`, users select an explicit workforce role via the **Assign OpenCode Role** dialog.
2. **Workspace Isolation**: Automatically generates `opencode.json` with gateway baseURL (`http://127.0.0.1:20128/api/v1`) and injects `.opencode_role_context.md` containing the assigned role instructions.
3. **Interactive Window Binding**: Spawns an interactive Windows Console window named `OpenCode [<ROLE>] - Jinwoo Sys (<WORKSPACE>)` and tracks its process PID and session ID.
4. **Multi-Agent Bus Integration**: Inbound handoffs (e.g. from Architect) are received as tasks; OpenCode performs real workspace actions and returns correlated review requests and final results.
5. **Clean Termination**: Stopping a session kills the process tree, releases workspace locks, and preserves conversation history.

---

## 5. Multi-Agent Communication Bus

The Multi-Agent Communication Bus provides real, correlated, persisted, and observable messaging between workers.

### Canonical Message Lifecycle States

```
CREATED ──► QUEUED ──► SENT ──► DELIVERED ──► ACKNOWLEDGED ──► PROCESSING ──► RESPONDED
   │           │
   └───────────┴──► CANCELLED / FAILED (with auto-retry)
```

- **`CREATED`**: Message initialized and validated with `WorkspaceGuard`.
- **`QUEUED`**: Persisted in SQLite `agent_messages` and recipient's `agent_inboxes`.
- **`SENT`**: Dispatched over HTTP / SSE to the target worker adapter.
- **`DELIVERED`**: Verified that target worker runtime actively received the payload.
- **`ACKNOWLEDGED`**: Target agent explicitly confirmed receipt (`acknowledgedAt` timestamp recorded).
- **`RESPONDED`**: Correlated child response generated (`replyToMessageId` linked).
- **`CANCELLED`**: Gracefully aborted on workflow cancellation without orphan processes.

---

## 6. Workspace Safety & Containment

All file actions are strictly guarded by `WorkspaceGuard`:
- **Path Traversal Protection**: Enforces that all file operations remain strictly inside the configured workspace root.
- **File Locking**: Atomic file locks prevent concurrent write collisions between multiple active agents.
- **Diff & Context Bounding**: Only relevant files, diff snippets, and summaries are propagated between handoffs, preventing token context blowout.

---

## 7. Quickstart & Development

### Prerequisites
- Node.js $\ge 22.0.0$
- Python $\ge 3.10$ (for Python worker daemon)
- OpenCode CLI (`npm install -g opencode-ai` or local binary)

### Starting the Servers

```bash
# 1. Install dependencies
npm install

# 2. Start Python Worker Daemon (Port 20129)
python runtimes/jinwoo_worker_server.py

# 3. Start Jinwoo Sys OS & AI Gateway (Port 20128)
npm run dev -- -p 20128
```

### Accessing Jinwoo Sys
- **Main Dashboard**: [http://127.0.0.1:20128/jinwoo](http://127.0.0.1:20128/jinwoo)
- **Multi-Agent Bus**: [http://127.0.0.1:20128/jinwoo/communication](http://127.0.0.1:20128/jinwoo/communication)
- **OpenCode Control Panel**: [http://127.0.0.1:20128/jinwoo/coding-agents/opencode](http://127.0.0.1:20128/jinwoo/coding-agents/opencode)
- **Workforce Roles**: [http://127.0.0.1:20128/jinwoo/workforce](http://127.0.0.1:20128/jinwoo/workforce)
- **Active Agents**: [http://127.0.0.1:20128/jinwoo/agents](http://127.0.0.1:20128/jinwoo/agents)

---

## 8. Verification & Test Suite

Run the full 9-suite Multi-Agent Communication Bus and OpenCode verification suite:

```bash
node scratch/run_all_bus_tests.js
```

### Verified Test Results (9 / 9 PASS)
- **Test #1**: Real Agent-to-Agent Communication (Architect $\leftrightarrow$ Developer) — **PASS**
- **Test #2**: Three-Agent Correlated Handoff (Architect $\rightarrow$ Developer $\rightarrow$ QA $\rightarrow$ Architect) — **PASS**
- **Test #3**: Bidirectional AI Dialogue (6-turn inter-role exchange) — **PASS**
- **Test #4**: OpenCode Worker Context Injection — **PASS**
- **Test #5**: OpenClaw Detection & Capability Accuracy — **PASS**
- **Test #6**: Offline Worker Queueing & Recovery — **PASS**
- **Test #7**: Concurrent Multi-Worker Sessions with Zero Cross-Talk — **PASS**
- **Test #8**: Workflow Cancellation & Process Cleanup — **PASS**
- **Test #9**: OpenCode as Real Jinwoo Role Worker (E2E) — **PASS**

---

## 9. Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **OpenCode Not Detected** | CLI executable is not on `%PATH%` | Verify `node_modules\.bin\opencode.cmd` exists or run `npm install -g opencode-ai` |
| **Worker Offline / Queued** | Python daemon on port 20129 is not running | Start `python runtimes/jinwoo_worker_server.py` |
| **Workspace Conflict** | Another agent currently holds a lock on the target file | Check `/jinwoo/changes` or stop the conflicting session |
| **Gateway 500 / Refused** | Local Next.js gateway on port 20128 is not running | Run `npm run dev -- -p 20128` |
| **Process Not Terminating** | Windows task tree lingering | Click "Stop Session" in `/jinwoo/coding-agents/opencode` |
