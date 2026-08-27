# 🚀 Getting Started with Jinwoo Sys

Follow this step-by-step guide to install, configure, launch, and verify **Jinwoo Sys** on your local machine.

---

## 1. System Requirements & Verification

Verify that your workstation meets the following requirements:

| Dependency | Required Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>=22.22.2 <23` or `>=24 <27` | `node -v` | Core Next.js & TypeScript control plane |
| **Python** | `>=3.10` | `python --version` (or `python3`) | Required for the Python worker daemon |
| **Git** | `>=2.30` | `git --version` | Version control & diff generation |
| **OpenCode CLI** *(Optional)* | `v1.18.18+` | `opencode --version` | `npm install -g opencode-ai` |

---

## 2. Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/jinwoo-sys.git
cd jinwoo-sys

# 2. Install Node dependencies
npm install

# 3. Create local configuration file
# On Windows (PowerShell):
Copy-Item .env.example .env
# On Linux / macOS:
cp .env.example .env
```

---

## 3. Starting the Services (Dual-Process Architecture)

Jinwoo Sys runs as two coordinated local services. Open **two separate terminal windows**:

### Terminal 1: Python Worker Daemon (Port 20129)
The Python worker daemon executes background compute, autonomous tool actions, and the Hermes worker runtime:

```bash
python runtimes/jinwoo_worker_server.py
```
*Expected output:*
```text
[Jinwoo Worker Server] Running on http://127.0.0.1:20129
[Jinwoo Worker Server] SQLite state connected.
```

### Terminal 2: Jinwoo Sys Control Plane & AI Gateway (Port 20128)
This boots the Next.js UI, the Multi-Agent Communication Bus SSE stream, and the local OmniRoute proxy:

```bash
npm run dev -- -p 20128
```
*Expected output:*
```text
▲ Next.js 16.x (Turbopack)
- Local:        http://localhost:20128
- Network:      http://127.0.0.1:20128
✓ Ready in 1200ms
```

---

## 4. Local Interfaces Map

Open your browser and navigate to the Jinwoo Sys modules:

| Interface | URL | Purpose |
| :--- | :--- | :--- |
| **Main Dashboard** | [http://127.0.0.1:20128/jinwoo](http://127.0.0.1:20128/jinwoo) | System overview, active workers, quick status metrics |
| **Communication Bus** | [http://127.0.0.1:20128/jinwoo/communication](http://127.0.0.1:20128/jinwoo/communication) | Real-time visual message topology, SSE stream, handoffs |
| **Coding Agents** | [http://127.0.0.1:20128/jinwoo/coding-agents](http://127.0.0.1:20128/jinwoo/coding-agents) | Runtime launcher, capability detection, session monitor |
| **OpenCode Panel** | [http://127.0.0.1:20128/jinwoo/coding-agents/opencode](http://127.0.0.1:20128/jinwoo/coding-agents/opencode) | Dedicated OpenCode worker console & conversation stream |
| **Workforce Roles** | [http://127.0.0.1:20128/jinwoo/workforce](http://127.0.0.1:20128/jinwoo/workforce) | Role headcount and runtime mapping |
| **Active Agents** | [http://127.0.0.1:20128/jinwoo/agents](http://127.0.0.1:20128/jinwoo/agents) | Monitor live worker PIDs, models, and session states |

---

## 5. Running Your First Multi-Agent Task in 3 Minutes

1. **Select a Target Workspace**:
   - In the top navigation bar, click **Select Folder** and choose the directory of the project you want to modify (e.g. `C:\Projects\MyWebApp` or a local sandbox).
2. **Assign a Role & Launch OpenCode**:
   - Go to [**Coding Agents**](http://127.0.0.1:20128/jinwoo/coding-agents).
   - Click **⚡ Assign Role & Launch OpenCode**.
   - Select the `DEVELOPER` role (or `QA`, `SECURITY`).
   - Click **🚀 Launch OpenCode**.
   - An interactive Windows Console window titled `OpenCode [DEVELOPER] - Jinwoo Sys` will open with workspace configuration (`opencode.json`) and role instructions automatically injected.
3. **Dispatch Tasks on the Communication Bus**:
   - Navigate to [**Communication Bus**](http://127.0.0.1:20128/jinwoo/communication).
   - Type a prompt in the message bar (e.g. *"Implement authentication token validation in auth.ts"*).
   - Watch the live SSE timeline: `ARCHITECT` $\rightarrow$ `DEVELOPER` (`HANDOFF`) $\rightarrow$ `QA` (`REVIEW_REQUEST`) $\rightarrow$ `FINAL_RESULT`.

---

## 6. Automated Verification

Run the built-in 9-point verification suite to confirm that your installation, communication bus, and OpenCode adapter are functioning with 100% test pass rate:

```bash
node scratch/run_all_bus_tests.js
```

---

## 7. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `EADDRINUSE: :::20128` | Port 20128 is already in use by another process | Stop previous instance or launch on another port: `npm run dev -- -p 20130` |
| `Messages stuck in QUEUED` | Python worker daemon on port 20129 is not running | Start `python runtimes/jinwoo_worker_server.py` in a separate terminal |
| `OpenCode NOT_INSTALLED` | `opencode` CLI binary is not found in `%PATH%` | Run `npm install -g opencode-ai` and restart Jinwoo |
| `File write BLOCKED` | Another active worker holds an atomic lock on the file | Go to `/jinwoo/changes` or stop conflicting worker session in `/jinwoo/agents` |
