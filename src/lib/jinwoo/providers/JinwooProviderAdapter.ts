import { PROVIDERS } from "../../../../open-sse/config/providers/index";
import type { RegistryEntry, RegistryModel } from "../../../../open-sse/config/providers/shared";

export interface JinwooProviderIdentity {
  id: string;
  name: string;
  type: string;
  authType: string;
  enabled: boolean;
  local: boolean;
}

export interface JinwooModelCapabilities {
  modelId: string;
  providerId: string;
  contextWindow: number;
  reasoning: boolean;
  tools: boolean;
  vision: boolean;
  streaming: boolean;
  local: boolean;
}

export class JinwooProviderAdapter {
  /**
   * Translates the massive OmniRouter provider registry into Jinwoo's
   * normalized ProviderIdentity representation.
   */
  static getProviders(): JinwooProviderIdentity[] {
    const registry: Record<string, RegistryEntry> = (PROVIDERS as any);
    return Object.values(registry).map((p) => {
      const isLocal = p.id.includes("ollama") || p.id === "lmstudio" || p.id === "local";
      return {
        id: p.id,
        name: p.alias || p.id,
        type: p.format,
        authType: p.authType,
        enabled: true, // Later, this will check active DB credentials
        local: isLocal
      };
    });
  }

  /**
   * Translates OmniRouter's model capability maps into Jinwoo's
   * normalized ModelCapabilities representation.
   */
  static getModels(): JinwooModelCapabilities[] {
    const models: JinwooModelCapabilities[] = [];
    const registry: Record<string, RegistryEntry> = (PROVIDERS as any);
    for (const p of Object.values(registry)) {
      const isLocal = p.id.includes("ollama") || p.id === "lmstudio" || p.id === "local";
      for (const m of p.models) {
        models.push({
          modelId: m.id,
          providerId: p.id,
          contextWindow: m.contextLength || 4096,
          reasoning: !!m.supportsReasoning,
          tools: m.toolCalling !== false, // Default to assuming models support tools unless explicitly marked false (OmniRouter specific)
          vision: !!m.supportsVision,
          streaming: true,
          local: isLocal
        });
      }
    }
    return models;
  }
}
