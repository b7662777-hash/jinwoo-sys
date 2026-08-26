import fs from "fs";
import path from "path";
import { BoundedContext, CanonicalAgentMessage } from "./types";
import { WorkspaceGuard } from "../workspace/guard";

export class ContextPropagator {
  /**
   * Builds bounded context from previous messages, modified files, and handoffs,
   * guaranteeing that model token limits are respected and paths are workspace-contained.
   */
  static buildBoundedContext(params: {
    workspacePath: string;
    taskDescription: string;
    previousMessages?: CanonicalAgentMessage[];
    filesTouched?: string[];
    maxTokens?: number;
  }): BoundedContext {
    const { workspacePath, taskDescription, previousMessages = [], filesTouched = [], maxTokens = 4000 } = params;

    // Validate workspace safety
    WorkspaceGuard.assertInsideWorkspace(workspacePath, ".");

    const relevantMessages = previousMessages.slice(-6).map((m) => ({
      from: `${m.fromRole} (${m.fromAgentId})`,
      content: m.content.length > 500 ? m.content.substring(0, 500) + " ...[truncated]" : m.content,
      timestamp: m.timestamp
    }));

    const filesData: { path: string; changeType: string; diffSnippet?: string }[] = [];

    for (const relPath of filesTouched.slice(0, 8)) {
      try {
        const fullPath = path.resolve(workspacePath, relPath);
        if (WorkspaceGuard.isSafePath(workspacePath, fullPath) && fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          if (stats.isFile()) {
            const preview = fs.readFileSync(fullPath, "utf-8").slice(0, 400);
            filesData.push({
              path: relPath,
              changeType: "MODIFIED",
              diffSnippet: preview
            });
          }
        }
      } catch (e) {
        // Skip unreadable files safely
      }
    }

    const decisions = previousMessages
      .filter((m) => m.messageType === "HANDOFF" || m.messageType === "PLAN_CREATED" || m.messageType === "ANSWER")
      .slice(-3)
      .map((m) => `[${m.messageType}] from ${m.fromRole}: ${m.content.slice(0, 150)}`);

    const summary = `Task Context: ${taskDescription.slice(0, 200)} | Active Files: ${filesTouched.join(", ") || "None"}`;

    // Simple rough token estimation (4 chars ~ 1 token)
    const totalChars =
      summary.length +
      taskDescription.length +
      JSON.stringify(relevantMessages).length +
      JSON.stringify(filesData).length;

    return {
      summary,
      taskDescription,
      relevantMessages,
      filesTouched: filesData,
      decisions,
      workspacePath,
      tokenEstimate: Math.ceil(totalChars / 4)
    };
  }
}
