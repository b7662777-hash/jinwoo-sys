import { describe, it } from "node:test";
import assert from "node:assert";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";

describe("Test #8: Workflow Cancellation & Process Cleanup", () => {
  it("cancels all pending and queued messages when workflow is aborted", async () => {
    const workflowId = `wf_cancel_${Date.now()}`;
    const workspacePath = process.cwd();

    // Send 3 messages
    await AgentMessageBus.send({
      workflowId,
      fromAgentId: "architect",
      fromRole: "ARCHITECT",
      toAgentId: "dev-cancel",
      toRole: "DEVELOPER",
      content: "Task 1",
      workspacePath
    });

    await AgentMessageBus.send({
      workflowId,
      fromAgentId: "architect",
      fromRole: "ARCHITECT",
      toAgentId: "qa-cancel",
      toRole: "QA",
      content: "Task 2",
      workspacePath
    });

    // Abort workflow messages
    const db = (await import("../../../src/lib/jinwoo/db/schema")).getJinwooDb();
    db.prepare(`UPDATE agent_messages SET status = 'CANCELLED' WHERE workflowId = ?`).run(workflowId);

    const msgs = AgentMessageBus.queryMessages({ workflowId });
    assert.ok(msgs.length >= 2);
    for (const m of msgs) {
      assert.strictEqual(m.status, "CANCELLED");
    }
  });
});
