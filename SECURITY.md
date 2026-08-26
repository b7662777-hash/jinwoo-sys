# Security Policy

Jinwoo Sys takes the security of autonomous agent orchestration, filesystem operations, and credential storage seriously.

---

## 1. Reporting a Vulnerability

If you discover a potential security vulnerability in Jinwoo Sys, please **do NOT disclose it publicly**.

Please submit your vulnerability report privately via GitHub Security Advisories or by emailing the project maintainers.

Please include:
- A description of the vulnerability.
- Steps to reproduce or a proof of concept.
- Potential impact and affected components.

---

## 2. Core Security Architecture & Guarantees

1. **Filesystem Containment**: All coding agent file operations are validated against `WorkspaceGuard` to prevent directory traversal outside user-selected roots.
2. **Credential Isolation**: API keys, OAuth credentials, and gateway secrets are stored in local encrypted databases and never committed or logged.
3. **Process Isolation**: External coding runtimes (such as OpenCode and Python daemons) are executed with distinct process IDs, tracked in SQLite, and terminated cleanly upon workflow cancellation.
4. **Zero Cloud Leaks**: Jinwoo Sys runs 100% locally on your machine. Telemetry and logs remain in your local storage directory.
