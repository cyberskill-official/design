// `npx @cyberskill/design ai-setup` and `check`: run with `node --test scripts/*.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = join(dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'cyberskill-design.mjs');
const run = (cwd, ...args) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: 'utf8' });
const tmp = () => { const dir = mkdtempSync(join(tmpdir(), 'cs-cli-')); writeFileSync(join(dir, 'package.json'), '{}'); return dir; };

test('installs all three and is idempotent, keeping the rest of AGENTS.md', () => {
  const dir = tmp();
  writeFileSync(join(dir, 'AGENTS.md'), '# My app\n\nOur rules cost $5 and use $1.\n');
  assert.equal(run(dir, 'ai-setup').status, 0);
  assert.ok(existsSync(join(dir, '.claude/skills/cyberskill-design/SKILL.md')));
  assert.ok(existsSync(join(dir, '.cursor/rules/cyberskill-design.mdc')));
  const once = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
  assert.match(once, /^# My app\n\nOur rules cost \$5 and use \$1\.\n\n<!-- cyberskill-design:start -->/);
  const again = run(dir, 'ai-setup');
  assert.equal(again.status, 0);
  assert.match(again.stdout, /= AGENTS\.md \(up to date\)/);
  assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), once);
});

test('--only=cursor and --dry-run', () => {
  const dir = tmp();
  assert.equal(run(dir, 'ai-setup', '--only=cursor', '--dry-run').status, 0);
  assert.ok(!existsSync(join(dir, '.cursor')));
  assert.equal(run(dir, 'ai-setup', '--only', 'cursor').status, 0);
  assert.ok(existsSync(join(dir, '.cursor/rules/cyberskill-design.mdc')) && !existsSync(join(dir, 'AGENTS.md')));
});

test('rejects unknown commands, flags and targets', () => {
  const dir = tmp();
  for (const args of [['setup'], [], ['ai-setup', '--dryrun'], ['ai-setup', '--only', 'claud'], ['ai-setup', '--only'], ['ai-setup', 'extra'], ['check', '--json'], ['check', '--dry-run'], ['check', '--only', 'claude']]) {
    const r = run(dir, ...args);
    assert.equal(r.status, 1, `${args.join(' ')} should fail`);
    assert.match(r.stderr, /Usage:/);
  }
  assert.ok(!existsSync(join(dir, '.claude')));
});

test('refuses to run outside a project (no package.json), writing nothing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cs-cli-home-'));
  const r = run(dir, 'ai-setup');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /No package\.json/);
  assert.ok(!existsSync(join(dir, '.claude')) && !existsSync(join(dir, 'AGENTS.md')));
});

test('refuses a broken marker section without writing anything', () => {
  const dir = tmp();
  writeFileSync(join(dir, 'AGENTS.md'), '# App\n<!-- cyberskill-design:start -->\nold\n');
  const r = run(dir, 'ai-setup');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /broken cyberskill-design section/);
  assert.ok(!existsSync(join(dir, '.claude')));
});

/* ---------- check ---------- */
const project = (files, pkg = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'cs-check-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  for (const [rel, text] of Object.entries(files)) { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), text); }
  return dir;
};
const checked = (dir, ...paths) => { const r = run(dir, 'check', ...paths); return { status: r.status, out: r.stdout + r.stderr }; };

test('check passes a clean project: tokens, roles, recipes, the motion peer', () => {
  const dir = project({
    'src/app.css': ".card {\n  color: var(--foreground);\n  background: color-mix(in srgb, var(--primary) 8%, var(--panel));\n  transition: opacity var(--motion-fade), transform var(--motion-pop-in);\n}\n#fade { opacity: 1; }\n.spin { animation: spin 1s linear infinite; }\n/* brand ink is #14243D */\n",
    'app/page.tsx': "export default () => <a href=\"#faq\" className=\"bg-teal-soft text-teal-text border-success-line\" style={{ transition: 'opacity var(--motion-fade)' }}>Issue #123</a>;\n",
  }, { dependencies: { '@cyberskill/design': '^3', motion: '^12' } });
  const r = checked(dir);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /✓ 2 files/);
});

