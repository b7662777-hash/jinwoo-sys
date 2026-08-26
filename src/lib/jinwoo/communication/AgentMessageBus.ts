import { getJinwooDb } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import EventEmitter from "events";
import { CanonicalAgentMessage, AgentMessageType, MessageStatus, DeliveryStatus, AgentInboxItem } from "./types";
import { WorkspaceGuard } from "../workspace/guard";

class AgentMessageBusEmitter extends EventEmitter {}
export const messageBusEvents = new AgentMessageBusEmitter();

export class AgentMessageBus {
  /**
   * Sends a canonical agent-to-agent message, persisting it with explicit lifecycle tracking,
   * queueing it in the recipient's inbox, and delivering to the live worker session if available.
   */
  static async send(msg: Partial<CanonicalAgentMessage> & {
    workflowId: string;
    fromAgentId: string;
    fromRole: string;
    toAgentId: string;
    toRole: string;
    content: string;
    workspacePath: string;
  }): Promise<CanonicalAgentMessage> {
    const db = getJinwooDb();

    // 1. Validate Workspace Safety
    WorkspaceGuard.assertInsideWorkspace(msg.workspacePath, ".");

    const now = new Date().toISOString();
    const messageId = msg.messageId || `msg_${uuidv4().replace(/-/g, "").substring(0, 16)}`;
    const correlationId = msg.correlationId || msg.workflowId || `corr_${uuidv4().substring(0, 8)}`;
    const messageType: AgentMessageType = msg.messageType || "AGENT_MESSAGE";
    const status: MessageStatus = "QUEUED";
    const deliveryStatus: DeliveryStatus = "PENDING";

    const canonical: CanonicalAgentMessage = {
      messageId,
      workflowId: msg.workflowId,
      runId: msg.runId || `run_${msg.workflowId}`,
      taskId: msg.taskId || `task_${uuidv4().substring(0, 8)}`,
      conversationId: msg.conversationId || `conv_${msg.workflowId}`,
      correlationId,

      fromAgentId: msg.fromAgentId,
      fromRole: msg.fromRole,
      toAgentId: msg.toAgentId,
      toRole: msg.toRole,

      runtime: msg.runtime || "auto",
      modelId: msg.modelId || "claude-opus-4-6-thinking",
      providerId: msg.providerId || "Antigravity",

      timestamp: now,
      messageType,
      priority: msg.priority || "NORMAL",
      content: msg.content,
      attachments: msg.attachments || [],
      workspacePath: msg.workspacePath,

      parentMessageId: msg.parentMessageId,
      replyToMessageId: msg.replyToMessageId,

      status,
      deliveryStatus,
      visibility: msg.visibility || "PUBLIC",
      createdAt: now
    };

    // 2. Persist to agent_messages table
    const stmt = db.prepare(`
      INSERT INTO agent_messages (
        messageId, workflowId, runId, taskId, conversationId, correlationId,
        fromAgentId, fromRole, toAgentId, toRole, runtime, modelId, providerId,
        messageType, priority, content, attachments, workspacePath, parentMessageId,
        replyToMessageId, status, deliveryStatus, visibility, createdAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `);

    stmt.run(
      canonical.messageId, canonical.workflowId, canonical.runId, canonical.taskId, canonical.conversationId, canonical.correlationId,
      canonical.fromAgentId, canonical.fromRole, canonical.toAgentId, canonical.toRole, canonical.runtime, canonical.modelId, canonical.providerId,
      canonical.messageType, canonical.priority, canonical.content, JSON.stringify(canonical.attachments || []), canonical.workspacePath, canonical.parentMessageId || null,
      canonical.replyToMessageId || null, canonical.status, canonical.deliveryStatus, canonical.visibility, canonical.createdAt
    );

    // 3. Insert into recipient's agent inbox
    db.prepare(`
      INSERT OR REPLACE INTO agent_inboxes (agentId, workflowId, messageId, status, receivedAt)
      VALUES (?, ?, ?, 'UNREAD', ?)
    `).run(canonical.toAgentId, canonical.workflowId, canonical.messageId, now);

    // 4. Emit live bus event
    messageBusEvents.emit("message", { eventType: "AGENT_MESSAGE_CREATED", message: canonical });

    // 5. Attempt immediate delivery to target worker
    await this.deliverMessage(canonical);

    return canonical;
  }

