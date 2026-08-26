"use client";

import React, { useState, useEffect } from "react";

export default function OmniProxyEndpointsPage() {
  const [catalog, setCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("ALL");

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      const res = await fetch("/api/endpoint/catalog");
      const data = await res.json();
      setCatalog(data);
    } catch (e) {
      console.error("Failed to load endpoints catalog:", e);
    } finally {
      setLoading(false);
    }
  };

  const endpoints: any[] = catalog?.endpoints || [
    { method: "POST", path: "/v1/chat/completions", summary: "OpenAI-Compatible Chat Completions with Automatic Routing & Streaming", security: true, tags: ["Inference", "Proxy"] },
    { method: "POST", path: "/v1/responses", summary: "OpenAI Responses API with Tool Execution & Reasoning", security: true, tags: ["Inference", "Proxy"] },
    { method: "POST", path: "/v1/embeddings", summary: "Embedding Vector Generation across Providers", security: true, tags: ["Embeddings"] },
    { method: "GET", path: "/v1/models", summary: "List Aggregated Model Catalog from All Configured Providers", security: false, tags: ["Models"] },
    { method: "POST", path: "/v1/images/generations", summary: "Multi-Provider Image Generation API", security: true, tags: ["Media"] },
    { method: "POST", path: "/v1/audio/transcriptions", summary: "Speech-to-Text Audio Transcription", security: true, tags: ["Audio"] },
    { method: "POST", path: "/v1/audio/speech", summary: "Text-to-Speech Audio Synthesis", security: true, tags: ["Audio"] },
    { method: "GET", path: "/api/health", summary: "OmniRoute Gateway Health & Uptime Status", security: false, tags: ["System"] },
    { method: "GET", path: "/api/combos", summary: "List Active Intelligent Fallback Combos", security: true, tags: ["Combos"] },
    { method: "GET", path: "/api/providers", summary: "List All Upstream Provider Connections", security: true, tags: ["Providers"] }
  ];

  const filtered = endpoints.filter((ep) => {
    const matchSearch = ep.path.toLowerCase().includes(search.toLowerCase()) || ep.summary.toLowerCase().includes(search.toLowerCase());
    const matchMethod = filterMethod === "ALL" || ep.method === filterMethod;
    return matchSearch && matchMethod;
  });

  const getMethodBadgeColor = (m: string) => {
    switch (m) {
      case "GET": return { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)" };
      case "POST": return { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" };
      case "PUT": return { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" };
      case "DELETE": return { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "rgba(239, 68, 68, 0.3)" };
      default: return { bg: "rgba(107, 114, 128, 0.15)", color: "#9ca3af", border: "rgba(107, 114, 128, 0.3)" };
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🌐</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>OmniProxy Endpoints</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Local AI Gateway reverse-proxy endpoints supporting OpenAI, Anthropic, Gemini, and Ollama protocols.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0D111C", border: "1px solid #1f2937", padding: "6px 12px", borderRadius: "8px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>Gateway Base:</span>
          <code style={{ fontSize: "12px", color: "#34d399", fontWeight: "600" }}>http://127.0.0.1:20128</code>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search endpoints by path or description..."
          style={{ flex: 1, backgroundColor: "#0D111C", border: "1px solid #1f2937", color: "#f3f4f6", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", outline: "none" }}
        />

        <div style={{ display: "flex", gap: "6px" }}>
          {["ALL", "GET", "POST", "PUT", "DELETE"].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              style={{
                backgroundColor: filterMethod === m ? "#2563eb" : "#0D111C",
                border: `1px solid ${filterMethod === m ? "#3b82f6" : "#1f2937"}`,
                color: filterMethod === m ? "white" : "#9ca3af",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((ep, idx) => {
          const badge = getMethodBadgeColor(ep.method);
          return (
            <div
              key={idx}
              style={{
                backgroundColor: "#0D111C",
                border: "1px solid #1f2937",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, overflow: "hidden" }}>
                <span style={{
                  backgroundColor: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  minWidth: "50px",
                  textAlign: "center"
                }}>
                  {ep.method}
                </span>

                <div style={{ overflow: "hidden" }}>
                  <code style={{ fontSize: "14px", color: "#f3f4f6", fontWeight: "600", display: "block" }}>{ep.path}</code>
                  <span style={{ color: "#9ca3af", fontSize: "12px", display: "block", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ep.summary}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {ep.tags?.map((t: string) => (
                  <span key={t} style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#a78bfa", padding: "2px 8px", borderRadius: "10px", fontSize: "10px" }}>
                    {t}
                  </span>
                ))}
                {ep.security && (
                  <span style={{ color: "#fbbf24", fontSize: "12px" }} title="Requires Bearer Token">🔒</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
