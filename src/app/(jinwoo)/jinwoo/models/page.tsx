"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function JinwooModelsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ROLES = ["ARCHITECT", "DEVELOPER", "FRONTEND_DEVELOPER", "BACKEND_DEVELOPER", "QA", "SECURITY", "RESEARCHER", "REVIEWER"];

  useEffect(() => {
    async function loadData() {
      try {
        const [provRes, rolesRes] = await Promise.all([
          fetch("/api/jinwoo/providers"),
          fetch("/api/jinwoo/roles?projectId=default")
        ]);
        const provData = await provRes.json();
        const rolesData = await rolesRes.json();
        
        setConnections(provData.connections || []);
        setModels(provData.models || []);
        setRoles(rolesData.assignments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const assignModel = async (role: string, modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    await fetch("/api/jinwoo/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        projectId: "default",
        provider: model.provider,
        model: model.id,
        policy: {}
      })
    });
    
    // Update local state
    setRoles(prev => {
      const existing = prev.filter(r => r.role !== role);
      return [...existing, { role, provider: model.provider, model: model.id, policy: {} }];
    });
  };

  const getRecommendedModel = (role: string) => {
    // Basic heuristics based on capabilities
    if (role === "ARCHITECT" || role === "SECURITY" || role === "REVIEWER") {
      return models.find(m => m.reasoning === "High") || models[0];
    }
    if (role === "DEVELOPER" || role === "FRONTEND_DEVELOPER" || role === "BACKEND_DEVELOPER") {
      return models.find(m => m.coding === "High" && m.tools === "Yes") || models[0];
    }
    if (role === "QA") {
      return models.find(m => m.isLocal) || models[0];
    }
    return models[0];
  };

  if (loading) {
    return <div style={{ padding: "40px", color: "#fff" }}>Loading models...</div>;
  }

  return (
    <div style={{ padding: "24px", color: "#d4d4d8", background: "#0e0e11", minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#fff", marginBottom: "24px" }}>Model Catalog & Registry</h1>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #27272a', marginBottom: '24px', overflowX: 'auto' }}>
        {["All Models", "Connected", "Available", "Local", "Cloud", "Favorites", "Recently Used", "Capabilities", "Usage", "Health"].map(tab => (
          <button 
            key={tab}
            style={{ 
              background: 'none', border: 'none', padding: '8px 4px', cursor: 'pointer', 
              color: tab === "All Models" ? '#a78bfa' : '#a1a1aa', 
              borderBottom: tab === "All Models" ? '2px solid #8b5cf6' : '2px solid transparent',
              fontWeight: tab === "All Models" ? '600' : '400',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Resource Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div style={{ background: "#18181b", border: "1px solid #27272a", padding: "16px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase" }}>AI Models</div>
          <div style={{ fontSize: "18px", color: "#fff", marginTop: "8px" }}>Available: {models.length}</div>
          <div style={{ fontSize: "13px", color: "#4ade80" }}>Local: {models.filter(m => m.isLocal).length}</div>
        </div>
        <div style={{ background: "#18181b", border: "1px solid #27272a", padding: "16px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase" }}>Providers</div>
          <div style={{ fontSize: "18px", color: "#fff", marginTop: "8px" }}>Connected: {connections.length}</div>
          <div style={{ fontSize: "13px", color: "#f87171" }}>Unavailable: {connections.filter(c => c.health !== 'HEALTHY').length}</div>
        </div>
        <div style={{ background: "#18181b", border: "1px solid #27272a", padding: "16px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase" }}>Tokens</div>
          <div style={{ fontSize: "18px", color: "#fff", marginTop: "8px" }}>Used: 0</div>
          <div style={{ fontSize: "13px", color: "#a1a1aa" }}>Remaining: Unknown</div>
        </div>
        <div style={{ background: "#18181b", border: "1px solid #27272a", padding: "16px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase" }}>Active Agents</div>
          <div style={{ fontSize: "18px", color: "#fff", marginTop: "8px" }}>0</div>
          <div style={{ fontSize: "13px", color: "#71717a" }}>Waiting for workflow</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", color: "#fff" }}>Provider Status</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => window.location.reload()} style={{ background: "#27272a", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
            Refresh
          </button>
          <Link href="/admin/providers" style={{ background: "#3b82f6", color: "#fff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
            + Connect Provider
          </Link>
        </div>
      </div>

      {connections.length === 0 ? (
        <div style={{ background: "#18181b", padding: "32px", borderRadius: "8px", border: "1px solid #27272a", textAlign: "center", marginBottom: "32px" }}>
          <h3 style={{ color: "#fff", marginBottom: "8px" }}>No providers connected</h3>
          <p style={{ color: "#a1a1aa", marginBottom: "16px" }}>Connect your AI models to start assigning roles.</p>
          <Link href="/admin/providers" style={{ background: "#3b82f6", color: "#fff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none" }}>Connect Provider</Link>
        </div>
      ) : (
        <div style={{ background: "#18181b", borderRadius: "8px", border: "1px solid #27272a", marginBottom: "32px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#27272a", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", color: "#a1a1aa", fontWeight: "500" }}>Provider</th>
                <th style={{ padding: "12px 16px", color: "#a1a1aa", fontWeight: "500" }}>Name</th>
                <th style={{ padding: "12px 16px", color: "#a1a1aa", fontWeight: "500" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {connections.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid #27272a" }}>
                  <td style={{ padding: "12px 16px", color: "#fff" }}>{c.displayName || c.provider}</td>
                  <td style={{ padding: "12px 16px", color: "#e4e4e7" }}>{c.name || "Default Account"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ 
                      color: c.health === 'HEALTHY' ? "#4ade80" : (c.health === 'NOT_CONFIGURED' ? "#9ca3af" : "#f87171"), 
                      background: c.health === 'HEALTHY' ? "rgba(74,222,128,0.1)" : (c.health === 'NOT_CONFIGURED' ? "rgba(156,163,175,0.1)" : "rgba(248,113,113,0.1)"), 
                      padding: "4px 8px", borderRadius: "4px", fontSize: "12px" 
                    }}>
                      {c.health}
                    </span>
                    {c.reason && <div style={{ fontSize: "11px", color: "#fca5a5", marginTop: "4px" }}>{c.reason}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "16px" }}>Role Assignment Engine</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {ROLES.map(role => {
          const recommended = getRecommendedModel(role);
          const currentAssignment = roles.find(r => r.role === role);
          const activeModelId = currentAssignment?.model || recommended?.id;
          
          return (
            <div key={role} style={{ background: "#18181b", padding: "16px", borderRadius: "8px", border: "1px solid #27272a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <strong style={{ fontSize: "14px", color: "#fff" }}>{role}</strong>
                <span style={{ fontSize: "11px", color: "#a1a1aa", background: "#27272a", padding: "2px 6px", borderRadius: "4px" }}>Policy: Auto</span>
              </div>
              
              <div style={{ fontSize: "13px", color: "#a1a1aa", marginBottom: "12px" }}>
                Recommended: <span style={{ color: "#60a5fa" }}>{recommended ? recommended.name : "None"}</span>
                {recommended && (
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>
                    ✓ {recommended.reasoning === "High" ? "Strong reasoning" : "Low latency"}<br/>
                    ✓ {recommended.coding === "High" ? "Excellent coding" : (recommended.isLocal ? "Local inference" : "Good generalist")}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: "12px", color: "#a1a1aa", marginBottom: "4px" }}>Assigned Model:</div>
                <select 
                  value={activeModelId || ""} 
                  onChange={(e) => assignModel(role, e.target.value)}
                  style={{ width: "100%", background: "#27272a", color: "#fff", border: "1px solid #3f3f46", padding: "8px", borderRadius: "4px", fontSize: "13px" }}
                >
                  <option value="" disabled>Select a model...</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "16px" }}>Model Capabilities Registry</h2>
      <div style={{ background: "#18181b", borderRadius: "8px", border: "1px solid #27272a", overflow: "x-auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#27272a", textAlign: "left" }}>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Model</th>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Provider</th>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Coding</th>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Reasoning</th>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Tools</th>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Local</th>
              <th style={{ padding: "12px", color: "#a1a1aa", fontWeight: "500" }}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={m.id + i} style={{ borderTop: "1px solid #27272a" }}>
                <td style={{ padding: "12px", color: "#fff", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</td>
                <td style={{ padding: "12px", color: "#e4e4e7" }}>{m.provider}</td>
                <td style={{ padding: "12px", color: m.coding === "High" ? "#4ade80" : "#a1a1aa" }}>{m.coding}</td>
                <td style={{ padding: "12px", color: m.reasoning === "High" ? "#4ade80" : "#a1a1aa" }}>{m.reasoning}</td>
                <td style={{ padding: "12px", color: m.tools === "Yes" ? "#4ade80" : "#a1a1aa" }}>{m.tools}</td>
                <td style={{ padding: "12px", color: m.isLocal ? "#4ade80" : "#a1a1aa" }}>{m.isLocal ? "Yes" : "No"}</td>
                <td style={{ padding: "12px", color: "#a1a1aa" }}>{m.cost}</td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "#71717a" }}>No models discovered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
