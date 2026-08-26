import fs from "fs";
import path from "path";

export interface FileLockInfo {
  filePath: string;
  lockedByAgent: string;
  taskId: string;
  workflowId: string;
  timestamp: number;
}

export class WorkspaceGuard {
  private static instance: WorkspaceGuard;
  private activeLocks: Map<string, FileLockInfo> = new Map();

  private constructor() {}

  public static getInstance(): WorkspaceGuard {
    if (!WorkspaceGuard.instance) {
      WorkspaceGuard.instance = new WorkspaceGuard();
    }
    return WorkspaceGuard.instance;
  }

  public validateWorkspace(rawPath: string): { valid: boolean; resolvedPath: string; error?: string } {
    if (!rawPath || typeof rawPath !== "string") {
      return { valid: false, resolvedPath: "", error: "Workspace path must be a non-empty string." };
    }

    try {
      const resolved = path.resolve(path.normalize(rawPath));
      if (!fs.existsSync(resolved)) {
        // Attempt to create if non-existent
        fs.mkdirSync(resolved, { recursive: true });
      }

      const stat = fs.statSync(resolved);
      if (!stat.isDirectory()) {
        return { valid: false, resolvedPath: resolved, error: `Path exists but is not a directory: ${resolved}` };
      }

      return { valid: true, resolvedPath: resolved };
    } catch (e: any) {
      return { valid: false, resolvedPath: rawPath, error: `Invalid workspace path: ${e.message}` };
    }
  }

  public checkConflict(filePath: string, agentId: string, taskId: string, workflowId: string): {
    conflict: boolean;
    conflictingWith?: FileLockInfo;
  } {
    const norm = path.normalize(filePath).toLowerCase();
    const existing = this.activeLocks.get(norm);

    if (existing && existing.lockedByAgent !== agentId) {
      return { conflict: true, conflictingWith: existing };
    }

    // Acquire or refresh lock
    this.activeLocks.set(norm, {
      filePath,
      lockedByAgent: agentId,
      taskId,
      workflowId,
      timestamp: Date.now()
    });

    return { conflict: false };
  }

  public releaseLocksForTask(taskId: string): void {
    for (const [key, lock] of this.activeLocks.entries()) {
      if (lock.taskId === taskId) {
        this.activeLocks.delete(key);
      }
    }
  }

  public releaseLocksForWorkflow(workflowId: string): void {
    for (const [key, lock] of this.activeLocks.entries()) {
      if (lock.workflowId === workflowId) {
        this.activeLocks.delete(key);
      }
    }
  }

  public static isSafePath(workspacePath: string, targetPath: string): boolean {
    const resolvedBase = path.resolve(workspacePath).toLowerCase();
    const resolvedTarget = path.resolve(targetPath).toLowerCase();
    return resolvedTarget.startsWith(resolvedBase);
  }

  public static assertInsideWorkspace(workspacePath: string, targetPath: string): void {
    const resolvedBase = path.resolve(workspacePath).toLowerCase();
    const resolvedTarget = path.resolve(workspacePath, targetPath).toLowerCase();
    if (!resolvedTarget.startsWith(resolvedBase)) {
      throw new Error(`Path traversal blocked: '${targetPath}' is outside workspace '${workspacePath}'`);
    }
  }
}
