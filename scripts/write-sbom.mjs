#!/usr/bin/env node
/**
 * Deterministic CycloneDX 1.5 SBOM from package-lock.json for release-bind.
 * Publish-quality CycloneDX remains `npm run sbom` (cyclonedx-npm).
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const components = [];
for (const [path, meta] of Object.entries(lock.packages || {})) {
  if (!path) continue;
  const name = meta.name || path.replace(/^node_modules\//, "").replace(/\/node_modules\//g, "/");
  if (!meta.version || !name) continue;
  const npmName = name.startsWith("@") ? name : name;
  components.push({
    type: "library",
    name: npmName,
    version: meta.version,
    purl: `pkg:npm/${npmName.replace("/", "%2F")}@${meta.version}`,
  });
}

const bom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  version: 1,
  metadata: {
    timestamp: "1970-01-01T00:00:00.000Z",
    component: {
      type: "library",
      name: pkg.name,
      version: pkg.version,
    },
    tools: [{ name: "scripts/write-sbom.mjs", vendor: "CyberSkill" }],
  },
  components,
};

const out = join(root, "_audit/ci/bom.cdx.json");
mkdirSync(dirname(out), { recursive: true });
const body = `${JSON.stringify(bom, null, 2)}\n`;
writeFileSync(out, body);
const sha256 = createHash("sha256").update(body).digest("hex");
const isMain = process.argv[1] && /write-sbom\.mjs$/.test(process.argv[1]);
if (isMain) {
  console.log("PASS write-sbom", { components: components.length, sha256: sha256.slice(0, 12) });
}
export { out, sha256, bom };
