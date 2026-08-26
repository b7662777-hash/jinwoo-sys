"use client";

import React, { useState, useEffect } from "react";

export default function WorkforcePage() {
  const [roles, setRoles] = useState<any[]>([
    { id: "role_architect", role: "architect", codingAgent: "hermes", provider: "antigravity", model: "antigravity/claude-opus-4-6-thinking", priority: "High" },
    { id: "role_developer", role: "developer", codingAgent: "hermes", provider: "antigravity", model: "antigravity/claude-sonnet-4-6", priority: "High" },
    { id: "role_qa", role: "qa", codingAgent: "hermes", provider: "antigravity", model: "antigravity/gemini-3.7-flash-high", priority: "Normal" },
    { id: "role_security", role: "security", codingAgent: "hermes", provider: "antigravity", model: "antigravity/claude-sonnet-4-6", priority: "Normal" }
  ]);

  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [agentsRes, provRes, wfRes] = await Promise.all([
          fetch("/api/jinwoo/coding-agents"),
          fetch("/api/jinwoo/providers"),
          fetch("/api/jinwoo/workforce")
        ]);

        const agentsData = await agentsRes.json();
        const provData = await provRes.json();
        const wfData = await wfRes.json();

        if (agentsData.agents) setAvailableAgents(agentsData.agents);
        if (provData.models) setAvailableModels(provData.models);
        if (wfData.roles && wfData.roles.length > 0) {
          setRoles(wfData.roles.map((r: any) => ({
            id: r.id,
            role: r.role,
            codingAgent: r.codingAgent || "hermes",
            provider: r.provider || "openai",
            model: r.model || "gpt-4o",
            priority: "High"
          })));
        }
      } catch (e) {
        console.error("Failed to load workforce data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const addRole = () => {
    const newId = `role_custom_${Date.now()}`;
    setRoles([...roles, {
      id: newId,
      role: "custom_specialist",
      codingAgent: "hermes",
      provider: availableModels[0]?.provider || "openai",
      model: availableModels[0]?.id || "gpt-4o",
      priority: "Normal"
    }]);
  };

  const removeRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const updateRole = (id: string, field: string, value: string) => {
    setRoles(roles.map(r => {
      if (r.id !== id) return r;
      if (field === "model") {
        const match = availableModels.find(m => m.id === value);
        const provider = match ? match.provider : (value.includes("/") ? value.split("/")[0] : r.provider);
        return { ...r, model: value, provider };
      }
      return { ...r, [field]: value };
    }));
  };

  const saveWorkforce = async () => {
    try {
      for (const r of roles) {
        await fetch("/api/jinwoo/workforce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(r)
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Save workforce failed:", e);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>👥</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>AI Workforce Builder</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Define specialist roles and assign their coding agent runtime, upstream provider, and model through OmniRoute.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={addRole}
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#a78bfa",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            + Add Role
          </button>
          <button
            onClick={saveWorkforce}
            style={{
              backgroundColor: "#10b981",
              border: "none",
              color: "white",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {savedSuccess ? "✓ Saved!" : "Save Workforce"}
          </button>
        </div>
      </div>

      {/* Role Assignment Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {roles.map((r, idx) => (
          <div
            key={r.id}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "grid",
              gridTemplateColumns: "180px 180px 1fr 140px 40px",
              gap: "16px",
              alignItems: "center"
            }}
          >
            {/* Role Name */}
            <div>
              <label style={{ display: "block", color: "#9ca3af", fontSize: "11px", marginBottom: "4px" }}>Role Name</label>
              <input
                value={r.role}
                onChange={(e) => updateRole(r.id, "role", e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  color: "#f3f4f6",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textTransform: "capitalize"
                }}
              />
            </div>

            {/* Assigned Coding Agent */}
            <div>
              <label style={{ display: "block", color: "#9ca3af", fontSize: "11px", marginBottom: "4px" }}>Worker Runtime</label>
              <select
                value={r.codingAgent}
                onChange={(e) => updateRole(r.id, "codingAgent", e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  color: "#60a5fa",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "13px"
                }}
              >
                <option value="hermes">Hermes Agent (Local)</option>
                <option value="opencode">OpenCode CLI</option>
                <option value="claude-code">Claude Code CLI</option>
                <option value="codex">Codex CLI</option>
                <option value="openclaw">OpenClaw</option>
              </select>
            </div>

            {/* Model & Gateway Routing */}
            <div>
              <label style={{ display: "block", color: "#9ca3af", fontSize: "11px", marginBottom: "4px" }}>
                OmniRoute Gateway ➔ Provider & Model
              </label>
              <select
                value={r.model}
                onChange={(e) => updateRole(r.id, "model", e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  color: "#a78bfa",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "13px"
                }}
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.id} via {m.providerDisplayName || m.provider}
                  </option>
                ))}
                {!availableModels.some(m => m.id === r.model) && (
                  <option value={r.model}>{r.model}</option>
                )}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label style={{ display: "block", color: "#9ca3af", fontSize: "11px", marginBottom: "4px" }}>Priority</label>
              <select
                value={r.priority}
                onChange={(e) => updateRole(r.id, "priority", e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  color: "#f3f4f6",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "13px"
                }}
              >
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Delete button */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "16px" }}>
              <button
                onClick={() => removeRole(r.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px"
                }}
                title="Remove Role"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
