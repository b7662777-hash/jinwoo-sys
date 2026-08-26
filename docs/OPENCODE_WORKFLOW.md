# 💻 OpenCode Role Worker Guide

This guide details how **OpenCode** (CLI `v1.18.18`) operates as a first-class worker within the Jinwoo Sys multi-agent workforce.

---

## 1. The OpenCode Role Worker Lifecycle

```
                      USER / JINWOO SYS
                              │
                  Assign OpenCode Role Modal
               (Pick Role, Model, Workspace)
                              │
                    OpenCodeAdapter.launch()
               (Generates opencode.json & Role Doc)
                              │
                   Interactive Terminal Window
                  (Window: "OpenCode [DEVELOPER]")
                              │
              MULTI-AGENT COMMUNICATION BUS
                              │
      ┌───────────────────────┼───────────────────────┐
      │                       │                       │
Incoming Handoff       File Modifications       Outgoing Review
(From Architect)      (Under WorkspaceGuard)       (To QA Agent)
```

---

## 2. Step-by-Step Execution

### Step 1: Assigning a Role
1. Navigate to `/jinwoo/coding-agents` or `/jinwoo/coding-agents/opencode`.
2. Click **⚡ Assign Role & Launch OpenCode**.
3. Select your target role (e.g. `DEVELOPER`, `FRONTEND_DEVELOPER`, `QA`).
4. Select the target workspace directory.
5. Click **Launch OpenCode as [Role]**.

### Step 2: Automatic Workspace Configuration
Jinwoo Sys automatically generates:
1. `opencode.json`:
   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "antigravity": {
         "npm": "@ai-sdk/openai",
         "name": "OmniRoute Gateway",
         "options": {
           "baseURL": "http://127.0.0.1:20128/api/v1",
           "apiKey": "jinwoo-local-gateway"
         }
       }
     },
     "model": "antigravity/claude-sonnet-4-6"
   }
   ```
2. `.opencode_role_context.md`:
   Contains role responsibilities, agent identifier, gateway endpoints, and instructions to communicate with Jinwoo Sys.

### Step 3: Real Inter-Role Handoffs
- OpenCode receives incoming tasks across `/api/jinwoo/communication/send`.
- Status updates automatically in the Communication Bus as `DELIVERED` and `ACKNOWLEDGED`.
- Upon completing work, OpenCode sends a `REVIEW_REQUEST` to QA with file attachments.
