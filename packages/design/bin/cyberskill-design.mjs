#!/usr/bin/env node
// npx cyberskill-design ai-setup [--dry-run] [--only claude,cursor,agents]
// Installs the AI guidance shipped in node_modules/@cyberskill/design/ai into the current project:
//   .claude/skills/cyberskill-design/SKILL.md, .cursor/rules/cyberskill-design.mdc, and a marked section in AGENTS.md.
// Only touches its own files and its own marked section; everything else in AGENTS.md is left as is.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ai = join(dirname(fileURLToPath(import.meta.url)), '..', 'ai');
const [cmd, ...rest] = process.argv.slice(2);
const dry = rest.includes('--dry-run');
const onlyArg = rest[rest.indexOf('--only') + 1];
const only = rest.includes('--only') && onlyArg ? new Set(onlyArg.split(',')) : new Set(['claude', 'cursor', 'agents']);

if (cmd !== 'ai-setup') {
  console.log('Usage: npx cyberskill-design ai-setup [--dry-run] [--only claude,cursor,agents]');
  process.exit(cmd ? 1 : 0);
}
if (!existsSync(join(ai, 'INDEX.md'))) { console.error('AI docs not found in the installed package.'); process.exit(1); }

const cwd = process.cwd();
const write = (rel, content) => {
  const f = join(cwd, rel), same = existsSync(f) && readFileSync(f, 'utf8') === content;
  console.log(`${same ? '=' : dry ? '~' : '✓'} ${rel}${same ? ' (up to date)' : dry ? ' (would write)' : ''}`);
  if (!same && !dry) { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); }
};

if (only.has('claude')) write('.claude/skills/cyberskill-design/SKILL.md', readFileSync(join(ai, 'SKILL.md'), 'utf8'));
if (only.has('cursor')) write('.cursor/rules/cyberskill-design.mdc', readFileSync(join(ai, 'cursor-rule.mdc'), 'utf8'));
if (only.has('agents')) {
  const START = '<!-- cyberskill-design:start -->', END = '<!-- cyberskill-design:end -->';
  const block = `${START}\n${readFileSync(join(ai, 'AGENTS-snippet.md'), 'utf8').trim()}\n${END}`;
  const f = join(cwd, 'AGENTS.md'), cur = existsSync(f) ? readFileSync(f, 'utf8') : '';
  const next = cur.includes(START) ? cur.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block) : `${cur}${cur && !cur.endsWith('\n') ? '\n' : ''}${cur ? '\n' : ''}${block}\n`;
  write('AGENTS.md', next);
}
console.log(dry ? '\nDry run: nothing written.' : '\nDone. AI tools in this project will now read node_modules/@cyberskill/design/ai/INDEX.md before writing UI.');
