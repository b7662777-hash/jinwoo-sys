import { NextRequest, NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getJinwooDb();
    const projects = db.prepare("SELECT * FROM projects ORDER BY createdAt DESC").all();
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, workspacePath } = await req.json();
    if (!name || !workspacePath) {
      return NextResponse.json({ error: "Missing name or workspacePath" }, { status: 400 });
    }

    if (!fs.existsSync(workspacePath)) {
      return NextResponse.json({ error: "Path does not exist on the filesystem." }, { status: 400 });
    }

    const stat = fs.statSync(workspacePath);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: "Path must be a directory." }, { status: 400 });
    }

    const db = getJinwooDb();
    const id = "proj_" + Math.random().toString(36).substring(2, 9);
    
    db.prepare(`
      INSERT INTO projects (id, name, workspacePath, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(id, name, workspacePath, new Date().toISOString());

    return NextResponse.json({ id, name, workspacePath });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");
    
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Missing project id to delete" }, { status: 400 });
    }

    const db = getJinwooDb();
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: `Project ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
