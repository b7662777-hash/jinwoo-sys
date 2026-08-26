import { NextRequest } from "next/server";

// Sends a task dispatch to the Hermes Python daemon and streams the events back to the Jinwoo frontend
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Configurable python daemon port, defaulting to 20129
    const port = process.env.JINWOO_HERMES_PORT || 20129;
    
    const hermesResponse = await fetch(`http://127.0.0.1:${port}/bus/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: req.signal, // Abort if client disconnects
    });

    if (!hermesResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to dispatch to Hermes" }), { status: hermesResponse.status });
    }

    // Stream the typed Collaboration Bus events straight back to the client
    return new Response(hermesResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Bus Dispatch Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