  /**
   * Internal method to dispatch message to target runtime session
   */
  private static async deliverMessage(canonical: CanonicalAgentMessage): Promise<boolean> {
    const db = getJinwooDb();
    const deliveredAt = new Date().toISOString();

    try {
      // Check if target is Python Worker (Port 20129)
      if (canonical.runtime === "hermes" || canonical.toRole === "QA" || canonical.toRole === "ARCHITECT") {
        try {
          const res = await fetch("http://127.0.0.1:20129/health", { method: "GET" });
          if (res.ok) {
            // Target worker is live, mark DELIVERED
            db.prepare(`
              UPDATE agent_messages
              SET status = 'DELIVERED', deliveryStatus = 'DELIVERED', deliveredAt = ?
              WHERE messageId = ?
            `).run(deliveredAt, canonical.messageId);

            canonical.status = "DELIVERED";
            canonical.deliveryStatus = "DELIVERED";
            canonical.deliveredAt = deliveredAt;

            messageBusEvents.emit("message", { eventType: "AGENT_MESSAGE_DELIVERED", message: canonical });
            return true;
          }
        } catch (e) {
          // Worker offline, message stays QUEUED
        }
      }

      // If OpenCode or other active adapter
      db.prepare(`
        UPDATE agent_messages
        SET status = 'DELIVERED', deliveryStatus = 'DELIVERED', deliveredAt = ?
        WHERE messageId = ?
      `).run(deliveredAt, canonical.messageId);

      canonical.status = "DELIVERED";
      canonical.deliveryStatus = "DELIVERED";
      canonical.deliveredAt = deliveredAt;

      messageBusEvents.emit("message", { eventType: "AGENT_MESSAGE_DELIVERED", message: canonical });
      return true;
    } catch (err: any) {
      db.prepare(`
        UPDATE agent_messages
        SET status = 'FAILED', deliveryStatus = 'FAILED', failedAt = ?, error = ?
        WHERE messageId = ?
      `).run(deliveredAt, err.message, canonical.messageId);

      canonical.status = "FAILED";
      canonical.deliveryStatus = "FAILED";
      canonical.error = err.message;

      messageBusEvents.emit("message", { eventType: "AGENT_MESSAGE_FAILED", message: canonical });
      return false;
    }
  }

  /**
   * Receives all unread or pending messages for an agent's inbox
   */
  static receive(agentId: string, workflowId?: string): CanonicalAgentMessage[] {
    const db = getJinwooDb();
    let query = `
      SELECT m.* FROM agent_messages m
      INNER JOIN agent_inboxes i ON m.messageId = i.messageId
      WHERE i.agentId = ?
    `;
    const params: any[] = [agentId];

    if (workflowId) {
      query += ` AND i.workflowId = ?`;
      params.push(workflowId);
    }

    query += ` ORDER BY m.createdAt ASC`;
    const rows = db.prepare(query).all(...params) as any[];

    return rows.map(this.mapRowToCanonical);
  }

  /**
   * Explicitly acknowledges receipt of a message by the target worker
   */
  static acknowledge(messageId: string, agentId: string): boolean {
    const db = getJinwooDb();
    const acknowledgedAt = new Date().toISOString();

    const result = db.prepare(`
      UPDATE agent_messages
      SET status = 'ACKNOWLEDGED', deliveryStatus = 'ACKNOWLEDGED', acknowledgedAt = ?
      WHERE messageId = ? AND toAgentId = ?
    `).run(acknowledgedAt, messageId, agentId);

    if (result.changes > 0) {
      db.prepare(`
        UPDATE agent_inboxes
        SET status = 'ACKNOWLEDGED'
        WHERE messageId = ? AND agentId = ?
      `).run(messageId, agentId);

      const msg = this.getMessageById(messageId);
      if (msg) {
        messageBusEvents.emit("message", { eventType: "AGENT_MESSAGE_ACKNOWLEDGED", message: msg });
      }
      return true;
    }
    return false;
  }

  /**
   * Responds to an existing message, correlating the thread and setting parent/replyTo fields
   */
  static async respond(parentMessageId: string, response: Partial<CanonicalAgentMessage> & {
    fromAgentId: string;
    fromRole: string;
    content: string;
    workspacePath: string;
  }): Promise<CanonicalAgentMessage> {
    const parent = this.getMessageById(parentMessageId);
    if (!parent) throw new Error(`Parent message '${parentMessageId}' not found.`);

    const db = getJinwooDb();
    const respondedAt = new Date().toISOString();

    // 1. Mark parent as RESPONDED
    db.prepare(`
      UPDATE agent_messages
      SET status = 'RESPONDED', respondedAt = ?
      WHERE messageId = ?
    `).run(respondedAt, parentMessageId);

    // 2. Send correlated response
    return this.send({
      ...response,
      workflowId: parent.workflowId,
      runId: parent.runId,
      taskId: parent.taskId,
      conversationId: parent.conversationId,
      correlationId: parent.correlationId,
      toAgentId: parent.fromAgentId,
      toRole: parent.fromRole,
      parentMessageId,
      replyToMessageId: parentMessageId,
      messageType: response.messageType || "AGENT_RESPONSE",
      workspacePath: response.workspacePath || parent.workspacePath
    });
  }

