"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function OmniProxyProvidersPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/jinwoo/providers");
      const data = await res.json();
      if (data.connections) {
        setConnections(data.connections);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔌</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>OmniProxy Providers</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Upstream AI model provider connections routed through the local OmniProxy gateway.
          </p>
        </div>

        <Link
          href="/jinwoo/providers"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none"
          }}
        >
          Configure All Providers →
        </Link>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Loading provider topology...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {connections.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: "#0D111C",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{c.name || c.id}</strong>
                <span style={{
                  backgroundColor: c.health === "HEALTHY" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: c.health === "HEALTHY" ? "#34d399" : "#f87171",
                  border: `1px solid ${c.health === "HEALTHY" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "600"
                }}>
                  ● {c.health || "ONLINE"}
                </span>
              </div>

              <div style={{ backgroundColor: "#111827", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Type:</span>
                  <span style={{ color: "#a78bfa", textTransform: "capitalize" }}>{c.type || "Cloud LLM"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Models:</span>
                  <span style={{ color: "#60a5fa" }}>{c.modelCount || "Available"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
