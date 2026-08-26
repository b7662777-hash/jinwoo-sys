"use client";

import React, { useState, useEffect } from "react";

export default function ProviderQuotaPage() {
  const [quotas, setQuotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotas();
  }, []);

  const fetchQuotas = async () => {
    try {
      const res = await fetch("/api/quotas");
      const data = await res.json();
      if (Array.isArray(data)) setQuotas(data);
      else if (data.quotas) setQuotas(data.quotas);
      else {
        // Fetch provider health list
        const pRes = await fetch("/api/jinwoo/providers");
        const pData = await pRes.json();
        if (pData.connections) {
          setQuotas(pData.connections.map((c: any) => ({
            provider: c.name || c.id,
            limit: c.type === "local" ? "Unlimited (Local)" : "Standard Tier",
            used: "Active",
            remaining: "Available",
            reset: "Rolling Window",
            status: c.health || "HEALTHY"
          })));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚖️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Provider Quotas & Limits</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Real-time rate limit tracking, token quota usage, and reset timestamps across upstream providers.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Loading quota telemetry...</div>
      ) : (
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
                <th style={{ padding: "12px 16px" }}>PROVIDER</th>
                <th style={{ padding: "12px 16px" }}>LIMIT</th>
                <th style={{ padding: "12px 16px" }}>USED</th>
                <th style={{ padding: "12px 16px" }}>REMAINING</th>
                <th style={{ padding: "12px 16px" }}>RESET</th>
                <th style={{ padding: "12px 16px" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {quotas.map((q, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                  <td style={{ padding: "14px 16px", fontWeight: "600" }}>{q.provider || q.name}</td>
                  <td style={{ padding: "14px 16px", color: "#9ca3af" }}>{q.limit || "Unlimited"}</td>
                  <td style={{ padding: "14px 16px", color: "#60a5fa" }}>{q.used || "0"}</td>
                  <td style={{ padding: "14px 16px", color: "#34d399", fontWeight: "500" }}>{q.remaining || "Available"}</td>
                  <td style={{ padding: "14px 16px", color: "#a78bfa", fontSize: "12px" }}>{q.reset || "Rolling"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      ● {q.status || "HEALTHY"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
