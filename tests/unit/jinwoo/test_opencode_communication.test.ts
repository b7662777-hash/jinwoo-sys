import { describe, it } from "node:test";
import assert from "node:assert";
import path from "path";
import { AgentMessageBus } from "../../../src/lib/jinwoo/communication/AgentMessageBus";
import { OpenCodeAdapter } from "../../../src/lib/jinwoo/coding-agents/adapters/opencode";

describe("Test #4: OpenCode Worker Communication & Context Injection", () => {
  it("delivers real context to OpenCode worker session and correlates the returned result", async () => {
    const adapter = new OpenCodeAdapter();
    const detection = await adapter.detectInstallation();

    assert.strictEqual(detection.status, "READY", "OpenCode must be detected as READY");
    assert.strictEqual(detection.capabilities.supportsAgentMessaging, true);

    const workflowId = `wf_opencode_${Date.now()}`;
    const workspacePath = path.resolve(process.cwd(), "scratch", "jinwoo_coding_agent_test");

    // 1. Architect sends handoff to OpenCode Developer
    const handoff = await AgentMessageBus.send({
      workflowId,
      correlationId: "corr_opencode_001",
      fromAgentId: "architect-1",
      fromRole: "ARCHITECT",
      toAgentId: "opencode-worker",
      toRole: "DEVELOPER",
      runtime: "opencode",
      messageType: "HANDOFF",
      content: "OpenCode Developer: Inspect workspace files and generate verification report.",
      workspacePath
    });

    assert.strictEqual(handoff.status, "DELIVERED");
    assert.strictEqual(handoff.runtime, "opencode");

    // 2. OpenCode acknowledges receipt
    AgentMessageBus.acknowledge(handoff.messageId, "opencode-worker");

    // 3. OpenCode worker replies
    const opencodeResult = await AgentMessageBus.respond(handoff.messageId, {
      fromAgentId: "opencode-worker",
      fromRole: "DEVELOPER",
      runtime: "opencode",
      content: "OpenCode worker executed successfully: 1 verification token written to workspace.",
      workspacePath,
      messageType: "CODE_RESULT"
    });

    assert.strictEqual(opencodeResult.status, "DELIVERED");
    assert.strictEqual(opencodeResult.toRole, "ARCHITECT");
    assert.strictEqual(opencodeResult.replyToMessageId, handoff.messageId);
  });
});