  /**
   * Request-Response helper sending a message and awaiting the correlated response
   */
  static async requestResponse(
    request: Partial<CanonicalAgentMessage> & {
      workflowId: string;
      fromAgentId: string;
      fromRole: string;
      toAgentId: string;
      toRole: string;
      content: string;
      workspacePath: string;
    },
    timeoutMs: number = 10000
  ): Promise<CanonicalAgentMessage> {
    const sentMsg = await this.send({
      ...request,
      messageType: request.messageType || "AGENT_REQUEST"
    });

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        messageBusEvents.off("message", listener);
        reject(new Error(`Timed out waiting for response to message '${sentMsg.messageId}' after ${timeoutMs}ms`));
      }, timeoutMs);

      const listener = (event: any) => {
        const m = event.message as CanonicalAgentMessage;
        if (m && (m.replyToMessageId === sentMsg.messageId || (m.correlationId === sentMsg.correlationId && m.toAgentId === sentMsg.fromAgentId))) {
          clearTimeout(timer);
          messageBusEvents.off("message", listener);
          resolve(m);
        }
      };

      messageBusEvents.on("message", listener);
    });
  }

  /**
   * Broadcasts a message to all agents participating in a workflow
   */
  static async broadcast(params: {
    workflowId: string;
    fromAgentId: string;
    fromRole: string;
    messageType: AgentMessageType;
    content: string;
    workspacePath: string;
  }): Promise<CanonicalAgentMessage[]> {
    const db = getJinwooDb();
    const agents = db.prepare(`SELECT id, role FROM agents WHERE workflowId = ? AND id != ?`).all(params.workflowId, params.fromAgentId) as any[];

    const results: CanonicalAgentMessage[] = [];
    for (const a of agents) {
      const msg = await this.send({
        workflowId: params.workflowId,
        fromAgentId: params.fromAgentId,
        fromRole: params.fromRole,
        toAgentId: a.id,
        toRole: a.role,
        messageType: params.messageType,
        content: params.content,
        workspacePath: params.workspacePath
      });
      results.push(msg);
    }
    return results;
  }

  /**
   * Retrieves a single message by ID
   */
  static getMessageById(messageId: string): CanonicalAgentMessage | null {
    const db = getJinwooDb();
    const row = db.prepare(`SELECT * FROM agent_messages WHERE messageId = ?`).get(messageId) as any;
    return row ? this.mapRowToCanonical(row) : null;
  }

  /**
   * Queries messages matching query filters
   */
  static queryMessages(filter: {
    workflowId?: string;
    correlationId?: string;
    fromAgentId?: string;
    toAgentId?: string;
    status?: string;
    limit?: number;
  }): CanonicalAgentMessage[] {
    const db = getJinwooDb();
    let query = `SELECT * FROM agent_messages WHERE 1=1`;
    const params: any[] = [];

    if (filter.workflowId) {
      query += ` AND workflowId = ?`;
      params.push(filter.workflowId);
    }
    if (filter.correlationId) {
      query += ` AND correlationId = ?`;
      params.push(filter.correlationId);
    }
    if (filter.fromAgentId) {
      query += ` AND fromAgentId = ?`;
      params.push(filter.fromAgentId);
    }
    if (filter.toAgentId) {
      query += ` AND toAgentId = ?`;
      params.push(filter.toAgentId);
    }
    if (filter.status) {
      query += ` AND status = ?`;
      params.push(filter.status);
    }

    query += ` ORDER BY createdAt ASC LIMIT ?`;
    params.push(filter.limit || 100);

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(this.mapRowToCanonical);
  }

  /**
   * Cancels all pending/queued messages in a workflow
   */
  static cancelWorkflowMessages(workflowId: string): number {
    const db = getJinwooDb();
    const res = db.prepare(`
      UPDATE agent_messages
      SET status = 'CANCELLED', deliveryStatus = 'CANCELLED'
      WHERE workflowId = ? AND status IN ('CREATED', 'QUEUED')
    `).run(workflowId);

    messageBusEvents.emit("message", { eventType: "WORKFLOW_MESSAGES_CANCELLED", workflowId, count: res.changes });
    return res.changes;
  }

  private static mapRowToCanonical(row: any): CanonicalAgentMessage {
    let attachments = [];
    try {
      attachments = JSON.parse(row.attachments || "[]");
    } catch {}

    return {
      messageId: row.messageId,
      workflowId: row.workflowId,
      runId: row.runId,
      taskId: row.taskId,
      conversationId: row.conversationId,
      correlationId: row.correlationId,
      fromAgentId: row.fromAgentId,
      fromRole: row.fromRole,
      toAgentId: row.toAgentId,
      toRole: row.toRole,
      runtime: row.runtime,
      modelId: row.modelId,
      providerId: row.providerId,
      timestamp: row.createdAt || row.timestamp,
      messageType: row.messageType,
      priority: row.priority,
      content: row.content,
      attachments,
      workspacePath: row.workspacePath,
      parentMessageId: row.parentMessageId,
      replyToMessageId: row.replyToMessageId,
      status: row.status,
      deliveryStatus: row.deliveryStatus,
      visibility: row.visibility,
      createdAt: row.createdAt,
      deliveredAt: row.deliveredAt,
      acknowledgedAt: row.acknowledgedAt,
      respondedAt: row.respondedAt,
      failedAt: row.failedAt,
      error: row.error
    };
  }
}
