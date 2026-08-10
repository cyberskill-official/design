#!/usr/bin/env node
/**
 * FIND-073 / FIND-118 / FIND-120 — directory-driven EN·VI docs parity.
 * Enumerates docs/*.md (not a hardcoded allowlist). Optional EN_ONLY exemptions
 * must be named + commented. Also asserts heading-count parity (FIND-121).
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../..');

/** Deliberately EN-only operator docs (none today). Add a dated comment if used. */
const EN_ONLY = new Set([
  // e.g. 'internal-only.md' — maintainer EN-only; not used as of Phase 4
]);

const BLACKLIST = [
  /50\s+style\s+packs/i,
  /41-document/i,
  /41\s+documents/i,
  /Ba\s+trục/i,
  /three\s+identity\s+axes/i,
  /invent\s+a\s+fourth\s+product\s+axis/i,
  /not\s+a\s+fourth\s+axis/i,
  /Theme\s*×\s*Element\s*×\s*Language(?!\s*×\s*Style)/,
];
const STUB_RE = /translate\s+me|stub\s+only|chưa\s+dịch|pending\s+translation|^\s*#?\s*TODO\b[\s:]*$/im;

function listMd(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

function headingCount(text) {
  return (text.match(/^#{1,6}\s+\S/gm) || []).length;
}

const enDir = join(root, 'docs');
const viDir = join(root, 'docs/vi');
const enFiles = listMd(enDir).filter((f) => !EN_ONLY.has(f));
const problems = [];

for (const name of enFiles) {
  const enPath = join(enDir, name);
  const viPath = join(viDir, name);
  const en = readFileSync(enPath, 'utf8');
  if (!existsSync(viPath)) {
    problems.push(`docs/vi/${name}: missing Vietnamese mirror`);
    continue;
  }
  const vi = readFileSync(viPath, 'utf8');
  const enLen = en.trim().length;
  const viLen = vi.trim().length;
  const minLen = Math.max(80, Math.floor(enLen * 0.4));
  if (viLen < minLen) problems.push(`docs/vi/${name}: stub/too short (${viLen}; need ≥${minLen})`);
  if (STUB_RE.test(vi)) problems.push(`docs/vi/${name}: stub placeholder phrase`);
  const enH = headingCount(en);
  const viH = headingCount(vi);
  if (enH !== viH) {
    problems.push(`docs/vi/${name}: heading-count drift EN=${enH} VI=${viH}`);
  }
  for (const [label, text] of [
    [`docs/${name}`, en],
    [`docs/vi/${name}`, vi],
  ]) {
    for (const re of BLACKLIST) {
      re.lastIndex = 0;
      const m = re.exec(text);
      if (m) problems.push(`${label}: stale-phrase «${m[0]}»`);
    }
  }
}

// VI orphans (file in vi/ with no EN twin)
for (const name of listMd(viDir)) {
  if (!existsSync(join(enDir, name)) && !EN_ONLY.has(name)) {
    problems.push(`docs/vi/${name}: orphan (no docs/${name})`);
  }
}

// Freshness: browser board consumes this directory-derived list (not a hand list).
const trackedPath = join(root, '_audit/docs-tracked.json');
const trackedPayload = {
  generatedBy: '_audit/ci/test-docs-lang-parity.mjs',
  tracked: listMd(enDir),
  enOnly: [...EN_ONLY].sort(),
};
const expectedJson = `${JSON.stringify(trackedPayload, null, 2)}\n`;
if (!existsSync(trackedPath) || readFileSync(trackedPath, 'utf8') !== expectedJson) {
  if (process.argv.includes('--write')) {
    writeFileSync(trackedPath, expectedJson);
  } else {
    problems.push(
      '_audit/docs-tracked.json stale — run: node _audit/ci/test-docs-lang-parity.mjs --write',
    );
  }
}

if (problems.length) {
  console.error('FAIL test-docs-lang-parity');
  for (const p of problems.slice(0, 40)) console.error('  ·', p);
  process.exit(1);
}
console.log('PASS test-docs-lang-parity', { tracked: enFiles.length, enOnly: EN_ONLY.size });
