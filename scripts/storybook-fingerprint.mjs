import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { storybookBuildInputs, storybookGeneratedDependencies } from './storybook-inputs.mjs';

export function toolchainIdentity() {
  return { node: process.version, platform: process.platform, arch: process.arch };
}

/** Hash path, length and bytes, including binary/hidden assets and empty directories. */
export function fingerprint(root, inputs, identity = {}, exclude = []) {
  const hash = createHash('sha256');
  const paths = new Set();
  const add = (value) => { const bytes = Buffer.from(value); hash.update(`${bytes.length}:`); hash.update(bytes); };
  const walk = (path) => {
    if (exclude.includes(path) || paths.has(path)) return;
    paths.add(path);
    const stat = lstatSync(join(root, path));
    if (stat.isSymbolicLink()) throw new Error(`Untracked external build input: symbolic link ${path}`);
    add(path);
    if (stat.isDirectory()) {
      add('directory');
      for (const name of readdirSync(join(root, path)).sort()) walk(path ? `${path}/${name}` : name);
    } else if (stat.isFile()) {
      add('file'); add(readFileSync(join(root, path)));
    } else throw new Error(`Unsupported build input: ${path}`);
  };
  add(JSON.stringify(identity));
  for (const input of [...new Set(inputs)].sort()) walk(input);
  return { hash: hash.digest('hex'), entries: paths.size };
}
export function sourceFingerprint(root, identity = toolchainIdentity()) {
  return fingerprint(root, storybookBuildInputs, identity, storybookGeneratedDependencies);
}
export function outputFingerprint(root) {
  return fingerprint(join(root, 'storybook-static'), [''], {}, ['.cs-freshness.json']);
}
export function verifyFreshness(root, stamp, identity = toolchainIdentity()) {
  if (stamp.schemaVersion !== 2) throw new Error('Old or invalid freshness stamp; rebuild Storybook');
  if (JSON.stringify(stamp.toolchain) !== JSON.stringify(identity)) throw new Error('Storybook toolchain changed');
  if (stamp.sourceHash !== sourceFingerprint(root, identity).hash) throw new Error('Storybook inputs changed');
  if (stamp.outputHash !== outputFingerprint(root).hash) throw new Error('Storybook output changed or incomplete');
}
