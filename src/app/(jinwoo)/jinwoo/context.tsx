"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useWorkflow } from "./hooks/useWorkflow";

const WorkspaceContext = createContext<any>(null);

export function useJinwooWorkspace() {
  return useContext(WorkspaceContext);
}

export function JinwooWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workflowId, setWorkflowId] = useState<string>("");
  const [workspacePath, setWorkspacePath] = useState("");
  const [workspaceName, setWorkspaceName] = useState("No Workspace");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [roleCount, setRoleCount] = useState<number | "auto">("auto");
  const [prompt, setPrompt] = useState("");

  // Initialize or restore active workflow ID
  useEffect(() => {
    const savedWfId = localStorage.getItem("jinwoo_active_workflow_id");
    if (savedWfId) {
      setWorkflowId(savedWfId);
    } else {
      const newWfId = "wf_" + Date.now();
      localStorage.setItem("jinwoo_active_workflow_id", newWfId);
      setWorkflowId(newWfId);
    }

    const savedPrompt = localStorage.getItem("jinwoo_active_prompt");
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, []);

  const createNewWorkflow = () => {
    const newWfId = "wf_" + Date.now();
    localStorage.setItem("jinwoo_active_workflow_id", newWfId);
    setWorkflowId(newWfId);
    setPrompt("");
    localStorage.removeItem("jinwoo_active_prompt");
  };

  const handleSetPrompt = (p: string) => {
    setPrompt(p);
    localStorage.setItem("jinwoo_active_prompt", p);
  };

  const workflow = useWorkflow(workflowId, workspacePath);

  const loadWorkspace = async () => {
    const wsId = localStorage.getItem("jinwoo_active_workspace");
    const wsPath = localStorage.getItem("jinwoo_active_workspace_path");
    
    if (wsPath) setWorkspacePath(wsPath);
    if (wsId) {
      setWorkspaceId(wsId);
      try {
        const res = await fetch("/api/jinwoo/projects");
        const data = await res.json();
        const project = data.projects?.find((p: any) => p.id === wsId);
        if (project) setWorkspaceName(project.name);
      } catch (err) {}
    } else {
      setWorkspaceName("Select Workspace");
    }
  };

  useEffect(() => {
    loadWorkspace();
    window.addEventListener("jinwoo_workspace_changed", loadWorkspace);
    return () => window.removeEventListener("jinwoo_workspace_changed", loadWorkspace);
  }, []);

  return (
    <WorkspaceContext.Provider value={{ 
      ...workflow, 
      prompt, 
      setPrompt: handleSetPrompt, 
      workspacePath, 
      workspaceName, 
      workspaceId,
      roleCount,
      setRoleCount,
      createNewWorkflow,
      setWorkflowId
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
