#!/usr/bin/env node
/** Generate portable template runtimes. --check verifies without writing. */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, writeFileSync, lstatSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

export const runtimeSources = {
  'support.js': 'templates/_vendor/support.js',
  'ds-base.js': 'scripts/template-runtime/ds-base.js',
};
const defaultRoot = fileURLToPath(new URL('../', import.meta.url));

export function syncTemplateRuntimes(root = defaultRoot, { check = false } = {}) {
  root = resolve(root);
  // Reject linked sources, directories or outputs before any write.
  const safe = (path, missing = false) => {
    const parts = path.split('/');
    assert(parts.every(part => part && part !== '.' && part !== '..'), 'Unsafe runtime path');
    for (let i = 1; i <= parts.length; i++) {
      const target = resolve(root, ...parts.slice(0, i));
      if (missing && i === parts.length && !existsSync(target)) {
        // lstat still catches a dangling symlink.
        try { assert(!lstatSync(target).isSymbolicLink(), 'Linked runtime output'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
        return target;
      }
      const stat = lstatSync(target);
      assert(!stat.isSymbolicLink(), `Linked runtime path: ${path}`);
      assert(i === parts.length ? stat.isFile() : stat.isDirectory(), `Invalid runtime path: ${path}`);
    }
    return resolve(root, path);
  };
  const manifest = JSON.parse(readFileSync(safe('_ds_manifest.json'), 'utf8'));
  assert(Array.isArray(manifest.templates) && manifest.templates.length, 'Missing template inventory');
  const folders = manifest.templates.map(item => item.folder).sort();
  assert(folders.every(folder => typeof folder === 'string' && /^templates\/[a-z0-9-]+$/.test(folder)), 'Unsafe template folder');
  assert(new Set(folders).size === folders.length, 'Duplicate template folder');
  const sources = Object.entries(runtimeSources).map(([name, path]) => {
    const bytes = readFileSync(safe(path));
    new Script(bytes.toString('utf8'), { filename: path });
    if (name === 'support.js') {
      const code = bytes.toString('utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
      assert(!/\bnew\s+Function\b|\beval\s*\(/.test(code), 'REFUSE: support.js contains new Function or eval(');
    }
    return { name, bytes };
  });
  for (const item of readdirSync(resolve(root, 'templates'), { withFileTypes: true })) {
    if (item.name === '_vendor') continue;
    const folder = `templates/${item.name}`;
    if (item.isSymbolicLink()) throw Error(`Linked template directory: ${folder}`);
    if (!item.isDirectory()) continue;
    for (const { name } of sources) if (existsSync(resolve(root, folder, name))) assert(folders.includes(folder), `Unregistered runtime output: ${folder}/${name}`);
  }
  const outputs = folders.flatMap(folder => sources.map(({ name, bytes }) => {
    const path = `${folder}/${name}`, target = safe(path, true);
    return { path, target, bytes, matches: existsSync(target) && readFileSync(target).equals(bytes) };
  }));
  const stale = outputs.filter(item => !item.matches);
  if (check) assert(!stale.length, `Stale or missing template runtime copies: ${stale.map(item => item.path).join(', ')}`);
  else for (const item of stale) writeFileSync(item.target, item.bytes);
  return { copies: outputs.length, changed: check ? 0 : stale.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.slice(2).every(arg => arg === '--check'), 'Usage: node scripts/sync-support-runtime.mjs [--check]');
  console.log('PASS template runtime generation', syncTemplateRuntimes(defaultRoot, { check: process.argv.includes('--check') }));
}
