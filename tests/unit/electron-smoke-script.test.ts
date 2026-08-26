import assert from "node:assert/strict";
import test from "node:test";

import {
  assertNativeDriverSelected,
  buildSmokeEnv,
  FATAL_LOG_PATTERNS,
  LINUX_EXECUTABLE_NAMES,
  stopApp,
} from "../../scripts/dev/smoke-electron-packaged.mjs";

test("electron smoke discovers the default Linux executable name", () => {
  assert.ok(LINUX_EXECUTABLE_NAMES.includes("omniroute-desktop"));
});

test("electron smoke env allowlists runtime variables and drops secrets", () => {
  const env = buildSmokeEnv({
    currentPlatform: "linux",
    dataDir: "/tmp/omniroute-electron-smoke-test",
    parentEnv: {
      DISPLAY: ":99",
      GITHUB_TOKEN: "should-not-leak",
      PATH: "/usr/bin",
      SNYK_TOKEN: "should-not-leak",
    },
  });

  assert.equal(env.DATA_DIR, "/tmp/omniroute-electron-smoke-test");
  assert.equal(env.DISPLAY, ":99");
  assert.equal(env.PATH, "/usr/bin");
  assert.equal(env.HOME, "/tmp/omniroute-electron-smoke-test/home");
  assert.equal(env.XDG_CONFIG_HOME, "/tmp/omniroute-electron-smoke-test/config");
  assert.equal(env.ELECTRON_ENABLE_LOGGING, "1");
  assert.equal(env.ELECTRON_ENABLE_STACK_DUMPING, "1");
  assert.equal(env.GITHUB_TOKEN, undefined);
  assert.equal(env.SNYK_TOKEN, undefined);
});

test("electron smoke treats Electron process errors as fatal startup logs", () => {
  const logs = [
    "[Electron] Unhandled Rejection: Error: startup failed",
    "[Electron] Uncaught Exception: Error: startup failed",
  ];

  for (const log of logs) {
    assert.ok(
      FATAL_LOG_PATTERNS.some((pattern) => pattern.test(log)),
      `${log} should match a fatal log pattern`
    );
  }
});

test("electron smoke force-terminates the Windows process tree before the parent can exit", async () => {
  const signals: string[] = [];
  const waits: number[] = [];
  const child = {
    pid: 4242,
    exitCode: 0,
    signalCode: null,
  };

  await stopApp(child, {
    currentPlatform: "win32",
    signalProcessTreeFn: async (_child, signal) => {
      signals.push(signal);
    },
    waitForProcessTreeExitFn: async (_child, timeoutMs) => {
      waits.push(timeoutMs);
    },
  });

  assert.deepEqual(signals, ["SIGKILL"]);
  assert.deepEqual(waits, [2_000]);
});

// #7592: on a cold restart against an already-persisted DATA_DIR, a stale-ABI
// better-sqlite3 binary used to fail to load and silently fall through to the
// sql.js (WASM) driver. These are the regression guards for that assertion.
test("electron smoke accepts every native SQLite driver on the startup log", () => {
  for (const driver of ["bun:sqlite", "better-sqlite3", "node:sqlite"]) {
    assert.doesNotThrow(() =>
      assertNativeDriverSelected(`[electron] [DB] Driver: ${driver} | file: /data/storage.sqlite`)
    );
  }
});

test("electron smoke flags a cold-restart fallback to the sql.js WASM driver", () => {
  assert.throws(
    () => assertNativeDriverSelected("[electron] [DB] Driver: sql.js | file: /data/storage.sqlite"),
    /fell back to the sql\.js \(WASM\) driver/
  );
});

test("electron smoke flags startup logs missing any driver selection line", () => {
  assert.throws(
    () => assertNativeDriverSelected("[electron] [server] listening on 20128"),
    /no '\[DB\] Driver: \.\.\.' line/
  );
});
