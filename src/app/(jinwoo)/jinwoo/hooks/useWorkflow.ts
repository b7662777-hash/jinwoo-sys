import { useReducer, useEffect, useRef, useCallback } from "react";

export type AgentState = {
  id: string;
  status: "IDLE" | "THINKING" | "WORKING" | "WAITING" | "COMPLETED" | "FAILED" | "CANCELLED";
  provider: string;
  model: string;
  isLocal: boolean;
  routingReason: string;
  tokens: number;
  usageSource: string;
  cost: number | "Unknown";
  currentTask: string;
};

export type TimelineEvent = {
  id: string;
  timestamp: string;
  text: string;
  type: string;
};

export type ChatMessage = {
  id: string;
  agentId: string;
  type: "text" | "tool_call" | "tool_result" | "handoff" | "file_change" | "system";
  content: string;
  metadata?: any;
};

export type WorkspaceFile = {
  name: string;
  status: "NEW" | "MODIFIED" | "DELETED" | "UNCHANGED";
};

export type WorkflowState = {
  workflowId: string;
  projectId: string;
  isRunning: boolean;
  isPlanning: boolean;
  approvalRequired: boolean;
  currentStatus?: string;
  plan: any;
  activeAgents: string[];
  workflowSequence: string[];
  agents: Record<string, AgentState>;
  messages: ChatMessage[];
  timeline: TimelineEvent[];
  files: Record<string, WorkspaceFile>;
  error?: string | null;
};

const initialState: WorkflowState = {
  workflowId: "",
  projectId: "project_auth_1",
  isRunning: false,
  isPlanning: false,
  approvalRequired: false,
  plan: null,
  activeAgents: [],
  workflowSequence: [],
  agents: {},
  messages: [],
  timeline: [],
  files: {},
  error: null
};

function ensureAgent(state: WorkflowState, id: string): AgentState {
  return state.agents[id] || { 
    id, status: "IDLE", provider: "Unknown", model: "Unknown", 
    isLocal: false, routingReason: "-", tokens: 0, cost: "Unknown", currentTask: "Idle",
    usageSource: "UNKNOWN"
  };
}

