import { NextRequest, NextResponse } from "next/server";
import { AgentMessageBus } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const { agentId } = await params;
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId") || undefined;

    const inbox = AgentMessageBus.receive(agentId, workflowId);
    const outbox = AgentMessageBus.queryMessages({ fromAgentId: agentId, workflowId, limit: 50 });

    return NextResponse.json({
      success: true,
      agentId,
      inboxCount: inbox.length,
      inbox,
      outboxCount: outbox.length,
      outbox
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
