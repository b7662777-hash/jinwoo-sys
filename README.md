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

## Quick start

### Requirements

- Node.js `>=22.22.2 <23` or `>=24 <27`
- Python `>=3.10` for the Python worker daemon
- A supported coding-agent runtime such as OpenCode, Codex, or Claude Code, depending on the workflow

### Install

```bash
npm install
```

### Start the Python worker

```bash
python runtimes/jinwoo_worker_server.py
```

### Start Jinwoo Sys

```bash
npm run dev -- -p 20128
```

### Local interfaces

```text
Dashboard:     http://127.0.0.1:20128/jinwoo
Communication: http://127.0.0.1:20128/jinwoo/communication
OpenCode:      http://127.0.0.1:20128/jinwoo/coding-agents/opencode
Workforce:     http://127.0.0.1:20128/jinwoo/workforce
Agents:        http://127.0.0.1:20128/jinwoo/agents
```

> Installation and runtime commands can evolve. Prefer the repository scripts and current source tree as the source of truth.

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

Directory names may evolve; this is an orientation map rather than a hard API contract.

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

The roadmap should remain implementation-driven: features should solve real orchestration problems.

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

If that problem interests you, the repository is the place to experiment, challenge the architecture, and improve it.
