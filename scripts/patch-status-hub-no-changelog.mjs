#!/usr/bin/env node
/**
 * Re-apply design-system no-CHANGELOG doctrine to the vendored status hub after
 * `cyberos install` (`.cyberos/` is gitignored and wiped/replaced on reinstall).
 *
 * House doctrine (CLAUDE.md / docs/release-notes.md): no root CHANGELOG.md —
 * continuity is tip SHA + curated Release Notes. Upstream CyberOS migrate still
 * expects CHANGELOG version sections unless the hub is taught otherwise.
 *
 * Usage: node scripts/patch-status-hub-no-changelog.mjs
 * Idempotent. Exit 0 when already patched or successfully patched; 1 on miss.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hub = join(root, '.cyberos/docs-tools/render-status-hub.mjs');

if (!existsSync(hub)) {
  console.error('patch-status-hub: missing', hub, '(run cyberos install first)');
  process.exit(1);
}

const src = readFileSync(hub, 'utf-8');
if (src.includes('detectsNoChangelogDoctrine') && src.includes('NO_CHANGELOG_DOCTRINE')) {
  console.log('patch-status-hub: already patched');
  process.exit(0);
}

if (!src.includes('const LEGACY_PRIMARY = process.env.CYBEROS_STATUS_LEGACY === \'1\';')) {
  console.error('patch-status-hub: unexpected hub shape — refuse to patch');
  process.exit(1);
}

let next = src.replace(
  'const LEGACY_PRIMARY = process.env.CYBEROS_STATUS_LEGACY === \'1\';\n',
  `const LEGACY_PRIMARY = process.env.CYBEROS_STATUS_LEGACY === '1';
/** House doctrine: curated docs/release-notes.md replaces root CHANGELOG.md. */
function detectsNoChangelogDoctrine(root) {
  if (process.env.CYBEROS_NO_CHANGELOG === '1') return true;
  if (existsSync(join(root, 'CHANGELOG.md'))) return false;
  const rn = join(root, 'docs/release-notes.md');
  if (!existsSync(rn)) return false;
  const text = readFileSync(rn, 'utf-8');
  return /no CHANGELOG|not a [\`'']?CHANGELOG|forbid\\w* CHANGELOG|does not maintain a changelog/i.test(text);
}
const NO_CHANGELOG_DOCTRINE = detectsNoChangelogDoctrine(ROOT);
`,
);

if (next === src) {
  console.error('patch-status-hub: LEGACY_PRIMARY anchor not found');
  process.exit(1);
}

next = next.replace(
  'if (!existsSync(clPath) && !LENIENT) die(\'CHANGELOG.md missing\');',
  'if (!existsSync(clPath) && !LENIENT && !NO_CHANGELOG_DOCTRINE) die(\'CHANGELOG.md missing\');',
);

next = next.replace(
  'const releases = marks.map((mk, i) => {',
  'let releases = marks.map((mk, i) => {',
);

const warnBlock = `if (!releases.length) {
  if (!LENIENT) { console.error('status-hub: ERROR zero version sections parsed from CHANGELOG.md'); process.exit(1); }
  console.error('status-hub: WARN no CHANGELOG version sections (lenient - the releases lens is empty)');
}`;

const fixedBlock = `if (!releases.length) {
  if (NO_CHANGELOG_DOCTRINE) {
    const verFile = join(ROOT, 'VERSION');
    const ver = existsSync(verFile) ? readFileSync(verFile, 'utf-8').trim() : '';
    if (ver) {
      releases = [{
        v: ver,
        vl: 'v' + ver,
        d: '',
        intro: [inlineHtml('Curated product highlights live in \`docs/release-notes.md\` (no root \`CHANGELOG.md\` by doctrine).')],
        sec: [],
        cited: [],
        dated: [],
      }];
    }
    console.error('status-hub: note no CHANGELOG.md by doctrine — releases lens seeded from VERSION + docs/release-notes.md');
  } else if (!LENIENT) {
    console.error('status-hub: ERROR zero version sections parsed from CHANGELOG.md');
    process.exit(1);
  } else {
    console.error('status-hub: WARN no CHANGELOG version sections (lenient - the releases lens is empty)');
  }
}`;

if (!next.includes(warnBlock)) {
  console.error('patch-status-hub: WARN block not found — hub may already differ');
  process.exit(1);
}
next = next.replace(warnBlock, fixedBlock);

writeFileSync(hub, next);
console.log('patch-status-hub: applied no-CHANGELOG doctrine to', hub);
