import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The Docker publish workflow builds on GitHub-hosted runners (ubuntu-24.04 and
// ubuntu-24.04-arm): 4 vCPU, 16 GB RAM. Every Next page-data worker is its own
// process and inherits NODE_OPTIONS, so the V8 ceiling is per PROCESS: the
// build's worst case is roughly `workers × OMNIROUTE_BUILD_MEMORY_MB`.
//
// With 7 workers × 6144 MB the runner ran out and buildkit failed the step with
// `ResourceExhausted: ... cannot allocate memory`, right after "Collecting page
// data using 7 workers" — every Docker publish since 2026-08-22 23:14 UTC.
//
// This pins the budget so raising either knob has to be a deliberate change
// that re-does the arithmetic, not a one-line bump that silently reds the
// publish pipeline again.

const RUNNER_MEMORY_MB = 16 * 1024;
// Leave room for buildkit, the snapshotter and page cache.
const HEADROOM_FRACTION = 0.75;
// Planning figure for one page-data worker's peak RSS. It is an INFERENCE, not
// a measurement: 7 workers did not fit in 16 GB alongside the parent, which
// puts the per-worker peak somewhere north of ~1.8 GB. 2.5 GB is that bound
// rounded up, so the budget below stays conservative. If a future build OOMs
// again with a worker count this test accepts, raise this number — do not
// weaken the budget.
const WORKER_PEAK_MB = 2560;

const dockerfile = readFileSync(
  fileURLToPath(new URL("../../Dockerfile", import.meta.url)),
  "utf8"
);

function readArgDefault(name: string): number {
  const match = dockerfile.match(new RegExp(`^ARG ${name}=(\\d+)$`, "m"));
  assert.ok(match, `Dockerfile no longer declares ARG ${name}`);
  return Number(match![1]);
}

test("the Docker build's worker pool is derived from OMNIROUTE_BUILD_WORKERS", () => {
  // assert.ok(boolean), not assert.match — a failing assert.match dumps the
  // whole Dockerfile into the report.
  assert.ok(
    /^ENV CIRCLE_NODE_TOTAL=\$\{OMNIROUTE_BUILD_WORKERS\}$/m.test(dockerfile),
    "CIRCLE_NODE_TOTAL must stay wired to the build arg so a big builder can raise it"
  );
  assert.ok(
    /^ENV NODE_OPTIONS="--max-old-space-size=\$\{OMNIROUTE_BUILD_MEMORY_MB\}"$/m.test(dockerfile),
    "the build heap ceiling must stay wired to OMNIROUTE_BUILD_MEMORY_MB"
  );
});

test("worker count × per-process heap fits a 16 GB GitHub runner", () => {
  const workerPool = readArgDefault("OMNIROUTE_BUILD_WORKERS");
  const heapMb = readArgDefault("OMNIROUTE_BUILD_MEMORY_MB");

  // Next derives `workers = CIRCLE_NODE_TOTAL - 1`.
  const workers = workerPool - 1;
  assert.ok(workers >= 1, `CIRCLE_NODE_TOTAL=${workerPool} leaves no build workers`);

  // The parent `next build` process is the one that genuinely needs the raised
  // ceiling (the webpack/turbopack production pass, #4076); the workers are
  // budgeted at their inferred peak instead.
  const worstCaseMb = heapMb + workers * WORKER_PEAK_MB;
  const budgetMb = RUNNER_MEMORY_MB * HEADROOM_FRACTION;
  assert.ok(
    worstCaseMb <= budgetMb,
    `parent ${heapMb} MB + ${workers} workers × ${WORKER_PEAK_MB} MB = ${worstCaseMb} MB ` +
      `exceeds the ${budgetMb} MB budget on a ${RUNNER_MEMORY_MB} MB runner — the Docker ` +
      `publish step dies with "ResourceExhausted: cannot allocate memory" during page-data ` +
      `collection`
  );
});

test("the worker pool does not oversubscribe the runner's 4 vCPU", () => {
  const workers = readArgDefault("OMNIROUTE_BUILD_WORKERS") - 1;
  assert.ok(workers <= 4, `${workers} workers oversubscribe a 4 vCPU runner`);
});
