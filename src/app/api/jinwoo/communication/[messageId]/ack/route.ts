import { NextRequest, NextResponse } from "next/server";
import { AgentMessageBus } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ messageId: string }> }) {
  try {
    const { messageId } = await params;
    const body = await req.json();
    const agentId = body.agentId;

    if (!agentId) {
      return NextResponse.json({ success: false, error: "Missing agentId" }, { status: 400 });
    }

    const success = AgentMessageBus.acknowledge(messageId, agentId);
    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to acknowledge message" }, { status: 404 });
    }

    return NextResponse.json({ success: true, messageId, status: "ACKNOWLEDGED" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
