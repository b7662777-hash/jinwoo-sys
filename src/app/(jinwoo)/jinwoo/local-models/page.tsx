"use client";

import React, { useState, useEffect } from "react";

const LOCAL_PROVIDER_IDS = [
  "ollama-local", "lmstudio", "lm-studio", "localai", "jan", "text-gen-webui",
  "llamacpp", "vllm-local", "koboldcpp"
];

export default function LocalModelsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLocalProviders();
  }, []);

  const fetchLocalProviders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jinwoo/providers");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        // Filter to only local providers
        const all = data.providers || [];
        const local = all.filter((p: any) => {
          const pid = (p.providerId || p.id || "").toLowerCase();
          return LOCAL_PROVIDER_IDS.some(lid => pid.includes(lid)) ||
                 p.isLocal === true || 
                 (p.category || "").toLowerCase() === "local";
        });
        setProviders(local);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", minHeight: "100%", background: "#0b0f19" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Local Models</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Detect and manage locally-running AI model servers (Ollama, LM Studio, etc).</p>
        </div>
        <button
          onClick={fetchLocalProviders}
          style={{ background: "#374151", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500" }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Scanning for local model providers...</div>
      ) : error ? (
        <div style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "16px", borderRadius: "8px" }}>
          {error}
          <button onClick={fetchLocalProviders} style={{ marginLeft: "12px", background: "#374151", color: "#fff", padding: "4px 12px", borderRadius: "4px", border: "none", cursor: "pointer" }}>Retry</button>
        </div>
      ) : providers.length === 0 ? (
        <div style={{ padding: "64px 32px", border: "1px dashed #374151", borderRadius: "12px", textAlign: "center", background: "#111827", color: "#9ca3af" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💻</div>
          <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px", color: "#e5e7eb" }}>No Local Providers Detected</h2>
          <p style={{ maxWidth: "400px", margin: "0 auto" }}>No local AI model servers (Ollama, LM Studio, etc) are currently configured in the OmniRoute provider registry.</p>
          <p style={{ marginTop: "16px", fontSize: "13px" }}>Configure a local provider connection in Providers to see it here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
          {providers.map((p, i) => (
            <div key={i} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb" }}>{p.displayName || p.providerId}</h3>
                <span style={{
                  background: p.status === "CONNECTED" || p.status === "HEALTHY" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: p.status === "CONNECTED" || p.status === "HEALTHY" ? "#10b981" : "#ef4444",
                  padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600"
                }}>
                  {p.status || "UNKNOWN"}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#9ca3af", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Provider ID</span>
                  <span style={{ color: "#e5e7eb", fontFamily: "monospace" }}>{p.providerId}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Models</span>
                  <span style={{ color: "#e5e7eb" }}>{p.modelCount || "UNKNOWN"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Auth</span>
                  <span style={{ color: "#e5e7eb" }}>{p.authType || "None"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
