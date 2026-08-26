# ⚡ Multi-Agent Communication Bus Guide

The **Jinwoo Multi-Agent Communication Bus** (`AgentMessageBus`) provides a real-time, correlated, persisted, and observable messaging infrastructure between autonomous AI worker roles.

---

## 1. Core Principles

1. **No Fake Simulation**: Messages are not static UI cards; every message is a correlated record with explicit state transitions.
2. **Deterministic Lifecycle**: Every dispatch transitions through verified delivery states.
3. **Bounded Context**: Agents only receive relevant diff summaries and task parameters, preventing token context blowout.
4. **Observable**: Full SSE streaming (`/api/jinwoo/communication/stream`) and visual topology graphs.

---

## 2. Canonical Message Model (`CanonicalAgentMessage`)

```typescript
export interface CanonicalAgentMessage {
  messageId: string;
  workflowId: string;
  correlationId: string;
  parentMessageId?: string;
  fromAgentId: string;
  fromRole: string;
  toAgentId: string;
  toRole: string;
  runtime?: string;
  messageType: "TASK_ASSIGNMENT" | "HANDOFF" | "CODE_REQUEST" | "REVIEW_REQUEST" | "REVIEW_RESULT" | "FINAL_RESULT";
  status: "CREATED" | "QUEUED" | "SENT" | "DELIVERED" | "ACKNOWLEDGED" | "PROCESSING" | "RESPONDED" | "FAILED" | "RETRYING" | "CANCELLED";
  content: string;
  workspacePath: string;
  attachments?: { type: "file" | "diff" | "log"; path: string }[];
  createdAt: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
}
```

---

## 3. Real 4-Role Handoff Example

```
ARCHITECT (Hermes/Opus)
      │
      │ 1. HANDOFF ("Implement auth checking logic")
      ▼
DEVELOPER (OpenCode v1.18.18)
      │
      │ 2. REVIEW_REQUEST ("Token written to auth.ts; verify")
      ▼
QA VERIFIER (Codex/Python)
      │
      │ 3. REVIEW_RESULT ("100% test coverage passed")
      ▼
DEVELOPER (OpenCode v1.18.18)
      │
      │ 4. FINAL_RESULT ("Ready for merge")
      ▼
ARCHITECT / OPERATOR
```

All 4 messages share the same `correlationId` and can be inspected in detail within the **Message Inspector Drawer** at `/jinwoo/communication`.
