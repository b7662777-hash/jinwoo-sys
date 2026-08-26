# 🏛️ Jinwoo Sys Architecture Specification

This document details the software architecture, modular layer boundaries, communication protocols, and execution topologies of **Jinwoo Sys**.

---

## 1. High-Level Architecture

```
                               ┌──────────────────────────────────────────┐
                               │               JINWOO SYS                 │
                               │        PRIMARY APPLICATION SHELL         │
                               └────────────────────┬─────────────────────┘
                                                    │
                ┌───────────────────────────────────┼───────────────────────────────────┐
                │                                   │                                   │
  ┌─────────────▼─────────────┐       ┌─────────────▼─────────────┐       ┌─────────────▼─────────────┐
  │   WORKFORCE & ROLES       │       │    WORKFLOW SCHEDULER     │       │    WORKSPACE CONTAINMENT  │
  │  - Role Mapping           │       │  - DAG Decomposition      │       │  - WorkspaceGuard         │
  │  - Model Recommendations  │       │  - Dependency Resolution  │       │  - Atomic File Locks      │
  │  - Agent Lifecycles       │       │  - Parallel Branches      │       │  - Diff Summarization     │
  └─────────────┬─────────────┘       └─────────────┬─────────────┘       └─────────────┬─────────────┘
                │                                   │                                   │
                └───────────────────────────────────┼───────────────────────────────────┘
                                                    │
                               ┌────────────────────▼─────────────────────┐
                               │      MULTI-AGENT COMMUNICATION BUS       │
                               │  - Canonical Message Format              │
                               │  - Correlation ID Tracking               │
                               │  - Inboxes & Explicit Delivery States    │
                               │  - Real-Time SSE Event Stream            │
                               └────────────────────┬─────────────────────┘
                                                    │
                ┌───────────────────────────────────┼───────────────────────────────────┐
                │                                   │                                   │
  ┌─────────────▼─────────────┐       ┌─────────────▼─────────────┐       ┌─────────────▼─────────────┐
  │     OPENCODE ADAPTER      │       │      HERMES ADAPTER       │       │       CODEX ADAPTER       │
  │  - CLI v1.18.18 Binding   │       │  - Python Worker Daemon   │       │  - Node SDK Streamer      │
  │  - Interactive TUI Window │       │  - Port 20129 Dispatch    │       │  - Direct Prompt Passing  │
  │  - Role Context Injection │       │  - SSE Event Forwarding   │       │  - Token Tracking         │
  └─────────────┬─────────────┘       └─────────────┬─────────────┘       └─────────────┬─────────────┘
                │                                   │                                   │
                └───────────────────────────────────┼───────────────────────────────────┘
                                                    │
                               ┌────────────────────▼─────────────────────┐
                               │         OMNIROUTE LOCAL GATEWAY          │
                               │  - Unified /v1 Proxy Endpoint            │
                               │  - Circuit Breakers & Cooldowns          │
                               │  - Auto-Combos & Upstream Fallback       │
                               └────────────────────┬─────────────────────┘
                                                    │
                               ┌────────────────────▼─────────────────────┐
                               │      UPSTREAM PROVIDERS & MODELS         │
                               │  - Anthropic / OpenAI / Google           │
                               │  - OpenRouter / Ollama / Local Models    │
                               └──────────────────────────────────────────┘
```

---

## 2. Layer Definitions & Contracts

### 2.1 Jinwoo Control Plane
- **Role**: Manages UI state, workforce headcount, task scheduling, and user intervention.
- **Persistence**: SQLite database at `data/jinwoo_state.sqlite`.
- **Safety**: Validates all file operations against `WorkspaceGuard` to prevent directory traversal.

### 2.2 Multi-Agent Communication Bus (`AgentMessageBus`)
- **Role**: Dispatches messages between roles with explicit delivery confirmation.
- **Canonical Schema**: Defined in `src/lib/jinwoo/communication/types.ts`.
- **States**: `CREATED` $\rightarrow$ `QUEUED` $\rightarrow$ `SENT` $\rightarrow$ `DELIVERED` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `PROCESSING` $\rightarrow$ `RESPONDED`.

### 2.3 Coding Agent Adapter Layer (`CodingAgentRegistry`)
- **Role**: Bridges abstract Jinwoo roles (`DEVELOPER`, `QA`) to physical subprocesses and daemons (`OpenCode`, `Hermes`, `Codex`).
- **Contract**: `CodingAgentAdapter` interface.

### 2.4 OmniRoute Gateway
- **Role**: Acts as the local AI gateway on port 20128 (`/api/v1/chat/completions`).
- **Resilience**: Enforces 3-layer resilience (Provider Breakers, Connection Cooldowns, Model Lockouts).
