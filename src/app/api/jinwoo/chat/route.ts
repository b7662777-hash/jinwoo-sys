import { NextRequest } from "next/server";
import { getRegisteredExecutor } from "@omniroute/open-sse/executors/registry.ts";
import { DefaultExecutor } from "@omniroute/open-sse/executors/default.ts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, providerId, modelId, apiKey, endpoint } = body;
    
    // We will stream back Jinwoo Event Protocol SSE.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (eventType: string, payload: any) => {
            const event = {
                eventId: crypto.randomUUID(),
                eventType,
                timestamp: new Date().toISOString(),
                providerId,
                modelId,
                payload
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };
        
        sendEvent("MODEL_REQUEST_STARTED", { message: "Request started" });
        
        try {
          // Resolve executor
          let executor = getRegisteredExecutor(providerId);
          if (!executor) {
              executor = new DefaultExecutor(providerId || "default");
          }
          
          let creds: any = {
            type: "standard",
            apiKey: apiKey || "sk-dummy",
            id: "jinwoo-test",
            providerId: providerId,
            isActive: true,
            providerSpecificData: {}
          };

          if (endpoint) {
              creds.providerSpecificData.baseUrl = endpoint; // Custom endpoint override for Ollama/mock
          }
          
          const input = {
            model: modelId,
            body: { messages, model: modelId, stream: true },
            stream: true,
            credentials: creds,
            clientResponseFormat: "openai",
            signal: request.signal,
          };
          
          let result;
          try {
              result = await executor.execute(input as any);
          } catch (execErr: any) {
              // Provider Fallback Demonstration
              sendEvent("PROVIDER_FALLBACK", { reason: execErr.message, fallbackProvider: "default" });
              executor = new DefaultExecutor("default");
              result = await executor.execute(input as any);
          }

          const response = result instanceof Response ? result : (result as any).response;
          
          if (!response.ok) {
            const errorText = await response.text();
            sendEvent("MODEL_ERROR", { error: errorText });
            controller.close();
            return;
          }
          
          let usage = null;
          
          if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              let newlineIndex;
              while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                const line = buffer.slice(0, newlineIndex).trim();
                buffer = buffer.slice(newlineIndex + 1);
                
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    if (data.usage) {
                        usage = data.usage;
                    }
                    
                    if (data.choices && data.choices[0] && data.choices[0].delta) {
                      const delta = data.choices[0].delta.content || "";
                      if (delta) {
                        sendEvent("MODEL_STREAM", { delta });
                      }
                    }
                  } catch (e) {
                    // Ignore parse errors on partial chunks
                  }
                }
              }
            }
          }
          
          sendEvent("MODEL_REQUEST_COMPLETED", { message: "Stream finished", usage });
        } catch (e: any) {
          sendEvent("MODEL_ERROR", { error: e.message });
        } finally {
          controller.close();
        }
      }
    });
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
