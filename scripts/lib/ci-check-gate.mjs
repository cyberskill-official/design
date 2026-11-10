import assert from 'node:assert/strict';

export const REQUIRED_CI_CHECKS = Object.freeze([
  'node-prechecks',
  'token-provenance',
  'fast-gates',
  'whole-set-audits',
  'pixel-diff',
  'storybook-build',
  'docs-consistency-blocker',
  'benchmark-baselines',
  'unit-tests (1/4)',
  'unit-tests (2/4)',
  'unit-tests (3/4)',
  'unit-tests (4/4)',
]);

const HEX_40 = /^[a-f0-9]{40}$/;
const HEX_64 = /^[a-f0-9]{64}$/;
const SHARD_RE = /^([1-9]\d*)\/([1-9]\d*)$/;

function normalizeCheckName(rawName, requiredChecks) {
  if (typeof rawName !== 'string') return null;
  const trimmed = rawName.trim();
  if (requiredChecks.includes(trimmed)) return trimmed;
  for (const req of requiredChecks) {
    if (trimmed.endsWith(` / ${req}`)) return req;
  }
  return null;
}

/**
 * Evaluates GitHub Actions check-runs on a commit against the canonical required CI checks.
 * Fails closed immediately if any required check completed with a non-success conclusion.
 */
export function evaluateCiChecks({
  checkRuns = [],
  requiredChecks = REQUIRED_CI_CHECKS,
} = {}) {
  assert(Array.isArray(checkRuns), 'checkRuns must be an array');
  assert(Array.isArray(requiredChecks) && requiredChecks.length > 0, 'requiredChecks must be a non-empty array');

  const latestByName = new Map();
  for (const run of checkRuns) {
    assert(run && typeof run === 'object', 'Malformed check-run entry');
    const canonical = normalizeCheckName(run.name, requiredChecks);
    if (!canonical) continue;
    const prev = latestByName.get(canonical);
    const runId = typeof run.id === 'number' ? run.id : 0;
    const prevId = prev && typeof prev.id === 'number' ? prev.id : -1;
    if (!prev || runId >= prevId) {
      latestByName.set(canonical, run);
    }
  }

  const missing = [];
  const pending = [];
  const failed = [];
  const passed = [];

  for (const name of requiredChecks) {
    const run = latestByName.get(name);
    if (!run) {
      missing.push(name);
      continue;
    }
    if (run.status !== 'completed') {
      pending.push({
        name,
        id: run.id ?? null,
        status: run.status ?? 'unknown',
      });
      continue;
    }
    if (run.conclusion === 'success') {
      passed.push({
        name,
        id: run.id ?? null,
        conclusion: run.conclusion,
      });
    } else {
      failed.push({
        name,
        id: run.id ?? null,
        conclusion: run.conclusion ?? 'unknown',
      });
    }
  }

  if (failed.length > 0) {
    return {
      state: 'failed',
      pass: false,
      requiredCount: requiredChecks.length,
      passed,
      pending,
      missing,
      failed,
    };
  }

  if (missing.length > 0 || pending.length > 0) {
    return {
      state: 'pending',
      pass: false,
      requiredCount: requiredChecks.length,
      passed,
      pending,
      missing,
      failed,
    };
  }

  return {
    state: 'passed',
    pass: true,
    requiredCount: requiredChecks.length,
    passed,
    pending,
    missing,
    failed,
  };
}

export function formatActShardStatus({ shard, treeSha, planSha256, suiteCount }) {
  assert(SHARD_RE.test(shard), `Invalid shard spec: ${shard}`);
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(planSha256), `Invalid 64-hex shard plan SHA-256: ${planSha256}`);
  assert(Number.isInteger(suiteCount) && suiteCount > 0, 'suiteCount must be a positive integer');
  return {
    context: `ci/act/unit-tests (${shard})`,
    state: 'success',
    description: `act-v1 tree=${treeSha} plan=${planSha256.slice(0, 16)} suites=${suiteCount}/${suiteCount}`,
  };
}

/**
 * Verifies whether a commit status list contains a valid commit- and tree-bound
 * local `act` attestation for the requested unit-test shard.
 */
export function verifyActShardAttestation({
  statuses = [],
  shard,
  treeSha,
  planSha256,
  expectedSuiteIds = [],
} = {}) {
  assert(Array.isArray(statuses), 'statuses must be an array');
  assert(SHARD_RE.test(shard), `Invalid shard spec: ${shard}`);
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(planSha256), `Invalid 64-hex shard plan SHA-256: ${planSha256}`);
  assert(Array.isArray(expectedSuiteIds) && expectedSuiteIds.length > 0, 'expectedSuiteIds must be non-empty');

  const expectedContext = `ci/act/unit-tests (${shard})`;
  const expectedDesc = formatActShardStatus({
    shard,
    treeSha,
    planSha256,
    suiteCount: expectedSuiteIds.length,
  }).description;

  const matching = statuses.find(s => s && s.context === expectedContext);
  if (!matching) {
    return { verified: false, reason: `No ${expectedContext} status on commit` };
  }
  if (matching.state !== 'success') {
    return { verified: false, reason: `Status ${expectedContext} state is ${matching.state}` };
  }
  if (matching.description !== expectedDesc) {
    return {
      verified: false,
      reason: `Status ${expectedContext} description mismatch (expected "${expectedDesc}", got "${matching.description}")`,
    };
  }

  return {
    verified: true,
    receipt: {
      schemaVersion: 1,
      shard,
      treeSha,
      planSha256,
      selectedSuiteIds: [...expectedSuiteIds],
      pass: true,
    },
  };
}

