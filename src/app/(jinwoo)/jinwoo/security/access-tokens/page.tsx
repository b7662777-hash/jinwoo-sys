"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AccessTokensSecurityPage() {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/keys");
        const data = await res.json();
        if (Array.isArray(data)) setTokens(data);
        else if (data.keys) setTokens(data.keys);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔑</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Security Access Tokens</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Authorized client tokens with scoped permissions for external tool access.
          </p>
        </div>

        <Link
          href="/jinwoo/omniproxy/api-keys"
          style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
        >
          Manage & Create Keys →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {tokens.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6b7280", backgroundColor: "#0D111C", borderRadius: "12px", border: "1px solid #1f2937" }}>
            No access tokens currently issued.
          </div>
        ) : (
          tokens.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: "#0D111C",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>{t.name || "Access Token"}</strong>
                <span style={{ color: "#6b7280", fontSize: "12px", fontFamily: "monospace" }}>{t.key ? `${t.key.substring(0, 10)}...` : t.id}</span>
              </div>
              <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>
                ● VALID
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
