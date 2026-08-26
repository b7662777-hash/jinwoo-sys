"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function JinwooBreadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname.startsWith("/jinwoo")) return null;

  const segments = pathname.split("/").filter(Boolean);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "12px", marginBottom: "16px" }}>
      <Link href="/jinwoo" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: "500" }}>Jinwoo Sys</Link>
      
      {segments.length > 1 && (
        <>
          <span style={{ color: "#4b5563" }}>/</span>
          {segments.slice(1).map((segment, idx) => {
            const isLast = idx === segments.length - 2;
            const text = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            const href = "/" + segments.slice(0, idx + 2).join("/");
            
            return (
              <React.Fragment key={href}>
                {isLast ? (
                  <span style={{ color: "#f3f4f6", fontWeight: "600" }}>{text}</span>
                ) : (
                  <>
                    <Link href={href} style={{ color: "#9ca3af", textDecoration: "none" }}>{text}</Link>
                    <span style={{ color: "#4b5563" }}>/</span>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
}
