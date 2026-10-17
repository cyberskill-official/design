/** Outcome reports must prove their result; all fixtures run without network or real secrets. */
import assert from 'node:assert/strict';
import { mkdtempSync, realpathSync, readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { classifyCiReport, recordCiVerdict } from './ci-verdict.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const scratch = realpathSync(mkdtempSync(join(tmpdir(), 'cs-verdict-')));
const cli = join(root, '_audit/ci/ci-verdict.mjs');
const contexts = [
  { name: 'local', env: {}, protected: false },
  { name: 'pull-request', env: { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'pull_request', GITHUB_REF: 'refs/pull/1/merge' }, protected: false },
  { name: 'main', env: { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/heads/main' }, protected: true },
  { name: 'schedule', env: { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'schedule', GITHUB_REF: 'refs/heads/main' }, protected: true },
];
const valid = [
  ['success', { ok: true, skipped: false }, 0, 'Live success', 'PASS'],
  ['dry_run', { ok: true, dryRun: true }, 0, 'Dry-run OK', 'DRY-RUN'],
  ['local_pack', { ok: true, localPack: true }, 0, 'Local-pack proof', 'LOCAL-PACK'],
  ['readiness', { ok: true, kind: 'readiness', dryRun: false, secretsPresent: true, submit: false }, 0, 'Readiness check', 'READINESS'],
  ['soft_skip', { skipped: true, reason: 'missing_secrets' }, 0, 'Soft-skip', 'SOFT-SKIP'],
  ['hard_fail', { ok: false, dryRun: true, message: 'fixture operation failed' }, 1, 'Failure', 'HARD-FAIL'],
];
const invalid = [null, [], 'success', {}, { skipped: false }, { ok: 'true' }, { ok: 1 },
  { ok: true, skipped: 'false' }, { ok: true, dryRun: 'true' }, { ok: true, localPack: 1 },
  { skipped: true }, { skipped: true, reason: '' }, { skipped: true, reason: 'x', ok: true },
  { skipped: true, reason: 'x', dryRun: true }, { skipped: true, reason: 'x', localPack: true },
  { ok: true, kind: 'waived' }, { ok: true, kind: 'soft_skip' }, { ok: true, kind: 'hard_fail' },
  { ok: false, kind: 'success' }, { ok: true, dryRun: true, kind: 'success' },
  { ok: true, localPack: true, kind: 'readiness' }, { ok: true, dryRun: true, localPack: true },
  { ok: true, kind: 'dry_run' }, { ok: true, kind: 'local_pack' },
  { ok: true, channel: [] }, { ok: true, channel: '' }, { ok: true, message: false }, { ok: true, reason: {} },
];
let executions = 0;
function runReport(report, context, name) {
  const file = join(scratch, name + '.json');
  const summary = join(scratch, name + '.md');
  writeFileSync(file, JSON.stringify(report));
  const result = spawnSync(process.execPath, [cli, '--assert-report', file], {
    env: { ...context.env, GITHUB_STEP_SUMMARY: summary }, encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.signal, null, result.stderr);
  assert(!result.error, String(result.error));
  executions++;
  return { ...result, summary: existsSync(summary) ? readFileSync(summary, 'utf8') : '' };
}
try {
  for (const context of contexts) {
    for (const [kind, report, exitCode, banner, label] of valid) {
      assert.equal(classifyCiReport(report).kind, kind);
      const result = runReport(report, context, context.name + '-' + kind);
      assert.equal(result.status, exitCode, result.stderr);
      assert(result.summary.includes(banner), result.summary);
      assert(result.stdout.startsWith(label + ' '), result.stdout);
      if (kind !== 'success') assert(!result.summary.includes('### Live success') && !result.stdout.includes('PASS '));
      if (context.env.GITHUB_ACTIONS && kind === 'hard_fail') assert(result.stderr.startsWith('::error title=HARD-FAIL::'));
      if (context.env.GITHUB_ACTIONS && kind === 'soft_skip') {
        assert(result.stderr.startsWith(context.protected ? '::error title=SOFT-SKIP' : '::warning title=SOFT-SKIP'));
      }
      if (!context.env.GITHUB_ACTIONS) assert.equal(result.stderr, '');
    }
    for (const [index, report] of invalid.entries()) {
      assert.throws(() => classifyCiReport(report));
      const result = runReport(report, context, context.name + '-invalid-' + index);
      assert.equal(result.status, 1, result.stdout);
      assert(result.stderr.includes('FAIL ci-verdict') && !result.stdout.includes('PASS '));
      assert(result.summary.includes('HARD-FAIL') && !result.summary.includes('Live success'));
      if (context.env.GITHUB_ACTIONS) assert(result.stderr.includes('::error title=HARD-FAIL::'));
    }
  }
  const injected = runReport({ ok: true, message: 'first%line\r\n::error title=INJECTED::second' }, contexts[2], 'annotation-escaping');
  assert.equal(injected.status, 0);
  assert.equal(injected.stderr.trim().split('\n').length, 1, 'External report text cannot create another workflow command');
  assert(injected.stderr.includes('first%25line%0D%0A::error title=INJECTED::second'));
  for (const content of ['{not valid JSON', '']) {
    const file = join(scratch, 'malformed.json');writeFileSync(file, content);
    const result = spawnSync(process.execPath, [cli, '--assert-report', file], { encoding: 'utf8', env: {}, timeout: 10000 });
    assert.equal(result.status, 1);assert(result.stderr.includes('Cannot read valid report JSON'));
    assert(!result.stdout.includes('PASS '));executions++;
  }
  const missing = spawnSync(process.execPath, [cli, '--assert-report', join(scratch, 'absent.json')], { encoding: 'utf8', env: {}, timeout: 10000 });
  assert.equal(missing.status, 1);assert(!missing.stdout.includes('PASS '));executions++;
  assert.throws(() => recordCiVerdict({ channel: 'fixture', kind: 'made_up', env: {} }));
  assert.throws(() => recordCiVerdict({ channel: 'fixture', kind: 'soft_skip', env: {} }));
  assert.throws(() => recordCiVerdict({ channel: '', kind: 'success', env: {} }));

  // Exercise the current report writers in an isolated source fixture. Dummy
  // presence values prove configuration only; these helpers never build/sign/upload.
  const fixture = join(scratch, 'fixture');
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0');
  const paths = new Set(files.filter(path => /^(examples\/native\/|tokens\/native\/)/.test(path)));
  for (const path of ['_audit/ci/ci-verdict.mjs', '_audit/ci/native-store-dry-run.mjs',
    '_ds_manifest.json', 'package.json', 'package-lock.json', 'components']) paths.add(path);
  for (const path of paths) {
    if (!existsSync(join(root, path))) continue;
    mkdirSync(dirname(join(fixture, path)), { recursive: true });cpSync(join(root, path), join(fixture, path), {recursive:true});
  }
  symlinkSync(join(root,'node_modules'),join(fixture,'node_modules'),'dir');
  execFileSync('git',['init','-q'],{cwd:fixture,stdio:'ignore'});
  for (const [name, args, extraEnv, expected] of [
    ['native-dry', ['native-store-dry-run.mjs', '--dry-run'], {}, 'dry_run'],
    ['native-missing', ['native-store-dry-run.mjs'], {}, 'soft_skip'],
    ['native-ready', ['native-store-dry-run.mjs'], { ASC_KEY_ID: 'fixture', ASC_ISSUER_ID: 'fixture', ASC_KEY_P8: 'fixture', PLAY_SERVICE_ACCOUNT_JSON: 'fixture' }, 'readiness'],
  ]) {
    const result = spawnSync(process.execPath, [join(fixture, '_audit/ci', args[0]), ...args.slice(1)], {
      env: { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'pull_request', ...extraEnv }, encoding: 'utf8', timeout: 120000,
    });
    assert.equal(result.status, 0, result.stderr);executions++;
    const reportFile = join(fixture, '_audit/ci/native-store-report.json');
    const report = JSON.parse(readFileSync(reportFile, 'utf8'));
    assert.equal(classifyCiReport(report).kind, expected);
    assert(!result.stderr.includes('title=SUCCESS') && !result.stderr.includes('::native-store live success'));
    if (name === 'native-ready') assert.equal(report.submit, false);
    const replay = spawnSync(process.execPath, [cli, '--assert-report', reportFile], { env: {}, encoding: 'utf8', timeout: 10000 });
    assert.equal(replay.status, 0, replay.stderr);assert(!replay.stdout.startsWith('PASS '));executions++;
  }
  console.log(`PASS CI verdicts: ${executions} isolated executions; six outcomes, four CI contexts, ${invalid.length} invalid shapes, annotation escaping and actual native report replay. Soft-skips remain exit 0; no live service operation.`);
} finally { rmSync(scratch, { recursive: true, force: true }); }
