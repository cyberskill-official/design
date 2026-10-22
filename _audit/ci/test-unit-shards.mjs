import assert from 'node:assert/strict';
import { createShardPlan, validateShardPlan, registryHash } from './lib/unit-shards.mjs';
import { selectSuites } from './lib/run-unit-suite.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
const registry = {
  schemaVersion: 1,
  suites: [80, 70, 6, 5, 4, 3].map((durationMs, index) => ({
    id: `case-${index}`,
    command: `run-${index}`,
    durationMs
  }))
};
const timings = registry.suites.map(row => ({
  ...row,
  pass: true
}));
const plan = createShardPlan(registry, timings, 2);
assert.deepEqual(createShardPlan(registry, [...timings].reverse(), 2), plan, 'Timing input order cannot affect assignment');
const selected = [1, 2].flatMap(index => selectSuites(registry, `${index}/2`, plan));
assert.equal(selected.length, registry.suites.length);
assert.equal(new Set(selected.map(row => row.id)).size, registry.suites.length);
const roundRobinLoads = [0, 1].map(shard => timings.filter((_, index) => index % 2 === shard).reduce((sum, row) => sum + row.durationMs, 0));
assert(Math.max(...plan.estimatedDurationMs) < Math.max(...roundRobinLoads), 'Measured skewed fixture must improve');
for (const mutate of [x => x.registrySha256 = '0'.repeat(64), x => x.shards[0].pop(), x => x.shards[0].push(x.shards[1][0]), x => x.shards[0].push('unknown'), x => x.shards[0] = [], x => x.shardCount = 3, x => x.schemaVersion = 2]) {
  const invalid = structuredClone(plan);
  mutate(invalid);
  assert.throws(() => validateShardPlan(registry, invalid));
}
assert.throws(() => selectSuites(registry, '1/3', plan), /count differs/);
assert.throws(() => selectSuites(registry, undefined, plan), /explicit shard/);
assert.throws(() => validateShardPlan({
  ...registry,
  suites: registry.suites.map((r, index) => index ? r : {
    ...r,
    command: 'changed'
  })
}, plan), /stale/);
assert.notEqual(registryHash({
  ...registry,
  suites: [...registry.suites].reverse()
}), registryHash(registry));
for (const bad of [NaN, -1, Infinity]) assert.throws(() => createShardPlan(registry, [{
  ...timings[0],
  durationMs: bad
}], 2));
assert.throws(() => createShardPlan(registry, [timings[0], timings[0]], 2));
assert.throws(() => createShardPlan(registry, [], 7));
const untrusted = timings.map(row => ({
  ...row,
  pass: false
}));
assert(createShardPlan(registry, untrusted, 2).estimates.every(row => !row.observed && row.estimateMs === 1000), 'Failed runs do not masquerade as timings');
const changed = [{
  ...timings[0],
  command: 'previous command',
  durationMs: 1e9
}, ...timings.slice(1)];
assert.equal(createShardPlan(registry, changed, 2).estimates[0].observed, false);
assert.deepEqual(selectSuites(registry, '1/2').map(row => row.id), ['case-0', 'case-2', 'case-4'], 'Original round-robin contract remains available');
// Exercise the real CLI in a harmless disposable workspace, including
// fail-closed planning before any command or receipt can be created.
const scratch = mkdtempSync(join(tmpdir(), 'cs-unit-plan-'));
try {
  mkdirSync(join(scratch, '_audit/ci/lib'), {
    recursive: true
  });
  for (const name of ['run-unit-suite.mjs', 'unit-shards.mjs']) cpSync(new URL('./lib/' + name, import.meta.url), join(scratch, '_audit/ci/lib', name));
  writeFileSync(join(scratch, 'probe.mjs'), `import {appendFileSync} from 'node:fs';appendFileSync('executed.txt',process.argv[2]+'\\n');`);
  const cliRegistry = {
    schemaVersion: 1,
    suites: registry.suites.map(({
      id
    }) => ({
      id,
      command: 'node probe.mjs ' + id
    }))
  };
  const cliPlan = createShardPlan(cliRegistry, [], 2);
  writeFileSync(join(scratch, '_audit/ci/unit-suites.json'), JSON.stringify(cliRegistry));
  const planPath = join(scratch, 'plan.json');
  const execute = shard => spawnSync(process.execPath, ['_audit/ci/lib/run-unit-suite.mjs'], {
    cwd: scratch,
    encoding: 'utf8',
    env: {
      ...process.env,
      CS_UNIT_SHARD: shard,
      CS_UNIT_PLAN: planPath,
      CS_UNIT_REPORT_DIR: join(scratch, 'report-' + shard.replace('/', '-'))
    }
  });
  writeFileSync(planPath, JSON.stringify({
    ...cliPlan,
    registrySha256: 'stale'
  }));
  assert.notEqual(execute('1/2').status, 0);
  assert.equal(existsSync(join(scratch, 'executed.txt')), false, 'A bad plan cannot execute even one suite');
  assert.equal(existsSync(join(scratch, 'report-1-2')), false, 'A bad plan cannot create a passing receipt');
  writeFileSync(planPath, JSON.stringify(cliPlan));
  for (const shard of ['1/2', '2/2']) {
    const result = execute(shard);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(readFileSync(join(scratch, 'report-' + shard.replace('/', '-'), 'unit-results.json')));
    assert.match(report.planSha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(report.selectedSuiteIds, report.results.map(row => row.id));
  }
  const executed = readFileSync(join(scratch, 'executed.txt'), 'utf8').trim().split('\n');
  assert.deepEqual(executed.sort(), cliRegistry.suites.map(row => row.id).sort(), 'Both actual CLI shards execute each command exactly once');
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS timed shard plans: exact once membership, skewed workload, stable ordering, failed/missing/changed timing fallback and fail-closed stale/malformed plans');
