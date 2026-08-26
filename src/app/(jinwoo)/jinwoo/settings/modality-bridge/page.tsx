"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ModalityBridgeSettingsPage() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🌉</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Modality Bridge</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Multimodal audio transcription, vision OCR, and image payload translation policies.
          </p>
        </div>

        <Link
          href="/jinwoo/settings"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Settings
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>Automatic Vision & Audio Transcoding</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Converts non-standard multimodal requests to OpenAI/Anthropic standard format.</span>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
