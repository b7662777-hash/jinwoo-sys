import { CodingAgentAdapter, DetectedAgentRuntime } from "./types";
import { HermesAdapter } from "./adapters/hermes";
import { OpenCodeAdapter } from "./adapters/opencode";
import { ClaudeCodeAdapter } from "./adapters/claude-code";
import { CodexAdapter } from "./adapters/codex";
import { OpenClawAdapter } from "./adapters/openclaw";

export class CodingAgentRegistry {
  private static instance: CodingAgentRegistry;
  private adapters: Map<string, CodingAgentAdapter> = new Map();

  private constructor() {
    this.register(new HermesAdapter());
    this.register(new OpenCodeAdapter());
    this.register(new ClaudeCodeAdapter());
    this.register(new CodexAdapter());
    this.register(new OpenClawAdapter());
  }

  public static getInstance(): CodingAgentRegistry {
    if (!CodingAgentRegistry.instance) {
      CodingAgentRegistry.instance = new CodingAgentRegistry();
    }
    return CodingAgentRegistry.instance;
  }

  public register(adapter: CodingAgentAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  public getAdapter(id: string): CodingAgentAdapter | undefined {
    return this.adapters.get(id) || this.adapters.get("hermes");
  }

  public getAllAdapters(): CodingAgentAdapter[] {
    return Array.from(this.adapters.values());
  }

  public async detectAll(): Promise<DetectedAgentRuntime[]> {
    const results: DetectedAgentRuntime[] = [];
    for (const adapter of this.adapters.values()) {
      try {
        const detected = await adapter.detectInstallation();
        results.push(detected);
      } catch (e: any) {
        results.push({
          id: adapter.id,
          name: adapter.name,
          status: "UNHEALTHY",
          capabilities: adapter.getCapabilities(),
          installInstructions: e.message
        });
      }
    }
    return results;
  }
}
