#!/usr/bin/env node
// npx @cyberskill/design ai-setup [--dry-run] [--only claude,cursor,agents]
//   Installs the AI guidance shipped in node_modules/@cyberskill/design/ai into the current project:
//   .claude/skills/cyberskill-design/SKILL.md, .cursor/rules/cyberskill-design.mdc, and a marked section in AGENTS.md.
//   Only touches its own files and its own marked section; everything else in AGENTS.md is left as is.
// npx @cyberskill/design check [paths…]
//   Lists raw colors, raw motion and a second animation library in the app's own code. Exits 1 when it finds any,
//   2 when it could not run.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, lstatSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
import { cssRules, motionProblems, isMotionProp, lineIndex } from './motion-rules.mjs';

const USAGE = 'Usage: npx @cyberskill/design ai-setup [--dry-run] [--only claude,cursor,agents]\n       npx @cyberskill/design check [paths…]   (default: src, app, components, pages, styles)';
const TARGETS = ['claude', 'cursor', 'agents'];
const fail = msg => { console.error(`${msg}\n${USAGE}`); process.exit(1); };

let parsed;
try {
  parsed = parseArgs({ allowPositionals: true, options: { 'dry-run': { type: 'boolean' }, only: { type: 'string' }, help: { type: 'boolean', short: 'h' } } });
} catch (e) { fail(e.message); }
const { values, positionals } = parsed;
if (values.help) { console.log(USAGE); process.exit(0); }

