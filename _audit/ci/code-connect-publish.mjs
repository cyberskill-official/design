#!/usr/bin/env node
/**
 * Code Connect parse / publish with Decision 1C soft-skip posture.
 *
 * Soft-skips (exit 0 + report) when:
 *   - FIGMA_TOKEN / FIGMA_FILE_KEY missing
 *   - Figma API returns 403 / 404 / 429 (or Enterprise/plan blocks)
 *   - CLI exits non-zero with those statuses in stderr
 *
 * Usage:
 *   node _audit/ci/code-connect-publish.mjs --dry-run   # parse only, no network needed for local file discovery
 *   node _audit/ci/code-connect-publish.mjs --parse      # figma connect parse (needs @figma/code-connect)
 *   node _audit/ci/code-connect-publish.mjs             # publish (needs secrets)
 *
 * Token: prefers FIGMA_TOKEN (repo convention); also accepts FIGMA_ACCESS_TOKEN (CLI default).
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { recordCiVerdict } from './ci-verdict.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT = join(root, '_audit/ci/code-connect-report.json');
const PLACEHOLDER = 'CS_FIGMA_FILE_KEY';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const parseOnly = args.has('--parse') || dryRun;

export function resolveToken() {
  return process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN || '';
}

export function isSoftSkippableCodeConnectError(err) {
  const msg = String(err?.message || err || '');
  return /\b403\b/.test(msg)
    || /\b404\b/.test(msg)
    || /\b429\b/.test(msg)
    || /Rate limit/i.test(msg)
    || /Too many requests/i.test(msg)
    || /Invalid scope/i.test(msg)
    || /Enterprise/i.test(msg)
    || /Organization plan/i.test(msg)
    || /not (found|available)/i.test(msg)
    || /Code Connect.*(not|isn't) available/i.test(msg)
    || /does not have access/i.test(msg);
}

function writeReport(payload) {
  try {
    writeFileSync(REPORT, JSON.stringify({ ...payload, at: new Date().toISOString() }, null, 2) + '\n');
  } catch (_) { /* ignore */ }
}

function softSkip(reason, detail) {
  console.error('');
  console.error(`SOFT SKIP — Code Connect (${reason}).`);
  if (detail) console.error(detail);
  console.error('See docs/figma.md. Decision 1C: live path, soft-skip when secrets/API missing.');
  writeReport({ skipped: true, reason, message: detail || reason, channel: 'code-connect' });
  recordCiVerdict({ channel: 'code-connect', kind: 'soft_skip', reason, detail });
  process.exit(0);
}

function countMappings() {
  const mapPath = join(root, 'code-connect/node-map.json');
  if (!existsSync(mapPath)) return { total: 0, published: 0 };
  const map = JSON.parse(readFileSync(mapPath, 'utf8'));
  const nodes = Object.values(map.nodes || {});
  return {
    total: nodes.length,
    published: nodes.filter((n) => n && n.published).length,
  };
}

