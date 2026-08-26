# 🌟 Open-Source Credits & Attributions

**Jinwoo Sys** stands on the shoulders of remarkable open-source projects, autonomous agent runtimes, and AI infrastructure technologies. We gratefully acknowledge and credit the following upstream projects and maintainers:

---

## 1. OmniRoute
- **Project**: [OmniRoute](https://github.com/omniroute/omniroute)
- **Role in Jinwoo Sys**: Local AI gateway, multi-provider HTTP streaming engine, provider circuit breakers, and rate-limiting infrastructure.
- **Integration**: Jinwoo Sys orchestrates workforce roles above OmniRoute's `/v1` endpoint, utilizing its model catalog and connection pools for upstream model routing.
- **License**: See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) and upstream repository for full terms.

---

## 2. Hermes Agent
- **Project**: Hermes Autonomous Agent Runtime
- **Role in Jinwoo Sys**: Python-based worker daemon for task execution, file tool automation, and architectural planning.
- **Integration**: Connected as a worker runtime on port `20129` communicating via SSE event streams and JSON-RPC dispatch.
- **License**: Open-source license terms preserved in upstream source.

---

## 3. OpenCode
- **Project**: [OpenCode AI](https://github.com/opencode-ai/opencode)
- **Role in Jinwoo Sys**: Terminal-based autonomous coding agent runtime (CLI `v1.18.18`).
- **Integration**: Integrated as a first-class Jinwoo worker role (e.g. `DEVELOPER`) through `OpenCodeAdapter`, dedicated TUI window spawning, injected `.opencode_role_context.md`, and correlated multi-agent messaging.
- **License**: MIT License (or upstream specified terms).

---

## 4. OpenRouter
- **Project**: [OpenRouter](https://openrouter.ai)
- **Role in Jinwoo Sys**: Cloud model aggregation and inference marketplace.
- **Integration**: Supported as an upstream provider within the gateway connection catalog.

---

## 5. Core Ecosystem Dependencies
- **Next.js & React**: Modern full-stack application framework and UI library by Vercel.
- **SQLite & better-sqlite3**: High-performance local-first persistence engine.
- **Tailwind CSS & Lucide Icons**: Responsive styling system and clean iconography.
- **Node.js Test Runner & Vitest**: Native asynchronous test execution framework.

---

## Notice
Attribution in this document does not imply endorsement by the upstream projects or maintainers of Jinwoo Sys. All trademarks, service marks, and logos belong to their respective owners.
