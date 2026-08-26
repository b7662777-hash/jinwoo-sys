"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ConductorToolPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🎼</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Agent Conductor</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Real-time execution pipeline monitor coordinating multi-agent handoffs, dependencies, and synchronization locks.
          </p>
        </div>

        <Link
          href="/jinwoo/runs/current"
          style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
        >
          View Live Run →
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", color: "#f3f4f6", marginBottom: "12px" }}>Conductor Orchestration Status</h3>
        <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.5" }}>
          The Agent Conductor enforces directed acyclic graph (DAG) step ordering, guarantees zero simultaneous write collisions on locked workspace files, and marshals inter-agent protocol messages.
        </p>
      </div>
    </div>
  );
}
