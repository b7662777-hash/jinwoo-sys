/**
 * Derive the live WebSocket path from `NEXT_PUBLIC_LIVE_WS_PUBLIC_URL`.
 *
 * Only `ws://` or `wss://` URLs are accepted (mirrors the scheme guard in
 * `getLivePublicUrl()`). The pathname is extracted and used as the WS upgrade
 * path; if the URL has no pathname (or is `/`), falls back to `/live-ws`.
 *
 * Used by:
 * - `src/app/api/v1/ws/route.ts` — handshake response `path` field
 * - `src/hooks/useLiveDashboard.ts` — build-time path constant + runtime discovery
 *
 * No env var is introduced — this reads the existing `NEXT_PUBLIC_LIVE_WS_PUBLIC_URL`.
 */
export function deriveLiveWsPath(publicUrl?: string): string {
  if (!publicUrl) return "/live-ws";
  if (!publicUrl.startsWith("ws://") && !publicUrl.startsWith("wss://")) return "/live-ws";
  try {
    const parsed = new URL(publicUrl);
    const pathname = parsed.pathname;
    return pathname && pathname !== "/" ? pathname : "/live-ws";
  } catch {
    return "/live-ws";
  }
}

/**
 * The operator-declared public WebSocket URL, resolved at RUNTIME.
 *
 * `NEXT_PUBLIC_*` is inlined into the client bundle at BUILD time, so a prebuilt
 * Docker or npm image can never carry an operator's value — which is exactly why
 * the server echoes this in `/api/v1/ws?handshake=1` for the client to discover.
 * Reading only the `NEXT_PUBLIC_`-prefixed name on the server made that echo
 * unreachable too: behind a reverse proxy the dashboard kept dialling
 * `wss://<host>:20132/live-ws` and reported "Live disabled" (#11331).
 *
 * `LIVE_WS_PUBLIC_URL` is the runtime name, alongside the existing runtime
 * `LIVE_WS_HOST` / `LIVE_WS_PORT`. The prefixed name still wins nothing and loses
 * nothing — it stays supported as the fallback so existing deployments that set it
 * (build-time or in the container) keep working.
 */
export function resolveLiveWsPublicUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  const candidates = [env.LIVE_WS_PUBLIC_URL, env.NEXT_PUBLIC_LIVE_WS_PUBLIC_URL];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("ws://") || trimmed.startsWith("wss://")) return trimmed;
  }
  return null;
}

/** Convenience: read the env var at call time and derive the path. */
export function getLiveWsPath(): string {
  return deriveLiveWsPath(resolveLiveWsPublicUrl() ?? undefined);
}

export function sanitizeLiveWsPort(port: unknown): number | null {
  if (typeof port === "number" && !isNaN(port) && port > 0 && port < 65536) return port;
  if (typeof port === "string") {
    const parsed = parseInt(port, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 65536) return parsed;
  }
  return null;
}

export interface ResolveLiveWsUrlOptions {
  explicit?: string | null;
  handshakeUrl?: string | null;
  handshakePort?: number | null;
  handshakePath?: string | null;
  defaultUrl: string;
}

export function resolveLiveWsUrl({
  explicit,
  handshakeUrl,
  handshakePort,
  handshakePath,
  defaultUrl,
}: ResolveLiveWsUrlOptions): string {
  if (explicit) return explicit;
  if (handshakeUrl) return handshakeUrl;
  
  let url = defaultUrl;
  if (handshakePort !== null || handshakePath) {
    try {
      const parsed = new URL(defaultUrl);
      if (handshakePort !== null && handshakePort !== undefined) {
        parsed.port = handshakePort.toString();
      }
      if (handshakePath) {
        parsed.pathname = handshakePath;
      }
      url = parsed.toString();
    } catch {
      // Fallback to defaultUrl
    }
  }
  return url;
}
