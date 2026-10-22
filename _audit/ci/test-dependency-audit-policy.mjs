import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {evaluateAudit,validateAuditProjects} from '../../scripts/lib/dependency-audit-policy.mjs';
const clean={auditReportVersion:2,metadata:{vulnerabilities:{info:0,low:0,moderate:0,high:0,critical:0,total:0}},vulnerabilities:{}};
assert.equal(evaluateAudit(clean).pass,true);
for(const severity of ['info','low','moderate','high','critical']){const report=structuredClone(clean);report.metadata.vulnerabilities[severity]=1;report.metadata.vulnerabilities.total=1;report.vulnerabilities.fixture={severity};assert.equal(evaluateAudit(report).pass,['info','low','moderate'].includes(severity),severity)}
for(const mutate of [r=>delete r.metadata,r=>r.error={code:'EAUDIT'},r=>r.auditReportVersion=99,r=>r.metadata.vulnerabilities.high=-1,r=>r.metadata.vulnerabilities.total=1,r=>r.metadata.vulnerabilities.low=0.5,r=>r.vulnerabilities=null,r=>r.vulnerabilities.fixture={severity:'unknown'}]){const report=structuredClone(clean);mutate(report);assert.throws(()=>evaluateAudit(report))}
const missing=structuredClone(clean);missing.metadata.vulnerabilities.high=1;missing.metadata.vulnerabilities.total=1;assert.throws(()=>evaluateAudit(missing),/Missing vulnerability records/);
const mismatch=structuredClone(missing);mismatch.vulnerabilities.fixture={severity:'low'};assert.throws(()=>evaluateAudit(mismatch),/Severity\/detail mismatch/);
console.log('PASS dependency audit: all classes, high/critical blocked, lower impacts retained, service/malformed/missing/inconsistent reports fail closed; no advisory exceptions');

for(const dependencyClass of ['dev','optional','peer']){const report=structuredClone(clean);report.metadata.vulnerabilities.high=1;report.metadata.vulnerabilities.total=1;report.vulnerabilities.fixture={severity:'high',[dependencyClass]:true};assert.equal(evaluateAudit(report).pass,false,'No '+dependencyClass+' exception');}
const workflow=parse(readFileSync('.github/workflows/design-system-gates.yml','utf8'));const steps=workflow.jobs['fast-gates'].steps;assert(steps.some(step=>step.run==='npm run security:audit'),'Audit must run in existing fast-gates job');const retain=steps.find(step=>step.with?.name==='dependency-audit');assert.equal(retain.if,'always()');assert.deepEqual(retain.with.path.trim().split(/\s+/),['test-results/dependency-audit/','test-results/python-dependency-audit/']);
const cli=readFileSync('scripts/dependency-audit.mjs','utf8');for(const flag of ['--include=dev','--include=optional','--include=peer'])assert(cli.includes(flag),'Environment omit settings must not exclude '+flag);

const inventory=JSON.parse(readFileSync('scripts/dependency-audit-projects.json','utf8'));
assert.deepEqual(validateAuditProjects(inventory).map(row=>row.directory),['.','examples/vite-consumer','_audit/ci/fixtures/react18-consumer','_audit/ci/fixtures/npm-cli','_audit/ci/fixtures/style-dictionary']);
for(const row of inventory.projects){const lock=JSON.parse(readFileSync(row.directory+'/package-lock.json','utf8'));assert.equal(lock.lockfileVersion,3);}
for(const mutate of [r=>delete r.projects[1].id,r=>r.projects=[],r=>r.projects.push({...r.projects[0]}),r=>r.projects[1].directory='../outside',r=>r.projects[1].directory='/absolute',r=>r.projects[1].directory='examples/../outside',r=>r.projects.shift()]){const bad=structuredClone(inventory);mutate(bad);assert.throws(()=>validateAuditProjects(bad));}
console.log('PASS audit scope: root, Vite example, React 18 fixture, locked npm CLI and Style Dictionary; missing root, empty, duplicate and unsafe directory inventories rejected');
