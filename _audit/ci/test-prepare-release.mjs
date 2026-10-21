import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync, chmodSync, existsSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
import { planRelease, prepareRelease, verifyPreparedCandidate, verifyTagIdentity, parseArguments } from '../../scripts/prepare-release.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
const sourceSha = 'a'.repeat(40), otherSha = 'b'.repeat(40);
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'cs-release-fixture-'));
  const put = (path, value) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n'); };
  put('VERSION', '1.7.2\n'); put('package.json', { name: 'fixture-only', version: '1.7.2' });
  put('package-lock.json', { version: '1.7.2', lockfileVersion: 3, packages: { '': { name: 'fixture-only', version: '1.7.2' } } });
  put('evidence.txt', 'Fixture evidence only');
  put('_ds_manifest.json', { components: [{ name: 'Fixture', kind: 'component', sourcePath: 'fixture.jsx' }] });
  put('components/maintainers.json', { schemaVersion: 1, maintainers: [{ name: 'fixture-owner', roles: ['owner'] }, { name: 'fixture-reviewer', roles: ['reviewer'] }] });
  const compatibility = JSON.parse(readFileSync('components/release-compatibility.json','utf8'));
  compatibility.pendingChanges = [];
  put('components/release-compatibility.json',compatibility);
  const lifecycle = { supportContractVersion: 1, components: { Fixture: { status: 'stable', kind: 'component', sourcePath: 'fixture.jsx', support: {
    reviewState: 'reviewed', owner: 'fixture-owner', reviewedBy: 'fixture-reviewer', reviewedAt: '2026-10-20T00:00:00Z', environments: ['Isolated test fixture'], axes: ['Fixture only'], limitations: ['Not product acceptance'], deprecation: null,
    evidence: [{ path: 'evidence.txt', sha256: hash('Fixture evidence only'), checkedAt: '2026-10-20T00:00:00Z', scope: 'Fixture only' }],
  } } } };
  put('components/lifecycle.json', lifecycle);
  const state = { dirty: '', tags: [], taggedSha: sourceSha, untracked: '', patch: 'diff --git a/VERSION b/VERSION\n-1.7.2\n+1.7.3\n' };
  const calls = [];
  const runGit = (_, args) => {
    calls.push(args);
    if (args[0] === 'rev-parse') return args.at(-1).startsWith('refs/tags/') ? state.taggedSha : sourceSha;
    if (args[0] === 'status') return state.dirty;
    if (args[0] === 'tag') return state.tags.join('\n');
    if (args[0] === 'ls-files') return state.untracked;
    if (args[0] === 'diff') return state.patch;
    throw Error('Unexpected git command: ' + args.join(' '));
  };
  const initial = planRelease(root, { version: '1.7.3', sourceSha }, { runGit });
  for (const path of initial.authoredStamps.slice(3)) put(path, '# Current VERSION **1.7.2**; unrelated 1.7.20 stays.\n## Release — 1.7.2\nPublished 1.7.2 history.\n');
  return { root, put, lifecycle, state, runGit, calls };
}
const fx = fixture();
try {
  const options = { version: '1.7.3', sourceSha }, dependencies = { runGit: fx.runGit };
  const before = readFileSync(join(fx.root, 'VERSION'), 'utf8');
  assert.equal(planRelease(fx.root, options, dependencies).readyToPrepare, true);
  assert.equal(readFileSync(join(fx.root, 'VERSION'), 'utf8'), before, 'Default planning cannot write version files');
  assert.equal(planRelease(fx.root, options, dependencies).mode, 'plan');
  for (const version of ['1.7.2', '1.7.1', '01.8.0', '1.8.0-beta.01', '1.8.0;touch /tmp/no', '1.8']) assert.throws(() => planRelease(fx.root, { ...options, version }, dependencies));
  assert.equal(planRelease(fx.root, {...options, version:'2.0.0-alpha.0'}, dependencies).readyToPrepare, true, 'A canonical prerelease may be prepared only when the same fixture gates pass');
  assert.throws(() => planRelease(fx.root, { ...options, sourceSha: otherSha }, dependencies), /checked-out HEAD/);
  assert.throws(() => planRelease(fx.root, { ...options, sourceSha: '--help' }, dependencies), /exact lowercase/);
  fx.state.dirty = ' M component.jsx';
  assert.equal(planRelease(fx.root, options, dependencies).readyToPrepare, false);
  assert.throws(() => prepareRelease(fx.root, options, dependencies), /not clean/);
  fx.state.dirty = '';
  fx.state.tags = ['v1.7.3'];
  assert.throws(() => prepareRelease(fx.root, options, dependencies), /already exists/);
  fx.state.tags = [];
  fx.lifecycle.components.Fixture.support.reviewState = 'unreviewed';
  fx.lifecycle.components.Fixture.support.reviewedBy = null;
  fx.lifecycle.components.Fixture.support.reviewedAt = null;
  fx.put('components/lifecycle.json', fx.lifecycle);
  assert.throws(() => prepareRelease(fx.root, options, dependencies), /fresh authorized support review/);
  assert.throws(() => prepareRelease(fx.root, {...options, version:'2.0.0-alpha.0'}, dependencies), /fresh authorized support review/, 'Prerelease naming cannot bypass human support review');
  fx.lifecycle.components.Fixture.support.reviewState = 'reviewed';
  fx.lifecycle.components.Fixture.support.reviewedBy = 'fixture-reviewer';
  fx.lifecycle.components.Fixture.support.reviewedAt = '2026-10-20T00:00:00Z';
  fx.put('components/lifecycle.json', fx.lifecycle);
  fx.put('evidence.txt', 'Changed fixture evidence');
  assert.throws(() => prepareRelease(fx.root, options, dependencies), /Support evidence changed/);
  fx.put('evidence.txt', 'Fixture evidence only');
  const evidenceBefore = readFileSync(join(fx.root, 'components/lifecycle.json'), 'utf8');
  let regenerations = 0;
  const receipt = prepareRelease(fx.root, options, { ...dependencies, regenerate: () => { regenerations++; } });
  assert.equal(regenerations, 1); assert.equal(receipt.candidateValidated, false);
  assert.equal(receipt.patchSha256, hash(fx.state.patch), 'Patch receipt hashes exact bytes including trailing newline');
  assert.equal(readFileSync(join(fx.root, 'components/lifecycle.json'), 'utf8'), evidenceBefore, 'No synthetic support approval');
  assert.match(readFileSync(join(fx.root, 'README.md'), 'utf8'), /1\.7\.20 stays/);
  const notes = readFileSync(join(fx.root, 'docs/release-notes.md'), 'utf8');
  assert.match(notes, /Current VERSION \*\*1\.7\.3\*\*/); assert.match(notes, /Release — 1\.7\.2\nPublished 1\.7\.2 history/);
  assert.equal(verifyPreparedCandidate(fx.root, options, receipt, dependencies).publicationAuthorized, false);
  fx.state.patch += '+changed after testing\n';
  assert.throws(() => verifyPreparedCandidate(fx.root, options, receipt, dependencies), /patch changed/);
  fx.state.patch = fx.state.patch.replace('+changed after testing\n', '');
  fx.state.tags = ['v1.7.3']; fx.state.taggedSha = otherSha;
  assert.throws(() => verifyTagIdentity(fx.root, options, dependencies), /different source commit/);
  fx.state.taggedSha = sourceSha;
  assert.equal(verifyTagIdentity(fx.root, options, dependencies).identityVerified, true);
  assert(fx.calls.every(args => ['rev-parse', 'tag', 'status', 'ls-files', 'diff'].includes(args[0])), 'Only read-only Git commands are allowed');
  assert(fx.calls.filter(args => args[0] === 'tag').every(args => args[1] === '--list'), 'Never create a tag');
  for (const args of [[], ['--version', '1.7.3'], ['--version', '1.7.3', '--source-sha', sourceSha, '--publish'], ['--version', '1.7.3', '--source-sha', sourceSha, '--write', '--verify-tag']]) assert.throws(() => parseArguments(args));
  assert.equal(parseArguments(['--version', '1.7.3', '--source-sha', sourceSha]).write, false);
} finally { rmSync(fx.root, { recursive: true, force: true }); }
// Exercise the real default regeneration path, rather than an injected substitute.
const pinned = fixture();
const inheritedPath = process.env.PATH;
try {
  const repository = fileURLToPath(new URL('../../', import.meta.url));
  const actualPackage = JSON.parse(readFileSync(join(repository, 'package.json'), 'utf8'));
  pinned.put('package.json', {
    name: 'fixture-only', version: '1.7.2', packageManager: actualPackage.packageManager,
    scripts: { 'tokens:generate': 'node regenerate.mjs' },
  });
  pinned.put('regenerate.mjs', "import {writeFileSync} from 'node:fs'; writeFileSync('regenerated.json',JSON.stringify({node:process.execPath,npm:process.env.npm_execpath,cwd:process.cwd()}));\n");
  const fixtureDirectory = join(pinned.root, '_audit/ci/fixtures');
  mkdirSync(fixtureDirectory, { recursive: true });
  const lockedFixture = join(repository, '_audit/ci/fixtures/npm-cli');
  symlinkSync(lockedFixture, join(fixtureDirectory, 'npm-cli'), process.platform === 'win32' ? 'junction' : 'dir');
  const conflicting = join(pinned.root, 'conflicting-path');
  mkdirSync(conflicting);
  writeFileSync(join(conflicting, 'npm'), '#!/bin/sh\nexit 91\n');
  chmodSync(join(conflicting, 'npm'), 0o755);
  writeFileSync(join(conflicting, 'npm.cmd'), '@exit /b 91\r\n');
  process.env.PATH = conflicting + delimiter + (inheritedPath || '');
  const supportBefore = readFileSync(join(pinned.root, 'components/lifecycle.json'), 'utf8');
  const prepared = prepareRelease(pinned.root, { version: '1.7.3', sourceSha }, { runGit: pinned.runGit });
  assert.equal(prepared.filesPrepared, true);
  assert(existsSync(join(pinned.root, 'regenerated.json')), 'Default preparation must execute actual regeneration');
  const observed = JSON.parse(readFileSync(join(pinned.root, 'regenerated.json'), 'utf8'));
  assert.equal(observed.node, process.execPath, 'Default regeneration retains the invoking Node executable');
  assert.equal(realpathSync(observed.npm), realpathSync(join(lockedFixture, 'node_modules/npm/bin/npm-cli.js')), 'Default regeneration uses the pinned CLI despite conflicting PATH npm');
  assert.equal(realpathSync(observed.cwd), realpathSync(pinned.root), 'Regeneration runs in the candidate checkout');
  assert.equal(readFileSync(join(pinned.root, 'components/lifecycle.json'), 'utf8'), supportBefore, 'Actual regeneration cannot fabricate support approval');
} finally {
  if (inheritedPath === undefined) delete process.env.PATH; else process.env.PATH = inheritedPath;
  rmSync(pinned.root, { recursive: true, force: true });
}
const mutating = fixture();
try {
  assert.throws(() => prepareRelease(mutating.root, { version: '1.7.3', sourceSha }, { runGit: mutating.runGit, regenerate: () => mutating.put('components/lifecycle.json', {}) }), /must not rewrite support approvals/);
} finally { rmSync(mutating.root, { recursive: true, force: true }); }
const mutatingPolicy = fixture();
try {
  assert.throws(() => prepareRelease(mutatingPolicy.root, { version: '1.7.3', sourceSha }, {
    runGit: mutatingPolicy.runGit,
    regenerate: () => {
      const path = join(mutatingPolicy.root, 'components/release-compatibility.json');
      const policy = JSON.parse(readFileSync(path, 'utf8'));
      policy.deprecations.push({ id: 'invented', announcedAt: '2026-01-01' });
      mutatingPolicy.put('components/release-compatibility.json', policy);
    },
  }), /must not rewrite release classifications or notice\/publication evidence/);
} finally { rmSync(mutatingPolicy.root, { recursive: true, force: true }); }
const workflowText = readFileSync('.github/workflows/release.yml', 'utf8');
const workflow = parse(workflowText);
assert.deepEqual(workflow.permissions, { contents: 'read' });
assert.deepEqual(Object.keys(workflow.on), ['workflow_dispatch']);
assert.equal(workflow.on.workflow_dispatch.inputs.accept_evidence_review.default, false);
const steps = workflow.jobs.prepare.steps;
const reviewedLocalSetup = './.github/actions/setup-npm';
const setupAction = parse(readFileSync('.github/actions/setup-npm/action.yml', 'utf8'));
function assertReviewedAction(uses, localAction) {
  if (uses !== reviewedLocalSetup) {
    assert(!/^[./]/.test(uses), 'Only the exact reviewed local setup action is permitted');
    assert.match(uses, /@[a-f0-9]{40}$/, 'External actions must be SHA-pinned');
    return;
  }
  assert.deepEqual(Object.keys(localAction).sort(), ['description', 'name', 'runs'], 'Local setup metadata must retain the reviewed shape');
  assert.deepEqual(Object.keys(localAction.runs).sort(), ['steps', 'using']);
  assert.equal(localAction.runs.using, 'composite');
  assert.equal(localAction.runs.steps.length, 1, 'Local setup must have only its reviewed bootstrap step');
  const bootstrap = localAction.runs.steps[0];
  assert.deepEqual(Object.keys(bootstrap).sort(), ['name', 'run', 'shell'], 'No nested actions, conditional steps or injected environments');
  assert.equal(typeof bootstrap.name, 'string');
  assert.equal(bootstrap.shell, 'bash');
  assert.equal(bootstrap.run, 'node scripts/bootstrap-toolchain.mjs --github-path', 'Local action may only run the reviewed locked bootstrap');
}
for (const step of steps.filter(step => step.uses)) assertReviewedAction(step.uses, setupAction);
for (const uses of ['./.github/actions/other', './.github/actions/setup-npm/extra', '../setup-npm', '/setup-npm', './other@' + sourceSha,
  'actions/checkout@main', 'actions/checkout@' + sourceSha.slice(1), 'actions/checkout@' + sourceSha + ' --flag']) {
  assert.throws(() => assertReviewedAction(uses, setupAction), /reviewed local|SHA-pinned/);
}
for (const mutate of [action => action.runs.using = 'node20', action => action.runs.steps.push({uses:'actions/checkout@' + sourceSha}),
  action => action.runs.steps[0] = {uses:'actions/checkout@' + sourceSha}, action => action.runs.steps[0].run = 'npm publish',
  action => action.runs.steps[0].run += '\ngit push', action => action.runs.steps[0].env = {BASH_ENV:'unreviewed.sh'},
  action => action.runs.steps[0].shell = 'pwsh']) {
  const changed = structuredClone(setupAction); mutate(changed);
  assert.throws(() => assertReviewedAction(reviewedLocalSetup, changed));
}

assert.equal(steps.find(step => step.uses?.startsWith('actions/checkout')).with['persist-credentials'], false);
assert.equal(steps.find(step => step.uses?.startsWith('actions/setup-node')).with['node-version'], '22');
const commands = steps.map(step => step.run || '').join('\n');
assert(commands.includes('npm ci') && commands.includes('npm run verify\n') && commands.includes('npm run verify:browser'));
assert(commands.includes('test-component-lifecycle.mjs') && commands.includes('--check-candidate'));
assert(commands.includes('playwright install --with-deps chromium firefox webkit'));
assert(!/\b(?:git\s+(?:commit|push)|npm\s+publish|gh\s+release)\b/.test(commands), 'Preparation cannot publish or change remote identities');
assert(!/\$\{\{\s*inputs\./.test(commands), 'Untrusted dispatch inputs must use quoted environment variables, not shell interpolation');
console.log('PASS release preparation: read-only planning, exact identity, review/staleness/dirty/tag guards, deterministic version/stamps, preserved history, evidence integrity, candidate drift, immutable tag check and read-only externally SHA-pinned workflow with exact reviewed local bootstrap');
