import { NextRequest, NextResponse } from "next/server";
import { AgentMessageBus } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.workflowId || !body.fromAgentId || !body.toAgentId || !body.content || !body.workspacePath) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: workflowId, fromAgentId, toAgentId, content, workspacePath"
      }, { status: 400 });
    }

    const message = await AgentMessageBus.send({
      workflowId: body.workflowId,
      runId: body.runId,
      taskId: body.taskId,
      conversationId: body.conversationId,
      correlationId: body.correlationId,
      fromAgentId: body.fromAgentId,
      fromRole: body.fromRole || "ARCHITECT",
      toAgentId: body.toAgentId,
      toRole: body.toRole || "DEVELOPER",
      runtime: body.runtime || "auto",
      modelId: body.modelId,
      providerId: body.providerId,
      messageType: body.messageType || "AGENT_MESSAGE",
      priority: body.priority || "NORMAL",
      content: body.content,
      attachments: body.attachments || [],
      workspacePath: body.workspacePath,
      parentMessageId: body.parentMessageId,
      replyToMessageId: body.replyToMessageId
    });

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error("Failed to send agent message:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
