import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { pruneElectronRuntimeDocs } from "../../scripts/build/electronRuntimeDocs.mjs";

const ROOT = join(import.meta.dirname, "..", "..");

test("electron build copies the standalone runtime into resources/app exactly once", () => {
  const electronPackage = JSON.parse(readFileSync(join(ROOT, "electron", "package.json"), "utf8"));

  const extraResources = electronPackage.build?.extraResources;
  assert.ok(Array.isArray(extraResources), "electron build.extraResources must be an array");

  const appResources = extraResources.filter(
    (resource) => resource?.to === "app" || resource?.to?.startsWith("app/")
  );

  assert.deepEqual(appResources, [
    {
      from: "../.build/electron-standalone",
      to: "app",
      filter: ["**/*"],
    },
  ]);
});

test("electron standalone assembly normalizes Turbopack hashed external imports", () => {
  const prepareScript = readFileSync(
    join(ROOT, "scripts", "build", "prepare-electron-standalone.mjs"),
    "utf8"
  );

  assert.match(
    prepareScript,
    /assembleStandalone\(\{[\s\S]*?patchTurbopackChunks:\s*true,[\s\S]*?\}\);/,
    "Electron packages must strip Turbopack's hashed external package names before bundling"
  );
});

test("electron docs manifest prunes authoring payloads without removing runtime docs", () => {
  const bundleRoot = mkdtempSync(join(tmpdir(), "omniroute-electron-docs-"));
  const files = new Map([
    ["docs/openapi.yaml", "openapi: 3.1.0"],
    ["docs/guides/CODEX-CLI-CONFIGURATION.md", "# Codex CLI"],
    ["docs/i18n/ko/docs/guides/ELECTRON_GUIDE.md", "# Electron"],
    ["docs/i18n/ko/CHANGELOG.md", "translated release history"],
    ["docs/i18n/fr/CHANGELOG.md", "historique traduit"],
    ["docs/research/desktop-notes.md", "authoring notes"],
    ["docs/superpowers/plans/desktop-plan.md", "implementation plan"],
  ]);

  try {
    for (const [relativePath, content] of files) {
      const absolutePath = join(bundleRoot, relativePath);
      mkdirSync(join(absolutePath, ".."), { recursive: true });
      writeFileSync(absolutePath, content);
    }

    const result = pruneElectronRuntimeDocs(bundleRoot);

    assert.deepEqual(result.removedPaths, [
      "docs/i18n/fr/CHANGELOG.md",
      "docs/i18n/ko/CHANGELOG.md",
      "docs/research",
      "docs/superpowers",
    ]);
    assert.equal(result.removedFiles, 4);
    assert.equal(
      result.removedBytes,
      Buffer.byteLength("translated release history") +
        Buffer.byteLength("historique traduit") +
        Buffer.byteLength("authoring notes") +
        Buffer.byteLength("implementation plan")
    );

    assert.equal(existsSync(join(bundleRoot, "docs/openapi.yaml")), true);
    assert.equal(existsSync(join(bundleRoot, "docs/guides/CODEX-CLI-CONFIGURATION.md")), true);
    assert.equal(existsSync(join(bundleRoot, "docs/i18n/ko/docs/guides/ELECTRON_GUIDE.md")), true);
    assert.equal(existsSync(join(bundleRoot, "docs/i18n/ko/CHANGELOG.md")), false);
    assert.equal(existsSync(join(bundleRoot, "docs/research")), false);
    assert.equal(existsSync(join(bundleRoot, "docs/superpowers")), false);

    assert.deepEqual(pruneElectronRuntimeDocs(bundleRoot), {
      removedFiles: 0,
      removedBytes: 0,
      removedPaths: [],
    });
  } finally {
    rmSync(bundleRoot, { recursive: true, force: true });
  }
});

test("electron bundle preparation applies the runtime docs manifest to its staging tree", () => {
  const prepareScript = readFileSync(
    join(ROOT, "scripts", "build", "prepare-electron-standalone.mjs"),
    "utf8"
  );

  assert.match(
    prepareScript,
    /pruneElectronRuntimeDocs\(ELECTRON_STANDALONE_DIR\)/,
    "Electron staging must prune authoring docs before electron-builder copies the bundle"
  );
});
