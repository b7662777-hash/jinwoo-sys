import { JinwooProviderAdapter, type JinwooModelCapabilities } from "./JinwooProviderAdapter";

export interface RoutingConstraints {
  role?: string;
  requiresReasoning?: boolean;
  requiresVision?: boolean;
  requiresTools?: boolean;
  localOnly?: boolean;
  costPolicy?: "free-first" | "balanced" | "best";
  fallbackAllowed?: boolean;
}

export interface RoutingResult {
  provider: string;
  model: string;
  reason: string[];
}

export class JinwooRouter {
  /**
   * Resolves a model based on Jinwoo-level constraints, returning a choice
   * and an explanation of the routing decision.
   */
  static route(constraints: RoutingConstraints): RoutingResult {
    const reasons: string[] = [];
    if (constraints.role) reasons.push(`role=${constraints.role}`);
    
    let candidates = JinwooProviderAdapter.getModels();

    // 1. Filter by Capabilities
    if (constraints.requiresReasoning) {
      candidates = candidates.filter(m => m.reasoning);
      reasons.push("requires=reasoning");
    }
    if (constraints.requiresVision) {
      candidates = candidates.filter(m => m.vision);
      reasons.push("requires=vision");
    }
    if (constraints.requiresTools) {
      candidates = candidates.filter(m => m.tools);
      reasons.push("requires=tools");
    }
    
    // 2. Filter by Local-only
    if (constraints.localOnly) {
      candidates = candidates.filter(m => m.local);
      reasons.push("local=true");
    } else {
      reasons.push("local=false");
    }

    // 3. Select based on cost policy or role preferences
    // For this vertical slice, we'll implement a simple deterministic heuristic
    reasons.push(`cost-policy=${constraints.costPolicy || "balanced"}`);

    if (candidates.length === 0) {
      throw new Error(`No models found matching constraints: ${reasons.join(", ")}`);
    }

    // Pick best match. If localOnly, pick ollama.
    // If requiresReasoning, pick an o1/o3/r1 model.
    // Otherwise default to a strong general model like gpt-4o or claude-3-5-sonnet.
    let selected: JinwooModelCapabilities | undefined;

    if (constraints.localOnly) {
      selected = candidates.find(m => m.providerId === "ollama" && m.modelId.includes("llama")) || candidates[0];
    } else if (constraints.requiresReasoning) {
      selected = candidates.find(m => m.modelId.includes("o1") || m.modelId.includes("o3") || m.modelId.includes("r1")) || candidates[0];
    } else {
      // General strong model
      selected = candidates.find(m => m.modelId === "gpt-4o" || m.modelId === "claude-3-5-sonnet-20241022") || candidates[0];
    }

    return {
      provider: selected.providerId,
      model: selected.modelId,
      reason: reasons
    };
  }
}
