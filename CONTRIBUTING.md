# Contributing to Jinwoo Sys

Thank you for your interest in contributing to **Jinwoo Sys**! We welcome contributions from the community to improve multi-agent orchestration, coding agent adapters, and AI workflow coordination.

---

## 1. Code of Conduct

Please treat all contributors, maintainers, and community members with respect, patience, and empathy.

---

## 2. Development Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/jinwoo-sys.git
   cd jinwoo-sys
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Servers**:
   ```bash
   # Terminal 1: Start Python Worker Daemon (Port 20129)
   python runtimes/jinwoo_worker_server.py

   # Terminal 2: Start Jinwoo OS & AI Gateway (Port 20128)
   npm run dev -- -p 20128
   ```

---

## 3. Pull Request Guidelines

- **Focus**: Keep PRs focused on a single feature, bugfix, or improvement.
- **Testing**: Add or update automated tests in `tests/unit/jinwoo/` for any new messaging, workflow, or adapter behavior.
- **Verification**: Run the full verification test suite before opening a PR:
  ```bash
  node scratch/run_all_bus_tests.js
  ```
- **Documentation**: Update relevant guides in `docs/` if modifying user-facing workflows, API routes, or environment configurations.

---

## 4. Code Standards

- **TypeScript**: Strict types where possible, clean async/await patterns.
- **Workspace Security**: Always enforce `WorkspaceGuard.assertInsideWorkspace()` on any filesystem operations.
- **Message Bus Hygiene**: Ensure all inter-agent messages conform to `CanonicalAgentMessage` with correlated lifecycle states.
