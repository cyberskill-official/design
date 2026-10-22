import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {parseHashPinnedRequirements,evaluatePythonAudit} from '../../scripts/lib/python-audit-policy.mjs';
const pin='pypdf==6.21.1 --hash=sha256:'+'a'.repeat(64);
assert.deepEqual(parseHashPinnedRequirements('# Test only\n'+pin),[{name:'pypdf',version:'6.21.1',wheelSha256:['a'.repeat(64)]}]);
for(const source of ['',pin+'\n'+pin,'pypdf>=6',pin+' --extra-index-url https://example.test','-r other.txt','https://example.test/pkg.whl',pin.replace('a'.repeat(64),'not-a-hash'),pin.replace('6.21.1','*')])assert.throws(()=>parseHashPinnedRequirements(source));
assert.equal(evaluatePythonAudit({}).pass,true);assert.equal(evaluatePythonAudit({vulns:[]}).pass,true);
for(const [severity,pass]of [['LOW',true],['MODERATE',true],['MEDIUM',true],['HIGH',false],['CRITICAL',false],['unknown',false]])assert.equal(evaluatePythonAudit({vulns:[{id:'OSV-fixture',database_specific:{severity}}]}).pass,pass);
assert.equal(evaluatePythonAudit({vulns:[{id:'OSV-unknown',severity:[{type:'CVSS_V3',score:'CVSS:3.1/AV:N'}]}]}).pass,false);
for(const report of [null,[],{error:'service'},{message:'invalid'},{vulns:null},{vulns:{}},{vulns:[{}]},{vulns:[{id:'same'},{id:'same'}]}])assert.throws(()=>evaluatePythonAudit(report));
assert.equal(evaluatePythonAudit({vulns:[{id:'low',database_specific:{severity:'LOW'}},{id:'high',database_specific:{severity:'HIGH'}}]}).pass,false);
console.log('PASS Python audit: hash-pinned exact input, severity threshold, unknown classification and malformed/service responses fail closed');

assert.deepEqual(parseHashPinnedRequirements(readFileSync('_audit/ci/requirements-pdf.txt','utf8')).map(row=>row.name),['pypdf']);
const steps=parse(readFileSync('.github/workflows/design-system-gates.yml','utf8')).jobs['fast-gates'].steps;
const audit=steps.find(step=>step.run==='npm run security:audit-python');assert(audit);assert.equal(audit.if,'${{ !cancelled() }}');assert.equal(audit['continue-on-error'],undefined);

assert.equal(parseHashPinnedRequirements(pin+' --hash=sha256:'+'b'.repeat(64))[0].wheelSha256.length,2);
assert.throws(()=>parseHashPinnedRequirements(pin+' --hash=sha256:'+'a'.repeat(64)),/Duplicate wheel hash/);
assert.deepEqual(parseHashPinnedRequirements(readFileSync('scripts/requirements-fonts.txt','utf8')).map(row=>row.name),['fonttools','brotli']);

const unit=parse(readFileSync('.github/workflows/design-system-gates.yml','utf8')).jobs['unit-tests'].steps;
const setupIndex=unit.findIndex(step=>step.uses?.startsWith('actions/setup-python@'));
const installIndex=unit.findIndex(step=>step.name==='Install hash-pinned Python test tools');
assert(setupIndex>=0&&installIndex>setupIndex&&unit.findIndex(step=>step.run==='npm run test:unit')>installIndex);
assert.equal(unit[setupIndex].with['python-version'],'3.12');
for(const flag of ['--require-hashes','--only-binary=:all:','--no-deps','scripts/requirements-fonts.txt','_audit/ci/requirements-pdf.txt','CS_PDF_PYTHON='])assert(unit[installIndex].run.includes(flag));
const suites=JSON.parse(readFileSync('_audit/ci/unit-suites.json','utf8')).suites;assert(suites.some(row=>row.command==='npm run test:font-glyphs'));

const release=parse(readFileSync('.github/workflows/release.yml','utf8')).jobs.prepare.steps;
const releaseInstall=release.findIndex(step=>step.name==='Install hash-pinned Python test tools');
assert(releaseInstall>=0&&releaseInstall<release.findIndex(step=>step.run==='npm run verify'),'Release preparation must install required Python tools before canonical verification');
for(const flag of ['--require-hashes','--only-binary=:all:','--no-deps','scripts/requirements-fonts.txt','_audit/ci/requirements-pdf.txt','CS_PDF_PYTHON='])assert(release[releaseInstall].run.includes(flag));
