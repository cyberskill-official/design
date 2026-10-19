#!/usr/bin/env node
/**
 * FIND-095 — Soft-skip vs real success must be distinguishable on CI runs.
 *
 * Writes a one-line verdict to $GITHUB_STEP_SUMMARY (public run page) and emits
 * a ::warning:: / ::notice:: annotation. Soft-skip never looks identical to
 * success in the Actions UI annotation stream.
 *
 * On schedule or push to main, soft-skip additionally sets process exit marker
 * via returned `{ honesty: 'soft_skip_on_protected' }` so callers / workflow
 * steps can fail closed when green-must-mean-live (optional integrations keep
 * exit 0 from their softSkip helpers; workflow honesty steps enforce).
 */
import { appendFileSync, existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const verdictKinds = new Set(['success', 'soft_skip', 'hard_fail', 'dry_run', 'local_pack', 'readiness']);
const escapeAnnotation = value => value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');

/** Interpret explicit results; missing or contradictory flags cannot become success. */
export function classifyCiReport(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) throw Error('Report must be an object');
  for (const key of ['skipped', 'ok', 'dryRun', 'localPack']) {
    if (key in report && typeof report[key] !== 'boolean') throw Error(`Report ${key} must be boolean`);
  }
  for (const key of ['channel', 'reason', 'message']) {
    if (key in report && (typeof report[key] !== 'string' || !report[key].trim())) throw Error(`Report ${key} must be a nonempty string`);
  }
  if ('kind' in report && !verdictKinds.has(report.kind)) throw Error('Unsupported report kind');
  let kind;
  if (report.skipped === true) {
    if (!report.reason) throw Error('Skipped report requires a reason');
    if (report.ok === true || report.dryRun === true || report.localPack === true || (report.kind && report.kind !== 'soft_skip')) throw Error('Skipped report has a contradictory outcome');
    kind = 'soft_skip';
  } else {
    if (typeof report.ok !== 'boolean') throw Error('Executed report requires an explicit ok result');
    if (report.ok === false) {
      if (report.kind && report.kind !== 'hard_fail') throw Error('Failed report has a contradictory kind');
      kind = 'hard_fail';
    } else {
      if (report.dryRun === true && report.localPack === true) throw Error('Report has conflicting execution modes');
      kind = report.kind || (report.dryRun === true ? 'dry_run' : report.localPack === true ? 'local_pack' : 'success');
      if (kind === 'soft_skip' || kind === 'hard_fail') throw Error('Successful report has a contradictory kind');
      if (report.dryRun === true && kind !== 'dry_run') throw Error('Dry-run report has a contradictory kind');
      if (report.localPack === true && kind !== 'local_pack') throw Error('Local-pack report has a contradictory kind');
      if (kind === 'dry_run' && report.dryRun !== true) throw Error('Dry-run kind requires dryRun: true');
      if (kind === 'local_pack' && report.localPack !== true) throw Error('Local-pack kind requires localPack: true');
    }
  }
  return { channel: report.channel || 'report', kind, reason: report.reason, detail: report.message };
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {boolean}
 */
function isProtectedCiRef(env = process.env) {
  if (!env.GITHUB_ACTIONS) return false;
  if (env.GITHUB_EVENT_NAME === 'schedule') return true;
  if (env.GITHUB_EVENT_NAME === 'push' && env.GITHUB_REF === 'refs/heads/main') return true;
  return false;
}

/**
 * @typedef {'success' | 'soft_skip' | 'hard_fail' | 'dry_run' | 'local_pack' | 'readiness'} VerdictKind
 */

/**
 * @param {{
 *   channel: string,
 *   kind: VerdictKind,
 *   reason?: string,
 *   detail?: string,
 *   env?: NodeJS.ProcessEnv,
 * }} opts
 * @returns {{ line: string, protectedSoftSkip: boolean }}
 */
export function recordCiVerdict(opts) {
  if (!verdictKinds.has(opts.kind)) throw Error('Unsupported verdict kind');
  if (typeof opts.channel !== 'string' || !opts.channel.trim()) throw Error('Verdict requires a channel');
  for (const key of ['reason', 'detail']) {
    if (opts[key] !== undefined && typeof opts[key] !== 'string') throw Error(`Verdict ${key} must be a string`);
  }
  if (opts.kind === 'soft_skip' && !opts.reason?.trim()) throw Error('Soft-skip verdict requires a reason');
  const env = opts.env || process.env;
  const reason = opts.reason ? ` (${opts.reason})` : '';
  const detail = opts.detail ? ` — ${opts.detail}` : '';
  const label = String(opts.kind).toUpperCase().replace(/_/g, '-');
  const line = `**${opts.channel}:** \`${label}${reason}\`${detail}`;
  const protectedSoftSkip = opts.kind === 'soft_skip' && isProtectedCiRef(env);

  if (env.GITHUB_STEP_SUMMARY) {
    try {
      const banner =
        opts.kind === 'soft_skip'
          ? '### Soft-skip (not a live success)\n\n'
          : opts.kind === 'success'
            ? '### Live success\n\n'
            : opts.kind === 'dry_run'
              ? '### Dry-run OK\n\n'
              : opts.kind === 'readiness'
                ? '### Readiness check (no live operation)\n\n'
                : opts.kind === 'local_pack'
                ? '### Local-pack proof (not registry)\n\n'
                : '### Failure\n\n';
      appendFileSync(env.GITHUB_STEP_SUMMARY, `${banner}${line}\n\n`, 'utf8');
    } catch (_) {
      /* ignore summary write failures */
    }
  }

  if (env.GITHUB_ACTIONS) {
    if (opts.kind === 'soft_skip') {
      const msg = `${opts.channel} SOFT-SKIP${reason}${detail} — not identical to live success (FIND-095)`;
      // On schedule/main use ::error:: so the run is not a silent green success;
      // Decision 1C still exits 0 (soft-skip), but the annotation is distinct.
      if (protectedSoftSkip) {
        console.error(`::error title=SOFT-SKIP (not success)::${escapeAnnotation(msg)}`);
      } else {
        console.error(`::warning title=SOFT-SKIP::${escapeAnnotation(msg)}`);
      }
    } else if (opts.kind === 'success') {
      console.error(`::notice title=SUCCESS::${escapeAnnotation(`${opts.channel} live success${reason}${detail}`)}`);
    } else if (opts.kind === 'dry_run') {
      console.error(`::notice title=DRY-RUN::${escapeAnnotation(`${opts.channel} dry-run OK${reason}${detail}`)}`);
    } else if (opts.kind === 'local_pack') {
      console.error(`::warning title=LOCAL-PACK::${escapeAnnotation(`${opts.channel} used local pack (≠ registry)${reason}${detail}`)}`);
    } else if (opts.kind === 'readiness') {
      console.error(`::notice title=READINESS::${escapeAnnotation(`${opts.channel} readiness check; no live operation${reason}${detail}`)}`);
    } else if (opts.kind === 'hard_fail') {
      console.error(`::error title=HARD-FAIL::${escapeAnnotation(`${opts.channel} failed${reason}${detail}`)}`);
    }
  }

  return { line, protectedSoftSkip };
}

/**
 * Workflow helper: invalid/failed reports exit 1; explicit optional soft-skips
 * retain Decision 1C's exit 0 and distinct annotations.
 * Usage: node _audit/ci/ci-verdict.mjs --assert-report path/to/report.json
 */
const isMain = process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) {
  const args = process.argv.slice(2);
  if (args[0] === '--selftest') {
    const r = recordCiVerdict({
      channel: 'selftest',
      kind: 'soft_skip',
      reason: 'unit',
      env: {},
    });
    if (!/SOFT-SKIP/.test(r.line) && !/soft_skip/i.test(r.line)) {
      console.error('FAIL ci-verdict selftest');
      process.exit(1);
    }
    console.log('PASS ci-verdict --selftest');
    process.exit(0);
  }
  if (args[0] === '--assert-report') {
    const path = args[1];
    if (!path || !existsSync(path)) {
      console.error(`FAIL ci-verdict --assert-report: missing ${path || '(no path)'}`);
      process.exit(1);
    }
    try {
      let report;
      try { report = JSON.parse(readFileSync(path, 'utf8')); }
      catch { throw Error('Cannot read valid report JSON'); }
      const verdict = classifyCiReport(report);
      recordCiVerdict(verdict);
      const label = verdict.kind === 'success' ? 'PASS' : verdict.kind.toUpperCase().replaceAll('_', '-');
      console.log(`${label} ci-verdict --assert-report { kind: ${verdict.kind}, protected: ${isProtectedCiRef(process.env)} }`);
      process.exit(verdict.kind === 'hard_fail' ? 1 : 0);
    } catch (error) {
      recordCiVerdict({ channel: 'ci-verdict', kind: 'hard_fail', reason: 'invalid_report', detail: error.message });
      console.error(`FAIL ci-verdict --assert-report: ${error.message}`);
      process.exit(1);
    }
  }
  console.error('Usage: node _audit/ci/ci-verdict.mjs --selftest | --assert-report <report.json>');
  process.exit(2);
}
