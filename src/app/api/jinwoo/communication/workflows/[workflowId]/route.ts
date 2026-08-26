import { NextRequest, NextResponse } from "next/server";
import { AgentMessageBus } from "@/lib/jinwoo/communication/AgentMessageBus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ workflowId: string }> }) {
  try {
    const { workflowId } = await params;
    const messages = AgentMessageBus.queryMessages({ workflowId, limit: 200 });

    // Build communication graph nodes & edges
    const nodesMap: Record<string, { id: string; role: string; messageCount: number }> = {};
    const edgesMap: Record<string, { from: string; to: string; count: number; types: string[] }> = {};

    messages.forEach((m) => {
      // Nodes
      if (!nodesMap[m.fromAgentId]) {
        nodesMap[m.fromAgentId] = { id: m.fromAgentId, role: m.fromRole, messageCount: 0 };
      }
      if (!nodesMap[m.toAgentId]) {
        nodesMap[m.toAgentId] = { id: m.toAgentId, role: m.toRole, messageCount: 0 };
      }
      nodesMap[m.fromAgentId].messageCount++;

      // Edges
      const edgeKey = `${m.fromAgentId}->${m.toAgentId}`;
      if (!edgesMap[edgeKey]) {
        edgesMap[edgeKey] = { from: m.fromAgentId, to: m.toAgentId, count: 0, types: [] };
      }
      edgesMap[edgeKey].count++;
      if (!edgesMap[edgeKey].types.includes(m.messageType)) {
        edgesMap[edgeKey].types.push(m.messageType);
      }
    });

    return NextResponse.json({
      success: true,
      workflowId,
      messageCount: messages.length,
      messages,
      graph: {
        nodes: Object.values(nodesMap),
        edges: Object.values(edgesMap)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
