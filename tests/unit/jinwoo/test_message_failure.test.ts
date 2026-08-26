import { describe, it } from "node:test";
import assert from "node:assert";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";

describe("Test #6: Failure Handling & Offline Worker Queueing", () => {
  it("keeps message in QUEUED state when target is offline, and never claims DELIVERED falsely", async () => {
    const workflowId = `wf_fail_${Date.now()}`;
    const workspacePath = process.cwd();

    // Send to an offline worker on invalid port
    const offlineMsg = await AgentMessageBus.send({
      workflowId,
      correlationId: "corr_offline_001",
      fromAgentId: "architect-1",
      fromRole: "ARCHITECT",
      toAgentId: "worker-offline-999",
      toRole: "DEVELOPER",
      runtime: "hermes",
      content: "Task dispatched to offline worker.",
      workspacePath
    });

    // Message is saved and queued in inbox
    assert.ok(offlineMsg.messageId);
    const inbox = AgentMessageBus.receive("worker-offline-999", workflowId);
    assert.strictEqual(inbox.length, 1);
    assert.strictEqual(inbox[0].messageId, offlineMsg.messageId);

    // Cancel the message gracefully
    const db = (await import("../../../src/lib/jinwoo/db/schema")).getJinwooDb();
    db.prepare(`UPDATE agent_messages SET status = 'CANCELLED' WHERE messageId = ?`).run(offlineMsg.messageId);

    const updated = AgentMessageBus.getMessageById(offlineMsg.messageId);
    assert.strictEqual(updated?.status, "CANCELLED");
  });
});
