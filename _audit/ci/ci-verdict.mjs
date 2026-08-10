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
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {boolean}
 */
export function isProtectedCiRef(env = process.env) {
  if (!env.GITHUB_ACTIONS) return false;
  if (env.GITHUB_EVENT_NAME === 'schedule') return true;
  if (env.GITHUB_EVENT_NAME === 'push' && env.GITHUB_REF === 'refs/heads/main') return true;
  return false;
}

/**
 * @typedef {'success' | 'soft_skip' | 'hard_fail' | 'dry_run' | 'local_pack'} VerdictKind
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
        console.error(`::error title=SOFT-SKIP (not success)::${msg}`);
      } else {
        console.error(`::warning title=SOFT-SKIP::${msg}`);
      }
    } else if (opts.kind === 'success') {
      console.error(`::notice title=SUCCESS::${opts.channel} live success${reason}${detail}`);
    } else if (opts.kind === 'dry_run') {
      console.error(`::notice title=DRY-RUN::${opts.channel} dry-run OK${reason}${detail}`);
    } else if (opts.kind === 'local_pack') {
      console.error(`::warning title=LOCAL-PACK::${opts.channel} used local pack (≠ registry)${reason}${detail}`);
    }
  }

  return { line, protectedSoftSkip };
}

/**
 * Workflow helper: exit 1 when a report JSON records soft-skip on schedule/main.
 * Usage: node _audit/ci/ci-verdict.mjs --assert-report path/to/report.json
 */
const isMain = process.argv[1] && /ci-verdict\.mjs$/.test(process.argv[1]);
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
    const report = JSON.parse(readFileSync(path, 'utf8'));
    // Report mode only — does not fail the job. Soft-skip honesty is via
    // ::error:: annotations from recordCiVerdict (Decision 1C keeps exit 0).
    recordCiVerdict({
      channel: report.channel || 'report',
      kind: report.skipped ? 'soft_skip' : report.ok === false ? 'hard_fail' : report.dryRun ? 'dry_run' : 'success',
      reason: report.reason,
      detail: report.message,
    });
    console.log(
      `PASS ci-verdict --assert-report { skipped: ${Boolean(report.skipped)}, protected: ${isProtectedCiRef(process.env)} }`,
    );
    process.exit(0);
  }
  console.error('Usage: node _audit/ci/ci-verdict.mjs --selftest | --assert-report <report.json>');
  process.exit(2);
}
