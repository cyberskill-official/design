import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {tmpdir} from 'node:os';
import Ajv from 'ajv';
import {generateComponentScenarios} from '../../scripts/lib/component-scenarios.mjs';
import {projectScenarioStories} from '../../scripts/generate-component-scenario-stories.mjs';

const root=resolve('.'), scratch=mkdtempSync(join(tmpdir(),'cs-component-scenarios-'));
const read=path=>readFileSync(resolve(root,path),'utf8');
try {
  const model=generateComponentScenarios(root);
  assert.equal(read('components/scenarios.json'),JSON.stringify(model,null,2)+'\n','Checked-in scenario projection is fresh');
  const validate=new Ajv({strict:true,allowUnionTypes:true}).compile(JSON.parse(read('schemas/component-scenarios.schema.json')));
  assert(validate(model),JSON.stringify(validate.errors));
  assert.equal(new Set(model.cases.map(c=>c.id)).size,model.cases.length);
  assert.equal(model.coverage.components,model.cases.filter(c=>c.category==='default').length);
  assert.deepEqual(model.components.flatMap(c=>c.caseIds),model.cases.map(c=>c.id));
  for(const path of Object.keys(model.inputs)) {mkdirSync(dirname(resolve(scratch,path)),{recursive:true});copyFileSync(resolve(root,path),resolve(scratch,path));}
  symlinkSync(resolve(root,'node_modules'),resolve(scratch,'node_modules'),'dir');
  assert.deepEqual(generateComponentScenarios(scratch),model,'Same source graph deterministically regenerates the complete projection');
  const policyPath=resolve(scratch,'scripts/fixtures/component-scenarios.json'), policy=readFileSync(policyPath,'utf8');
  let negatives=0;
  for(const [change,pattern] of [
    [p=>delete p.disabled.TextField,/disabled\/error/],
    [p=>delete p.errors.TextField,/disabled\/error/],
    [p=>delete p.finite.Button,/authored runtime expectation/],
    [p=>delete p.finite.Button.defaultValues.size,/omitted-prop defaults/],
    [p=>p.finite.Button.defaultValues.size='invented',/Invalid default/],
    [p=>p.disabled.Ghost=p.disabled.Button,/Unknown scenario component/],
    [p=>p.disabled.TextField.props={invented:true},/Undeclared/],
    [p=>p.errors.TextField.props={onClick:'execute'},/Unsafe fixture property/],
    [p=>p.errors.TextField.props=JSON.parse('{"__proto__":{"polluted":true}}'),/Unsafe fixture property/],
    [p=>p.errors.TextField.sourceEvidence={'../outside':'0'.repeat(64)},/Exact source/],
    [p=>p.errors.TextField.sourceEvidence['components/textfield/TextField.jsx']='0'.repeat(64),/source changed/],
  ]) {
    const changed=JSON.parse(policy);change(changed);writeFileSync(policyPath,JSON.stringify(changed));
    assert.throws(()=>generateComponentScenarios(scratch),pattern);writeFileSync(policyPath,policy);negatives++;
  }
  const source=resolve(scratch,'components/textfield/TextField.jsx'), original=readFileSync(source);
  writeFileSync(source,original+'\n// drift\n');assert.throws(()=>generateComponentScenarios(scratch),/source changed/);writeFileSync(source,original);negatives++;
  const outside=resolve(scratch,'outside.jsx');writeFileSync(outside,original);rmSync(source);symlinkSync(outside,source);
  assert.throws(()=>generateComponentScenarios(scratch),/symlink/);rmSync(source);writeFileSync(source,original);negatives++;
  const fixturesPath=resolve(scratch,'scripts/fixtures/static-html-reference.json'), fixture=JSON.parse(readFileSync(fixturesPath,'utf8'));
  fixture.components.pop();writeFileSync(fixturesPath,JSON.stringify(fixture));assert.throws(()=>generateComponentScenarios(scratch),/public components/);negatives++;
  for(const mutate of [x=>delete x.components[0].keyboard,x=>x.components[0].empty='accepted-no-test',x=>x.cases[0].expectation.kind='inferred',x=>x.cases[0].category='manual-approved']) {
    const invalid=structuredClone(model); mutate(invalid);assert.equal(validate(invalid),false);negatives++;
  }
  const cases=model.cases.filter(c=>c.component==='TextField'&&c.category==='error'), old='export const Existing = {args:{label:"Keep"}};\n', next=projectScenarioStories(old,cases);
  assert(next.startsWith(old),'Authored CSF program is retained byte-for-byte');
  assert.equal(projectScenarioStories(next,cases),next,'Owned story fence is deterministic');
  assert(next.includes('ScenarioTextFieldError'));assert(next.includes('playComponentScenario'));
  assert.throws(()=>projectScenarioStories(next+'// BEGIN GENERATED COMPONENT SCENARIO STORIES\n',cases),/Duplicate/);negatives++;
  assert.throws(()=>projectScenarioStories(next.replace('// END GENERATED COMPONENT SCENARIO STORIES',''),cases),/Damaged/);negatives++;
  mkdirSync('test-results/component-scenarios',{recursive:true});
  writeFileSync('test-results/component-scenarios/structural.json',JSON.stringify({status:'PASS',coverage:model.coverage,negativeControls:negatives,deterministic:true,schema:true,scope:'Exact declared finite/default/disabled/error coverage and eight explicit empty contracts; no whole keyboard or all-API behavior claim.'},null,2)+'\n');
  console.log('PASS source-bound component scenarios/schema/determinism and '+negatives+' fail-closed controls');
} finally {rmSync(scratch,{recursive:true,force:true});}
