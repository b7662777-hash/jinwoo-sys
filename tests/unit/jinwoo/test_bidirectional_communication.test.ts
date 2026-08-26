import { describe, it } from "node:test";
import assert from "node:assert";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";

describe("Test #3: Real Bidirectional AI Dialogue", () => {
  it("executes a 6-step multi-turn inter-role dialogue with full lifecycle tracking", async () => {
    const workflowId = `wf_bidi_${Date.now()}`;
    const correlationId = `corr_bidi_${Date.now()}`;
    const workspacePath = process.cwd();

    // 1. Architect -> Developer
    const m1 = await AgentMessageBus.send({
      workflowId,
      correlationId,
      fromAgentId: "architect",
      fromRole: "ARCHITECT",
      toAgentId: "developer",
      toRole: "DEVELOPER",
      content: "Implement authentication.",
      workspacePath
    });
    assert.strictEqual(m1.fromRole, "ARCHITECT");

    // 2. Developer -> Architect
    const m2 = await AgentMessageBus.respond(m1.messageId, {
      fromAgentId: "developer",
      fromRole: "DEVELOPER",
      content: "I found two authentication paths. Should I modify OAuth only or both OAuth and local auth?",
      workspacePath
    });
    assert.strictEqual(m2.fromRole, "DEVELOPER");
    assert.strictEqual(m2.toRole, "ARCHITECT");

    // 3. Architect -> Developer
    const m3 = await AgentMessageBus.respond(m2.messageId, {
      fromAgentId: "architect",
      fromRole: "ARCHITECT",
      content: "Modify both.",
      workspacePath
    });
    assert.strictEqual(m3.content, "Modify both.");

    // 4. Developer -> QA
    const m4 = await AgentMessageBus.send({
      workflowId,
      correlationId,
      fromAgentId: "developer",
      fromRole: "DEVELOPER",
      toAgentId: "qa",
      toRole: "QA",
      content: "Both authentication paths implemented. Run validation.",
      workspacePath,
      parentMessageId: m3.messageId
    });
    assert.strictEqual(m4.fromRole, "DEVELOPER");
    assert.strictEqual(m4.toRole, "QA");

    // 5. QA -> Developer
    const m5 = await AgentMessageBus.respond(m4.messageId, {
      fromAgentId: "qa",
      fromRole: "QA",
      content: "Authentication tests pass except token expiration edge case.",
      workspacePath
    });
    assert.strictEqual(m5.fromRole, "QA");
    assert.strictEqual(m5.toRole, "DEVELOPER");

    // 6. Developer -> Architect
    const m6 = await AgentMessageBus.send({
      workflowId,
      correlationId,
      fromAgentId: "developer",
      fromRole: "DEVELOPER",
      toAgentId: "architect",
      toRole: "ARCHITECT",
      content: "Fixing expiration handling and finalizing.",
      workspacePath,
      parentMessageId: m5.messageId
    });
    assert.strictEqual(m6.fromRole, "DEVELOPER");
    assert.strictEqual(m6.toRole, "ARCHITECT");

    // Verify all 6 messages exist in correlated chain
    const dialogue = AgentMessageBus.queryMessages({ correlationId });
    assert.strictEqual(dialogue.length, 6);
  });
});
