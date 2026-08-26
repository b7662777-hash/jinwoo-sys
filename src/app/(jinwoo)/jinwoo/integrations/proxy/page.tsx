"use client";

import React from "react";

export default function IntegrationsProxyPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🛡️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Proxy Configuration</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            HTTP/HTTPS upstream corporate proxy, SOCKS5 tunnel, and TLS inspection settings.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>Local Loopback Proxy Mode</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Bound to 127.0.0.1:20128 with direct socket multiplexing.</span>
          </div>
          <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>● ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
