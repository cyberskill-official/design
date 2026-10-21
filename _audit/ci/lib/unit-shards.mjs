import { createHash } from 'node:crypto';
export function validateRegistry(registry) {
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.suites) || !registry.suites.length) throw Error('Invalid unit suite registry');
  const ids = new Set();
  for (const suite of registry.suites) {
    if (typeof suite.id !== 'string' || !suite.id || ids.has(suite.id) || typeof suite.command !== 'string' || !suite.command.trim()) throw Error('Invalid or duplicate suite');
    ids.add(suite.id);
  }
  return registry.suites;
}
export function registryHash(registry) {
  return createHash('sha256').update(JSON.stringify(validateRegistry(registry).map(({
    id,
    command
  }) => ({
    id,
    command
  })))).digest('hex');
}
export function validateShardPlan(registry, plan) {
  const suites = validateRegistry(registry);
  if (plan?.schemaVersion !== 1 || plan.registrySha256 !== registryHash(registry)) throw Error('Invalid or stale shard plan registry identity');
  if (!Number.isSafeInteger(plan.shardCount) || plan.shardCount < 1 || plan.shardCount > suites.length || !Array.isArray(plan.shards) || plan.shards.length !== plan.shardCount) throw Error('Invalid shard plan count');
  const expected = new Set(suites.map(suite => suite.id));
  const seen = new Set();
  for (const shard of plan.shards) {
    if (!Array.isArray(shard) || !shard.length) throw Error('Empty shard plan assignment');
    for (const id of shard) {
      if (!expected.has(id) || seen.has(id)) throw Error('Unknown or duplicate shard plan suite');
      seen.add(id);
    }
  }
  if (seen.size !== suites.length) throw Error('Incomplete shard plan assignment');
  return plan;
}

/** Longest estimated duration first; timing affects assignment, never membership. */
export function createShardPlan(registry, timingRecords, shardCount) {
  const suites = validateRegistry(registry);
  if (!Number.isSafeInteger(shardCount) || shardCount < 1 || shardCount > suites.length) throw Error('Invalid shard plan count');
  if (!Array.isArray(timingRecords)) throw Error('Invalid timing records');
  const timings = new Map();
  for (const row of timingRecords) {
    if (typeof row.id !== 'string' || timings.has(row.id) || typeof row.command !== 'string' || !Number.isFinite(row.durationMs) || row.durationMs < 0 || typeof row.pass !== 'boolean') throw Error('Invalid or duplicate timing record');
    timings.set(row.id, row);
  }
  const measured = suites.flatMap(suite => {
    const row = timings.get(suite.id);
    return row?.command === suite.command && row.pass ? [Math.max(1, row.durationMs)] : [];
  }).sort((a, b) => a - b);
  const fallbackEstimateMs = measured.length ? measured[Math.floor((measured.length - 1) * .75)] : 1000;
  const estimates = suites.map((suite, index) => {
    const row = timings.get(suite.id);
    const observed = !!(row?.command === suite.command && row.pass);
    return {
      ...suite,
      index,
      estimateMs: observed ? Math.max(1, row.durationMs) : fallbackEstimateMs,
      observed
    };
  });
  const loads = Array(shardCount).fill(0);
  const shards = Array.from({
    length: shardCount
  }, () => []);
  for (const suite of [...estimates].sort((a, b) => b.estimateMs - a.estimateMs || a.index - b.index)) {
    const target = loads.indexOf(Math.min(...loads));
    shards[target].push(suite.id);
    loads[target] += suite.estimateMs;
  }
  // Preserve canonical command order within each shard.
  for (let index = 0; index < shards.length; index++) {
    const ids = new Set(shards[index]);
    shards[index] = suites.filter(suite => ids.has(suite.id)).map(suite => suite.id);
  }
  const plan = {
    schemaVersion: 1,
    registrySha256: registryHash(registry),
    shardCount,
    shards,
    estimatedDurationMs: loads,
    fallbackEstimateMs,
    estimates: estimates.map(({
      id,
      estimateMs,
      observed
    }) => ({
      id,
      estimateMs,
      observed
    })),
    scope: 'Historical local durations estimate load only. Failed, missing or changed commands use the observed 75th percentile (1000ms without history). No suite is skipped and no CI latency guarantee is made.'
  };
  return validateShardPlan(registry, plan);
}
