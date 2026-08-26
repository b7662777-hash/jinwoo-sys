import React from "react";
import { JinwooAppShell } from "@/components/jinwoo/JinwooAppShell";
import { JinwooWorkspaceProvider } from "./jinwoo/context";

export const metadata = { title: "Jinwoo Sys - Local-First Multi-AI Workspace" };

export default function JinwooRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <JinwooWorkspaceProvider>
      <JinwooAppShell>
        {children}
      </JinwooAppShell>
    </JinwooWorkspaceProvider>
  );
}
