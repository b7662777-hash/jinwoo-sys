# 🔌 Jinwoo Sys REST & Streaming API Reference

This document provides complete reference specifications for all Jinwoo Sys control-plane endpoints.

---

## 1. Multi-Agent Communication Bus APIs

### `POST /api/jinwoo/communication/send`
Dispatches a new message between workforce roles or agents.
- **Request Body**:
  ```json
  {
    "workflowId": "wf_12345",
    "correlationId": "corr_abc",
    "fromAgentId": "architect-lead",
    "fromRole": "ARCHITECT",
    "toAgentId": "developer-opencode",
    "toRole": "DEVELOPER",
    "runtime": "opencode",
    "messageType": "HANDOFF",
    "content": "Implement auth token check.",
    "workspacePath": "D:\\Projects\\App"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": { "messageId": "msg_...", "status": "DELIVERED", ... }
  }
  ```

---

### `GET /api/jinwoo/communication/messages`
Queries persisted messages by filter parameters.
- **Query Parameters**:
  - `workflowId`: string
  - `correlationId`: string
  - `role`: string
  - `limit`: number (default: 50)
- **Response**: `200 OK` with array of `CanonicalAgentMessage`.

---

### `GET /api/jinwoo/communication/stream`
Server-Sent Events (SSE) stream broadcasting real-time message bus events (`AGENT_MESSAGE_CREATED`, `AGENT_MESSAGE_DELIVERED`, `AGENT_MESSAGE_ACKNOWLEDGED`).

---

## 2. Coding Agent Management APIs

### `POST /api/jinwoo/coding-agents`
Manages external coding agent subprocesses.
- **Actions**:
  - `launch_interactive`: Spawns an interactive OpenCode console session with assigned role.
  - `stop_interactive`: Terminates the worker session and kills its process tree.
  - `restart_interactive`: Restarts the worker session cleanly.
  - `test_execution`: Runs a headless capability probe.
- **Response**: `200 OK` with session details (`sessionId`, `pid`, `role`, `status`).

---

## 3. Workforce & Roles APIs

### `GET /api/jinwoo/agents`
Returns active workforce agents, roles, runtimes, PIDs, models, and creation timestamps.

### `GET /api/jinwoo/roles`
Returns all registered workforce role templates (`ARCHITECT`, `DEVELOPER`, `QA`, etc.) with capability mappings.
