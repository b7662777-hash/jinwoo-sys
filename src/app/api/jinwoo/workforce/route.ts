import { NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getJinwooDb();
    const roles = db.prepare("SELECT * FROM role_assignments ORDER BY role ASC").all();
    return NextResponse.json({ success: true, roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, codingAgent, provider, model, projectId } = body;

    if (!role) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const db = getJinwooDb();
    const pId = projectId || "project_auth_1";

    db.prepare(`
      INSERT INTO role_assignments (projectId, role, provider, model, codingAgent, policy)
      VALUES (?, ?, ?, ?, ?, 'standard')
      ON CONFLICT(projectId, role) DO UPDATE SET
        provider = excluded.provider,
        model = excluded.model,
        codingAgent = excluded.codingAgent
    `).run(pId, role.toLowerCase(), provider || "openai", model || "gpt-4o", codingAgent || "hermes");

    return NextResponse.json({ success: true, role: { projectId: pId, role, codingAgent, provider, model } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
