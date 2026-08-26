import { describe, it } from "node:test";
import assert from "node:assert";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";

describe("Test #2: Three-Agent Correlated Handoff (Architect → Developer → QA → Architect)", () => {
  it("orchestrates a full 3-agent handoff pipeline with state validation at each stage", async () => {
    const workflowId = `wf_handoff_${Date.now()}`;
    const correlationId = `corr_three_agent_${Date.now()}`;
    const workspacePath = process.cwd();

    // Stage 1: Architect sends implementation plan to Developer
    const stage1 = await AgentMessageBus.send({
      workflowId,
      correlationId,
      fromAgentId: "architect-lead",
      fromRole: "ARCHITECT",
      toAgentId: "developer-core",
      toRole: "DEVELOPER",
      messageType: "HANDOFF",
      content: "Plan: Implement token expiration check in src/auth/token.ts",
      workspacePath
    });

    assert.strictEqual(stage1.messageType, "HANDOFF");
    AgentMessageBus.acknowledge(stage1.messageId, "developer-core");

    // Stage 2: Developer performs work and sends handoff to QA
    const stage2 = await AgentMessageBus.send({
      workflowId,
      correlationId,
      fromAgentId: "developer-core",
      fromRole: "DEVELOPER",
      toAgentId: "qa-verifier",
      toRole: "QA",
      messageType: "REVIEW_REQUEST",
      content: "Changes complete. Verify token expiration handling under test suite.",
      workspacePath,
      parentMessageId: stage1.messageId
    });

    assert.strictEqual(stage2.messageType, "REVIEW_REQUEST");
    AgentMessageBus.acknowledge(stage2.messageId, "qa-verifier");

    // Stage 3: QA validates and reports result back to Developer & Architect
    const stage3 = await AgentMessageBus.send({
      workflowId,
      correlationId,
      fromAgentId: "qa-verifier",
      fromRole: "QA",
      toAgentId: "architect-lead",
      toRole: "ARCHITECT",
      messageType: "FINAL_RESULT",
      content: "All QA assertions passed: 100% token expiration test coverage verified.",
      workspacePath,
      parentMessageId: stage2.messageId
    });

    assert.strictEqual(stage3.messageType, "FINAL_RESULT");
    AgentMessageBus.acknowledge(stage3.messageId, "architect-lead");

    // Verify complete correlation chain
    const chain = AgentMessageBus.queryMessages({ correlationId });
    assert.strictEqual(chain.length, 3, "Chain must contain all 3 stages");
    assert.strictEqual(chain[0].fromRole, "ARCHITECT");
    assert.strictEqual(chain[1].fromRole, "DEVELOPER");
    assert.strictEqual(chain[2].fromRole, "QA");
  });
});
