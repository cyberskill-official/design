#!/usr/bin/env node
// npx @cyberskill/design ai-setup [--dry-run] [--only claude,cursor,agents]
//   Installs the AI guidance shipped in node_modules/@cyberskill/design/ai into the current project:
//   .claude/skills/cyberskill-design/SKILL.md, .cursor/rules/cyberskill-design.mdc, and a marked section in AGENTS.md.
//   Only touches its own files and its own marked section; everything else in AGENTS.md is left as is.
// npx @cyberskill/design check [paths…]
//   Lists raw colors, raw motion and a second animation library in the app's own code. Exits 1 when it finds any.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';

const USAGE = 'Usage: npx @cyberskill/design ai-setup [--dry-run] [--only claude,cursor,agents]\n       npx @cyberskill/design check [paths…]   (default: src, app, components, pages, styles)';
const TARGETS = ['claude', 'cursor', 'agents'];
const fail = msg => { console.error(`${msg}\n${USAGE}`); process.exit(1); };

let parsed;
try {
  parsed = parseArgs({ allowPositionals: true, options: { 'dry-run': { type: 'boolean' }, only: { type: 'string' }, help: { type: 'boolean', short: 'h' } } });
} catch (e) { fail(e.message); }
const { values, positionals } = parsed;
if (values.help) { console.log(USAGE); process.exit(0); }

