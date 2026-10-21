import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';

// Run directly with Node. This verifies CI routing, not native compilation or
// visual acceptance; hosted results must retain their own exact source SHA.
export function validateNativeRouting(workflow,toolchain) {
  assert.deepEqual(workflow.permissions,{contents:'read'});
  assert(Object.hasOwn(workflow.on,'workflow_dispatch'));
  assert(workflow.on.push.branches.includes('main'),'Main pushes must run native validation');
  const paths=workflow.on.pull_request?.paths;
  assert(Array.isArray(paths),'PR native validation cannot depend on manual dispatch');
  for(const path of ['tokens/**','examples/native/**','scripts/ci/native-validation.sh','scripts/generate-native-sample-*.mjs','.github/workflows/native-validation.yml']) assert(paths.includes(path),'Missing native PR source route: '+path);
  assert.equal(workflow.jobs.validate.strategy['fail-fast'],false);
  assert.deepEqual(workflow.jobs.validate.strategy.matrix.include.map(x=>x.platform).sort(),['compose','flutter','swiftui']);
  assert.equal(workflow.jobs.validate['timeout-minutes'],30);
  const steps=workflow.jobs.validate.steps;
  if(steps.some(x=>x.uses==='./.github/actions/setup-npm')){
    assert(toolchain,'Pinned setup requires the package metadata in the delivered checkout');
    assert.equal(toolchain.packageMetadata.packageManager,'npm@'+toolchain.fixtureMetadata.dependencies.npm,'Delivered package must pin the exact fixture npm version');
    assert.equal(toolchain.packageMetadata.engines.node,'>=22.12.0');
    assert.deepEqual(toolchain.lockMetadata.packages[''].engines,toolchain.packageMetadata.engines,'Delivered lock must retain the same Node floor');
    const initialize=steps.findIndex(x=>x.name==='Initialize native evidence'),bootstrap=steps.findIndex(x=>x.uses==='./.github/actions/setup-npm');
    assert(initialize>=0&&initialize<bootstrap,'Retain source evidence even if toolchain bootstrap fails');
    assert(steps[initialize].run.includes('git rev-parse HEAD > native-evidence/source-commit.txt'));
  }
  assert.equal(steps.find(x=>x.uses?.startsWith('actions/checkout@')).with['persist-credentials'],false);
  assert(steps.some(x=>x.run?.includes('bash scripts/ci/native-validation.sh')));
  assert(steps.some(x=>x.uses?.startsWith('actions/upload-artifact@')&&x.if==='always()'&&x.with['if-no-files-found']==='error'),'Retain source/build evidence on failure');
  for(const step of steps.filter(x=>x.uses&&!x.uses.startsWith('./'))) assert.match(step.uses,/@[a-f0-9]{40}$/);
}
const actual=parse(readFileSync('.github/workflows/native-validation.yml','utf8'));
const toolchain={packageMetadata:JSON.parse(readFileSync('package.json','utf8')),lockMetadata:JSON.parse(readFileSync('package-lock.json','utf8')),fixtureMetadata:actual.jobs.validate.steps.some(x=>x.uses==='./.github/actions/setup-npm')?JSON.parse(readFileSync('_audit/ci/fixtures/npm-cli/package.json','utf8')):null};
validateNativeRouting(actual,toolchain);
for(const mutate of [x=>delete x.on.pull_request,x=>x.on.push.branches=['codex/native-only'],x=>x.on.pull_request.paths=x.on.pull_request.paths.filter(p=>p!=='tokens/**'),x=>x.jobs.validate.strategy['fail-fast']=true,x=>x.jobs.validate.strategy.matrix.include.pop(),x=>x.jobs.validate.steps.find(s=>s.uses?.startsWith('actions/upload-artifact@')).if='success()',x=>x.permissions.contents='write']) {
  const changed=structuredClone(actual);mutate(changed);assert.throws(()=>validateNativeRouting(changed,toolchain));
}
if(actual.jobs.validate.steps.some(x=>x.uses==='./.github/actions/setup-npm')){
 assert.throws(()=>validateNativeRouting(actual),/Delivered|delivered/);
 for(const mutate of [x=>delete x.packageMetadata.packageManager,x=>x.packageMetadata.packageManager='npm@0.0.0',x=>delete x.lockMetadata.packages[''].engines]){const changed=structuredClone(toolchain);mutate(changed);assert.throws(()=>validateNativeRouting(actual,changed));}
}
console.log('PASS native CI routing and delivered pinned metadata: main+relevant PR sources, all3platforms, read-only permissions, failed-build evidence and negative missing/wrong package-pin controls');
