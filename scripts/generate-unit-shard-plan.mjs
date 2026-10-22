#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createShardPlan } from '../_audit/ci/lib/unit-shards.mjs';
const root = new URL('../', import.meta.url);
export function generateUnitShardPlan() {
  const registry = JSON.parse(readFileSync(new URL('_audit/ci/unit-suites.json', root)));
  const baseline = JSON.parse(readFileSync(new URL('_audit/ci/unit-duration-baseline.json', root)));
  assert.equal(baseline.schemaVersion, 1, 'Unsupported timing baseline');
  const plan = createShardPlan(registry, baseline.records, 4);
  return JSON.stringify({
    ...plan,
    timingSource: baseline.scope,
    timingSourceReports: baseline.reports
  }, null, 2) + '\n';
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  assert(args.length === 0 || args.length === 1 && args[0] === '--check', 'Usage: generate-unit-shard-plan.mjs [--check]');
  const path = new URL('_audit/ci/unit-shard-plan.json', root);
  const output = generateUnitShardPlan();
  if (args.length) assert.equal(readFileSync(path, 'utf8'), output, 'Stale unit shard plan; regenerate after registry changes');else writeFileSync(path, output);
  const plan = JSON.parse(output);
  console.log(`PASS complete timed shard plan: ${plan.estimates.length} suites /${plan.shardCount} shards; estimated loads ${plan.estimatedDurationMs.map(ms => Math.round(ms / 1000)).join('/')}s (estimates, not CI guarantees)`);
}
