import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { action, cwd } = await req.json();

    if (!action || !cwd) {
      return NextResponse.json({ error: "Missing action or cwd" }, { status: 400 });
    }

    if (!fs.existsSync(cwd)) {
      return NextResponse.json({ error: "Workspace path does not exist" }, { status: 400 });
    }

    const isGit = fs.existsSync(path.join(cwd, ".git"));
    if (!isGit) {
      return NextResponse.json({ error: "Not a git repository" }, { status: 400 });
    }

    if (action === "status") {
      return new Promise((resolve) => {
        exec("git status -s", { cwd }, (error, stdout) => {
          if (error) {
            resolve(NextResponse.json({ error: error.message }, { status: 500 }));
            return;
          }
          const changes = stdout.split("\n").filter(Boolean).map(line => {
            const status = line.substring(0, 2);
            const file = line.substring(3);
            return { status, file };
          });
          resolve(NextResponse.json({ changes }));
        });
      });
    }
    
    if (action === "diff") {
        return new Promise((resolve) => {
            exec("git diff", { cwd }, (error, stdout) => {
                resolve(NextResponse.json({ diff: stdout || "" }));
            });
        });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
