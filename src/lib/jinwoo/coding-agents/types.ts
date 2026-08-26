export type AgentInstallStatus = "READY" | "NOT_INSTALLED" | "NOT_CONFIGURED" | "UNHEALTHY";

export interface CodingAgentCapabilities {
  supportsWorkspace: boolean;
  supportsTerminal: boolean;
  supportsFileTools: boolean;
  supportsGit: boolean;
  supportsStreaming: boolean;
  supportsParallelSessions: boolean;
  supportsAgentMessaging?: boolean;
  supportsSessionInjection?: boolean;
  supportsLiveEvents?: boolean;
  supportsConversationHistory?: boolean;
  supportsInteractiveSession?: boolean;
  supportsExternalMessages?: boolean;
  supportsNativeConversationView?: boolean;
}

export interface DetectedAgentRuntime {
  id: string;
  name: string;
  version?: string;
  status: AgentInstallStatus;
  executablePath?: string;
  configPath?: string;
  capabilities: CodingAgentCapabilities;
  supportedModels?: string[];
  installInstructions?: string;
}

export interface WorkerSessionParams {
  sessionId: string;
  agentId: string;
  role: string;
  workflowId: string;
  taskId: string;
  workspacePath: string;
  model: string;
  provider: string;
  apiBaseUrl?: string;
  prompt: string;
  upstreamContext?: string;
}

export interface NormalizedAgentEvent {
  eventType: 
    | "AGENT_STARTED"
    | "AGENT_CONFIG"
    | "AGENT_MESSAGE"
    | "AGENT_HANDOFF"
    | "TOOL_CALL"
    | "TOOL_RESULT"
    | "MODEL_REQUEST_STARTED"
    | "MODEL_STREAM"
    | "MODEL_REQUEST_COMPLETED"
    | "FILE_CHANGED"
    | "TEST_STARTED"
    | "TEST_PASSED"
    | "TEST_FAILED"
    | "AGENT_WAITING"
    | "AGENT_COMPLETED"
    | "AGENT_FAILED"
    | "PROVIDER_FALLBACK"
    | "CONFLICT_DETECTED"
    | "USAGE_UPDATED"
    | "ORCHESTRATOR_STATE"
    | "ORCHESTRATOR_ERROR"
    | "ORCHESTRATOR_COMPLETE";
  taskId?: string;
  workflowId?: string;
  payload: Record<string, any>;
  timestamp?: number;
}

export interface CodingAgentAdapter {
  id: string;
  name: string;
  detectInstallation(): Promise<DetectedAgentRuntime>;
  getCapabilities(): CodingAgentCapabilities;
  startSession(params: WorkerSessionParams, onEvent: (event: NormalizedAgentEvent) => void): Promise<{
    sessionId: string;
    pid?: number;
    stop: () => Promise<void>;
  }>;
  sendAgentMessage?(message: any): Promise<boolean>;
  injectContext?(context: any): Promise<boolean>;
  getSessionStatus?(sessionId: string): Promise<any>;
}
