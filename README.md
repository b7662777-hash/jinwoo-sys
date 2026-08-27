# ⚡ Jinwoo Sys

> **Local-first control plane for autonomous AI coding teams.**
>
> Turn independent AI coding agents into a coordinated engineering workforce with roles, routing, persistent agent-to-agent communication, workspace isolation, and runtime adapters.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-brightgreen.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-active%20development-blue.svg)](#project-status)

---

## What is Jinwoo Sys?

Most AI coding tools operate as isolated sessions: one agent gets a prompt, edits a workspace, and stops.

**Jinwoo Sys is the coordination layer around those agents.** It treats AI coding as a distributed engineering workflow where specialized workers can be assigned explicit roles, communicate through a correlated message bus, share bounded context, and operate against isolated workspaces while a local gateway handles model/provider routing.

### The core idea

```text
                        JINWOO SYS
                    CONTROL PLANE / OS
                              │
             ┌────────────────┴────────────────┐
             │      Workflow + Workforce      │
             │     Scheduler + Role Policy    │
             └────────────────┬────────────────┘
                              │
                   CORRELATED MESSAGE BUS
                  Persistent inboxes + handoffs
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ARCHITECT              DEVELOPER               QA
        │                     │                     │
   Python worker          OpenCode              Codex/worker
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    Jinwoo Gateway / Router
                              │
      OpenAI • Anthropic • Google • OpenRouter
                    Ollama • Local models
```

### Architectural rule

**Role ≠ Runtime ≠ Provider ≠ Model**

A `DEVELOPER` role may run on OpenCode today and another runtime tomorrow. The orchestration layer should not have to change just because the worker or model changes.

---

## Why it exists

Jinwoo Sys is designed around problems that appear once AI models become software workers:

- How do multiple agents hand work to each other?
- How do you correlate requests, acknowledgements, retries, and responses?
- How do you prevent two agents from corrupting the same workspace?
- How do you keep role definitions separate from runtime implementations?
- How do you recover queued work when a worker is offline?
- How do you stop a workflow without leaving orphan processes?
- How do you route different workers through different providers without coupling orchestration to one vendor?

Jinwoo Sys provides the control-plane primitives for those workflows.

---

## What you can build

### Autonomous coding teams

```text
User request
    ↓
Architect
    ↓
Developer
    ↓
QA
    ↓
Security
    ↓
Final result
```

### Example workloads

- Feature implementation
- Code review and refactoring
- Bug investigation and repair
- QA and regression validation
- Security review
- Architecture planning
- Multi-step repository maintenance
- Local/offline worker queues

---

## Core capabilities

| Capability | What Jinwoo Sys provides |
|---|---|
| **Workforce roles** | Explicit responsibilities such as `ARCHITECT`, `DEVELOPER`, `QA`, and `SECURITY` |
| **Runtime adapters** | Connect coding-agent runtimes without coupling them to the role model |
| **Communication bus** | Correlated, persisted agent-to-agent messaging and inboxes |
| **Workflow orchestration** | Schedule and coordinate multi-step worker execution |
| **Gateway/router** | Local routing, provider abstraction, fallback and model selection |
| **Workspace safety** | Path containment and file locking for concurrent workers |
| **Bounded context** | Propagate relevant diffs/context instead of entire workspaces |
| **Offline recovery** | Queue work for unavailable workers and recover it later |
| **Process lifecycle** | Track sessions and cleanly terminate worker process trees |
| **Local-first operation** | Keep orchestration and worker coordination on the local machine |

---

## Supported runtimes

| Runtime | Status | Integration |
|---|---:|---|
| **OpenCode** | Implemented & tested | Role assignment, workspace binding, interactive Windows session, bus handoff, injected context |
| **Hermes / Python worker** | Implemented & tested | Local daemon, REST/SSE dispatch, path containment |
| **Codex adapter** | Implemented & tested | Task dispatch, streamed execution, role context |
| **Claude Code** | Supported | CLI handoff and role context |
| **OpenClaw** | Capability-detected | Explicitly reports unavailable when not installed |

---

## Multi-Agent Communication Bus

The communication bus is a core system boundary rather than simple chat plumbing.

### Message lifecycle

```text
CREATED
   ↓
QUEUED
   ↓
SENT
   ↓
DELIVERED
   ↓
ACKNOWLEDGED
   ↓
PROCESSING
   ↓
RESPONDED
```

Failure paths are explicit:

```text
QUEUED / SENT
   ├──→ CANCELLED
   └──→ FAILED → retry/recovery
```

Messages are correlated so a worker can receive a task, acknowledge it, perform work, and return a linked response rather than creating an unrelated conversation.

---

## Workspace safety

Concurrent autonomous workers need stronger boundaries than a human-operated editor.

Jinwoo Sys uses workspace guards for:

- **Path traversal protection** — file actions remain inside the configured workspace root.
- **File locking** — concurrent agents cannot silently overwrite one another's work.
- **Bounded context propagation** — handoffs can carry relevant files/diffs/summaries instead of entire repositories.
- **Session/workspace binding** — workers are associated with explicit workspaces.

Security is a first-class design concern.

---

## Example workflow

Suppose the user asks:

> Add OAuth login to my application.

A Jinwoo Sys workflow can decompose the request into role-specific work:

```text
User
  │
  ▼
ARCHITECT ── design + task breakdown
  │
  ▼
DEVELOPER ── implementation
  │
  ▼
QA ───────── tests + regression checks
  │
  ▼
SECURITY ─── audit + findings
  │
  ▼
Final result
```

The important part is that each stage is a real worker interaction with explicit state and handoff semantics.

---

## ⚡ Full & Detailed Quick Start Guide

Follow these step-by-step instructions to install, configure, launch, and verify Jinwoo Sys on your machine.

---

### Step 1: Verify Prerequisites

Ensure your system meets the minimum requirements before proceeding:

| Dependency | Required Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>=22.22.2 <23` or `>=24 <27` | `node -v` | Core Next.js & TypeScript control plane |
| **Python** | `>=3.10` | `python --version` (or `python3`) | Required for the Python worker daemon |
| **Git** | `>=2.30` | `git --version` | Version control & diff generation |
| **OpenCode CLI** *(Optional)* | `v1.18.18+` | `opencode --version` | `npm install -g opencode-ai` |

---

### Step 2: Clone & Install Dependencies

```bash
# 1. Clone the repository
git clone https://github.com/b7662777-hash/jinwoo-sys.git
cd jinwoo-sys

# 2. Install Node dependencies
npm install
```

---

### Step 3: Configure Environment (.env)

Create your local `.env` file from the provided template:

```bash
# On Windows (PowerShell):
Copy-Item .env.example .env

# On Linux / macOS:
cp .env.example .env
```

> [!TIP]
> The default configuration runs locally out-of-the-box. You can optionally add upstream provider API keys (e.g. `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`) to `.env` or enter them dynamically in the web UI under **Providers**.

---

### Step 4: Launch Jinwoo Sys (Dual-Process Architecture)

Jinwoo Sys runs as two coordinated local services. Open **two separate terminal windows**:

#### Terminal 1: Start the Python Worker Daemon (Port 20129)
The Python worker daemon executes background compute, autonomous tool actions, and the Hermes worker runtime:

```bash
# Windows / Linux / macOS
python runtimes/jinwoo_worker_server.py
```
*Expected output:*
```text
[Jinwoo Worker Server] Running on http://127.0.0.1:20129
[Jinwoo Worker Server] SQLite state connected.
```

#### Terminal 2: Start Jinwoo Sys Control Plane & AI Gateway (Port 20128)
This starts the Next.js full-stack control plane, the Multi-Agent Communication Bus SSE stream, and the local OmniRoute proxy:

```bash
# Windows / Linux / macOS
npm run dev -- -p 20128
```
*Expected output:*
```text
▲ Next.js 16.x (Turbopack)
- Local:        http://localhost:20128
- Network:      http://127.0.0.1:20128
✓ Ready in 1200ms
```

---

### Step 5: Open Local Interfaces

Open your browser and navigate to the Jinwoo Sys modules:

| Interface | URL | Purpose |
| :--- | :--- | :--- |
| **Main Dashboard** | [http://127.0.0.1:20128/jinwoo](http://127.0.0.1:20128/jinwoo) | System overview, active workers, quick status metrics |
| **Communication Bus** | [http://127.0.0.1:20128/jinwoo/communication](http://127.0.0.1:20128/jinwoo/communication) | Real-time visual message topology, SSE stream, handoffs |
| **Coding Agents** | [http://127.0.0.1:20128/jinwoo/coding-agents](http://127.0.0.1:20128/jinwoo/coding-agents) | Runtime launcher, capability detection, session monitor |
| **OpenCode Panel** | [http://127.0.0.1:20128/jinwoo/coding-agents/opencode](http://127.0.0.1:20128/jinwoo/coding-agents/opencode) | Dedicated OpenCode worker console & conversation stream |
| **Workforce Roles** | [http://127.0.0.1:20128/jinwoo/workforce](http://127.0.0.1:20128/jinwoo/workforce) | Role headcount and runtime mapping |
| **Active Agents** | [http://127.0.0.1:20128/jinwoo/agents](http://127.0.0.1:20128/jinwoo/agents) | Monitor live worker PIDs, models, and session states |

---

### Step 6: Run Your First Multi-Agent Task in 3 Minutes

1. **Select a Target Workspace**:
   - In the top navigation bar, click **Select Folder** and choose the directory of the project you want to modify (e.g. `C:\Projects\MyWebApp` or a local sandbox).
2. **Assign a Role & Launch OpenCode**:
   - Go to [**Coding Agents**](http://127.0.0.1:20128/jinwoo/coding-agents).
   - Click **⚡ Assign Role & Launch OpenCode**.
   - Select the `DEVELOPER` role (or `QA`, `SECURITY`).
   - Click **🚀 Launch OpenCode**.
   - An interactive Windows Console window titled `OpenCode [DEVELOPER] - Jinwoo Sys` will open with workspace configuration (`opencode.json`) and role instructions automatically injected.
3. **Dispatch Tasks on the Communication Bus**:
   - Navigate to [**Communication Bus**](http://127.0.0.1:20128/jinwoo/communication).
   - Type a prompt in the message bar (e.g. *"Implement authentication token validation in auth.ts"*).
   - Watch the live SSE timeline: `ARCHITECT` $\rightarrow$ `DEVELOPER` (`HANDOFF`) $\rightarrow$ `QA` (`REVIEW_REQUEST`) $\rightarrow$ `FINAL_RESULT`.

---

### Step 7: Run the Automated Verification Suite

Run the built-in 9-point verification suite to confirm that your installation, communication bus, and OpenCode adapter are functioning with 100% test pass rate:

```bash
node scratch/run_all_bus_tests.js
```

*Expected output:*
```text
============================================================
JINWOO SYS — MULTI-AGENT COMMUNICATION BUS VERIFICATION SUITE
============================================================

Running Test #1: Real Agent-to-Agent Communication... ✓ PASS
Running Test #2: Three-Agent Correlated Handoff... ✓ PASS
Running Test #3: Bidirectional AI Dialogue... ✓ PASS
Running Test #4: OpenCode Worker Context Injection... ✓ PASS
Running Test #5: OpenClaw Detection Verification... ✓ PASS
Running Test #6: Offline Worker Queueing & Failure Recovery... ✓ PASS
Running Test #7: Concurrent Workers with Zero Cross-Talk... ✓ PASS
Running Test #8: Workflow Cancellation & Process Cleanup... ✓ PASS
Running Test #9: OpenCode as Real Jinwoo Role Worker (E2E)... ✓ PASS

============================================================
TOTAL TESTS: 9 | PASSED: 9 | FAILED: 0
============================================================
```

---

### Quick Installation Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `EADDRINUSE: :::20128` | Port 20128 is already in use by another process | Stop previous instance or launch on another port: `npm run dev -- -p 20130` |
| `Messages stuck in QUEUED` | Python worker daemon on port 20129 is not running | Start `python runtimes/jinwoo_worker_server.py` in a separate terminal |
| `OpenCode NOT_INSTALLED` | `opencode` CLI binary is not found in `%PATH%` | Run `npm install -g opencode-ai` and restart Jinwoo |
| `File write BLOCKED` | Another active worker holds an atomic lock on the file | Go to `/jinwoo/changes` or stop conflicting worker session in `/jinwoo/agents` |

---

## Verification

The repository contains extensive automated testing and validation infrastructure across API, authentication/authorization, runtime, database, security, services, UI, correctness, documentation, and related subsystems.

Dedicated multi-agent/OpenCode verification scenarios cover:

1. Real agent-to-agent communication
2. Three-agent correlated handoffs
3. Multi-turn role dialogue
4. OpenCode worker context injection
5. Runtime capability detection
6. Offline worker queueing and recovery
7. Concurrent multi-worker sessions and cross-talk isolation
8. Workflow cancellation and process cleanup
9. OpenCode as a Jinwoo role worker

Run the repository's current test commands in your environment before claiming a deployment is verified.

---

## Project structure

```text
.
├── .github/          # CI, issue/PR automation and repository workflows
├── .husky/           # Git hooks
├── .vale/            # Documentation/prose quality checks
├── .vscode/          # Editor configuration
├── @omniroute/       # Gateway/runtime package surface
├── bin/              # CLI entry points
├── changelog.d/      # Changelog fragments
├── config/           # Quality/tooling configuration
├── contrib/          # Contribution and integration material
├── docker/           # Container assets
├── docs/             # Documentation
├── packages/         # Workspace packages
├── scripts/          # Build/release/validation/development tooling
├── src/              # Core implementation
├── tests/            # Automated tests
└── README.md         # Project overview
```

---

## Development principles

### Local-first
Keep orchestration useful on a developer workstation without requiring a hosted SaaS control plane.

### Runtime independence
A workforce role should not be hard-coded to one coding-agent runtime.

### Provider independence
Routing and orchestration should not assume one model vendor.

### Explicit state
Agent communication should have observable lifecycle states rather than disappearing into ephemeral prompts.

### Safe concurrency
Autonomous workers need workspace and process boundaries that prevent accidental cross-agent interference.

### Testable orchestration
Multi-agent behavior should be verified through reproducible tests, not only screenshots or demos.

---

## Security

Do not open public issues for undisclosed vulnerabilities. Use the repository's **Security Policy** and responsible-disclosure process for security reports.

When evaluating or deploying autonomous coding agents, assume agent-generated code and tool actions are untrusted until validated. Apply least privilege to filesystem access, credentials, network access, and external tools.

---

## Contributing

Contributions are welcome.

Before opening a pull request:

1. Read the contribution guidelines.
2. Run the relevant lint and test commands.
3. Keep architectural boundaries intact.
4. Add or update tests for behavioral changes.
5. Keep documentation aligned with implementation.
6. Avoid introducing provider- or runtime-specific coupling into core orchestration.

Small, focused pull requests are easier to review than large mixed-purpose changes.

---

## Roadmap direction

Potential areas include:

- More runtime adapters
- Better workflow authoring and visualization
- Richer observability and tracing
- Stronger sandboxing and capability controls
- Reproducible agent evaluation suites
- Better local-model integration
- Portable deployment modes
- Shared workflow templates
- Better first-run onboarding

---

## Project status

**Active development.**

Jinwoo Sys is an evolving engineering project. APIs, runtime integrations, workflow surfaces, and internal architecture can change between releases.

For the most accurate status, use the current source tree, tests, issues, pull requests, and release notes rather than relying on a static feature list.

---

## License

Jinwoo Sys is released under the [MIT License](LICENSE).

---

## Why Jinwoo Sys?

AI coding agents are becoming more capable. The bottleneck is increasingly **coordination**, not just model intelligence.

Jinwoo Sys explores what happens when coding agents are treated like an engineering workforce:

**roles, runtimes, routing, communication, workspaces, state, and verification — under one local control plane.**
