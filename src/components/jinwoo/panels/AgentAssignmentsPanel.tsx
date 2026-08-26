"use client";

import React, { useEffect, useState } from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function AgentAssignmentsPanel() {
  const { state } = useJinwooWorkspace();
  const plannerTasks = state.plan?.tasks || [];
  
  const [roles, setRoles] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fetch real connected models
  useEffect(() => {
    async function loadModels() {
      try {
        const res = await fetch("/api/jinwoo/providers");
        const data = await res.json();
        if (data.models && data.models.length > 0) {
          setAvailableModels(data.models);
        }
      } catch (e) {}
    }
    loadModels();
  }, []);

  // Sync with planner tasks whenever planner generates a new plan
  useEffect(() => {
    if (plannerTasks.length > 0) {
      setRoles(plannerTasks.map((t: any) => ({
        id: t.id || Math.random().toString(36).substring(2, 9),
        name: t.role,
        model: t.recommendedModel || t.model || (availableModels[0]?.id || "gpt-4o"),
        provider: t.recommendedProvider || t.provider || (availableModels[0]?.provider || "openai"),
        reason: t.reason || "Assigned by Jinwoo Planner",
        isRecommended: true
      })));
    }
  }, [plannerTasks, availableModels]);

  const addRole = () => {
    const defaultModel = availableModels[0]?.id || "gpt-4o";
    const defaultProvider = availableModels[0]?.provider || "openai";
    
    setRoles([...roles, {
      id: "custom_" + Math.random().toString(36).substring(2, 7),
      name: "Specialist",
      model: defaultModel,
      provider: defaultProvider,
      reason: "Custom role created by user",
      isRecommended: false
    }]);
  };

  const removeRole = (id: string) => {
    setRoles(roles.filter((r: any) => r.id !== id));
  };

  const updateRole = (id: string, field: string, value: string) => {
    setRoles(roles.map((r: any) => {
      if (r.id !== id) return r;
      if (field === "model") {
        // Automatically extract provider if model is in provider/model format
        const match = availableModels.find(m => m.id === value);
        const provider = match ? match.provider : (value.includes("/") ? value.split("/")[0] : r.provider);
        return { ...r, model: value, provider, isRecommended: false };
      }
      return { ...r, [field]: value, isRecommended: false };
    }));
  };

  const saveAssignments = async () => {
    try {
      for (const r of roles) {
        await fetch('/api/jinwoo/roles', {
          method: 'POST',
          body: JSON.stringify({ 
            role: r.name.toLowerCase(), 
            model: r.model, 
            provider: r.provider,
            projectId: state.projectId || "project_auth_1" 
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Save role assignments failed:", e);
    }
  };

  return (
    <div style={{ border: "1px solid #1f2937", borderRadius: "12px", background: "#0D111C", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px" }}>👥</span>
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px", color: "#f3f4f6" }}>Workforce Model Overrides</div>
            <div style={{ fontSize: "11px", color: "#9ca3af" }}>Customize specialist models & providers</div>
          </div>
        </div>
        
        <button 
          onClick={addRole}
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#a78bfa", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}
        >
          + Add Role
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", padding: "16px", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
        {roles.map((role: any, index: number) => (
          <div key={role.id} style={{ border: "1px solid #2d3748", borderRadius: "8px", padding: "12px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ color: "#f3f4f6", fontSize: "13px", fontWeight: "600" }}>
                {index + 1}. {role.name.toUpperCase()}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {role.isRecommended ? (
                  <span style={{ color: "#34d399", fontSize: "10px", border: "1px solid rgba(52,211,153,0.3)", padding: "1px 6px", borderRadius: "4px", backgroundColor: "rgba(52,211,153,0.05)" }}>
                    Recommended
                  </span>
                ) : (
                  <span style={{ color: "#fbbf24", fontSize: "10px", border: "1px solid rgba(251,191,36,0.3)", padding: "1px 6px", borderRadius: "4px", backgroundColor: "rgba(251,191,36,0.05)" }}>
                    Custom Override
                  </span>
                )}
                <button 
                  onClick={() => removeRole(role.id)} 
                  style={{ background: "none", border: "none", color: "#ef4444", fontSize: "13px", cursor: "pointer", padding: "0 4px" }}
                  title="Remove role"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Routing Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#9ca3af", backgroundColor: "rgba(0,0,0,0.3)", padding: "4px 8px", borderRadius: "4px" }}>
                <span>Gateway: <strong style={{ color: "#34d399" }}>OmniRoute</strong></span>
                <span>•</span>
                <span>Provider: <strong style={{ color: "#60a5fa" }}>{role.provider || "openai"}</strong></span>
              </div>

              {/* Role Title */}
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "8px", alignItems: "center" }}>
                <label style={{ color: "#9ca3af", fontSize: "11px" }}>Role:</label>
                <input 
                  value={role.name} 
                  onChange={(e) => updateRole(role.id, 'name', e.target.value)} 
                  style={{ background: "#030712", border: "1px solid #374151", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", outline: "none" }} 
                />
              </div>

              {/* Model Dropdown */}
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "8px", alignItems: "center" }}>
                <label style={{ color: "#9ca3af", fontSize: "11px" }}>Model:</label>
                {availableModels.length > 0 ? (
                  <select 
                    value={role.model} 
                    onChange={(e) => updateRole(role.id, 'model', e.target.value)}
                    style={{ background: "#030712", border: "1px solid #374151", color: "#60a5fa", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", outline: "none" }}
                  >
                    {availableModels.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.name || m.id} via {m.providerDisplayName || m.provider}
                      </option>
                    ))}
                    {!availableModels.some(m => m.id === role.model) && (
                      <option value={role.model}>{role.model}</option>
                    )}
                  </select>
                ) : (
                  <input 
                    value={role.model} 
                    onChange={(e) => updateRole(role.id, 'model', e.target.value)} 
                    style={{ background: "#030712", border: "1px solid #374151", color: "#60a5fa", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", outline: "none" }} 
                  />
                )}
              </div>
            </div>

            {role.reason && (
              <div style={{ color: "#9ca3af", fontSize: "11px", fontStyle: "italic", marginTop: "8px" }}>
                Note: {role.reason}
              </div>
            )}
          </div>
        ))}
        
        {roles.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px", color: "#6b7280", fontSize: "12px" }}>
            No roles generated yet. Click "Start Plan Analysis" to let Jinwoo assemble the workforce.
          </div>
        )}
      </div>

      {roles.length > 0 && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {savedSuccess ? (
            <span style={{ color: "#34d399", fontSize: "12px" }}>✓ Saved to database!</span>
          ) : (
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>Overrides apply to future runs</span>
          )}
          <button 
            onClick={saveAssignments}
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#d1d5db", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}
          >
            Save Overrides
          </button>
        </div>
      )}
    </div>
  );
}
