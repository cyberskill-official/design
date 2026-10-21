import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {assertNpmVersion} from './check-npm-version.mjs';
export function reproducibleSbom(input) {
  assert.equal(input?.bomFormat, 'CycloneDX');
  assert.equal(input.specVersion, '1.5');
  assert(Array.isArray(input.components) && Array.isArray(input.dependencies), 'SBOM must contain component and dependency inventories');
  assert(input.metadata?.component && Array.isArray(input.metadata.tools), 'SBOM metadata is required');
  const output = structuredClone(input);
  // These optional identity/time fields are the only npm output normalization.
  delete output.serialNumber;
  delete output.metadata.timestamp;
  return output;
}
export function generateSbom(root, cli) {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const version = spawnSync(process.execPath, [cli, '--version'], {encoding:'utf8'});
  assert.equal(version.status, 0, 'npm CLI unavailable'); assertNpmVersion(pkg, version.stdout);
  const result = spawnSync(process.execPath, [cli, 'sbom', '--package-lock-only', '--sbom-format', 'cyclonedx', '--include=dev', '--include=optional', '--include=peer'], {cwd:root, encoding:'utf8', maxBuffer:32*1024*1024});
  assert(!result.error && !result.signal && result.status === 0, 'npm SBOM failed: ' + (result.error?.message || result.stderr || result.signal));
  return reproducibleSbom(JSON.parse(result.stdout));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.env.npm_execpath, 'Run npm run sbom using the pinned npm CLI');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const output = generateSbom(root, process.env.npm_execpath);
  writeFileSync(resolve(root, 'bom.cdx.json'), JSON.stringify(output,null,2)+'\n');
  console.log('PASS reproducible CycloneDX1.5 SBOM: ' + output.components.length + ' components; npm lockfile inventory');
}
