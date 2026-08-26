# ⚙️ Configuration & Environment Variables

This document details runtime configuration, ports, and environment variables supported by **Jinwoo Sys**.

---

## 1. Port Allocation

| Port | Service | Description |
| :--- | :--- | :--- |
| `20128` | **Jinwoo Sys OS & AI Gateway** | Next.js full-stack control plane and OmniRoute local proxy. |
| `20129` | **Python Worker Daemon** | Background execution runtime for Hermes and Python tool tasks. |

---

## 2. Core Environment Variables

```bash
# Gateway Security & Dashboard
JWT_SECRET=your-random-jwt-secret-here
API_KEY_SECRET=your-hex-32-encryption-secret-here
INITIAL_PASSWORD=your-secure-admin-password

# Data Persistence Root
# DATA_DIR=~/.omniroute

# Upstream Provider Keys (Optional: can also be entered via UI)
# ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-proj-...
# OPENROUTER_API_KEY=sk-or-...
```

---

## 3. Local Data Directory Layout

When running, Jinwoo Sys manages local state under `data/`:
- `data/jinwoo_state.sqlite`: Local SQLite state database (WAL journal mode).
- User workspaces and project code remain strictly within the user's selected external folders.