function reducer(state: WorkflowState, action: any): WorkflowState {
  if (action.type === "RESET") {
    return { ...initialState, workflowId: action.workflowId || state.workflowId, projectId: action.projectId || state.projectId, workflowSequence: ["user"] };
  }
  
  if (action.type === "HYDRATE") {
    return action.state;
  }

  if (action.type !== "EVENT") return state;

  const evt = action.eventType;
  const p = action.payload || {};
  const newState: WorkflowState = { 
    ...state, 
    agents: { ...state.agents }, 
    files: { ...state.files }, 
    messages: [...state.messages], 
    timeline: [...state.timeline] 
  };

  const pushEvent = (text: string, type: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    newState.timeline.push({ id: Math.random().toString(), timestamp, text, type });
  };

  try {
      if (evt === "PLANNING_STARTED") {
        newState.isPlanning = true;
        newState.approvalRequired = false;
        newState.isRunning = false;
        newState.currentStatus = "ANALYZING";
        newState.error = null;
        pushEvent("Planning analysis started...", "SYSTEM");
      }
      else if (evt === "PLANNING_FAILED") {
        newState.isPlanning = false;
        newState.approvalRequired = false;
        newState.isRunning = false;
        newState.currentStatus = "PLANNING_FAILED";
        newState.error = p.error || "Planning failed";
        pushEvent(`Planning failed: ${newState.error}`, "ERROR");
        newState.messages.push({
          id: Math.random().toString(),
          agentId: "system",
          type: "system",
          content: `❌ Planning failed: ${newState.error}`
        });
      }
      else if (evt === "APPROVAL_REQUIRED" || evt === "PLAN_READY") {
        newState.isPlanning = false;
        newState.approvalRequired = true;
        newState.isRunning = false;
        newState.currentStatus = "APPROVAL_REQUIRED";
        newState.plan = p;
        pushEvent("Plan generated. Review and approve workforce.", "SYSTEM");
      }
      else if (evt === "APPROVED") {
        newState.approvalRequired = false;
        newState.isRunning = true;
        newState.currentStatus = "APPROVED";
        pushEvent("Workflow Approved. Starting agent execution.", "SYSTEM");
      }
      else if (evt === "ORCHESTRATOR_STATE") {
        newState.currentStatus = "RUNNING";
        pushEvent(`Orchestrator: ${p.status}`, "ORCH");
        if (p.role && !newState.activeAgents.includes(p.role)) {
          newState.activeAgents.push(p.role);
        }
        if (p.role) {
          const ag = ensureAgent(newState, p.role);
          ag.status = "WORKING";
          ag.currentTask = p.status || "Working...";
          newState.agents[p.role] = ag;
        }
      }
      else if (evt === "AGENT_CONFIG") {
        newState.currentStatus = "RUNNING";
        const ag = ensureAgent(newState, p.agentId);
        ag.provider = p.provider;
        ag.model = p.model;
        ag.isLocal = p.isLocal;
        ag.routingReason = p.routingReason;
        newState.agents[p.agentId] = ag;
        if (!newState.workflowSequence.includes(p.agentId)) {
          newState.workflowSequence.push(p.agentId);
        }
        newState.messages.push({ id: Math.random().toString(), agentId: p.agentId, type: "text", content: "" });
      }
      else if (evt === "MODEL_STREAM") {
        const agentId = p.agentId || (action.taskId ? action.taskId.split('_')[1] : null);
        if (agentId) {
          const ag = ensureAgent(newState, agentId);
          ag.status = "THINKING";
          newState.agents[agentId] = ag;
          
          for (let i = newState.messages.length - 1; i >= 0; i--) {
            const msg = newState.messages[i];
            if (msg.type === "text" && msg.agentId === agentId) {
              msg.content += p.delta || "";
              break;
            }
          }
        }
      }
      else if (evt === "AGENT_MESSAGE") {
        const agentId = p.fromAgent || p.agentId || p.from || "agent";
        newState.messages.push({
          id: p.correlationId || p.id || Math.random().toString(),
          agentId,
          type: "text",
          content: p.message || p.content || "",
          metadata: p
        });
      }
      else if (evt === "TOOL_CALL") {
        pushEvent(`Tool executed: ${p.tool}`, "TOOL");
        const agentId = p.agentId || (action.taskId ? action.taskId.split('_')[1] : newState.activeAgents[newState.activeAgents.length - 1]);
        if (agentId) {
          const ag = ensureAgent(newState, agentId);
          ag.status = "WORKING";
          ag.currentTask = `Running ${p.tool}`;
          newState.agents[agentId] = ag;
          
          newState.messages.push({ 
            id: Math.random().toString(), 
            agentId: agentId, 
            type: "tool_call", 
            content: `Executing ${p.tool}...`,
            metadata: p.args 
          });
        }
      }
      else if (evt === "FILE_CHANGED") {
        const bn = p.path ? (p.path.split(/[/\\]/).pop() || p.path) : "file";
        pushEvent(`File modified: ${bn}`, "FILE");
        newState.files[bn] = { name: bn, status: p.changeType === "MODIFIED" ? "MODIFIED" : "NEW" };
        newState.messages.push({ 
          id: Math.random().toString(), 
          agentId: p.agentId || "agent", 
          type: "file_change", 
          content: `Modified ${bn}`
        });
      }
      else if (evt === "AGENT_COMPLETED") {
        const agentId = p.agentId || (action.taskId ? action.taskId.split('_')[1] : null);
        if (agentId) {
          pushEvent(`${agentId} completed turn`, "AGENT");
          const ag = ensureAgent(newState, agentId);
          ag.status = "COMPLETED";
          newState.agents[agentId] = ag;
          newState.activeAgents = newState.activeAgents.filter(a => a !== agentId);
        }
      }
      else if (evt === "USAGE_UPDATED") {
        const agentId = p.agentId;
        if (agentId) {
          const ag = ensureAgent(newState, agentId);
          ag.tokens = (ag.tokens || 0) + (p.usage?.total_tokens || 0);
          ag.usageSource = p.source || "PROVIDER_REPORTED";
          newState.agents[agentId] = ag;
        }
      }
      else if (evt === "CONFLICT_DETECTED") {
        pushEvent(`Conflict Detected: ${p.path} (${p.agent1} vs ${p.agent2})`, "ERROR");
        newState.messages.push({
          id: Math.random().toString(),
          agentId: "system",
          type: "system",
          content: `⚠️ FILE CONFLICT: Agent ${p.agent2} attempted to overwrite ${p.path}, currently locked by ${p.agent1}.`
        });
      }
      else if (evt === "RESOURCE_LIMIT_REACHED") {
        pushEvent(`Resource Limit Reached (${p.current}/${p.limit} tokens)`, "ERROR");
        newState.messages.push({
          id: Math.random().toString(),
          agentId: "system",
          type: "system",
          content: `⛔ Resource limit reached (${p.current} tokens). No additional agents will be spawned.`
        });
      }
      else if (evt === "ORCHESTRATOR_HANDOFF" || evt === "AGENT_HANDOFF") {
        pushEvent(`Handoff: ${p.from} -> ${p.to}`, "ORCH");
        newState.messages.push({
          id: p.correlationId || Math.random().toString(),
          agentId: p.from,
          type: "handoff",
          content: `HANDED OFF TO ${p.to}: ${p.message || ""}`,
          metadata: {
            to: p.to,
            correlationId: p.correlationId,
            providerId: p.providerId,
            modelId: p.modelId,
            taskId: p.taskId
          }
        });
      }
      else if (evt === "ORCHESTRATOR_COMPLETE") {
        pushEvent(`Workflow completed successfully`, "ORCH");
        newState.isRunning = false;
        newState.currentStatus = "COMPLETED";
        newState.activeAgents = [];
      }
      else if (evt === "ORCHESTRATOR_ERROR") {
        pushEvent(`Workflow error: ${p.error}`, "ERROR");
        newState.isRunning = false;
        newState.currentStatus = "FAILED";
        newState.error = p.error;
        newState.messages.push({
          id: Math.random().toString(),
          agentId: "system",
          type: "system",
          content: `❌ Error: ${p.error}`
        });
      }
  } catch(e) {}

  return newState;
}