/* ---------- check: the app's own code, line by line ---------- */
const DEFAULT_DIRS = ['src', 'app', 'components', 'pages', 'styles'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.nuxt', '.svelte-kit', '.turbo', '.vercel', '.output', '.cache', 'dist', 'build', 'out', 'coverage', 'storybook-static']);
const SOURCE = /\.(css|scss|sass|less|[cm]?[jt]sx?|mdx|html|vue|svelte|astro)$/;
const STYLESHEET = /\.(css|scss|sass|less)$/;
const ALLOW = 'cyberskill-design-allow';
const ANIMATION_LIBS = /^(framer-motion|gsap|react-spring|@react-spring\/.+|animejs|@formkit\/auto-animate|popmotion)$/; // `motion` itself is the /motion entry's peer
const COLOR_FIX = 'use a token (var(--primary), bg-primary) or a color role (var(--success-soft), bg-teal-soft, data-tone); see ai/color.md';
const MOTION_FIX = 'use a --motion-* recipe (transition: opacity var(--motion-fade)) or @cyberskill/design/motion; see ai/motion.md';
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTILITY = 'bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|fill|stroke|from|via|to|decoration|divide|shadow|accent|caret|placeholder';
// each entry: [pattern, what it found]; the first match on a line is reported (one color and one motion problem per line)
const COLOR = [
  [/(?<![\w-])(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i, m => `raw color ${m[1]}()`],
  [new RegExp(`(?<![\\w-])(${UTILITY})-(${PALETTE})-(50|[1-9]00|950)(?![\\w-])`), m => `Tailwind palette color ${m[0]}`],
  [new RegExp(`(?<![\\w-])(${UTILITY})-(white|black)(?![\\w-])`), m => `Tailwind palette color ${m[0]}`],
  [/(?<![\w-])(color|background(?:-color|Color)?|border(?:-[a-z]+)*-color|borderColor|fill|stroke|outline-color)\s*:\s*['"]?(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink)(?![\w-])/i, m => `named color ${m[2]}`],
];
// hex: anywhere in a stylesheet value; in code only as a whole string, a Tailwind arbitrary value or after a colon, so "#faq" links and "Issue #123" pass
const HEX_CSS = /(?<![\w-])#[0-9a-f]{3,8}(?![\w-])/i;
const HEX_CODE = /(['"`])#[0-9a-f]{3,8}\1|\[#[0-9a-f]{3,8}\]|:\s*#[0-9a-f]{3,8}(?![\w-])/i;
const MOTION_DECL = /(?<![\w-])(transition|animation)(-duration|-timing-function|-property|-delay|Duration|TimingFunction|Property|Delay)?\s*:\s*([^;{}]*)/;
const MOTION_RAW = [
  [/(?<![\w-])all(?![\w-])/, () => 'transition: all animates every property, layout included'],
  [/var\(--(duration|ease|spring)-[\w-]*\)/, m => `${m[0]} in a transition skips reduced motion`],
  [/(?<![a-zA-Z0-9.-])(?=\d*\.?\d*[1-9])\d*\.?\d+m?s(?![\w-])/, m => `raw time ${m[0]}`],
  [/(cubic-bezier|steps|linear)\(/, m => `raw curve ${m[1]}()`],
  [/(?<![\w-])(ease-in-out|ease-in|ease-out|ease|linear|step-start|step-end)(?![\w-])/, m => `raw curve ${m[1]}`],
];
const MOTION_CLASS = [
  [/(?<![\w-])transition\s*[:=]\s*\{\{?[^}]*\b(duration|ease|stiffness|damping|bounce|mass|visualDuration)\s*:/, m => `raw Motion transition (${m[1]}); use transitions.<recipe> from @cyberskill/design/motion`],
  [/(?<![\w-])transition-all(?![\w-])/, () => 'Tailwind transition-all animates every property'],
  [/(?<![\w-])duration-\d+(?![\w-])/, m => `Tailwind ${m[0]}`],
  [/(?<![\w-])ease-(in-out|in|out)(?![\w-])/, m => `Tailwind ${m[0]}`],
];
const first = (rules, line) => { for (const [re, say] of rules) { const m = re.exec(line); if (m) return say(m); } return null; };

function lineProblems(line, stylesheet) {
  const out = [];
  const valuePart = stylesheet ? line.slice(line.lastIndexOf('{') + 1) : line; // a selector like `#fade {` is not a color
  const hex = (stylesheet ? HEX_CSS : HEX_CODE).exec(valuePart);
  const color = hex ? `raw color ${hex[0].replace(/^[^#]*/, '').replace(/[^#0-9a-f]+$/i, '')}` : first(COLOR, line);
  if (color) out.push(`${color}; ${COLOR_FIX}`);
  const decl = MOTION_DECL.exec(line);
  // shortcut: a loading loop is spotted by `infinite` on the same line, not elsewhere in its rule
  const motion = (decl && !/(?<![\w-])infinite(?![\w-])/.test(line) && first(MOTION_RAW, decl[3])) || first(MOTION_CLASS, line);
  if (motion) out.push(`${motion}; ${MOTION_FIX}`);
  return out;
}

function sourceFiles(cwd, paths) {
  const keep = f => SOURCE.test(f) && !/\.min\./.test(f) && !f.split(/[\\/]/).some(p => SKIP_DIRS.has(p));
  // git knows which files are ignored; outside a repo, walk the folders
  const git = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', ...paths], { cwd, encoding: 'utf8' });
  if (git.status === 0) return git.stdout.split('\0').filter(f => f && keep(f) && existsSync(join(cwd, f)));
  const out = [];
  const walk = rel => {
    if (!statSync(join(cwd, rel)).isDirectory()) { if (keep(rel)) out.push(rel); return; }
    for (const e of readdirSync(join(cwd, rel))) if (!SKIP_DIRS.has(e)) walk(join(rel, e));
  };
  paths.forEach(walk);
  return out;
}

function check(cwd, given) {
  const missing = given.filter(p => !existsSync(join(cwd, p)));
  if (missing.length) fail(`No such file or folder: ${missing.join(', ')}`);
  const paths = given.length ? given : DEFAULT_DIRS.filter(d => existsSync(join(cwd, d)));
  if (!paths.length) fail(`Nothing to check: no ${DEFAULT_DIRS.join(', ')} folder in ${cwd}. Pass the folders to check.`);
  const problems = [];
  const files = sourceFiles(cwd, paths);
  for (const f of files) {
    const raw = readFileSync(join(cwd, f), 'utf8');
    // block comments are blanked (lines kept), so a hex in a note is not a finding; the allow marker is read from the raw line
    const code = raw.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).split('\n');
    raw.split('\n').forEach((line, i) => {
      if (line.includes(ALLOW) || /^\s*\/\//.test(code[i])) return;
      for (const p of lineProblems(code[i], STYLESHEET.test(f))) problems.push(`${f}:${i + 1}  ${p}`);
    });
  }
  const pkgFile = join(cwd, 'package.json');
  if (existsSync(pkgFile)) {
    const raw = readFileSync(pkgFile, 'utf8');
    let pkg;
    try { pkg = JSON.parse(raw); } catch (e) { fail(`package.json is not valid JSON: ${e.message}`); }
    const deps = new Set(['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'].flatMap(k => Object.keys(pkg[k] ?? {})));
    for (const name of [...deps].filter(d => ANIMATION_LIBS.test(d)))
      problems.push(`package.json:${raw.split('\n').findIndex(l => l.includes(`"${name}"`)) + 1}  ${name} is a second animation library; use @cyberskill/design/motion (its peer, motion, is the one allowed)`);
  }
  if (problems.length) { console.log(`${problems.join('\n')}\n\n✗ ${problems.length} problem${problems.length > 1 ? 's' : ''} in ${files.length} files. Mark a deliberate exception with a ${ALLOW} comment on its line.`); return 1; }
  console.log(`✓ ${files.length} files: colors through tokens and roles, motion through recipes, no second animation library`);
  return 0;
}

if (positionals[0] === 'check') {
  if (values['dry-run'] || values.only !== undefined) fail('check takes only paths.');
  process.exit(check(process.cwd(), positionals.slice(1)));
}
if (positionals.length !== 1 || positionals[0] !== 'ai-setup') fail(positionals.length ? `Unknown command: ${positionals.join(' ')}` : 'Missing command.');
const dry = !!values['dry-run'];
const only = new Set(values.only === undefined ? TARGETS : values.only.split(',').map(s => s.trim()).filter(Boolean));
const unknown = [...only].filter(t => !TARGETS.includes(t));
if (unknown.length || only.size === 0) fail(`--only takes ${TARGETS.join(', ')}${unknown.length ? `; got ${unknown.join(', ')}` : ''}.`);

const ai = join(dirname(fileURLToPath(import.meta.url)), '..', 'ai');
// every source is checked before anything is written, so a broken install never leaves a half-done setup
const SOURCES = { claude: 'SKILL.md', cursor: 'cursor-rule.mdc', agents: 'AGENTS-snippet.md' };
const missing = ['INDEX.md', ...[...only].map(t => SOURCES[t])].filter(f => !existsSync(join(ai, f)));
if (missing.length) fail(`AI docs not found in the installed package (${missing.join(', ')}).`);

const cwd = process.cwd();
// Run from a home folder it would install a user-wide skill and a ~/AGENTS.md. A project has a package.json.
if (!existsSync(join(cwd, 'package.json'))) fail(`No package.json in ${cwd}. Run this from your project's root folder.`);
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
