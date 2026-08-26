"use client";

import React, { useState } from "react";

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommendedCapabilities: string[];
  recommendedModel: string;
  provider: string;
  workersCount: number;
}

export const JINWOO_ROLES: RoleDefinition[] = [
  {
    id: "ARCHITECT",
    name: "Architect",
    description: "System design, high-level architecture planning, and cross-module governance.",
    icon: "🏛️",
    recommendedCapabilities: ["Architecture planning", "Reasoning", "Handoff coordination"],
    recommendedModel: "antigravity/claude-opus-4-6-thinking",
    provider: "Antigravity",
    workersCount: 1
  },
  {
    id: "DEVELOPER",
    name: "Developer",
    description: "Implementation, core coding, bug fixes, and feature refactoring.",
    icon: "💻",
    recommendedCapabilities: ["File tools", "Terminal", "Git diffs", "Streaming"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 1
  },
  {
    id: "FRONTEND_DEVELOPER",
    name: "Frontend Developer",
    description: "UI layouts, components, responsive styles, and web interactivity.",
    icon: "🎨",
    recommendedCapabilities: ["Component design", "CSS/Tailwind", "Browser tools"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 0
  },
  {
    id: "BACKEND_DEVELOPER",
    name: "Backend Developer",
    description: "API routes, SQLite domain modules, server-side data models, and auth.",
    icon: "⚙️",
    recommendedCapabilities: ["REST APIs", "Database migrations", "Process management"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 0
  },
  {
    id: "QA",
    name: "QA Verifier",
    description: "Automated test suite execution, assertion verification, and error auditing.",
    icon: "🧪",
    recommendedCapabilities: ["Test runners", "Edge-case analysis", "Regression reporting"],
    recommendedModel: "antigravity/gemini-2.5-flash",
    provider: "Antigravity",
    workersCount: 1
  },
  {
    id: "SECURITY",
    name: "Security Auditor",
    description: "Path traversal protection, token sanitization, and compliance audits.",
    icon: "🛡️",
    recommendedCapabilities: ["Workspace containment", "Secret masking", "Policy enforcement"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 1
  },
  {
    id: "RESEARCHER",
    name: "Researcher",
    description: "Deep documentation lookup, codebase indexing, and dependency analysis.",
    icon: "🔍",
    recommendedCapabilities: ["Context search", "Document indexing", "Web discovery"],
    recommendedModel: "antigravity/claude-opus-4-6-thinking",
    provider: "Antigravity",
    workersCount: 0
  },
  {
    id: "PLANNER",
    name: "Planner",
    description: "Task decomposition, dependency scheduling, and roadmap milestones.",
    icon: "📋",
    recommendedCapabilities: ["DAG creation", "Dependency ordering", "Budget allocation"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 0
  },
  {
    id: "DOCUMENTATION",
    name: "Documentation Specialist",
    description: "API references, README documentation, changelogs, and user guides.",
    icon: "📚",
    recommendedCapabilities: ["Markdown authoring", "Architecture diagrams", "API specs"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 0
  },
  {
    id: "DEVOPS",
    name: "DevOps Engineer",
    description: "Build scripts, process isolation, deployment daemons, and environment sync.",
    icon: "🚀",
    recommendedCapabilities: ["Node runtimes", "Shell execution", "Port management"],
    recommendedModel: "antigravity/claude-sonnet-4-6",
    provider: "Antigravity",
    workersCount: 0
  }
];

interface OpenCodeRoleLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (config: {
    role: string;
    workspacePath: string;
    model: string;
    provider: string;
  }) => Promise<void>;
  defaultWorkspace?: string;
}

export default function OpenCodeRoleLaunchModal({
  isOpen,
  onClose,
  onLaunch,
  defaultWorkspace = ""
}: OpenCodeRoleLaunchModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("DEVELOPER");
  const [workspacePath, setWorkspacePath] = useState<string>(() => {
    if (defaultWorkspace) return defaultWorkspace;
    if (typeof window !== "undefined") {
      return localStorage.getItem("jinwoo_current_workspace") || "";
    }
    return "";
  });
  const [model, setModel] = useState<string>("antigravity/claude-sonnet-4-6");
  const [provider, setProvider] = useState<string>("antigravity");
  const [launching, setLaunching] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRoleDef = JINWOO_ROLES.find((r) => r.id === selectedRole) || JINWOO_ROLES[1];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const def = JINWOO_ROLES.find((r) => r.id === roleId);
    if (def) {
      setModel(def.recommendedModel);
      setProvider(def.provider);
    }
  };

  const handleConfirmLaunch = async () => {
    setLaunching(true);
    try {
      await onLaunch({
        role: selectedRole,
        workspacePath,
        model,
        provider
      });
      onClose();
    } catch (e) {
      console.error("Launch error:", e);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#0D111C",
        border: "1px solid #1f2937",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "840px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Assign OpenCode to a Jinwoo Role</h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", margin: "4px 0 0 0" }}>
              Choose which Jinwoo workforce role this OpenCode session will perform.
            </p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: "18px", cursor: "pointer" }}>✕</button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Role Grid */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "10px" }}>
              Select Workforce Role
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {JINWOO_ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    style={{
                      backgroundColor: isSelected ? "rgba(59, 130, 246, 0.12)" : "#111827",
                      border: isSelected ? "2px solid #3b82f6" : "1px solid #1f2937",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "16px" }}>{r.icon}</span>
                        <strong style={{ color: isSelected ? "#60a5fa" : "#f3f4f6", fontSize: "13px" }}>{r.name}</strong>
                      </div>
                      <span style={{ backgroundColor: "#1f2937", color: "#9ca3af", fontSize: "10px", padding: "2px 6px", borderRadius: "4px" }}>
                        {r.workersCount} active
                      </span>
                    </div>
                    <p style={{ color: "#9ca3af", fontSize: "11px", margin: 0, lineHeight: "1.3" }}>
                      {r.description}
                    </p>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
                      {r.recommendedCapabilities.map((c, i) => (
                        <span key={i} style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#cbd5e1", fontSize: "9px", padding: "1px 5px", borderRadius: "3px" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workspace Path Input */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
              Target Workspace Directory
            </label>
            <input
              value={workspacePath}
              onChange={(e) => setWorkspacePath(e.target.value)}
              placeholder="e.g. /path/to/project or C:\Projects\App"
              style={{ width: "100%", backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => {
                  const saved = typeof window !== "undefined" ? localStorage.getItem("jinwoo_current_workspace") : "";
                  setWorkspacePath(saved || ".");
                }}
                style={{ backgroundColor: "#1f2937", border: "none", color: "#60a5fa", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
              >
                Current Active Workspace
              </button>
              <button
                type="button"
                onClick={() => setWorkspacePath("./scratch/sandbox_workspace")}
                style={{ backgroundColor: "#1f2937", border: "none", color: "#9ca3af", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
              >
                Local Sandbox Workspace
              </button>
            </div>
          </div>

          {/* Model & Gateway Configuration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                Intelligence Model
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{ width: "100%", backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                Local AI Gateway
              </label>
              <input
                disabled
                value="http://127.0.0.1:20128/api/v1 (OmniRoute)"
                style={{ width: "100%", backgroundColor: "#111827", border: "1px solid #374151", color: "#9ca3af", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Session Launch Summary Card */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "14px 16px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <strong style={{ color: "#f3f4f6", fontSize: "13px", marginBottom: "2px" }}>Session Configuration Summary</strong>
            <div><span style={{ color: "#9ca3af" }}>Role:</span> <strong style={{ color: "#34d399" }}>{currentRoleDef.name.toUpperCase()}</strong></div>
            <div><span style={{ color: "#9ca3af" }}>Runtime:</span> <span style={{ color: "#f3f4f6" }}>OpenCode v1.18.18 (Dedicated TUI Window)</span></div>
            <div><span style={{ color: "#9ca3af" }}>Workspace:</span> <code style={{ color: "#60a5fa" }}>{workspacePath}</code></div>
            <div><span style={{ color: "#9ca3af" }}>Model:</span> <span style={{ color: "#fbbf24" }}>{model}</span></div>
            <div><span style={{ color: "#9ca3af" }}>Multi-Agent Bus:</span> <span style={{ color: "#34d399" }}>Connected (Bidirectional Dialogue Enabled)</span></div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLaunch}
            disabled={launching}
            style={{
              backgroundColor: launching ? "#374151" : "#2563eb",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: launching ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {launching ? "Launching..." : `🚀 Launch OpenCode as ${currentRoleDef.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
