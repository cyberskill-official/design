#!/usr/bin/env node
// npx @cyberskill/design ai-setup [--dry-run] [--only claude,cursor,agents]
// Installs the AI guidance shipped in node_modules/@cyberskill/design/ai into the current project:
//   .claude/skills/cyberskill-design/SKILL.md, .cursor/rules/cyberskill-design.mdc, and a marked section in AGENTS.md.
// Only touches its own files and its own marked section; everything else in AGENTS.md is left as is.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const USAGE = 'Usage: npx @cyberskill/design ai-setup [--dry-run] [--only claude,cursor,agents]';
const TARGETS = ['claude', 'cursor', 'agents'];
const fail = msg => { console.error(`${msg}\n${USAGE}`); process.exit(1); };

let parsed;
try {
  parsed = parseArgs({ allowPositionals: true, options: { 'dry-run': { type: 'boolean' }, only: { type: 'string' }, help: { type: 'boolean', short: 'h' } } });
} catch (e) { fail(e.message); }
const { values, positionals } = parsed;
if (values.help) { console.log(USAGE); process.exit(0); }
if (positionals.length !== 1 || positionals[0] !== 'ai-setup') fail(positionals.length ? `Unknown command: ${positionals.join(' ')}` : 'Missing command.');
const dry = !!values['dry-run'];
const only = new Set(values.only === undefined ? TARGETS : values.only.split(',').map(s => s.trim()).filter(Boolean));
const unknown = [...only].filter(t => !TARGETS.includes(t));
if (unknown.length || only.size === 0) fail(`--only takes ${TARGETS.join(', ')}${unknown.length ? `; got ${unknown.join(', ')}` : ''}.`);

const ai = join(dirname(fileURLToPath(import.meta.url)), '..', 'ai');
if (!existsSync(join(ai, 'INDEX.md'))) fail('AI docs not found in the installed package.');

const cwd = process.cwd();
const write = (rel, content) => {
  const f = join(cwd, rel), same = existsSync(f) && readFileSync(f, 'utf8') === content;
  console.log(`${same ? '=' : dry ? '~' : '✓'} ${rel}${same ? ' (up to date)' : dry ? ' (would write)' : ''}`);
  if (!same && !dry) { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); }
};

// Check AGENTS.md before writing anything, so a broken marker never leaves a half-done setup.
const START = '<!-- cyberskill-design:start -->', END = '<!-- cyberskill-design:end -->';
const agentsFile = join(cwd, 'AGENTS.md'), cur = only.has('agents') && existsSync(agentsFile) ? readFileSync(agentsFile, 'utf8') : '';
const starts = cur.split(START).length - 1, ends = cur.split(END).length - 1;
if (only.has('agents') && (starts !== ends || starts > 1 || (starts === 1 && cur.indexOf(END) < cur.indexOf(START))))
  fail(`AGENTS.md has a broken cyberskill-design section (${starts} start and ${ends} end markers). Fix or remove it, then run again.`);

if (only.has('claude')) write('.claude/skills/cyberskill-design/SKILL.md', readFileSync(join(ai, 'SKILL.md'), 'utf8'));
if (only.has('cursor')) write('.cursor/rules/cyberskill-design.mdc', readFileSync(join(ai, 'cursor-rule.mdc'), 'utf8'));
if (only.has('agents')) {
  const block = `${START}\n${readFileSync(join(ai, 'AGENTS-snippet.md'), 'utf8').trim()}\n${END}`;
  // function replacer: `$` in the snippet is literal text, not a replacement pattern
  const next = starts ? cur.replace(new RegExp(`${START}[\\s\\S]*?${END}`), () => block) : `${cur}${cur && !cur.endsWith('\n') ? '\n' : ''}${cur ? '\n' : ''}${block}\n`;
  write('AGENTS.md', next);
}
console.log(dry ? '\nDry run: nothing written.' : '\nDone. AI tools in this project will now read node_modules/@cyberskill/design/ai/INDEX.md before writing UI.');