export function useWorkflow(initialWorkflowId: string, workspacePath: string) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, workflowId: initialWorkflowId });
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const fetchSnapshot = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/jinwoo/workflow?id=${id}`);
      if (!res.ok) return;
      const data = await res.json();
      
      if (data.events && data.events.length > 0) {
        dispatch({ type: "RESET", workflowId: id, projectId: "project_auth_1" });
        for (const ev of data.events) {
          dispatch({ type: "EVENT", eventType: ev.eventType, payload: ev.payload });
        }
      } else if (data.workflow) {
        // Hydrate from workflow DB record
        dispatch({ type: "RESET", workflowId: id, projectId: data.workflow.projectId || "project_auth_1" });
        if (data.workflow.status === "APPROVAL_REQUIRED" && data.tasks) {
          const plan = {
            enhancedRequest: data.workflow.enhancedPrompt ? JSON.parse(data.workflow.enhancedPrompt) : { objective: data.workflow.originalPrompt },
            tasks: data.tasks.map((t: any) => ({
              id: t.id,
              role: t.role,
              objective: t.objective,
              recommendedModel: t.model,
              recommendedProvider: t.provider,
              dependsOn: (data.dependencies || []).filter((d: any) => d.taskId === t.id).map((d: any) => d.dependsOnTaskId)
            }))
          };
          dispatch({ type: "EVENT", eventType: "APPROVAL_REQUIRED", payload: plan });
        }
      }
    } catch(e) {
      console.error("Failed to load snapshot", e);
    }
  }, []);

  useEffect(() => {
    if (initialWorkflowId) {
      fetchSnapshot(initialWorkflowId);
    }
  }, [initialWorkflowId, fetchSnapshot]);

  const startWorkflow = async (prompt: string, roleCount: number | "auto" = "auto") => {
    if (!prompt) return;
    
    // Stop any existing stream
    if (readerRef.current) {
        try { readerRef.current.cancel(); } catch(e) {}
        readerRef.current = null;
    }

    const currentWfId = state.workflowId || ("wf_" + Date.now());
    dispatch({ type: "RESET", workflowId: currentWfId, projectId: state.projectId });
    dispatch({ type: "EVENT", eventType: "PLANNING_STARTED", payload: {} });
    
    try {
      const response = await fetch("/api/jinwoo/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: currentWfId,
          prompt,
          workspacePath,
          roleCount
        }),
      });
      
      const resData = await response.json();
      if (resData.success && (resData.status === 'APPROVAL_REQUIRED' || resData.plan)) {
        dispatch({ type: "EVENT", eventType: "APPROVAL_REQUIRED", payload: resData.plan });
      } else {
        const errMsg = resData.error || "Planner failed to generate tasks.";
        dispatch({ type: "EVENT", eventType: "PLANNING_FAILED", payload: { error: errMsg } });
      }
    } catch (e: any) {
      console.error("Start workflow error:", e);
      dispatch({ type: "EVENT", eventType: "PLANNING_FAILED", payload: { error: e.message || String(e) } });
    }
  };

  const approveWorkflow = async () => {
    dispatch({ type: "EVENT", eventType: "APPROVED", payload: {} });

    try {
      const response = await fetch("/api/jinwoo/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: state.workflowId,
          workspacePath
        }),
      });
      
      if (!response.body) {
        dispatch({ type: "EVENT", eventType: "ORCHESTRATOR_ERROR", payload: { error: "No response stream from server" } });
        return;
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              dispatch({ type: "EVENT", eventType: data.eventType, payload: data.payload });
            } catch (e) {}
          }
        }
      }
    } catch (e: any) {
      console.error("Approve workflow execution error:", e);
      dispatch({ type: "EVENT", eventType: "ORCHESTRATOR_ERROR", payload: { error: e.message || String(e) } });
    }
  };

  return {
    state,
    startWorkflow,
    approveWorkflow,
    fetchSnapshot
  };
}
