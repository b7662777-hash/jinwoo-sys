import { NextRequest, NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";
import { messageBusEvents } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ messageId: string }> }) {
  try {
    const { messageId } = await params;
    const db = getJinwooDb();

    const res = db.prepare(`
      UPDATE agent_messages
      SET status = 'CANCELLED', deliveryStatus = 'CANCELLED'
      WHERE messageId = ? AND status IN ('CREATED', 'QUEUED')
    `).run(messageId);

    if (res.changes > 0) {
      messageBusEvents.emit("message", { eventType: "AGENT_MESSAGE_CANCELLED", messageId });
      return NextResponse.json({ success: true, messageId, status: "CANCELLED" });
    }

    return NextResponse.json({ success: false, error: "Message could not be cancelled or was already delivered" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
