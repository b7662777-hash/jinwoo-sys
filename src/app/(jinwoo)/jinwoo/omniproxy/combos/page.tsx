"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function OmniProxyCombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState("fallback");
  const [modelsInput, setModelsInput] = useState("");

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const res = await fetch("/api/combos");
      const data = await res.json();
      if (Array.isArray(data)) setCombos(data);
      else if (data.combos) setCombos(data.combos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCombo = async () => {
    if (!name.trim()) return;
    try {
      const modelsList = modelsInput.split(",").map(m => m.trim()).filter(Boolean);
      await fetch("/api/combos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          strategy,
          models: modelsList,
          enabled: true
        })
      });
      setShowCreateModal(false);
      setName("");
      setModelsInput("");
      fetchCombos();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCombo = async (id: string) => {
    if (!confirm("Delete this routing combo?")) return;
    try {
      await fetch(`/api/combos?id=${id}`, { method: "DELETE" });
      fetchCombos();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔀</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Intelligent Combos</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Automated failover, latency routing, load balancing, and multi-provider cascade policies.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/omniproxy/combos/studio"
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#a78bfa",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            🎨 Visual Studio
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)"
            }}
          >
            + Create Combo
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Loading combos...</div>
      ) : combos.length === 0 ? (
        <div style={{ padding: "64px 32px", border: "1px dashed #374151", borderRadius: "12px", textAlign: "center", backgroundColor: "#0D111C" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔀</div>
          <h3 style={{ fontSize: "16px", color: "#f3f4f6", marginBottom: "6px" }}>No Intelligent Combos Configured</h3>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Create a combo to define automatic fallback pipelines between primary, secondary, and local models.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
          {combos.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: "#0D111C",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{c.name}</strong>
                  <span style={{ fontSize: "11px", color: "#60a5fa", textTransform: "uppercase", fontWeight: "600" }}>{c.strategy || "Fallback Cascade"}</span>
                </div>
                <button
                  onClick={() => handleDeleteCombo(c.id)}
                  style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: "12px" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ backgroundColor: "#111827", padding: "10px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>ROUTING PIPELINE:</span>
                {(c.models || []).map((m: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#f3f4f6" }}>
                    <span style={{ color: "#60a5fa", fontSize: "10px" }}>#{idx + 1}</span>
                    <span style={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{typeof m === "string" ? m : m.model || m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "#111827", border: "1px solid #374151", padding: "28px", borderRadius: "12px", width: "480px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#f3f4f6", marginBottom: "16px" }}>Create Intelligent Routing Combo</h3>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>COMBO NAME</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Claude Opus -> Sonnet Fallback"
                style={{ width: "100%", backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>STRATEGY</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                style={{ width: "100%", backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
              >
                <option value="fallback">Sequential Failover (Primary &rarr; Backup)</option>
                <option value="load_balance">Weighted Load Balancing</option>
                <option value="round_robin">Round Robin</option>
                <option value="circuit_breaker">Circuit Breaker with Error Quarantine</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>MODELS (COMMA SEPARATED)</label>
              <textarea
                value={modelsInput}
                onChange={(e) => setModelsInput(e.target.value)}
                placeholder="antigravity/claude-opus-4-6-thinking, antigravity/claude-sonnet-4-6, openrouter/anthropic/claude-3.5-sonnet"
                rows={3}
                style={{ width: "100%", backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", fontFamily: "monospace", outline: "none" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowCreateModal(false)} style={{ backgroundColor: "transparent", color: "#9ca3af", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
              <button onClick={handleCreateCombo} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Save Combo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
