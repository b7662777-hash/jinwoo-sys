import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    let selectedPath = "";
    
    if (os.platform() === "win32") {
      const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
        $dialog.Description = 'Select Jinwoo Workspace Folder'
        $dialog.ShowNewFolderButton = $true
        $form = New-Object System.Windows.Forms.Form
        $form.TopMost = $true
        $form.Opacity = 0
        $form.ShowInTaskbar = $false
        $form.WindowState = 'Minimized'
        $form.Show()
        $result = $dialog.ShowDialog($form)
        $form.Dispose()
        if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
          Write-Output $dialog.SelectedPath
        }
      `.replace(/\r?\n/g, " ");

      try {
        const { stdout } = await execAsync(`powershell -NoProfile -STA -Command "${psScript}"`, { timeout: 30000 });
        selectedPath = stdout.trim();
      } catch (psErr: any) {
        // Fallback to Shell.Application
        const comScript = `
          $app = New-Object -ComObject Shell.Application
          $folder = $app.BrowseForFolder(0, 'Select Jinwoo Workspace Folder', 0, 0)
          if ($folder) { Write-Output $folder.Self.Path }
        `.replace(/\r?\n/g, " ");
        const { stdout } = await execAsync(`powershell -NoProfile -STA -Command "${comScript}"`, { timeout: 30000 });
        selectedPath = stdout.trim();
      }
    } else if (os.platform() === "darwin") {
      const { stdout } = await execAsync(`osascript -e 'POSIX path of (choose folder with prompt "Select Jinwoo Workspace Folder")'`, { timeout: 30000 });
      selectedPath = stdout.trim();
    } else {
      const { stdout } = await execAsync(`zenity --file-selection --directory --title="Select Jinwoo Workspace Folder"`, { timeout: 30000 });
      selectedPath = stdout.trim();
    }
    
    if (!selectedPath) {
      return NextResponse.json({ canceled: true });
    }
    
    return NextResponse.json({ path: selectedPath });
  } catch (error: any) {
    console.error("Folder dialog error:", error);
    return NextResponse.json({ error: error.message || "Failed to open folder dialog" }, { status: 500 });
  }
}
