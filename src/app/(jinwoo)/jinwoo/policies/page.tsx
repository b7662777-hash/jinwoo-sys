"use client";

import React, { useState, useEffect } from "react";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState({
    maxAgents: "5",
    maxConcurrent: "3",
    maxTokens: "100000",
    maxBudget: "10.00",
    localOnly: false,
    cloudOnly: false,
    allowFileWrite: true,
    allowTerminal: true,
    requireApproval: true,
    fallbackPolicy: "auto"
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem("jinwoo_policies");
    if (p) setPolicies(JSON.parse(p));
  }, []);

  const handleSave = () => {
    localStorage.setItem("jinwoo_policies", JSON.stringify(policies));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Orchestration Policies</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Control how Jinwoo agents operate, access resources, and spend budgets.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {saved && <span style={{ color: "#10b981", fontSize: "14px" }}>Saved successfully!</span>}
          <button 
            onClick={handleSave}
            style={{ background: "#3b82f6", color: "#fff", padding: "8px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500" }}>
            Save Policies
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Resource Limits */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px", color: "#e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⚖️</span> Resource Limits
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>Max Agents per Workflow</label>
              <input type="number" value={policies.maxAgents} onChange={e => setPolicies({...policies, maxAgents: e.target.value})} style={{ width: "100%", background: "#0b0f19", border: "1px solid #374151", color: "#fff", padding: "10px", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>Max Concurrent Agents</label>
              <input type="number" value={policies.maxConcurrent} onChange={e => setPolicies({...policies, maxConcurrent: e.target.value})} style={{ width: "100%", background: "#0b0f19", border: "1px solid #374151", color: "#fff", padding: "10px", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>Max Tokens per Workflow</label>
              <input type="number" value={policies.maxTokens} onChange={e => setPolicies({...policies, maxTokens: e.target.value})} style={{ width: "100%", background: "#0b0f19", border: "1px solid #374151", color: "#fff", padding: "10px", borderRadius: "6px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>Max Workflow Budget ($)</label>
              <input type="number" step="0.01" value={policies.maxBudget} onChange={e => setPolicies({...policies, maxBudget: e.target.value})} style={{ width: "100%", background: "#0b0f19", border: "1px solid #374151", color: "#fff", padding: "10px", borderRadius: "6px" }} />
            </div>
          </div>
        </div>

        {/* Security & Permissions */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px", color: "#e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🛡️</span> Security & Permissions
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={policies.localOnly} onChange={e => setPolicies({...policies, localOnly: e.target.checked, cloudOnly: false})} style={{ width: "18px", height: "18px", accentColor: "#3b82f6" }} />
              <div>
                <div style={{ fontSize: "15px", color: "#e5e7eb" }}>Force Local-Only Models</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Block all cloud providers (OpenAI, Anthropic)</div>
              </div>
            </label>
            
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={policies.allowFileWrite} onChange={e => setPolicies({...policies, allowFileWrite: e.target.checked})} style={{ width: "18px", height: "18px", accentColor: "#3b82f6" }} />
              <div>
                <div style={{ fontSize: "15px", color: "#e5e7eb" }}>Allow File System Writes</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Agents can create/modify/delete files</div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={policies.allowTerminal} onChange={e => setPolicies({...policies, allowTerminal: e.target.checked})} style={{ width: "18px", height: "18px", accentColor: "#3b82f6" }} />
              <div>
                <div style={{ fontSize: "15px", color: "#e5e7eb" }}>Allow Terminal Execution</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Agents can run terminal commands</div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={policies.requireApproval} onChange={e => setPolicies({...policies, requireApproval: e.target.checked})} style={{ width: "18px", height: "18px", accentColor: "#3b82f6" }} />
              <div>
                <div style={{ fontSize: "15px", color: "#e5e7eb" }}>Require Explicit Approval</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>Pause execution before destructive actions</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
