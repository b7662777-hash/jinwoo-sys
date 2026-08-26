# 🌐 OmniRoute Gateway Integration Layer

**OmniRoute** serves as the underlying local AI gateway and proxy engine for **Jinwoo Sys**.

---

## 1. Architectural Separation

- **Jinwoo Sys**: Manages high-level workforce governance, role assignments, DAG scheduling, coding-agent processes, and inter-role communication.
- **OmniRoute**: Manages low-level HTTP upstream connections, provider circuit breakers, token pooling, rate limiting, and fallback combos.

```
                    JINWOO SYS (Port 20128)
                   Orchestration & Workforce
                              │
                    OmniRoute Gateway (/v1)
                   AI Proxy & Provider Pool
                              │
             ┌────────────────┼────────────────┐
             │                │                │
        Anthropic          OpenAI           Google
```

---

## 2. Gateway Endpoints & Routing

- **Primary Chat Completions**: `POST http://127.0.0.1:20128/api/v1/chat/completions`
- **Model Discovery**: `GET http://127.0.0.1:20128/api/v1/models`
- **Provider Discovery**: `GET http://127.0.0.1:20128/api/v1/providers`

---

## 3. Resilience & Fallback

OmniRoute enforces three independent resilience mechanisms:
1. **Provider Circuit Breakers**: Temporarily blocks repeatedly failing providers (e.g. 500, 502, 503) without slowing down user workflows.
2. **Connection Cooldowns**: Skips individual rate-limited keys while allowing other healthy keys for the same provider to serve traffic.
3. **Model Lockouts**: Isolates quota-limited models without disabling an entire connection.
