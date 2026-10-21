import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
const root = new URL('../../',import.meta.url), read = path => readFileSync(new URL(path,root),'utf8');
const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.engines.node,'>=22.12.0');
assert.equal(read('.nvmrc').trim(),'22');
assert.equal(JSON.parse(read('vercel.json')).installCommand,'node scripts/bootstrap-toolchain.mjs && node scripts/npm.mjs ci');
assert(!/npm run build:|(?<![\w-])node scripts\/build-bundle/.test(pkg.scripts.prepublishOnly),'Publish preflight must not rebuild files');
for (const entry of ['./base/*','./assets/*','./package.json']) assert(pkg.exports[entry]);
assert(pkg.files.includes('package.json'),'Package metadata export must remain explicitly covered by the browser exports gate');
const publish = parse(read('.github/workflows/npm-publish.yml'));
assert(!publish.jobs.publish.steps.some(step => step.run?.includes('npm run prepublishOnly')),'npm publish executes prepublishOnly once');
const registry = JSON.parse(read('_audit/ci/unit-suites.json'));
for (const command of ['npm run test:template-touch','npm run test:template-touch-actions']) assert(registry.suites.some(suite => suite.command === command));
const board = read('_audit/run.html'), index = read('_audit/index.html');
for (const [, file] of board.matchAll(/file:'([^']+)'/g)) assert(index.includes('./'+file),'Unindexed board gate '+file);
const browser = read('scripts/verify-browser.mjs');
assert(browser.indexOf("run('_audit/ci/pixel-diff.mjs'") < browser.indexOf("run('_audit/ci/run-gates.mjs'"));
assert(read('_audit/ci/run-gates.mjs').includes('import-report.json'));
assert(!read('_audit/ci/run-gates.mjs').includes('.slice(0, 12000)'));
const native = parse(read('.github/workflows/native-validation.yml'));
assert(native.on.pull_request.paths.includes('tokens/**'));
assert(native.jobs.validate.strategy['fail-fast'] === false);

function assertNativeDataCoverage(workflow, script) {
  assert(workflow.on.push.branches.includes('main'), 'Native validation must cover main');
  assert(workflow.on.pull_request.paths.includes('scripts/generate-native-mode-packs.mjs'), 'Mode producer changes must trigger native validation');
  assert(script.includes('node scripts/generate-native-mode-packs.mjs --check'), 'Platform compilation must reject stale data packs');
  const sections = Object.fromEntries(['swiftui', 'compose', 'flutter'].map((name, index, names) => {
    const start = script.indexOf('  ' + name + ')');
    const end = index + 1 < names.length ? script.indexOf('  ' + names[index + 1] + ')') : script.indexOf('  *)');
    assert(start >= 0 && end > start);
    return [name, script.slice(start, end)];
  }));
  assert(sections.swiftui.includes('node _audit/ci/test-native-mode-swift.mjs'), 'Swift must execute actual exhaustive mode proof');
  for (const [platform, source] of [['swiftui', 'CSModes.swift'], ['compose', 'CSModes.kt'], ['flutter', 'cs_modes.dart']]) {
    assert(sections[platform].includes('tokens/native/' + source), 'Actual platform compiler must consume its mode data: ' + platform);
  }
}
const nativeScript = read('scripts/ci/native-validation.sh');
assertNativeDataCoverage(native, nativeScript);
for (const source of ['CSModes.swift', 'CSModes.kt', 'cs_modes.dart']) assert.throws(() => assertNativeDataCoverage(native, nativeScript.replaceAll(source, 'missing-mode-source')), /compiler must consume/);
assert.throws(() => assertNativeDataCoverage(native, nativeScript.replace('node _audit/ci/test-native-mode-swift.mjs', 'echo source-only')), /actual exhaustive/);
const noMain = structuredClone(native); noMain.on.push.branches = ['codex/native-validation-*'];
assert.throws(() => assertNativeDataCoverage(noMain, nativeScript), /cover main/);


// Generated Markdown must settle before its source-bound reference hashes.
function assertCatalogStageOrder(scripts) {
  const expand = (name, ancestors = []) => {
    assert(!ancestors.includes(name), 'Build script dependency cycle: ' + name);
    assert.equal(typeof scripts[name], 'string', 'Missing build stage: ' + name);
    return [name, ...[...scripts[name].matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)]
      .flatMap(([, child]) => expand(child, [...ancestors, name]))];
  };
  const stages = expand('build');
  const reference = stages.lastIndexOf('docs:reference');
  for (const name of ['build:design-md', 'tokens:contrast', 'build:static-reference', 'build:prompt-api', 'generate:guidance', 'generate:security-support', 'generate:component-inventory', 'build:api-discovery']) {
    assert(stages.includes(name), 'Missing document producer: ' + name);
    assert(reference > stages.lastIndexOf(name), 'Reference catalog must follow generated Markdown: ' + name);
  }
}
assertCatalogStageOrder(pkg.scripts);
const missingFinalReference = { ...pkg.scripts, build: pkg.scripts.build.replace(/ && npm run docs:reference$/, '') };
assert.throws(() => assertCatalogStageOrder(missingFinalReference), /Reference catalog must follow generated Markdown/,
  'A successful build with an early catalog stage must not leave stale prompt/reference hashes');

// Evidence must be uploaded after the actual tool run produces its receipt.
function assertInterchangeReceiptOrder(workflow) {
  const steps = workflow.jobs['unit-tests'].steps;
  const producer = steps.findIndex(step => step.run?.includes('_audit/ci/test-token-modes-style-dictionary.mjs'));
  assert(producer >= 0, 'Real Style Dictionary mode receipt producer is required');
  const uploads = steps.map((step, index) => ({step, index})).filter(({step}) =>
    step.uses?.startsWith('actions/upload-artifact@') && step.with?.path?.trim().split(/\s+/).includes('test-results/'));
  assert(uploads.some(({step, index}) => index > producer && step.if === 'always()'),
    'Interchange evidence must be retained after its producer, including failed runs');
}
const gates = parse(read('.github/workflows/design-system-gates.yml'));
assertInterchangeReceiptOrder(gates);
const earlyUpload = structuredClone(gates), unitSteps = earlyUpload.jobs['unit-tests'].steps;
const uploadIndex = unitSteps.findIndex(step => step.uses?.startsWith('actions/upload-artifact@') && step.with?.path === 'test-results/');
const [receiptUpload] = unitSteps.splice(uploadIndex, 1);
unitSteps.splice(unitSteps.findIndex(step => step.run?.includes('_audit/ci/test-token-modes-style-dictionary.mjs')), 0, receiptUpload);
assert.throws(() => assertInterchangeReceiptOrder(earlyUpload), /retained after its producer/);
const successOnly = structuredClone(gates);
successOnly.jobs['unit-tests'].steps.find(step => step.uses?.startsWith('actions/upload-artifact@') && step.with?.path === 'test-results/').if = 'success()';
assert.throws(() => assertInterchangeReceiptOrder(successOnly), /including failed runs/);

console.log('PASS remediation infrastructure: executable lanes, frozen publish artifacts, consumer subpaths, gate discovery, browser and final reference-catalog ordering, complete reports, native PR trigger');
