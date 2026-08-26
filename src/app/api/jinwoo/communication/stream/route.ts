import { NextRequest } from "next/server";
import { messageBusEvents } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection heartbeat
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ eventType: "CONNECTED", timestamp: new Date().toISOString() })}\n\n`));

      const listener = (eventData: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
        } catch (err) {
          // Client disconnected
        }
      };

      messageBusEvents.on("message", listener);

      req.signal.addEventListener("abort", () => {
        messageBusEvents.off("message", listener);
        try {
          controller.close();
        } catch {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
