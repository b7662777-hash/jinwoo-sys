import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { command, cwd } = await req.json();

    if (!command || !cwd) {
      return NextResponse.json({ error: "Missing command or cwd" }, { status: 400 });
    }

    if (!fs.existsSync(cwd)) {
      return NextResponse.json({ error: "Workspace path does not exist" }, { status: 400 });
    }

    return new Promise((resolve) => {
      const startTime = Date.now();
      exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        const duration = Date.now() - startTime;
        resolve(NextResponse.json({
          stdout: stdout || "",
          stderr: stderr || "",
          exitCode: error ? (error as any).code || 1 : 0,
          duration
        }));
      });
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
