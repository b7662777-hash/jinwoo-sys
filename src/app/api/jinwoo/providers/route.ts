import { NextResponse } from "next/server";
import { getProviderConnections } from "@/lib/db/providers";
import { AI_PROVIDERS } from "@/shared/constants/providers";
import { buildAliasMaps } from "@/app/api/v1/models/catalogProviderMaps";
import { PROVIDER_MODELS } from "@/shared/constants/models";
import { getSyncedAvailableModelsForConnection, getCustomModels } from "@/lib/db/models";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const connections = await getProviderConnections();
    const { aliasToProviderId } = buildAliasMaps();

    // Filter connections to strip sensitive data and infer health
    const safeConnections = connections.map((conn: any) => {
      let health = "UNKNOWN";
      let reason = "";

      const isActive = conn.isActive === true || conn.isActive === 1;
      const testStatus = (conn.testStatus || "").toLowerCase();
      const lastError = conn.lastError || "";

      if (isActive) {
        if (testStatus === "success" || testStatus === "active" || testStatus === "unknown" || !lastError) {
           health = "HEALTHY";
        } else {
           health = "UNAVAILABLE";
           reason = lastError;
           if (reason.toLowerCase().includes("auth") || reason.toLowerCase().includes("key")) {
             health = "AUTH_ERROR";
           } else if (reason.toLowerCase().includes("fetch") || reason.toLowerCase().includes("connect")) {
             health = "CONNECTION_ERROR";
           }
        }
      } else {
        health = "NOT_CONFIGURED";
      }

      const canonicalId = aliasToProviderId[conn.provider] || conn.provider;
      const registryEntry = AI_PROVIDERS[canonicalId] || AI_PROVIDERS[conn.provider];
      
      const displayName = registryEntry?.name || conn.name || conn.provider;

      return {
        id: conn.id,
        gateway: "OmniRoute",
        provider: conn.provider, // Actual DB string
        canonicalId,
        displayName,
        name: conn.name,
        isActive,
        health,
        reason,
        authType: conn.authType
      };
    });

    const enrichedModels: any[] = [];
    const seenModelIds = new Set<string>();
    
    // For every provider that is connected/healthy, fetch their models from OmniRoute catalog
    for (const conn of safeConnections.filter((c: any) => c.health === "HEALTHY")) {
       // 1. Check synced dynamic models (e.g. OpenRouter, Ollama, dynamic providers)
       try {
         const syncedModels = await getSyncedAvailableModelsForConnection(conn.id);
         if (syncedModels && syncedModels.length > 0) {
           for (const sm of syncedModels) {
             const fullId = sm.id.includes("/") ? sm.id : `${conn.canonicalId}/${sm.id}`;
             if (!seenModelIds.has(fullId)) {
               seenModelIds.add(fullId);
               enrichedModels.push({
                 id: fullId,
                 model: sm.id,
                 name: sm.name || sm.id,
                 gateway: "OmniRoute",
                 provider: conn.canonicalId,
                 providerDisplayName: conn.displayName,
                 context_length: sm.context_length || 128000,
                 isLocal: conn.canonicalId === "ollama" || conn.canonicalId === "lmstudio" || sm.id.includes("local"),
                 capabilities: ["text", "coding", "agentic"]
               });
             }
           }
         }
       } catch (e) {}

       // 2. Check static catalog models
       const providerModels = PROVIDER_MODELS[conn.canonicalId] || PROVIDER_MODELS[conn.provider] || [];
       if (providerModels.length > 0) {
         providerModels.forEach((m: any) => {
            const fullId = `${conn.canonicalId}/${m.id}`;
            if (!seenModelIds.has(fullId)) {
              seenModelIds.add(fullId);
              enrichedModels.push({
                 id: fullId,
                 model: m.id,
                 name: m.name,
                 gateway: "OmniRoute",
                 provider: conn.canonicalId,
                 providerDisplayName: conn.displayName,
                 context_length: m.context_length || 128000,
                 isLocal: conn.canonicalId === "ollama" || conn.canonicalId === "lmstudio" || m.id.includes("local"),
                 capabilities: ["text", "coding", "agentic"]
              });
            }
         });
       } else if (!seenModelIds.has(`${conn.canonicalId}/default-model`)) {
         // Synthetic default model if no static catalog exists
         const fullId = `${conn.canonicalId}/default-model`;
         seenModelIds.add(fullId);
         enrichedModels.push({
            id: fullId,
            model: "default-model",
            name: `${conn.displayName} Default Model`,
            gateway: "OmniRoute",
            provider: conn.canonicalId,
            providerDisplayName: conn.displayName,
            context_length: 128000,
            isLocal: conn.canonicalId === "ollama" || conn.canonicalId === "lmstudio" || conn.canonicalId.includes("-cli"),
            capabilities: ["text", "coding", "agentic"]
         });
       }
    }

    return NextResponse.json({
      gateway: "OmniRoute",
      connections: safeConnections,
      models: enrichedModels
    });
  } catch (error: any) {
    console.error("Provider route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
