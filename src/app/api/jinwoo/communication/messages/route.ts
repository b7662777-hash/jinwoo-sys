import { NextRequest, NextResponse } from "next/server";
import { AgentMessageBus } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId") || undefined;
    const correlationId = searchParams.get("correlationId") || undefined;
    const fromAgentId = searchParams.get("fromAgentId") || undefined;
    const toAgentId = searchParams.get("toAgentId") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100;

    const messages = AgentMessageBus.queryMessages({
      workflowId,
      correlationId,
      fromAgentId,
      toAgentId,
      status,
      limit
    });

    return NextResponse.json({ success: true, count: messages.length, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
