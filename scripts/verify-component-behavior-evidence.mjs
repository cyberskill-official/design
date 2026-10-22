import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {generateComponentSpecifications} from './generate-component-specifications.mjs';
import {behaviorInputInventoryVersion,assertExactEvidenceInputKeys,readBoundedEvidenceInput,snapshotBehaviorInputs} from './lib/behavior-evidence-inputs.mjs';
import {behaviorSourceCases} from './lib/behavior-source-cases.mjs';
const hash=text=>createHash('sha256').update(text).digest('hex');
export function verifyBehaviorEvidence(root,receipt){
 const specs=generateComponentSpecifications(root,{check:true}),names=specs.components.map(c=>c.name),read=path=>readFileSync(resolve(root,path),'utf8');
 assert.equal(receipt.schemaVersion,1);assert.equal(receipt.passed,true);assert.equal(receipt.sourceArtifactsUnchanged,true);assert.deepEqual(receipt.before,receipt.after);
 assert.equal(receipt.inputInventoryVersion,behaviorInputInventoryVersion);
 assertExactEvidenceInputKeys(root,receipt.before);assertExactEvidenceInputKeys(root,receipt.after);
 assert.deepEqual(receipt.before,snapshotBehaviorInputs(root),'Runtime source, CSS, vendor or producer drift');
 const boards=['_audit/component-behavior-test.html','_audit/a11y-gate.html'],engines=['chromium','firefox','webkit'];
 assert.deepEqual(receipt.sourceCases.map(row=>row.path).sort(),[...boards].sort(),'Exact source-board membership is required');
 assert.equal(receipt.results.length,boards.length*engines.length);
 for(const board of boards){
  const cases=behaviorSourceCases(read(board),names),sourceBoard=receipt.sourceCases.filter(b=>b.path===board);assert.equal(sourceBoard.length,1);assert.equal(sourceBoard[0].sourceSha256,hash(read(board)));assert.deepEqual(sourceBoard[0].cases,cases,'Assertion source/spans must exactly match');
  for(const engine of engines){const rows=receipt.results.filter(r=>r.board===board&&r.browser===engine);assert.equal(rows.length,1,'Each board/engine executes exactly once');const row=rows[0];assert(row.version);assert.deepEqual(row.pageErrors,[]);assert.equal(row.verdict.pass,true);assert.deepEqual(row.verdict.results.map(r=>r.name).sort(),cases.map(c=>c.name).sort());assert(row.verdict.results.every(r=>r.ok===true));}
 }
 assert.equal(receipt.fieldAssociations.passed,true);assert.equal(receipt.fieldAssociations.sourceSha256,receipt.before['_audit/ci/test-field-associations-browser.mjs']);
 return{schemaVersion:1,producerHashes:receipt.before,parsedReceiptJsonSha256:hash(JSON.stringify(receipt)),engines,components:specs.components.map(component=>({name:component.name,verifiedRequirements:component.behavior.requirements.map(r=>({id:r.id,statement:r.statement,testPath:r.testPath,caseName:r.caseName,contextComponents:r.contextComponents,assertions:r.assertions,status:'verified-on-recorded-producer'})),executedFixtureReferences:component.behavior.fixtureReferences.length,uncoveredAuthoredProps:component.behavior.uncoveredAuthoredProps,completeBehaviorSpecification:false,completeAccessibilitySpecification:false})),scope:'Only exact mapped assertions on this source/bundle in the three recorded installed engines. Incidental fixture references, unmapped props, manual accessibility and complete specifications remain unverified.'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const root=resolve(process.argv[2]||resolve(dirname(fileURLToPath(import.meta.url)),'..')),input=resolve(process.argv[3]||resolve(root,'test-results/component-behavior-evidence.json')),report=verifyBehaviorEvidence(root,JSON.parse(readFileSync(input,'utf8')));mkdirSync(resolve(root,'test-results'),{recursive:true});writeFileSync(resolve(root,'test-results/component-behavior-verification.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS '+report.components.reduce((n,c)=>n+c.verifiedRequirements.length,0)+' exact requirement mappings; all '+report.components.length+' exports retain explicit uncovered scope');}
