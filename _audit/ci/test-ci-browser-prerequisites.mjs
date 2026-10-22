import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {stringify,parse} from 'yaml';
import {chromium, firefox, webkit} from 'playwright';
import {inspectWorkflow, inspectRepository, requiredBrowsers, chromiumDependentScripts} from './lib/ci-browser-prerequisites.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const checks = inspectRepository(root);
assert.equal(checks.length, 1, 'Review any new canonical CI entrypoint');
const unit = {run: 'npm run test:unit'};
const probe = steps => inspectWorkflow(stringify({jobs: {test: {steps}}}), 'fixture.yml');
assert.equal(probe([{run: '# npm run test:unit\nnode _audit/ci/test-nav-model.mjs'}]).length, 0, 'Comments and browser-free fixtures are not canonical execution');
for (const prefix of ['npx playwright', 'npx --no-install playwright']) {
 const install = {run: prefix + ' install --with-deps chromium firefox webkit'};
 assert.equal(probe([install, unit]).length, 1, prefix + ': recognized complete install');
 assert.equal(probe([{run: prefix + ' install chromium firefox webkit'}, unit]).length, 1, prefix + ': legacy optional with-deps behavior');
 for (const steps of [
  [unit, install],
  [{run: '# ' + install.run}, unit],
  [{...install, if: 'false'}, unit],
  [{...install, if: false}, unit],
  [{...install, if: ''}, unit],
  [{...install, 'continue-on-error': true}, unit],
  [{run: 'if false; then\n' + install.run + '\nfi'}, unit],
  [{run: install.run + ' || true'}, unit],
  [install, {...unit, env: {CS_TEST_BROWSER: 'chromium'}}],
  [install, {run: 'CS_TEST_BROWSER=chromium npm run test:unit'}],
  [install, {run: 'export CS_TEST_BROWSER=chromium\nnpm run test:unit'}],
  [{run: 'npm run test:public-site'}],
  [{run: 'node _audit/ci/run-gates.mjs http://127.0.0.1:8080/_audit/run.html'}],
  ...requiredBrowsers.map(omit => [{run: prefix + ' install --with-deps ' + requiredBrowsers.filter(browser => browser !== omit).join(' ')}, unit]),
 ]) assert.throws(() => probe(steps), /install required browsers|must not select a single engine/, prefix + ': same negative contract');
}
// This bounded parser admits only the explicit locked spelling, not other npx modes.
for (const flag of ['--yes', '--install', '--no', '--no-install --no-install']) {
 assert.throws(() => probe([{run:'npx '+flag+' playwright install --with-deps chromium firefox webkit'},unit]), /install required browsers/);
}

const packageScripts=JSON.parse((await import('node:fs')).readFileSync(new URL('../../package.json',import.meta.url),'utf8')).scripts;
assert(chromiumDependentScripts(packageScripts).has('tokens:generate'),'Actual aggregate token generation transitively captures Chromium');
const aliases={capture:'node scripts/generate-token-modes.mjs --check',alias:'npm run capture',outer:'npm run alias',unrelated:'node plain.mjs'};
assert.deepEqual([...chromiumDependentScripts(aliases)].sort(),['alias','capture','outer']);
const captureProbe=steps=>inspectWorkflow(stringify({jobs:{fixture:{steps}}}),'token-fixture.yml',{scripts:aliases});
for(const command of ['node scripts/generate-token-modes.mjs','node scripts/generate-token-modes.mjs --check','npm run outer']) {
 const capture={run:command},install={run:'npx --no-install playwright install --with-deps chromium'};
 for(const steps of [[capture],[capture,install],[{...install,if:'condition-a'},capture],[{...install,if:'condition-a'},{...capture,if:'condition-b'}],[{...install,'continue-on-error':true},capture]])assert.throws(()=>captureProbe(steps),/install required browsers/);
 assert.doesNotThrow(()=>captureProbe([install,capture]));
 assert.doesNotThrow(()=>captureProbe([{...install,if:'condition-a'},{...capture,if:'condition-a'}]));
}
const actualWorkflow=parse((await import('node:fs')).readFileSync(new URL('../../.github/workflows/design-system-gates.yml',import.meta.url),'utf8'));
let tokenInstallations=0;
for(const [jobName,job]of Object.entries(actualWorkflow.jobs))for(const [index,step]of (job.steps||[]).entries()) {
 if(!step.name?.startsWith('Install Chromium for resolved token')&&!step.name?.startsWith('Install Chromium before post-sync token'))continue;
 tokenInstallations++;
 const missing=structuredClone(actualWorkflow);missing.jobs[jobName].steps.splice(index,1);
 assert.throws(()=>inspectWorkflow(stringify(missing),'real-token-installer-mutant.yml',{scripts:packageScripts}),/install required browsers/,'Every actual token producer invocation retains its browser prerequisite');
}
assert.equal(tokenInstallations,3,'Both jobs and post-sync regeneration need explicit browser installation');
// Real launches, separate from the YAML contract: installed/cache availability
// cannot be inferred from a passing source check. Never skip a missing engine.
for (const name of requiredBrowsers) {
  const browser = await {chromium, firefox, webkit}[name].launch();
  try { const page = await browser.newPage(); await page.setContent('<p>Browser prerequisite probe</p>'); assert.equal(await page.locator('p').innerText(), 'Browser prerequisite probe'); }
  finally { await browser.close(); }
}
console.log('PASS CI browser prerequisites: legacy/locked installer parity, missing/late/comment/conditional/tolerated-failure/single-engine and unsupported-flag cases; real Chromium, Firefox and WebKit launches. Hosted CI and Linux dependencies remain unverified.');
