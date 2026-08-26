import { describe, it } from "node:test";
import assert from "node:assert";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";

describe("Test #7: Concurrent Multi-Worker Sessions with Zero Cross-Talk", () => {
  it("delivers concurrent messages across 4 roles simultaneously with complete correlation isolation", async () => {
    const workflowId = `wf_concurrent_${Date.now()}`;
    const workspacePath = process.cwd();

    const roles = [
      { id: "dev-1", role: "DEVELOPER", content: "Developer task 1" },
      { id: "dev-2", role: "DEVELOPER", content: "Developer task 2" },
      { id: "qa-1", role: "QA", content: "QA test suite 1" },
      { id: "sec-1", role: "SECURITY", content: "Security audit 1" }
    ];

    // Dispatch 4 concurrent requests in parallel
    const promises = roles.map((r) =>
      AgentMessageBus.send({
        workflowId,
        correlationId: `corr_${r.id}`,
        fromAgentId: "architect-lead",
        fromRole: "ARCHITECT",
        toAgentId: r.id,
        toRole: r.role,
        content: r.content,
        workspacePath
      })
    );

    const results = await Promise.all(promises);
    assert.strictEqual(results.length, 4);

    // Verify inbox isolation (each agent receives ONLY their own message)
    for (const r of roles) {
      const inbox = AgentMessageBus.receive(r.id, workflowId);
      assert.strictEqual(inbox.length, 1, `Agent ${r.id} should have exactly 1 message`);
      assert.strictEqual(inbox[0].content, r.content);
      assert.strictEqual(inbox[0].correlationId, `corr_${r.id}`);
    }
  });
});