export function formatActFastGatesStatus({ treeSha, pixelReportSha256 }) {
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(pixelReportSha256), `Invalid 64-hex pixel report SHA-256: ${pixelReportSha256}`);
  return {
    context: 'ci/act/fast-gates',
    state: 'success',
    description: `act-v1 tree=${treeSha} pixel=${pixelReportSha256.slice(0, 16)}`,
  };
}

/**
 * Verifies whether a commit status list contains a valid commit- and tree-bound
 * local `act` attestation for the `fast-gates` job.
 */
export function verifyActFastGatesAttestation({
  statuses = [],
  treeSha,
  pixelReportSha256,
} = {}) {
  assert(Array.isArray(statuses), 'statuses must be an array');
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(pixelReportSha256), `Invalid 64-hex pixel report SHA-256: ${pixelReportSha256}`);

  const expectedContext = 'ci/act/fast-gates';
  const expectedDesc = formatActFastGatesStatus({
    treeSha,
    pixelReportSha256,
  }).description;

  const matching = statuses.find(s => s && s.context === expectedContext);
  if (!matching) {
    return { verified: false, reason: `No ${expectedContext} status on commit` };
  }
  if (matching.state !== 'success') {
    return { verified: false, reason: `Status ${expectedContext} state is ${matching.state}` };
  }
  if (matching.description !== expectedDesc) {
    return {
      verified: false,
      reason: `Status ${expectedContext} description mismatch (expected "${expectedDesc}", got "${matching.description}")`,
    };
  }

  return {
    verified: true,
    receipt: {
      schemaVersion: 1,
      job: 'fast-gates',
      treeSha,
      pixelReportSha256,
      pass: true,
    },
  };
}

export function formatActWholeSetStatus({ treeSha, manifestSha256 }) {
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(manifestSha256), `Invalid 64-hex manifest SHA-256: ${manifestSha256}`);
  return {
    context: 'ci/act/whole-set-audits',
    state: 'success',
    description: `act-v1 tree=${treeSha} manifest=${manifestSha256.slice(0, 16)} gates=3/3`,
  };
}

export function verifyActWholeSetAttestation({
  statuses = [],
  treeSha,
  manifestSha256,
} = {}) {
  assert(Array.isArray(statuses), 'statuses must be an array');
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(manifestSha256), `Invalid 64-hex manifest SHA-256: ${manifestSha256}`);

  const expectedContext = 'ci/act/whole-set-audits';
  const expectedDesc = formatActWholeSetStatus({ treeSha, manifestSha256 }).description;

  const matching = statuses.find(s => s && s.context === expectedContext);
  if (!matching) {
    return { verified: false, reason: `No ${expectedContext} status on commit` };
  }
  if (matching.state !== 'success') {
    return { verified: false, reason: `Status ${expectedContext} state is ${matching.state}` };
  }
  if (matching.description !== expectedDesc) {
    return {
      verified: false,
      reason: `Status ${expectedContext} description mismatch (expected "${expectedDesc}", got "${matching.description}")`,
    };
  }

  return {
    verified: true,
    receipt: {
      schemaVersion: 1,
      job: 'whole-set-audits',
      treeSha,
      manifestSha256,
      pass: true,
    },
  };
}

export function formatActStorybookStatus({ treeSha, scenariosSha256 }) {
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(scenariosSha256), `Invalid 64-hex scenarios SHA-256: ${scenariosSha256}`);
  return {
    context: 'ci/act/storybook-build',
    state: 'success',
    description: `act-v1 tree=${treeSha} scenarios=${scenariosSha256.slice(0, 16)} engines=3/3`,
  };
}

export function verifyActStorybookAttestation({
  statuses = [],
  treeSha,
  scenariosSha256,
} = {}) {
  assert(Array.isArray(statuses), 'statuses must be an array');
  assert(HEX_40.test(treeSha), `Invalid 40-hex Git tree SHA: ${treeSha}`);
  assert(HEX_64.test(scenariosSha256), `Invalid 64-hex scenarios SHA-256: ${scenariosSha256}`);

  const expectedContext = 'ci/act/storybook-build';
  const expectedDesc = formatActStorybookStatus({ treeSha, scenariosSha256 }).description;

  const matching = statuses.find(s => s && s.context === expectedContext);
  if (!matching) {
    return { verified: false, reason: `No ${expectedContext} status on commit` };
  }
  if (matching.state !== 'success') {
    return { verified: false, reason: `Status ${expectedContext} state is ${matching.state}` };
  }
  if (matching.description !== expectedDesc) {
    return {
      verified: false,
      reason: `Status ${expectedContext} description mismatch (expected "${expectedDesc}", got "${matching.description}")`,
    };
  }

  return {
    verified: true,
    receipt: {
      schemaVersion: 1,
      job: 'storybook-build',
      treeSha,
      scenariosSha256,
      pass: true,
    },
  };
}
