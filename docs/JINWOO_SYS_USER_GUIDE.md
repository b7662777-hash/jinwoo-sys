# 📘 Jinwoo Sys User Guide — The Complete Handbook

> **A Comprehensive 12-Part Guide to Autonomous Multi-Agent Orchestration, Coding Agent Runtimes, and Workforce Governance**

---

## Table of Contents

- [PART I — Fundamentals & Core Architecture](#part-i--fundamentals--core-architecture)
- [PART II — Installation & Environment Configuration](#part-ii--installation--environment-configuration)
- [PART III — Beginner Workflows: Your First Autonomous Run](#part-iii--beginner-workflows-your-first-autonomous-run)
- [PART IV — Tab-by-Tab Navigation Reference](#part-iv--tab-by-tab-navigation-reference)
- [PART V — Coding Agent Runtimes & Adapter Architecture](#part-v--coding-agent-runtimes--adapter-architecture)
- [PART VI — Multi-Agent Communication Bus & Correlated Handoffs](#part-vi--multi-agent-communication-bus--correlated-handoffs)
- [PART VII — OmniRoute Gateway Integration Layer](#part-vii--omniroute-gateway-integration-layer)
- [PART VIII — Advanced Orchestration & Custom Roles](#part-viii--advanced-orchestration--custom-roles)
- [PART IX — System Administration & Local Storage](#part-ix--system-administration--local-storage)
- [PART X — Developer Guide & Extension Patterns](#part-x--developer-guide--extension-patterns)
- [PART XI — Reference: Enums, Lifecycle States & APIs](#part-xi--reference-enums-lifecycle-states--apis)
- [PART XII — Open Source Governance & Attributions](#part-xii--open-source-governance--attributions)

---

## PART I — Fundamentals & Core Architecture

### 1.1 What is an AI Agent?
An **AI Agent** is an autonomous software entity that uses an underlying Large Language Model (LLM) to reason, plan, use external tools (such as reading and editing files or executing shell commands), and accomplish multi-step objectives without requiring continuous human prompt-by-prompt guidance.

### 1.2 What is a Coding Agent?
A **Coding Agent** is a specialized agent optimized for software engineering workflows. It operates inside a code workspace, inspects file structures, reads syntax trees, writes patches, executes unit tests, and verifies changes. Examples include **OpenCode**, **Hermes**, and **Codex**.

### 1.3 What is a Provider and Model?
- **Provider**: The service or organization hosting the intelligence inference API (e.g. OpenAI, Anthropic, Google, Ollama, OpenRouter).
- **Model**: The specific neural network checkpoint queried (e.g. `claude-3-7-sonnet`, `gpt-4o`, `gemini-2.5-pro`).

### 1.4 What is OmniRoute?
**OmniRoute** is the underlying local AI gateway and proxy engine. It runs locally on your machine, handles connections to 350+ providers, manages API keys and token pools, performs health checks and circuit breakers, and provides intelligent failover (combos) when upstream providers experience outages.

### 1.5 What is Jinwoo Sys?
**Jinwoo Sys** is the **Autonomous Workforce Operating System and Control Plane**. It lives above the gateway and model layers, orchestrating multiple AI agents across assigned roles, coordinating handoffs via a real-time communication bus, managing workspaces safely, and scheduling execution DAGs.

```
                    JINWOO SYS
                 AI WORKFORCE OS
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     ROLES         WORKFLOWS      WORKSPACES
        │              │              │
        └──────────────┼──────────────┘
                       │
               CODING AGENTS
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Hermes        OpenCode        Codex
        │              │              │
        └──────────────┼──────────────┘
                       │
                    OmniRoute
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Direct APIs    OpenRouter     Local Models
```

### 1.6 Core Rule: Role $\neq$ Runtime $\neq$ Provider $\neq$ Model
Jinwoo Sys enforces clean modularity:
- **Role**: The responsibility in the workflow (`ARCHITECT`, `DEVELOPER`, `QA`).
- **Runtime**: The CLI or execution engine (`OpenCode`, `Hermes Python Daemon`).
- **Provider**: The upstream gateway target (`Antigravity`, `OpenRouter`).
- **Model**: The specific LLM (`claude-sonnet-4-6`).

---

## PART II — Installation & Environment Configuration

### 2.1 Prerequisites
- **Node.js**: $\ge 22.0.0$
- **Python**: $\ge 3.10$
- **Git**: $\ge 2.30$

### 2.2 Setup Commands
```bash
# Clone
git clone https://github.com/your-username/jinwoo-sys.git
cd jinwoo-sys

# Install npm dependencies
npm install

# Configure environment
cp .env.example .env
```

### 2.3 Starting Services
1. **Python Worker Daemon** (Port 20129):
   ```bash
   python runtimes/jinwoo_worker_server.py
   ```
2. **Jinwoo Sys Control Plane & Gateway** (Port 20128):
   ```bash
   npm run dev -- -p 20128
   ```

---

## PART III — Beginner Workflows: Your First Autonomous Run

### 3.1 Execution Pipeline
When you trigger an autonomous objective (e.g. *"Analyze repo and add authentication"*):
1. **Planner Agent** parses the natural language prompt and generates a Directed Acyclic Graph (DAG) of tasks.
2. **Workforce Assignment**: Assigns the `ARCHITECT` role to design the system specification, `DEVELOPER` (via OpenCode) to edit code, and `QA` to verify tests.
3. **Stage 1 (Architect)**: Evaluates existing auth modules and produces an architectural plan.
4. **Stage 2 (Handoff to Developer)**: The Architect sends a correlated `HANDOFF` message across the Multi-Agent Bus to the OpenCode Developer.
5. **Stage 3 (Implementation)**: OpenCode receives bounded context, edits files safely under `WorkspaceGuard`, and generates test artifacts.
6. **Stage 4 (QA Verification)**: Developer sends a `REVIEW_REQUEST` to QA, who runs test suites and sends back a `REVIEW_RESULT`.
7. **Stage 5 (Finalization)**: Developer sends `FINAL_RESULT` back to Architect.

---

## PART IV — Tab-by-Tab Navigation Reference

| Section | Tab | Route | Purpose | Inputs | Outputs |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Workspace** | Dashboard | `/jinwoo` | System overview, active workers, quick metrics | None | System status overview |
| | Workspaces | `/jinwoo/workspaces` | Manage local workspace directories | Directory paths | Active workspace binding |
| | Files | `/jinwoo/files` | File tree & code browser | Workspace path | File contents |
| | Changes | `/jinwoo/changes` | Diff viewer & pending file locks | Workspace path | Unified diffs, lock states |
| | Search | `/jinwoo/search` | Fast codebase text & symbol search | Regex/Text query | Search matches |
| | Activity | `/jinwoo/activity` | Unified filesystem and task log | Filter criteria | Chronological audit logs |
| **Workforce** | Agents | `/jinwoo/agents` | Monitor active agent processes | Status filter | Active PIDs, models, roles |
| | Roles | `/jinwoo/roles` | Create & customize workforce roles | Role attributes | Role definition records |
| | Workforce | `/jinwoo/workforce` | Configure workforce headcount | Team definitions | Active workforce matrix |
| | Models | `/jinwoo/models` | Discovered LLM catalog | Provider filters | Model capabilities, pricing |
| | Providers | `/jinwoo/providers` | Gateway provider connections | API keys, URLs | Connection health status |
| | Coding Agents | `/jinwoo/coding-agents` | Manage OpenCode, Hermes, Codex | Action buttons | Process launch / stop |
| | OpenCode | `/jinwoo/coding-agents/opencode` | Dedicated OpenCode worker panel | Task inputs | Correlated dialogue & PID |
| | OpenClaw | `/jinwoo/coding-agents/openclaw` | OpenClaw detection & status | Refresh button | Accurate detection state |
| | Communication | `/jinwoo/communication` | Visual Multi-Agent Bus graph | Message filter | Real-time SSE timeline |
| **Orchestration** | Workflows | `/jinwoo/workflows` | Autonomous DAG designer & runner | Workflow prompt | Multi-agent execution DAG |
| | Runs | `/jinwoo/runs` | Execution history & metrics | Run ID | Step-by-step trace |
| | Tasks | `/jinwoo/tasks` | Task breakdown and dependencies | Status filter | Task progress & status |

---

## PART V — Coding Agent Runtimes & Adapter Architecture

Jinwoo Sys communicates with external coding runtimes through a standardized TypeScript interface `CodingAgentAdapter`:

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

### Supported Adapters:
- **OpenCode (`v1.18.18`)**: Interactive TUI subprocess spawning, role context injection, and correlated messaging.
- **Hermes**: Autonomous Python worker daemon running on port 20129.
- **Codex**: Node SDK streaming worker.
- **Claude Code**: External CLI runner.
- **OpenClaw**: Detection-enabled adapter accurately reporting `NOT_INSTALLED` when the binary is absent.

---

## PART VI — Multi-Agent Communication Bus & Correlated Handoffs

The Multi-Agent Communication Bus provides reliable, observable role-to-role messaging.

### Message Lifecycle States:
- `CREATED` $\rightarrow$ Validated and formatted.
- `QUEUED` $\rightarrow$ Written to SQLite and recipient inboxes.
- `SENT` $\rightarrow$ Dispatched to worker runtime.
- `DELIVERED` $\rightarrow$ Target worker confirmed payload arrival.
- `ACKNOWLEDGED` $\rightarrow$ Worker confirmed processing commencement.
- `PROCESSING` $\rightarrow$ Active tool execution or reasoning.
- `RESPONDED` $\rightarrow$ Linked reply message generated.
- `CANCELLED` / `FAILED` $\rightarrow$ Clean termination on abort or timeout.

---

## PART VII — OmniRoute Gateway Integration Layer

Jinwoo Sys delegates inference traffic to OmniRoute:
- **Unified `/v1` Endpoint**: `http://127.0.0.1:20128/api/v1/chat/completions`.
- **Circuit Breakers**: Upstream 5xx errors trip provider circuit breakers automatically without hanging agents.
- **Auto-Combos**: Automatically falls back to secondary models if primary encounters rate limits (`429`).

---

## PART VIII — Advanced Orchestration & Custom Roles

Users can define custom roles with tailored capabilities:
```json
{
  "roleId": "SECURITY_AUDITOR",
  "name": "Security Auditor",
  "recommendedCapabilities": ["Static analysis", "Token masking", "Path containment"],
  "recommendedModel": "antigravity/claude-sonnet-4-6"
}
```

---

## PART IX — System Administration & Local Storage

All state is persisted locally:
- `data/jinwoo_state.sqlite`: Workflows, tasks, agent metadata, message bus logs.
- SQLite WAL mode ensures concurrent read/write throughput without database locking.
- Workspace data remains strictly within user-designated external directories.

---

## PART X — Developer Guide & Extension Patterns

To add a new coding agent adapter:
1. Implement `CodingAgentAdapter` in `src/lib/jinwoo/coding-agents/adapters/yourAdapter.ts`.
2. Register the adapter in `src/lib/jinwoo/coding-agents/registry.ts`.
3. Add end-to-end tests in `tests/unit/jinwoo/`.

---

## PART XI — Reference: Enums, Lifecycle States & APIs

- `POST /api/jinwoo/communication/send`: Dispatches inter-role messages.
- `GET /api/jinwoo/communication/messages`: Queries correlated message chains.
- `GET /api/jinwoo/communication/stream`: Server-Sent Events stream for real-time UI updates.
- `POST /api/jinwoo/coding-agents`: Launches and manages interactive worker sessions.

---

## PART XII — Open Source Governance & Attributions

Jinwoo Sys is released under standard open-source terms. Full credits for upstream dependencies including OmniRoute, Hermes, and OpenCode are maintained in [`CREDITS.md`](../CREDITS.md).