test('check flags raw colors in CSS, style props and Tailwind classes', () => {
  const dir = project({
    'src/a.css': '.a {\n  color: #fff;\n  background: rgb(0 0 0 / 0.5);\n  border-color: white;\n}\n',
    'src/b.tsx': "<div style={{ color: '#14243D' }} />;\n<p className=\"bg-blue-500 hover:text-slate-900/80\" />;\n<p className=\"text-[#fafafa]\" />;\n",
  });
  const r = checked(dir);
  assert.equal(r.status, 1);
  for (const line of [/src\/a\.css:2  raw color #fff; use a token/, /src\/a\.css:3  raw color rgb\(\)/, /src\/a\.css:4  named color white/,
    /src\/b\.tsx:1  raw color #14243D/, /src\/b\.tsx:2  Tailwind palette color bg-blue-500/, /src\/b\.tsx:3  raw color #fafafa/]) assert.match(r.out, line);
  assert.match(r.out, /see ai\/color\.md/);
});

test('check flags raw motion: times, curves, transition: all, Tailwind timing and Motion transitions', () => {
  const dir = project({
    'styles/m.css': '.a { transition: opacity 200ms ease-in-out; }\n.b { transition: all var(--motion-state); }\n.c { transition: transform var(--duration-base) var(--ease-out); }\n.d { transition-timing-function: cubic-bezier(0.2, 0, 0, 1); }\n.e { animation: rise 0.4s linear; }\n',
    'components/x.tsx': '<div className="transition duration-300 ease-out" />;\n<div className="transition-all" />;\n<motion.div transition={{ duration: 0.3 }} />;\n',
  });
  const r = checked(dir);
  assert.equal(r.status, 1);
  for (const line of [/styles\/m\.css:1  raw time 200ms; use a --motion-\* recipe/, /m\.css:2  transition: all/, /m\.css:3  var\(--duration-base\) in a transition skips reduced motion/,
    /m\.css:4  raw curve cubic-bezier\(\)/, /m\.css:5  raw time 0\.4s/, /x\.tsx:1  Tailwind duration-300/, /x\.tsx:2  Tailwind transition-all/, /x\.tsx:3  raw Motion transition \(duration\)/]) assert.match(r.out, line);
  assert.match(r.out, /see ai\/motion\.md/);
});

test('check flags a second animation library, but not the motion peer', () => {
  const dir = project({ 'src/a.css': '' }, { dependencies: { motion: '^12', 'framer-motion': '^11' }, devDependencies: { '@react-spring/web': '^9', gsap: '^3' } });
  const r = checked(dir);
  assert.equal(r.status, 1);
  for (const name of ['framer-motion', '@react-spring/web', 'gsap']) assert.match(r.out, new RegExp(`package\\.json:\\d+  ${name} is a second animation library; use @cyberskill/design/motion`));
  assert.doesNotMatch(r.out, /  motion is a second/);
});

test('check skips a line marked cyberskill-design-allow, node_modules and build output', () => {
  const dir = project({
    'src/logo.tsx': '<path fill="#14243D" /> {/* cyberskill-design-allow: brand mark */}\n',
    'src/node_modules/x/a.css': '.a { color: #fff; }',
    'src/dist/a.css': '.a { color: #fff; }',
  });
  const r = checked(dir);
  assert.equal(r.status, 0, r.out);
});

test('check skips git-ignored files', { skip: spawnSync('git', ['--version']).status !== 0 && 'git not installed' }, () => {
  const dir = project({ '.gitignore': 'src/generated/\n', 'src/generated/a.css': '.a { color: #fff; }', 'src/b.css': '.b { color: var(--primary); }' });
  spawnSync('git', ['init', '-q'], { cwd: dir });
  const r = checked(dir);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /✓ 1 files/);
});

test('check takes paths, and fails on a missing path or nothing to check', () => {
  const dir = project({ 'lib/a.css': '.a { color: #fff; }', 'src/ok.css': '' });
  assert.equal(checked(dir).status, 0); // lib is not a default folder
  assert.match(checked(dir, 'lib').out, /lib\/a\.css:1  raw color #fff/);
  const gone = checked(dir, 'nope');
  assert.equal(gone.status, 1);
  assert.match(gone.out, /No such file or folder: nope/);
  const empty = project({});
  const none = checked(empty);
  assert.equal(none.status, 1);
  assert.match(none.out, /Nothing to check/);
});
