import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';

const path = '.github/workflows/native-store.yml';
const source = readFileSync(path, 'utf8');
const expected = [
  'examples/native/**',
  'tokens/native/**',
  'fonts/subset-recipe.json',
  '_audit/ci/native-store-dry-run.mjs',
  '_audit/ci/test-native-samples.mjs',
  '_audit/ci/ci-verdict.mjs',
  '.github/workflows/native-store.yml',
  'package.json',
];
function verify(value) {
  assert.deepEqual(Object.keys(value.on).sort(), ['pull_request', 'push', 'workflow_dispatch']);
  assert.deepEqual(value.on.pull_request.paths, expected, 'Pull requests use the reviewed native inputs');
  assert.deepEqual(value.on.push.paths, expected, 'Push and PR native input sets stay aligned');
  assert.deepEqual(value.on.push.branches, ['main']);
  assert.equal(value.on.pull_request.branches, undefined, 'No new PR branch exclusion');
  assert.deepEqual(value.permissions, { contents: 'read' });
  const job = value.jobs['store-dry-run'];
  assert(job && job.if === undefined && job['continue-on-error'] === undefined, 'Native checks remain unconditional');
  for (const command of ['node _audit/ci/native-store-dry-run.mjs --dry-run', 'node _audit/ci/native-store-dry-run.mjs']) {
    const steps = job.steps.filter(step => step.run === command);
    assert.equal(steps.length, 1, 'Each existing native dry-run/check remains present');
    assert.equal(steps[0].if, undefined);
    assert.equal(steps[0]['continue-on-error'], undefined);
  }
  const upload = job.steps.find(step => step.name === 'Upload native-store report');
  assert.equal(upload.if, 'always()');
  assert.equal(upload.with.path, '_audit/ci/native-store-report.json');
  return value;
}
const workflow = verify(parse(source));
const negatives = [
  ['missing PR filter', value => { value.on.pull_request = null; }],
  ['broad PR filter', value => { value.on.pull_request.paths = ['**']; }],
  ['missing native token input', value => { value.on.pull_request.paths = expected.filter(path => path !== 'tokens/native/**'); }],
  ['push drift', value => { value.on.push.paths.pop(); }],
  ['conditional native job', value => { value.jobs['store-dry-run'].if = 'false'; }],
  ['tolerated native check', value => { value.jobs['store-dry-run'].steps.find(step => step.run === 'node _audit/ci/native-store-dry-run.mjs')['continue-on-error'] = true; }],
];
for (const [name, mutate] of negatives) {
  const copy = structuredClone(workflow); mutate(copy);
  assert.throws(() => verify(copy), undefined, name);
}
mkdirSync('test-results/native-store-paths', { recursive: true });
writeFileSync('test-results/native-store-paths/receipt.json', JSON.stringify({ pass: true, node: process.version, workflowSha256: createHash('sha256').update(source).digest('hex'), testSha256: createHash('sha256').update(readFileSync('_audit/ci/test-native-store-paths.mjs')).digest('hex'), filters: expected, negatives: negatives.map(([name]) => name), scope: 'Source YAML contract: identical reviewed native PR/push paths; existing native jobs and reporting preserved. No hosted Actions/event execution claim.' }, null, 2) + '\n');
console.log('PASS native-store: matching PR/push native paths, unchanged checks/reporting and six mutation controls');
