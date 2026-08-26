# 🚀 Getting Started with Jinwoo Sys

Get started with **Jinwoo Sys** in under 5 minutes.

---

## 1. System Requirements

- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: `v22.0.0` or higher
- **Python**: `3.10` or higher (required for Python worker daemon)
- **Git**: `2.30+`
- **Optional**: OpenCode CLI (`npm install -g opencode-ai`)

---

## 2. Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/jinwoo-sys.git
cd jinwoo-sys

# 2. Install dependencies
npm install

# 3. Create local configuration file
cp .env.example .env
```

---

## 3. Starting the Servers

Jinwoo Sys operates with two local services:

### Terminal 1: Python Worker Daemon (Port 20129)
```bash
python runtimes/jinwoo_worker_server.py
```

### Terminal 2: Jinwoo Sys OS & AI Gateway (Port 20128)
```bash
npm run dev -- -p 20128
```

---

## 4. Your First Workflow in 4 Steps

1. **Open Jinwoo Sys**: Navigate to [http://localhost:20128/jinwoo](http://localhost:20128/jinwoo) in your browser.
2. **Select a Workspace**: Click **Select Folder** in the top-left to point Jinwoo to your target project folder.
3. **Assign a Role Worker**:
   - Go to [**Coding Agents**](http://localhost:20128/jinwoo/coding-agents).
   - Click **⚡ Assign Role & Launch OpenCode**.
   - Select the `DEVELOPER` role and click **Launch**.
4. **Inspect Live Multi-Agent Bus**:
   - Go to [**Communication Bus**](http://localhost:20128/jinwoo/communication).
   - View real-time topology, message exchanges, and file modifications in progress!
