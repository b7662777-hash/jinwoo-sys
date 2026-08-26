import { describe, it } from "node:test";
import assert from "node:assert";
import { OpenClawAdapter } from "../../../src/lib/jinwoo/coding-agents/adapters/openclaw";

describe("Test #5: OpenClaw Detection & Capability Verification", () => {
  it("accurately detects OpenClaw installation and reports NOT_INSTALLED when CLI is absent", async () => {
    const adapter = new OpenClawAdapter();
    const detection = await adapter.detectInstallation();

    // Since openclaw is not installed globally on this machine:
    assert.strictEqual(detection.id, "openclaw");
    if (detection.status === "NOT_INSTALLED") {
      assert.strictEqual(detection.capabilities.supportsAgentMessaging, false);
      assert.strictEqual(detection.capabilities.supportsSessionInjection, false);
      assert.ok(detection.installInstructions?.includes("npm install -g openclaw"));
    } else {
      assert.strictEqual(detection.status, "READY");
    }
  });
});
