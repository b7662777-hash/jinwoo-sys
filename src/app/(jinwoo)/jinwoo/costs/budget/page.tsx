"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CostsBudgetPage() {
  const [monthlyBudget, setMonthlyBudget] = useState("50.00");
  const [spent, setSpent] = useState("4.28");
  const [autoKillOnExceed, setAutoKillOnExceed] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>💵</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Budget & Hard Caps</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Set hard spending caps, automatic workflow pause thresholds, and cost alerts.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/costs"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
          >
            ← Cost Overview
          </Link>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            style={{ backgroundColor: saved ? "#10b981" : "#2563eb", color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            {saved ? "✓ Saved" : "Save Budget"}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>MONTHLY BUDGET CAP ($ USD)</label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              style={{ width: "100%", backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>CURRENT MONTH SPEND</label>
            <div style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#34d399", padding: "8px 12px", borderRadius: "6px", fontSize: "14px", fontWeight: "bold" }}>
              ${spent} USD ({(Number(spent) / Number(monthlyBudget) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>Auto-Pause Workflows on Budget Limit</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Immediately halts coding agent tasks if monthly cap is reached.</span>
          </div>
          <input
            type="checkbox"
            checked={autoKillOnExceed}
            onChange={(e) => setAutoKillOnExceed(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
