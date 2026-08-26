import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { action, targetPath } = await req.json();

    if (!action || !targetPath) {
      return NextResponse.json({ error: "Missing action or targetPath" }, { status: 400 });
    }

    if (!fs.existsSync(targetPath)) {
      return NextResponse.json({ error: "Path does not exist" }, { status: 404 });
    }

    if (action === "list") {
      const stats = fs.statSync(targetPath);
      if (!stats.isDirectory()) {
        return NextResponse.json({ error: "Not a directory" }, { status: 400 });
      }

      const files = fs.readdirSync(targetPath).map(file => {
        const filePath = path.join(targetPath, file);
        try {
            const fileStats = fs.statSync(filePath);
            return {
            name: file,
            path: filePath,
            isDirectory: fileStats.isDirectory(),
            size: fileStats.size,
            mtime: fileStats.mtime.toISOString(),
            };
        } catch(e) {
            return null;
        }
      }).filter(Boolean);

      // Sort: Directories first, then alphabetical
      files.sort((a: any, b: any) => {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        }
        return a.isDirectory ? -1 : 1;
      });

      return NextResponse.json({ files });
    }

    if (action === "read") {
      const stats = fs.statSync(targetPath);
      if (stats.isDirectory()) {
        return NextResponse.json({ error: "Cannot read a directory" }, { status: 400 });
      }
      const content = fs.readFileSync(targetPath, "utf-8");
      return NextResponse.json({ content });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
