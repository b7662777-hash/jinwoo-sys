"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SidebarSettingsPage() {
  const [resetDone, setResetDone] = useState(false);

  const handleResetSidebar = () => {
    localStorage.removeItem("jinwoo_sidebar_collapsed");
    localStorage.removeItem("jinwoo_sidebar_collapsed_groups");
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📐</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Sidebar Settings</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Navigation layout customization, group expansion preferences, and shortcut keys.
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
            <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>Reset Collapsed Group Memory</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Expands all 14 sidebar navigation categories back to default view.</span>
          </div>
          <button
            onClick={handleResetSidebar}
            style={{
              backgroundColor: resetDone ? "#10b981" : "#1f2937",
              border: "1px solid #374151",
              color: resetDone ? "white" : "#60a5fa",
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {resetDone ? "✓ Reset Complete" : "Reset Groups"}
          </button>
        </div>

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "14px", color: "#9ca3af", fontSize: "12px" }}>
          💡 Tip: Press <kbd style={{ backgroundColor: "#111827", padding: "2px 6px", borderRadius: "4px", border: "1px solid #374151", color: "#f3f4f6" }}>Ctrl + B</kbd> or <kbd style={{ backgroundColor: "#111827", padding: "2px 6px", borderRadius: "4px", border: "1px solid #374151", color: "#f3f4f6" }}>Cmd + B</kbd> anywhere to toggle sidebar collapse!
        </div>
      </div>
    </div>
  );
}
