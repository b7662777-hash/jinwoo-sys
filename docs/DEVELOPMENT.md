# 👨‍💻 Developer Guide — Extending Jinwoo Sys

This guide explains how to add new workforce roles, build custom coding agent adapters, and write automated tests for **Jinwoo Sys**.

---

## 1. Adding a New Workforce Role

1. Define role metadata in `src/components/jinwoo/OpenCodeRoleLaunchModal.tsx`:
   ```typescript
   {
     id: "SECURITY_AUDITOR",
     name: "Security Auditor",
     description: "Audits workspace dependencies and sanitizes secrets.",
     icon: "🛡️",
     recommendedCapabilities: ["Vulnerability scans", "Token masking"],
     recommendedModel: "antigravity/claude-sonnet-4-6",
     provider: "Antigravity"
   }
   ```
2. Register the role in `src/lib/jinwoo/roles/defaults.ts`.

---

## 2. Implementing a Custom Coding Agent Adapter

1. Create a class implementing `CodingAgentAdapter` in `src/lib/jinwoo/coding-agents/adapters/`:
   ```typescript
   import { CodingAgentAdapter, CodingAgentCapabilities } from "../types";

   export class CustomAgentAdapter implements CodingAgentAdapter {
     id = "custom-agent";
     name = "Custom Agent";

     async detectInstallation() {
       return { status: "READY", version: "v1.0" };
     }

     getCapabilities(): CodingAgentCapabilities {
       return { supportsWorkspace: true, supportsTerminal: true, ... };
     }

     async startSession(...) { ... }
     async stopSession(...) { ... }
   }
   ```
2. Register it in `CodingAgentRegistry.ts`:
   ```typescript
   this.register(new CustomAgentAdapter());
   ```

---

## 3. Running Automated Tests

```bash
# Run full Multi-Agent Bus and OpenCode verification suite
node scratch/run_all_bus_tests.js

# Run fast check on all 104 Jinwoo routes
node scratch/fast_test_routes.js
```
