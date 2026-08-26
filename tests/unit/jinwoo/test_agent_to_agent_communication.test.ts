import { describe, it } from "node:test";
import assert from "node:assert";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";

describe("Test #1: Real Agent-to-Agent Communication", () => {
  it("delivers, acknowledges, and correlates messages between Architect and Developer", async () => {
    const workflowId = `wf_test1_${Date.now()}`;
    const workspacePath = process.cwd();

    // 1. Architect sends prompt to Developer
    const architectMsg = await AgentMessageBus.send({
      workflowId,
      correlationId: `corr_auth_001`,
      fromAgentId: "architect-1",
      fromRole: "ARCHITECT",
      toAgentId: "developer-1",
      toRole: "DEVELOPER",
      content: "Developer, inspect the project and report the authentication architecture.",
      workspacePath,
      messageType: "AGENT_REQUEST"
    });

    assert.ok(architectMsg.messageId.startsWith("msg_"), "Message ID should have canonical format");
    assert.strictEqual(architectMsg.fromRole, "ARCHITECT");
    assert.strictEqual(architectMsg.toRole, "DEVELOPER");
    assert.strictEqual(architectMsg.status, "DELIVERED");

    // 2. Developer receives from inbox
    const developerInbox = AgentMessageBus.receive("developer-1", workflowId);
    assert.strictEqual(developerInbox.length, 1, "Developer should receive exactly 1 message");
    assert.strictEqual(developerInbox[0].messageId, architectMsg.messageId);

    // 3. Developer acknowledges receipt
    const ackSuccess = AgentMessageBus.acknowledge(architectMsg.messageId, "developer-1");
    assert.strictEqual(ackSuccess, true, "Message acknowledgment must succeed");

    const ackedMsg = AgentMessageBus.getMessageById(architectMsg.messageId);
    assert.strictEqual(ackedMsg?.status, "ACKNOWLEDGED");
    assert.ok(ackedMsg?.acknowledgedAt, "AcknowledgedAt timestamp must be recorded");

    // 4. Developer replies to Architect
    const devReply = await AgentMessageBus.respond(architectMsg.messageId, {
      fromAgentId: "developer-1",
      fromRole: "DEVELOPER",
      content: "Authentication architecture inspected: Next.js Auth with SQLite token storage.",
      workspacePath
    });

    assert.strictEqual(devReply.replyToMessageId, architectMsg.messageId);
    assert.strictEqual(devReply.correlationId, architectMsg.correlationId);
    assert.strictEqual(devReply.toAgentId, "architect-1");
    assert.strictEqual(devReply.toRole, "ARCHITECT");

    // 5. Architect receives reply
    const architectInbox = AgentMessageBus.receive("architect-1", workflowId);
    assert.strictEqual(architectInbox.length, 1);
    assert.strictEqual(architectInbox[0].messageId, devReply.messageId);
  });
});
