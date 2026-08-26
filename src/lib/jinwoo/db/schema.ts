import Database from "better-sqlite3";
import path from "path";

export interface JinwooProject {
  id: string;
  name: string;
  workspacePath: string;
  createdAt: string;
}

export interface JinwooWorkflow {
  id: string;
  projectId: string;
  status: "active" | "completed" | "failed";
  createdAt: string;
}

export interface JinwooAgent {
  id: string;
  workflowId: string;
  role: string;
  provider: string;
  model: string;
  status: "idle" | "working" | "waiting_approval";
}

export interface JinwooMessage {
  id: string;
  workflowId: string;
  fromAgent: string;
  toAgent: string;
  type: "AGENT_MESSAGE" | "AGENT_HANDOFF" | "REVIEW_RESULT" | "APPROVAL_REQUIRED";
  content: string;
  createdAt: string;
}

export interface JinwooFileLock {
  filePath: string;
  projectId: string;
  lockedByAgentId: string;
  lockedAt: string;
}

let dbInstance: Database.Database | null = null;

export function getJinwooDb(): Database.Database {
  if (dbInstance) return dbInstance;

  // Use a completely separate database file from OmniRouter
  const dbPath = path.resolve(process.cwd(), "data", "jinwoo_state.sqlite");
  dbInstance = new Database(dbPath);

  // Initialize schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      workspacePath TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      status TEXT NOT NULL,
      originalPrompt TEXT,
      enhancedPrompt TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projectId) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS workflow_tasks (
      id TEXT PRIMARY KEY,
      workflowId TEXT NOT NULL,
      role TEXT NOT NULL,
      model TEXT NOT NULL,
      provider TEXT NOT NULL,
      objective TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflowId) REFERENCES workflows(id)
    );

    CREATE TABLE IF NOT EXISTS task_dependencies (
      taskId TEXT NOT NULL,
      dependsOnTaskId TEXT NOT NULL,
      PRIMARY KEY (taskId, dependsOnTaskId),
      FOREIGN KEY(taskId) REFERENCES workflow_tasks(id),
      FOREIGN KEY(dependsOnTaskId) REFERENCES workflow_tasks(id)
    );

    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      workflowId TEXT NOT NULL,
      role TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(workflowId) REFERENCES workflows(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      workflowId TEXT NOT NULL,
      fromAgent TEXT NOT NULL,
      toAgent TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflowId) REFERENCES workflows(id)
    );

    CREATE TABLE IF NOT EXISTS file_locks (
      filePath TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      lockedByAgentId TEXT NOT NULL,
      lockedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(projectId) REFERENCES projects(id),
      FOREIGN KEY(lockedByAgentId) REFERENCES agents(id)
    );

    CREATE TABLE IF NOT EXISTS workflow_events (
      id TEXT PRIMARY KEY,
      workflowId TEXT NOT NULL,
      eventType TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflowId) REFERENCES workflows(id)
    );

    CREATE TABLE IF NOT EXISTS role_assignments (
      role TEXT NOT NULL,
      projectId TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      codingAgent TEXT DEFAULT 'hermes',
      policy TEXT NOT NULL DEFAULT 'standard',
      PRIMARY KEY (projectId, role)
    );

    CREATE TABLE IF NOT EXISTS agent_messages (
      messageId TEXT PRIMARY KEY,
      workflowId TEXT NOT NULL,
      runId TEXT,
      taskId TEXT,
      conversationId TEXT,
      correlationId TEXT NOT NULL,
      fromAgentId TEXT NOT NULL,
      fromRole TEXT NOT NULL,
      toAgentId TEXT NOT NULL,
      toRole TEXT NOT NULL,
      runtime TEXT NOT NULL,
      modelId TEXT,
      providerId TEXT,
      messageType TEXT NOT NULL,
      priority TEXT DEFAULT 'NORMAL',
      content TEXT NOT NULL,
      attachments TEXT,
      workspacePath TEXT NOT NULL,
      parentMessageId TEXT,
      replyToMessageId TEXT,
      status TEXT NOT NULL,
      deliveryStatus TEXT NOT NULL,
      visibility TEXT DEFAULT 'PUBLIC',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      deliveredAt DATETIME,
      acknowledgedAt DATETIME,
      respondedAt DATETIME,
      failedAt DATETIME,
      error TEXT
    );

    CREATE TABLE IF NOT EXISTS agent_inboxes (
      agentId TEXT NOT NULL,
      workflowId TEXT NOT NULL,
      messageId TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'UNREAD',
      receivedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (agentId, messageId),
      FOREIGN KEY (messageId) REFERENCES agent_messages(messageId)
    );

    CREATE INDEX IF NOT EXISTS idx_agent_messages_wf ON agent_messages(workflowId);
    CREATE INDEX IF NOT EXISTS idx_agent_messages_corr ON agent_messages(correlationId);
    CREATE INDEX IF NOT EXISTS idx_agent_messages_from ON agent_messages(fromAgentId);
    CREATE INDEX IF NOT EXISTS idx_agent_messages_to ON agent_messages(toAgentId);
    CREATE INDEX IF NOT EXISTS idx_agent_messages_status ON agent_messages(status);
    CREATE INDEX IF NOT EXISTS idx_agent_messages_created ON agent_messages(createdAt);
    CREATE INDEX IF NOT EXISTS idx_agent_inboxes_agent ON agent_inboxes(agentId, status);
  `);

  try {
    dbInstance.prepare(`ALTER TABLE role_assignments ADD COLUMN codingAgent TEXT DEFAULT 'hermes'`).run();
  } catch(e) {}
  try {
    dbInstance.prepare(`ALTER TABLE agents ADD COLUMN runtime TEXT DEFAULT 'hermes'`).run();
  } catch(e) {}
  try {
    dbInstance.prepare(`ALTER TABLE agents ADD COLUMN sessionId TEXT`).run();
  } catch(e) {}
  try {
    dbInstance.prepare(`ALTER TABLE agents ADD COLUMN pid INTEGER`).run();
  } catch(e) {}
  try {
    dbInstance.prepare(`ALTER TABLE agents ADD COLUMN workspacePath TEXT`).run();
  } catch(e) {}
  try {
    dbInstance.prepare(`ALTER TABLE agents ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`).run();
  } catch(e) {}

  return dbInstance;
}