function runFigmaCli(cliArgs, { cwd, env }) {
  const r = spawnSync('npx', ['--no-install', 'figma', 'connect', ...cliArgs], {
    cwd,
    env,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return {
    status: r.status,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    error: r.error,
  };
}

function main() {
  const counts = countMappings();
  console.log(`Code Connect mappings: ${counts.total} in node-map (${counts.published} marked published)`);

  if (dryRun && !args.has('--parse')) {
    // Local/CI dry-run without requiring the CLI binary to hit the network:
    // prove config + generated files exist.
    const cfg = join(root, 'figma.config.json');
    if (!existsSync(cfg)) throw new Error('figma.config.json missing');
    const config = JSON.parse(readFileSync(cfg, 'utf8'));
    if (config?.codeConnect?.parser !== 'react') throw new Error('figma.config.json parser must be react');
    const include = config.codeConnect.include || [];
    if (!include.some((p) => String(p).includes('.figma.tsx'))) {
      throw new Error('figma.config.json include must cover *.figma.tsx');
    }
    if (counts.total < 105) {
      throw new Error(`expected ≥105 primaries in node-map, got ${counts.total}`);
    }
    // Spot-check high-traffic files exist
    for (const rel of [
      'components/button/Button.figma.tsx',
      'components/textfield/TextField.figma.tsx',
      'components/dialog/Dialog.figma.tsx',
      'components/data/Card.figma.tsx',
      'components/feedback/Alert.figma.tsx',
    ]) {
      if (!existsSync(join(root, rel))) throw new Error(`missing ${rel}`);
    }
    console.log('Dry-run OK — figma.config.json + ≥105 mappings present (no network).');
    writeReport({ dryRun: true, skipped: false, channel: 'code-connect', ...counts });
    recordCiVerdict({
      channel: 'code-connect',
      kind: 'dry_run',
      detail: `${counts.total} mappings`,
    });
    return;
  }

  const token = resolveToken();
  const fileKey = process.env.FIGMA_FILE_KEY || '';

  if (!token || !fileKey) {
    softSkip(
      'missing_secrets',
      'FIGMA_TOKEN (or FIGMA_ACCESS_TOKEN) and/or FIGMA_FILE_KEY empty — no publish attempted.',
    );
  }

  // Temp config with real file-key substitution for document URLs.
  const tmp = mkdtempSync(join(tmpdir(), 'cs-code-connect-'));
  try {
    const cfgSrc = JSON.parse(readFileSync(join(root, 'figma.config.json'), 'utf8'));
    cfgSrc.codeConnect = cfgSrc.codeConnect || {};
    cfgSrc.codeConnect.documentUrlSubstitutions = {
      ...(cfgSrc.codeConnect.documentUrlSubstitutions || {}),
      [PLACEHOLDER]: fileKey,
      [`https://www.figma.com/design/${PLACEHOLDER}`]: `https://www.figma.com/design/${fileKey}`,
    };
    // Copy only what the parser needs into tmp so substitutions apply cleanly.
    cpSync(join(root, 'components'), join(tmp, 'components'), { recursive: true });
    cpSync(join(root, 'package.json'), join(tmp, 'package.json'));
    writeFileSync(join(tmp, 'figma.config.json'), JSON.stringify(cfgSrc, null, 2) + '\n');
    // Ensure local node_modules resolution for @figma/code-connect
    if (existsSync(join(root, 'node_modules'))) {
      try {
        cpSync(join(root, 'node_modules'), join(tmp, 'node_modules'), { recursive: true });
      } catch (_) {
        // fallback: run from root with --config pointing at tmp config — parser still reads include paths relative to config dir
      }
    }

    const env = {
      ...process.env,
      FIGMA_ACCESS_TOKEN: token,
      FIGMA_TOKEN: token,
      FIGMA_FILE_KEY: fileKey,
    };

    const mode = parseOnly ? 'parse' : 'publish';
    const cliArgs = parseOnly
      ? ['parse', '--skip-update-check', '--config', join(tmp, 'figma.config.json')]
      : ['publish', '--dry-run', '--skip-update-check', '--config', join(tmp, 'figma.config.json')];

    // Always do a dry-run publish first when publishing; then real publish unless --dry-run/--parse.
    console.log(`Running: figma connect ${cliArgs.join(' ')}`);
    let result = runFigmaCli(cliArgs, { cwd: existsSync(join(tmp, 'node_modules')) ? tmp : root, env });
    const combined = `${result.stdout}\n${result.stderr}`;
    if (result.error) {
      softSkip('cli_spawn_failed', String(result.error.message || result.error));
    }
    if (result.status !== 0) {
      if (isSoftSkippableCodeConnectError(combined) || isSoftSkippableCodeConnectError({ message: combined })) {
        softSkip('figma_api_unavailable', combined.slice(0, 800));
      }
      console.error(combined);
      writeReport({ skipped: false, ok: false, status: result.status, message: combined.slice(0, 800) });
      process.exit(result.status || 1);
    }

    if (!parseOnly && !dryRun) {
      console.log('Dry-run publish OK — publishing for real…');
      result = runFigmaCli(
        ['publish', '--skip-update-check', '--config', join(tmp, 'figma.config.json')],
        { cwd: existsSync(join(tmp, 'node_modules')) ? tmp : root, env },
      );
      const out2 = `${result.stdout}\n${result.stderr}`;
      if (result.status !== 0) {
        if (isSoftSkippableCodeConnectError(out2)) {
          softSkip('figma_api_unavailable', out2.slice(0, 800));
        }
        console.error(out2);
        writeReport({ skipped: false, ok: false, status: result.status, message: out2.slice(0, 800) });
        process.exit(result.status || 1);
      }
      console.log(result.stdout);
      writeReport({ skipped: false, ok: true, published: true, channel: 'code-connect', ...counts });
      recordCiVerdict({
        channel: 'code-connect',
        kind: 'success',
        detail: `published ${counts.total} mappings`,
      });
      return;
    }

    console.log(result.stdout || 'parse/dry-run OK');
    writeReport({ skipped: false, ok: true, dryRun: true, channel: 'code-connect', ...counts });
    recordCiVerdict({
      channel: 'code-connect',
      kind: 'dry_run',
      detail: `${counts.total} mappings`,
    });
  } finally {
    try { rmSync(tmp, { recursive: true, force: true }); } catch (_) { /* ignore */ }
  }
}

const invoked = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invoked) {
  try {
    main();
  } catch (e) {
    const msg = e.message || String(e);
    console.error(msg);
    if (isSoftSkippableCodeConnectError(e)) softSkip('figma_api_unavailable', msg);
    writeReport({ skipped: false, ok: false, message: msg });
    process.exit(1);
  }
}
