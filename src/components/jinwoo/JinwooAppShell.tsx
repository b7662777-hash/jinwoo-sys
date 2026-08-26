"use client";

import React from "react";
import { JinwooSidebar } from "./JinwooSidebar";
import { JinwooTopbar } from "./JinwooTopbar";
import { JinwooCommandPalette } from "./JinwooCommandPalette";
import { JinwooBreadcrumbs } from "./JinwooBreadcrumbs";

export function JinwooAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#0b0f19" }}>
      <JinwooSidebar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <JinwooTopbar />
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", backgroundColor: "#0b0f19", position: "relative" }}>
          <div style={{ padding: "16px 24px 0 24px" }}>
             <JinwooBreadcrumbs />
          </div>
          {children}
        </main>
      </div>
      <JinwooCommandPalette />
    </div>
  );
}
