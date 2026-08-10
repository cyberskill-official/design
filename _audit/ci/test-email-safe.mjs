#!/usr/bin/env node
/**
 * FIND-126 — templates/email-safe/ language + banned chrome gate.
 * Root lang must be vi (Vietnamese-first); English chrome (Unsubscribe,
 * Preferences, …) may appear only inside lang="en" spans/blocks.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const dir = join(root, 'templates/email-safe');
const LEXICON = ['Unsubscribe', 'Preferences', 'View in browser', 'All rights reserved'];

const problems = [];
if (!existsSync(dir)) {
  console.error('FAIL test-email-safe: templates/email-safe missing');
  process.exit(1);
}

const files = readdirSync(dir).filter((f) => f.startsWith('email-') && f.endsWith('.html')).sort();
if (files.length < 7) problems.push(`expected ≥7 email-*.html, found ${files.length}`);

function enGuarded(text, idx) {
  // Inside <… lang="en" …>…</…> or <span lang="en">…</span> etc.
  const before = text.slice(0, idx);
  const open = [...before.matchAll(/<([a-z0-9]+)([^>]*\blang\s*=\s*["']en["'][^>]*)>/gi)];
  if (!open.length) return false;
  const last = open[open.length - 1];
  const tag = last[1].toLowerCase();
  const openAt = last.index;
  const afterOpen = text.slice(openAt);
  const close = afterOpen.match(new RegExp(`</${tag}\\s*>`, 'i'));
  if (!close) return false;
  const closeAt = openAt + close.index + close[0].length;
  return idx >= openAt && idx < closeAt;
}

for (const name of files) {
  const text = readFileSync(join(dir, name), 'utf8');
  const rootLang = text.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i);
  if (!rootLang || rootLang[1].toLowerCase() !== 'vi') {
    problems.push(`${name}: root lang must be "vi" (got ${rootLang?.[1] || 'missing'})`);
  }
  if (!/\blang\s*=\s*["']en["']/i.test(text)) {
    problems.push(`${name}: missing lang="en" on English blocks`);
  }
  if (!/\blang\s*=\s*["']vi["']/i.test(text.replace(rootLang?.[0] || '', ''))) {
    // VI blocks beyond root — optional if whole doc is vi-dominant with en islands
  }
  for (const lex of LEXICON) {
    let from = 0;
    while (true) {
      const idx = text.indexOf(lex, from);
      if (idx < 0) break;
      if (!enGuarded(text, idx)) {
        problems.push(`${name}: EN chrome "${lex}" outside lang="en" guard`);
      }
      from = idx + lex.length;
    }
  }
}

if (problems.length) {
  console.error('FAIL test-email-safe');
  for (const p of problems.slice(0, 40)) console.error('  ·', p);
  process.exit(1);
}
console.log('PASS test-email-safe', { files: files.length });
