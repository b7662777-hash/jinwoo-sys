import { NextResponse } from "next/server";
import { getJinwooDb } from "@/lib/jinwoo/db/schema";

export async function GET() {
  try {
    const db = getJinwooDb();
    const agents = db.prepare(`
      SELECT a.*, w.status as workflowStatus, w.projectId 
      FROM agents a 
      LEFT JOIN workflows w ON a.workflowId = w.id
      ORDER BY a.createdAt DESC
    `).all();
    
    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
