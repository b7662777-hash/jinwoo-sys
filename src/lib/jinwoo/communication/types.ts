export type AgentMessageType =
  | "AGENT_MESSAGE"
  | "AGENT_REQUEST"
  | "AGENT_RESPONSE"
  | "HANDOFF"
  | "HANDOFF_ACK"
  | "QUESTION"
  | "ANSWER"
  | "TASK_ASSIGNED"
  | "TASK_ACCEPTED"
  | "TASK_REJECTED"
  | "PLAN_CREATED"
  | "PLAN_UPDATED"
  | "CODE_REQUEST"
  | "CODE_RESULT"
  | "REVIEW_REQUEST"
  | "REVIEW_RESULT"
  | "SECURITY_REQUEST"
  | "SECURITY_RESULT"
  | "QA_REQUEST"
  | "QA_RESULT"
  | "FILE_CONTEXT"
  | "FILE_CHANGED"
  | "ERROR"
  | "WARNING"
  | "BLOCKED"
  | "UNBLOCKED"
  | "APPROVAL_REQUEST"
  | "APPROVAL_RESPONSE"
  | "STATUS_UPDATE"
  | "PROGRESS_UPDATE"
  | "FINAL_RESULT"
  | "CANCELLATION"
  | "CANCELLATION_ACK";

export type MessageStatus =
  | "CREATED"
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "ACKNOWLEDGED"
  | "PROCESSING"
  | "RESPONDED"
  | "FAILED"
  | "RETRYING"
  | "CANCELLED";

export type DeliveryStatus =
  | "PENDING"
  | "DELIVERED"
  | "ACKNOWLEDGED"
  | "FAILED"
  | "CANCELLED";

export type MessagePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface MessageAttachment {
  type: "file" | "diff" | "test_result" | "schema" | "custom";
  path?: string;
  content?: string;
  summary?: string;
  diff?: string;
  sizeBytes?: number;
}

export interface CanonicalAgentMessage {
  messageId: string;
  workflowId: string;
  runId?: string;
  taskId?: string;
  conversationId?: string;
  correlationId: string;

  fromAgentId: string;
  fromRole: string;

  toAgentId: string;
  toRole: string;

  runtime: string;
  modelId?: string;
  providerId?: string;

  timestamp: string;
  messageType: AgentMessageType;
  priority?: MessagePriority;

  content: string;
  attachments?: MessageAttachment[];

  workspacePath: string;

  parentMessageId?: string;
  replyToMessageId?: string;

  status: MessageStatus;
  deliveryStatus: DeliveryStatus;
  visibility?: "PUBLIC" | "PRIVATE" | "INTERNAL";

  createdAt: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  respondedAt?: string;
  failedAt?: string;
  error?: string;
}

export interface AgentInboxItem {
  agentId: string;
  workflowId: string;
  messageId: string;
  status: "UNREAD" | "READ" | "ACKNOWLEDGED" | "PROCESSING" | "COMPLETED";
  receivedAt: string;
  message?: CanonicalAgentMessage;
}

export interface BoundedContext {
  summary: string;
  taskDescription: string;
  relevantMessages: { from: string; content: string; timestamp: string }[];
  filesTouched: { path: string; changeType: string; diffSnippet?: string }[];
  decisions: string[];
  testRequirements?: string[];
  workspacePath: string;
  tokenEstimate: number;
}
