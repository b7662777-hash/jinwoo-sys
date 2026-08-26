import { NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || "default";

    const db = getJinwooDb();
    const rows = db.prepare("SELECT * FROM role_assignments WHERE projectId = ?").all(projectId);

    const assignments = rows.map((row: any) => ({
      role: row.role,
      projectId: row.projectId,
      provider: row.provider,
      model: row.model,
      policy: JSON.parse(row.policy || "{}")
    }));

    return NextResponse.json({ assignments });
  } catch (error: any) {
    console.error("Error fetching role assignments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const projectId = data.projectId || "default";
    const role = data.role;
    const provider = data.provider;
    const model = data.model;
    const policy = JSON.stringify(data.policy || {});

    const db = getJinwooDb();
    
    db.prepare(`
      INSERT INTO role_assignments (role, projectId, provider, model, policy)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(projectId, role) DO UPDATE SET
        provider = excluded.provider,
        model = excluded.model,
        policy = excluded.policy
    `).run(role, projectId, provider, model, policy);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving role assignment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
