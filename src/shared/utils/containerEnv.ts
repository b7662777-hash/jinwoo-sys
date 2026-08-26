import fs from "node:fs";

/**
 * Container awareness for CLI-tool config writes.
 *
 * OmniRoute frequently runs as a container while the AI CLIs it configures
 * (Codex, Claude Code, Cursor, ...) live on the operator's host. Writing
 * `~/.codex/...` inside the container "succeeds" and then silently disappears
 * with the container, so every auto-config write path consults this module
 * before touching disk.
 *
 * A bind mount is treated as the operator's explicit statement that a path
 * reaches the host, which is what makes the compose `host` profile safe.
 */

export interface ContainerEnvDeps {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: string) => string;
  env: NodeJS.ProcessEnv;
}

const defaultDeps = (): ContainerEnvDeps => ({
  existsSync: fs.existsSync,
  readFileSync: (path, encoding) => fs.readFileSync(path, encoding as BufferEncoding) as string,
  env: process.env,
});

/** cgroup substrings emitted by the common container runtimes. */
const CGROUP_MARKERS = ["docker", "containerd", "kubepods", "podman", "lxc"];

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "off"]);

/**
 * Best-effort container detection. Superset of the Zed-specific
 * `isRunningInDocker()` (kept separate so its callers keep their behavior).
 *
 * `OMNIROUTE_CONTAINER` forces the answer either way — needed for tests and for
 * operators on exotic runtimes we fail to recognise.
 */
export function isRunningInContainer(deps: ContainerEnvDeps = defaultDeps()): boolean {
  const override = String(deps.env?.OMNIROUTE_CONTAINER ?? "")
    .trim()
    .toLowerCase();
  if (TRUE_VALUES.has(override)) return true;
  if (FALSE_VALUES.has(override)) return false;

  for (const marker of ["/.dockerenv", "/run/.containerenv"]) {
    try {
      if (deps.existsSync(marker)) return true;
    } catch {
      // not Linux, or permission denied — fall through to the next probe
    }
  }

  if (deps.env?.KUBERNETES_SERVICE_HOST) return true;

  try {
    const cgroup = deps.readFileSync("/proc/1/cgroup", "utf8");
    if (CGROUP_MARKERS.some((marker) => cgroup.includes(marker))) return true;
  } catch {
    // /proc not mounted
  }

  return false;
}

/** mountinfo escapes these four characters as octal sequences. */
function decodeMountPath(raw: string): string {
  return raw
    .replace(/\\040/g, " ")
    .replace(/\\011/g, "\t")
    .replace(/\\012/g, "\n")
    .replace(/\\134/g, "\\");
}

/** Strip a trailing slash so "/host-home/" and "/host-home" compare equal. */
function stripTrailingSlash(p: string): string {
  return p.length > 1 && p.endsWith("/") ? p.replace(/\/+$/, "") : p;
}

/**
 * True when `targetPath` is connected to a mount, in any of three ways:
 *
 *   1. the path IS a mount point            (`-v ~/.codex:/host-home/.codex`)
 *   2. the path sits INSIDE a mount point   (`/host-home/.codex/profiles`)
 *   3. a mount point sits BENEATH the path  (`/host-home`, whose children are
 *      the actual mounts — this is exactly how the compose `host` profile is
 *      wired, so case 3 is not optional)
 *
 * Returns false whenever `/proc/self/mountinfo` is unavailable, which keeps
 * host machines (macOS, Windows) on the conservative path.
 */
export function hasBindMountAt(
  targetPath: string,
  deps: ContainerEnvDeps = defaultDeps()
): boolean {
  const target = stripTrailingSlash(String(targetPath || "").trim());
  if (!target || !target.startsWith("/") || target === "/") return false;

  let content: string;
  try {
    content = deps.readFileSync("/proc/self/mountinfo", "utf8");
  } catch {
    return false;
  }

  for (const line of content.split("\n")) {
    // mountinfo field 5 (1-indexed) is the mount point.
    const fields = line.split(" ");
    if (fields.length < 5) continue;
    const mountPoint = stripTrailingSlash(decodeMountPath(fields[4] || ""));
    if (!mountPoint || mountPoint === "/") continue;

    if (mountPoint === target) return true;
    if (mountPoint.startsWith(`${target}/`)) return true;
    if (target.startsWith(`${mountPoint}/`)) return true;
  }

  return false;
}

export interface ContainerTargetInfo {
  inContainer: boolean;
  bindMounted: boolean;
  /** Writing here would be lost when the container is recreated. */
  ephemeral: boolean;
}

/**
 * Classify a would-be config write target. `ephemeral` is the signal callers
 * act on: refuse the write and point the operator at the host CLI instead.
 */
export function describeContainerTarget(
  targetPath: string,
  deps: ContainerEnvDeps = defaultDeps()
): ContainerTargetInfo {
  const inContainer = isRunningInContainer(deps);
  if (!inContainer) {
    return { inContainer: false, bindMounted: false, ephemeral: false };
  }
  const bindMounted = hasBindMountAt(targetPath, deps);
  return { inContainer: true, bindMounted, ephemeral: !bindMounted };
}