/* ---------- check: the app's own code ---------- */
const DEFAULT_DIRS = ['src', 'app', 'components', 'pages', 'styles'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.nuxt', '.svelte-kit', '.turbo', '.vercel', '.output', '.cache', 'dist', 'build', 'out', 'coverage', 'storybook-static', '__tests__', '__mocks__']);
// Markdown is prose and tests assert on colors, so neither is read
const SOURCE = /\.(css|scss|less|[cm]?[jt]sx?|html|vue|svelte|astro)$/;
const SKIP_FILE = /\.(test|spec)\.[cm]?[jt]sx?$|\.min\.|\.d\.ts$/;
const STYLESHEET = /\.(css|scss|less)$/, MARKUP = /\.(html|vue|svelte|astro)$/;
const ALLOW = 'cyberskill-design-allow';
const ANIMATION_LIBS = /^(framer-motion|gsap|react-spring|@react-spring\/.+|animejs|@formkit\/auto-animate|popmotion)$/; // `motion` itself is the /motion entry's peer
const COLOR_FIX = 'use a token (var(--primary), bg-primary) or a color role (var(--success-soft), bg-teal-soft, data-tone); see ai/color.md';
const MOTION_DOC = 'see ai/motion.md';
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTILITY = 'bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|fill|stroke|from|via|to|decoration|divide|shadow|accent|caret|placeholder';
const PALETTE_CLASS = new RegExp(`(?<![\\w-])(?:${UTILITY})-(?:(?:${PALETTE})-(?:50|[1-9]00|950)|white|black)(?![\\w-])`, 'g');
// a property that takes a color: color, background, border, outline, fill, stroke, shadows, and every *-color / *Color
const COLOR_KEY = /color$|^(background|border|outline|fill|stroke|box-?shadow|text-?shadow)/i;
const NAMED = /(?<![\w-])(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink)(?![\w-])/i;
const rawColor = (value, named) => {
  const v = value.replace(/url\([^)]*\)/g, ''); // url(#gradient) is a reference, not a color
  return (/#[0-9a-f]{3,8}(?![\w-])/i.exec(v) ?? /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i.exec(v) ?? (named ? NAMED.exec(v) : null))?.[0];
};
const kebab = k => k.replace(/^(Webkit|Moz|O|ms)(?=[A-Z])/, m => `-${m.toLowerCase()}`).replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
// a style value only counts as motion when it has something timing-like in it: 'Xem tất cả' under a `transition` key is a label
const TIMING = /\d*\.?\d+m?s(?![\w-])|var\(--|cubic-bezier\(|steps\(|(?<![\w-])(ease[\w-]*|linear|all)(?![\w-])/;
const blank = m => m.replace(/[^\n]/g, ' ');

/** Problems in one CSS declaration: a hex or color function in its value (a named color only where a color goes), motion off the recipes. */
function declProblems(prop, value, line, ruleDecls, out) {
  const c = rawColor(value, COLOR_KEY.test(prop));
  if (c) out.push({ line, msg: `raw color ${c}; ${COLOR_FIX}` });
  for (const m of motionProblems(prop, value, ruleDecls)) out.push({ line, msg: `${m}; ${MOTION_DOC}` });
}

function cssProblems(text, out) {
  for (const r of cssRules(text)) for (const d of r.decls) {
    if (d.prop === '@apply') classProblems(d.value, () => d.line, out);
    else declProblems(d.prop, d.value, d.line, r.decls, out);
  }
}

/** Tailwind classes: palette colors, raw colors in arbitrary values, and timing that skips the recipes. */
function classProblems(text, lineAt, out) {
  for (const m of text.matchAll(PALETTE_CLASS)) out.push({ line: lineAt(m.index), msg: `Tailwind palette color ${m[0]}; ${COLOR_FIX}` });
  for (const m of text.matchAll(/(?<![\w-])([a-z][\w-]*)-\[([^\]\s]+)\]/g)) {
    const [cls, util, arg] = m, v = arg.replace(/_/g, ' ');
    if (/^(duration|delay|ease)$/.test(util)) out.push({ line: lineAt(m.index), msg: `Tailwind ${cls} sets its own timing; use a recipe ([transition:opacity_var(--motion-fade)]); ${MOTION_DOC}` });
    else if (rawColor(v, false)) out.push({ line: lineAt(m.index), msg: `raw color ${rawColor(v, false)} in ${cls}; ${COLOR_FIX}` });
  }
  for (const m of text.matchAll(/(?<![\w-])\[([a-z-]+):([^\]\s]+)\]/g)) declProblems(m[1], m[2].replace(/_/g, ' '), lineAt(m.index), [], out);
  for (const m of text.matchAll(/(?<![\w-])(duration-\d+|delay-\d+|ease-(?:linear|in-out|in|out)|transition-all)(?![\w-])/g))
    out.push({ line: lineAt(m.index), msg: `Tailwind ${m[1]} ${m[1] === 'transition-all' ? 'animates every property' : 'sets its own timing'}; use a recipe ([transition:opacity_var(--motion-fade)]); ${MOTION_DOC}` });
}

/** Code and markup: style objects, color attributes, style="…", Tailwind classes, Motion transition objects. */
function codeProblems(text, out) {
  const lineAt = lineIndex(text);
  // style objects and CSS in template literals: `color: '#fff'`, `transition: 'opacity 200ms'` (not a union type `'a' | 'b'`)
  for (const m of text.matchAll(/(?<![\w$.-])(['"]?)([A-Za-z-]+)\1\s*:\s*(['"`])((?:\\.|(?!\3)[^\\])*?)\3(?=\s*(?:[,;})\]]|$))/gm)) {
    const prop = kebab(m[2]);
    if (COLOR_KEY.test(prop) || (isMotionProp(prop) && TIMING.test(m[4]))) declProblems(prop, m[4], lineAt(m.index), [], out);
  }
  // a type annotation (`color: string;`, `transition: Transition;`) has no color and nothing timing-like, so it passes
  for (const m of text.matchAll(/(?<![\w$.-])([a-z-]+)\s*:\s*([^;'"`{}<>]+);/g)) {
    if (COLOR_KEY.test(m[1]) || (isMotionProp(m[1]) && TIMING.test(m[2]))) declProblems(m[1], m[2], lineAt(m.index), [], out);
  }
  for (const m of text.matchAll(/(?<![\w-])(fill|stroke|color|stop-?[cC]olor|flood-?[cC]olor|lighting-?[cC]olor|bgcolor)\s*=\s*\{?\s*(['"`])([^'"`]*)\2/g)) {
    const c = rawColor(m[3], true);
    if (c) out.push({ line: lineAt(m.index), msg: `raw color ${c} in ${m[1]}; ${COLOR_FIX}` });
  }
  for (const m of text.matchAll(/(?<![\w-])style\s*=\s*(['"])([^'"]*)\1/g))
    for (const d of m[2].split(';')) { const k = d.indexOf(':'); if (k > 0) declProblems(d.slice(0, k).trim(), d.slice(k + 1).trim(), lineAt(m.index), [], out); }
  classProblems(text, lineAt, out);
  // Motion: transition={{ duration: 0.3 }} or a variant's transition: { … }, read to its closing brace across lines
  for (const m of text.matchAll(/(?<![\w$.-])transition\s*(?:=\s*\{\s*\{|:\s*\{)/g)) {
    let i = m.index + m[0].length, depth = 1;
    for (; i < text.length && depth; i++) depth += text[i] === '{' ? 1 : text[i] === '}' ? -1 : 0;
    const body = text.slice(m.index + m[0].length, i), k = /(?<![\w$])(duration|delay|ease|stiffness|damping|bounce|mass|visualDuration|repeatDelay)\s*:/.exec(body);
    if (k) out.push({ line: lineAt(m.index + m[0].length + k.index), msg: `Motion transition sets ${k[1]} itself; use transitions.<recipe> or springs from @cyberskill/design/motion; ${MOTION_DOC}` });
  }
}

function fileProblems(f, raw) {
  const out = [];
  let text = raw.replace(/\/\*[\s\S]*?\*\//g, blank);
  if (STYLESHEET.test(f)) {
    if (!f.endsWith('.css')) text = text.replace(/(^|[^:\\'"`\w(])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length))); // Sass and Less line comments
    cssProblems(text, out);
  } else {
    text = text.replace(/<!--[\s\S]*?-->/g, blank).replace(/(^|[^:\\'"`\w(])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)));
    if (MARKUP.test(f)) {
      // <style> blocks are CSS; the rest is markup and script
      const styles = /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi;
      let css = blank(text); // same length and lines as the file, so line numbers hold
      for (const m of text.matchAll(styles)) { const at = m.index + m[1].length; css = css.slice(0, at) + m[2] + css.slice(at + m[2].length); }
      cssProblems(css, out);
      text = text.replace(styles, (m, a, b, c) => a + blank(b) + c);
    }
    codeProblems(text, out);
  }
  const lines = raw.split('\n');
  return out.filter(p => !lines[p.line - 1]?.includes(ALLOW));
}

/** Source files under the given paths: what git tracks or would add, or a walk that never follows a symlink. */
function sourceFiles(cwd, paths, skipped) {
  const keep = f => SOURCE.test(f) && !SKIP_FILE.test(f) && !f.split(/[\\/]/).some(p => SKIP_DIRS.has(p));
  const git = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', ...paths], { cwd, encoding: 'utf8' });
  if (git.status === 0) return git.stdout.split('\0').filter(f => f && keep(f));
  const out = [];
  const walk = rel => {
    let entries;
    try { entries = readdirSync(join(cwd, rel), { withFileTypes: true }); } catch (e) { skipped.push(`${rel} (${e.code ?? e.message})`); return; }
    for (const e of entries) {
      const child = join(rel, e.name);
      if (e.isDirectory() && !SKIP_DIRS.has(e.name)) walk(child);
      else if (e.isFile() && keep(child)) out.push(child);
    }
  };
  for (const p of paths) { const st = lstatSync(join(cwd, p)); if (st.isDirectory()) walk(p); else if (st.isFile() && keep(p)) out.push(p); }
  return out;
}

function check(cwd, given) {
  const missing = given.filter(p => !existsSync(join(cwd, p)));
  if (missing.length) fail(`No such file or folder: ${missing.join(', ')}`);
  const paths = given.length ? given : DEFAULT_DIRS.filter(d => existsSync(join(cwd, d)));
  if (!paths.length) fail(`Nothing to check: no ${DEFAULT_DIRS.join(', ')} folder in ${cwd}. Pass the folders to check.`);
  const problems = [], skipped = [];
  const files = sourceFiles(cwd, paths, skipped);
  let read = 0;
  for (const f of files) {
    let raw;
    try { if (!lstatSync(join(cwd, f)).isFile()) continue; raw = readFileSync(join(cwd, f), 'utf8'); } // a tracked symlink is not followed
    catch (e) { skipped.push(`${f} (${e.code ?? e.message})`); continue; }
    read++;
    const seen = new Set();
    for (const p of fileProblems(f, raw).sort((a, b) => a.line - b.line)) { const line = `${f}:${p.line}  ${p.msg}`; if (!seen.has(line)) { seen.add(line); problems.push(line); } }
  }
  const pkgFile = join(cwd, 'package.json');
  if (existsSync(pkgFile)) {
    const raw = readFileSync(pkgFile, 'utf8');
    let pkg;
    try { pkg = JSON.parse(raw); } catch (e) { throw new Error(`package.json is not valid JSON: ${e.message}`); }
    const deps = new Set(['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'].flatMap(k => Object.keys(pkg[k] ?? {})));
    for (const name of [...deps].filter(d => ANIMATION_LIBS.test(d)))
      problems.push(`package.json:${raw.split('\n').findIndex(l => l.includes(`"${name}"`)) + 1}  ${name} is a second animation library; use @cyberskill/design/motion (its peer, motion, is the one allowed)`);
  }
  if (skipped.length) console.error(`! could not read ${skipped.length} file${skipped.length > 1 ? 's' : ''}, skipped: ${skipped.slice(0, 5).join(', ')}${skipped.length > 5 ? ', …' : ''}`);
  if (problems.length) { console.log(`${problems.join('\n')}\n\n✗ ${problems.length} problem${problems.length > 1 ? 's' : ''} in ${read} files. Mark a deliberate exception with a ${ALLOW} comment on its line.`); return 1; }
  console.log(`✓ ${read} files: colors through tokens and roles, motion through recipes, no second animation library`);
  return 0;
}

if (positionals[0] === 'check') {
  if (values['dry-run'] || values.only !== undefined) fail('check takes only paths.');
  // 1 means problems were found; 2 means the check itself could not run, so CI can tell the two apart
  try { process.exit(check(process.cwd(), positionals.slice(1))); } catch (e) { console.error(`✗ check could not finish: ${e.message}`); process.exit(2); }
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
