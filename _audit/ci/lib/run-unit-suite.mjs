import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { validateRegistry, validateShardPlan } from './unit-shards.mjs';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const escapeXML = value => String(value).replace(/[<>&"']/g, char => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;'
})[char]);
export function selectSuites(registry, shardSpec, plan) {
  validateRegistry(registry);
  if (plan) validateShardPlan(registry, plan);
  if (!shardSpec) {
    if (plan) throw Error('A shard plan requires an explicit shard selection');
    return registry.suites;
  }
  const match = /^(\d+)\/(\d+)$/.exec(shardSpec);
  if (!match || +match[1] < 1 || +match[2] < +match[1]) throw Error('Invalid shard: expected N/M with 1 <= N <= M');
  if (plan && plan.shardCount !== +match[2]) throw Error('Shard count differs from plan');
  const plannedIds = plan ? new Set(plan.shards[+match[1] - 1]) : null;
  const selected = registry.suites.filter((suite, index) => plannedIds ? plannedIds.has(suite.id) : index % +match[2] === +match[1] - 1);
  if (!selected.length) throw Error('Shard selects no suites; refusing an empty passing verdict');
  return selected;
}
export function runSuites(suites, {
  cwd = root,
  env = process.env,
  execute = spawnSync
} = {}) {
  return suites.map(suite => {
    console.log(`\n[${suite.id}] > ${suite.command}`);
    const start = performance.now();
    const result = execute(suite.command, {
      cwd,
      shell: true,
      stdio: 'inherit',
      env
    });
    const entry = {
      ...suite,
      durationMs: Math.round(performance.now() - start),
      exitCode: result.status ?? 1,
      signal: result.signal ?? null,
      error: result.error?.message ?? null
    };
    entry.pass = entry.exitCode === 0 && !entry.signal && !entry.error;
    if (!entry.pass) console.error(`FAIL ${suite.id} (exit=${entry.exitCode}, signal=${entry.signal || 'none'})`);
    return entry;
  });
}
export function writeReports(results, directory, metadata = {}) {
  mkdirSync(directory, {
    recursive: true
  });
  const pass = results.every(result => result.pass);
  writeFileSync(join(directory, 'unit-results.json'), JSON.stringify({
    schemaVersion: 1,
    ...metadata,
    pass,
    results
  }, null, 2) + '\n');
  const cases = results.map(result => `<testcase name="${escapeXML(result.id)}" classname="unit" time="${result.durationMs / 1000}">${result.pass ? '' : `<failure message="${escapeXML(result.error || `exit ${result.exitCode}; signal ${result.signal || 'none'}`)}">${escapeXML(result.command)}</failure>`}</testcase>`);
  writeFileSync(join(directory, 'unit-results.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<testsuite name="CyberSkill unit" tests="${results.length}" failures="${results.filter(result => !result.pass).length}">${cases.join('')}</testsuite>\n`);
  return pass;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const registry = JSON.parse(readFileSync(join(root, '_audit/ci/unit-suites.json'), 'utf8'));
    const shard = process.env.CS_UNIT_SHARD || process.argv.find(arg => arg.startsWith('--shard='))?.slice(8);
    const planPath = process.env.CS_UNIT_PLAN || process.argv.find(arg => arg.startsWith('--plan='))?.slice(7);
    const planBytes = planPath ? readFileSync(planPath) : null;
    const plan = planBytes ? JSON.parse(planBytes) : null;
    const selected = selectSuites(registry, shard, plan);
    const results = runSuites(selected);
    const reportDir = process.env.CS_UNIT_REPORT_DIR || join(root, 'test-results', shard ? `unit-${shard.replace('/', '-')}` : 'unit');
    const pass = writeReports(results, reportDir, {
      shard: shard || null,
      totalSuites: registry.suites.length,
      planSha256: planBytes ? createHash('sha256').update(planBytes).digest('hex') : null,
      selectedSuiteIds: selected.map(suite => suite.id)
    });
    console.log(`Unit suites: ${results.filter(result => result.pass).length}/${results.length} pass; reports: ${reportDir}`);
    process.exitCode = pass ? 0 : 1;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
