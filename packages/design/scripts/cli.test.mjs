// `npx @cyberskill/design ai-setup` and `check`: run with `node --test scripts/*.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, symlinkSync, chmodSync } from 'node:fs';
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
    'app/page.tsx': "export default () => <a href=\"#faq\" className=\"bg-teal-soft text-teal-text border-success-line [transition:opacity_var(--motion-fade)]\" style={{ transition: 'opacity var(--motion-fade)' }}>Issue #123</a>;\n",
  }, { dependencies: { '@cyberskill/design': '^3', motion: '^12' } });
  const r = checked(dir);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /✓ 2 files/);
});

test('check leaves ordinary app code alone: ids, issue numbers, labels, selectors, prose, tests, a function named lab', () => {
  const dir = project({
    'src/order.tsx': [
      '<p>Mã đơn: #10234</p>;', '// PR: #1234', '<a href="#add">Thêm</a>;', "const t = { transition: 'Xem tất cả', label: 'Show all transitions' };",
      'function lab(l, a, b) { return [l, a, b]; }', 'const c = lab(50, 20, 10);', "type P = { color: 'red' | 'blue'; transition: Transition; };", "const url = 'https://x.test/#abc';",
    ].join('\n'),
    'src/ids.css': '#bed,\n#add {\n  color: var(--primary);\n}\n.x { fill: url(#bad); }\n',
    'src/notes.md': 'Use `transition: all 2s` and `#fff`? No.\n',
    'src/page.mdx': '# Colors\n\n`color: #fff` is what we avoid.\n',
    'src/order.test.tsx': "expect(getComputedStyle(el).color).toBe('#0B1F3B');\n",
    'src/__tests__/x.tsx': "<div style={{ color: '#fff' }} />;\n",
  });
  const r = checked(dir);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /✓ 2 files/, 'Markdown, MDX and test files are not read');
});

test('check flags raw colors in CSS values, style objects, color attributes and Tailwind classes', () => {
  const dir = project({
    'src/a.css': '.a {\n  color: #fff;\n  background: rgb(0 0 0 / 0.5);\n  border-color: white;\n  --brand: oklch(60% 0.1 250);\n}\n',
    'src/b.tsx': "<div style={{ color: '#14243D' }} />;\n<p className=\"bg-blue-500 hover:text-slate-900/80\" />;\n<p className=\"text-[#fafafa] shadow-[0_0_0_1px_rgb(0,0,0)]\" />;\n<path fill=\"#000\" />;\n<div style=\"background: hsl(0 0% 0%)\"></div>;\n",
    'src/c.ts': 'export const card = css`\n  color: #222;\n`;\n',
  });
  const r = checked(dir);
  assert.equal(r.status, 1);
  for (const line of [/src\/a\.css:2  raw color #fff; use a token/, /src\/a\.css:3  raw color rgb\(/, /src\/a\.css:4  raw color white/, /src\/a\.css:5  raw color oklch\(/,
    /src\/b\.tsx:1  raw color #14243D/, /src\/b\.tsx:2  Tailwind palette color bg-blue-500/, /src\/b\.tsx:2  Tailwind palette color text-slate-900/, /src\/b\.tsx:3  raw color #fafafa in text-\[#fafafa\]/,
    /src\/b\.tsx:3  raw color rgb\( in shadow-/, /src\/b\.tsx:4  raw color #000 in fill/, /src\/b\.tsx:5  raw color hsl\(/, /src\/c\.ts:2  raw color #222/]) assert.match(r.out, line);
  assert.match(r.out, /see ai\/color\.md/);
});

test('check flags raw motion, reading declarations and Motion objects across lines', () => {
  const dir = project({
    'styles/m.css': [
      '.a {', '  transition:', '    opacity 200ms,', '    transform var(--motion-pop-in);', '}', '.b { transition: var(--motion-state); }', '.c { -webkit-transition: all 2s linear; }',
      '.d { transition: transform var(--duration-base) var(--ease-enter); }', '.e { transition: width var(--motion-fade); }', '.f { animation: rise 0.4s linear; }', '.g { @apply duration-300; }',
    ].join('\n'),
    'components/x.tsx': [
      '<div className="duration-[900ms] ease-[cubic-bezier(0.2,0,0,1)]" />;', '<div className="ease-linear delay-700 transition-all duration-300 ease-out" />;',
      '<motion.div', '  transition={{', '    type: "tween",', '    duration: 2,', '  }}', '/>;', "const s = { transition: 'opacity 200ms ease' };", 'const Card = styled.div`', '  transition:', '    opacity 1s;', '`;',
    ].join('\n'),
  });
  const r = checked(dir);
  assert.equal(r.status, 1);
  for (const line of [/styles\/m\.css:2  transition has a raw time \(200ms\)/, /m\.css:6  transition: var\(--motion-state\) names no property, which means all/,
    /m\.css:7  -webkit-transition: all;/, /m\.css:7  -webkit-transition has a raw time \(2s\)/, /m\.css:8  transition uses var\(--duration-base\) directly/,
    /m\.css:9  width animates with var\(--motion-fade\)/, /m\.css:10  animation has a raw time \(0\.4s\)/, /m\.css:11  Tailwind duration-300 sets its own timing/,
    /x\.tsx:1  Tailwind duration-\[900ms\]/, /x\.tsx:1  Tailwind ease-\[cubic-bezier\(0\.2,0,0,1\)\]/, /x\.tsx:2  Tailwind ease-linear/, /x\.tsx:2  Tailwind delay-700/,
    /x\.tsx:2  Tailwind transition-all animates every property/, /x\.tsx:2  Tailwind ease-out/, /x\.tsx:6  Motion transition sets duration itself; use transitions\.<recipe>/,
    /x\.tsx:9  transition has a raw time \(200ms\)/, /x\.tsx:11  transition has a raw time \(1s\)/]) assert.match(r.out, line);
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

test('check never follows a symlink, survives an unreadable file, and exits 2 when it cannot run', () => {
  const dir = project({ 'src/ok.css': '.ok { color: var(--primary); }', 'src/locked.css': '.l { color: #fff; }', 'elsewhere/bad.css': '.b { color: #fff; }' });
  symlinkSync(join(dir, 'missing.css'), join(dir, 'src/broken.css')); // broken
  symlinkSync('..', join(dir, 'src/up')); // a loop back to the project
  symlinkSync(join(dir, 'elsewhere'), join(dir, 'src/out')); // out of the checked folder
  chmodSync(join(dir, 'src/locked.css'), 0o000);
  const r = checked(dir);
  if (process.getuid?.() !== 0) assert.match(r.out, /could not read 1 file, skipped: src\/locked\.css \(EACCES\)/);
  assert.doesNotMatch(r.out, /bad\.css|ELOOP|ENOENT/);
  assert.equal(r.status, process.getuid?.() === 0 ? 1 : 0, r.out); // root can read the locked file
  chmodSync(join(dir, 'src/locked.css'), 0o644);
  writeFileSync(join(dir, 'package.json'), '{ not json');
  const broken = checked(dir);
  assert.equal(broken.status, 2, broken.out);
  assert.match(broken.out, /check could not finish: package\.json is not valid JSON/);
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
