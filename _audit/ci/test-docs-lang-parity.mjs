#!/usr/bin/env node
/**
 * FIND-073 / FIND-118 / FIND-120 — directory-driven EN·VI docs parity.
 * Enumerates current docs/*.md guides plus recursive Markdown decision source pairs.
 * Browser tracking remains the top-level guide collection. Optional EN_ONLY exemptions
 * must be named + commented. Also asserts heading-count parity (FIND-121).
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {documentationParityScope,listMarkdownFiles,pairProblems} from './lib/docs-parity.mjs';

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


function listMd(dir) { return listMarkdownFiles(dir); }


const enDir = join(root, 'docs');
const viDir = join(root, 'docs/vi');
const scope = documentationParityScope(root);
const publicFiles = scope.guides.filter((f) => !EN_ONLY.has(f));
const enFiles = scope.source.filter((f) => !EN_ONLY.has(f));
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
  problems.push(...pairProblems(en, vi, {label:`docs/vi/${name}`}));
  // Preserve the current-guide stale-language contract. Historical decision
  // records are translated faithfully; their dated source is not rewritten.
  if (name.startsWith('decisions/')) continue;
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
for (const name of scope.vietnamese) {
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
console.log('PASS test-docs-lang-parity', { tracked: publicFiles.length, sourcePairs: enFiles.length, decisionPairs: scope.decisions.length, enOnly: EN_ONLY.size, browserPublication: 'unchanged; docs-tracked.json contains only top-level guides' });
