import { getJinwooDb } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { JinwooRouter } from "../providers/JinwooRouter";

export class WorkflowManager {
  static createProject(name: string, workspacePath: string) {
    const id = uuidv4();
    getJinwooDb().prepare(
      "INSERT INTO projects (id, name, workspacePath) VALUES (?, ?, ?)"
    ).run(id, name, workspacePath);
    return id;
  }

  static createWorkflow(projectId: string) {
    const id = uuidv4();
    getJinwooDb().prepare(
      "INSERT INTO workflows (id, projectId, status) VALUES (?, ?, ?)"
    ).run(id, projectId, "active");
    return id;
  }

  static spawnAgent(workflowId: string, role: string, routingConstraints: any) {
    const id = `${role}-${uuidv4().substring(0, 8)}`;
    const route = JinwooRouter.route(routingConstraints);

    getJinwooDb().prepare(
      "INSERT INTO agents (id, workflowId, role, provider, model, status) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, workflowId, role, route.provider, route.model, "idle");

    return { id, route };
  }

  static recordMessage(workflowId: string, fromAgent: string, toAgent: string, type: string, content: string) {
    const id = uuidv4();
    getJinwooDb().prepare(
      "INSERT INTO messages (id, workflowId, fromAgent, toAgent, type, content) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, workflowId, fromAgent, toAgent, type, content);
    return id;
  }

  static lockFile(projectId: string, filePath: string, agentId: string) {
    try {
      getJinwooDb().prepare(
        "INSERT INTO file_locks (filePath, projectId, lockedByAgentId) VALUES (?, ?, ?)"
      ).run(filePath, projectId, agentId);
      return true;
    } catch (e) {
      return false; // Already locked
    }
  }

  static unlockFile(filePath: string, agentId: string) {
    getJinwooDb().prepare(
      "DELETE FROM file_locks WHERE filePath = ? AND lockedByAgentId = ?"
    ).run(filePath, agentId);
  }
}
