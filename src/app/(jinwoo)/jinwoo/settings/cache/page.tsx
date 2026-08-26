"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CacheSettingsPage() {
  const [cleared, setCleared] = useState(false);

  const handleClearCache = () => {
    localStorage.removeItem("jinwoo_cached_models");
    localStorage.removeItem("jinwoo_cached_providers");
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚡</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Cache Management</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Manage in-memory catalog cache, prompt prefix indices, and local storage state.
          </p>
        </div>

        <Link
          href="/jinwoo/settings"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Settings
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>Clear Local Model & Provider Catalog Cache</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Forces immediate refresh of provider metadata and model IDs from upstream gateway.</span>
          </div>
          <button
            onClick={handleClearCache}
            style={{
              backgroundColor: cleared ? "#10b981" : "#1f2937",
              border: "1px solid #374151",
              color: cleared ? "white" : "#f87171",
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {cleared ? "✓ Cache Cleared" : "Clear Cache"}
          </button>
        </div>
      </div>
    </div>
  );
}
