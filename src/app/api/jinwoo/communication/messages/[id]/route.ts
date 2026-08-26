import { NextRequest, NextResponse } from "next/server";
import { AgentMessageBus } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const message = AgentMessageBus.getMessageById(id);
    if (!message) {
      return NextResponse.json({ success: false, error: `Message '${id}' not found` }, { status: 404 });
    }
    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
