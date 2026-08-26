# Changelog

All notable changes to **Jinwoo Sys** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-26

### Initial Public Open-Source Release

#### Autonomous Orchestration & Governance
- **Primary Control Plane**: Unified Jinwoo Sys application shell providing full control over multi-agent workflows, workspaces, and workforce roles.
- **DAG Workflow Scheduler**: Parallel and sequential execution engine supporting task dependencies, blocked states, and auto-cancellation.
- **Dynamic Role System**: 10 workforce roles (`ARCHITECT`, `DEVELOPER`, `FRONTEND_DEVELOPER`, `BACKEND_DEVELOPER`, `QA`, `SECURITY`, `RESEARCHER`, `PLANNER`, `DOCUMENTATION`, `DEVOPS`) with model recommendation and capability mapping.

#### Multi-Agent Communication Bus
- **Correlated Delivery States**: Real `CREATED` $\rightarrow$ `QUEUED` $\rightarrow$ `SENT` $\rightarrow$ `DELIVERED` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `PROCESSING` $\rightarrow$ `RESPONDED` message lifecycle.
- **Live SSE Streaming**: Server-Sent Events stream (`/api/jinwoo/communication/stream`) broadcasting real-time inter-role communication.
- **Interactive Visualizer**: Dynamic topology graph, correlation drawer, and human-in-the-loop task injection.

#### Coding Agent Runtimes & Adapters
- **OpenCode v1.18.18 Role Worker**: First-class coding worker integration with interactive Windows Console window spawning, role context injection (`.opencode_role_context.md`), and correlated handoffs.
- **Hermes Worker Daemon**: Python-based worker executing on port 20129 for autonomous file tool tasks.
- **Codex & Claude Code Adapters**: Extensible adapter interface supporting streaming and prompt passing.
- **OpenClaw Detection**: Accurate environment detection reporting `NOT_INSTALLED` when binary is missing.

#### Safety & Gateway Layer
- **WorkspaceGuard**: Strict path traversal containment and atomic file locking to prevent multi-agent write collisions.
- **OmniRoute Local Gateway**: Local AI proxy layer handling 350+ LLM providers, circuit breakers, rate limits, and fallback combos.
