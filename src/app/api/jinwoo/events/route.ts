import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = [
      {
        id: "evt_1",
        type: "SYSTEM_READY",
        agentId: "JinwooOS",
        timestamp: new Date().toISOString(),
        payload: { message: "Jinwoo Sys control plane online", port: 20128 }
      },
      {
        id: "evt_2",
        type: "WORKER_DISCOVERY",
        agentId: "CodingAgentManager",
        timestamp: new Date(Date.now() - 30000).toISOString(),
        payload: { runtime: "OpenCode", status: "INSTALLED", version: "v1.18.18" }
      },
      {
        id: "evt_3",
        type: "GATEWAY_TOPOLOGY",
        agentId: "OmniRoute",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        payload: { connections: 5, strategy: "Sequential Fallback" }
      }
    ];

    return NextResponse.json({ success: true, events });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
