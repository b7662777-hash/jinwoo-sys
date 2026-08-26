import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";

function getAvailableDrives(): { name: string; path: string }[] {
  if (os.platform() === "win32") {
    const letters = ["C", "D", "R", "E", "F", "G", "H", "Z"];
    const drives: { name: string; path: string }[] = [];
    for (const l of letters) {
      const root = `${l}:\\`;
      try {
        if (fs.existsSync(root)) {
          drives.push({
            name: `${l}: Drive`,
            path: root
          });
        }
      } catch (e) {}
    }
    return drives;
  }
  return [{ name: "Root (/)", path: "/" }];
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let targetDir = url.searchParams.get("dir");

    const drives = getAvailableDrives();

    if (!targetDir || targetDir === "drives" || targetDir === "null") {
      return NextResponse.json({
        current: "",
        parent: null,
        directories: drives
      });
    }

    // Normalize path
    targetDir = path.resolve(targetDir);

    if (!fs.existsSync(targetDir)) {
      return NextResponse.json({ error: "Directory does not exist" }, { status: 404 });
    }

    const stat = fs.statSync(targetDir);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: "Path is not a directory" }, { status: 400 });
    }

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(targetDir, { withFileTypes: true });
    } catch (readErr: any) {
      return NextResponse.json({ error: `Cannot read directory: ${readErr.message}` }, { status: 403 });
    }

    const systemExcludes = new Set([
      "$recycle.bin",
      "system volume information",
      "msocache",
      "config.msi",
      "recovery",
      "pagefile.sys",
      "hiberfil.sys",
      "swapfile.sys"
    ]);

    const directories: { name: string; path: string }[] = [];

    for (const e of entries) {
      try {
        if (e.isDirectory()) {
          const lowerName = e.name.toLowerCase();
          if (!lowerName.startsWith(".") && !systemExcludes.has(lowerName) && lowerName !== "node_modules") {
            directories.push({
              name: e.name,
              path: path.join(targetDir, e.name)
            });
          }
        }
      } catch {}
    }

    directories.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const isDriveRoot = drives.some(d => d.path.toLowerCase() === targetDir.toLowerCase() || d.path.replace(/\\$/, "").toLowerCase() === targetDir.toLowerCase());
    const parentDir = isDriveRoot ? "" : path.dirname(targetDir);

    return NextResponse.json({
      current: targetDir,
      parent: parentDir,
      directories: directories.slice(0, 150)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
