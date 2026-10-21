import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function validateManualAT(matrix){
 assert.equal(matrix.schemaVersion,1);assert.equal(matrix.rows.length,16);
 assert.deepEqual(matrix.rows.map(row=>row.id),Array.from({length:16},(_,i)=>`AT-${String(i+1).padStart(2,'0')}`));
 for(const row of matrix.rows){
  assert(['pending','passed','failed','blocked'].includes(row.status));assert(Array.isArray(row.evidence));
  if(['passed','failed'].includes(row.status)){
   for(const key of ['scope','reviewer','reviewedAt','sourceCommit','environment','observations'])assert(typeof row[key]==='string'&&row[key].trim(),`${row.id}: missing ${key}`);
   assert(/^[a-f0-9]{40}$/.test(row.sourceCommit),'Exact commit required');assert(Number.isFinite(Date.parse(row.reviewedAt)),'Date required');assert(row.evidence.length>0,'Evidence required');
  }
 }
}
const matrix=JSON.parse(readFileSync(new URL('../../docs/manual-at-matrix.json',import.meta.url),'utf8'));validateManualAT(matrix);
export function validateCurrentScopePlan(matrix){
 const plan=matrix.currentScopePlan;
 assert.equal(plan.schemaVersion,1);assert.equal(plan.state,'approved');
 assert(typeof plan.approval.reviewedBy==='string'&&plan.approval.reviewedBy.trim());
 assert(Number.isFinite(Date.parse(plan.approval.approvedAt)));
 assert.match(plan.approval.proposalSha256,/^[a-f0-9]{64}$/);
 assert.equal(plan.approval.proposalPath,'_audit/remediation/manual-at-scope-proposal.json');
 const proposedBytes=readFileSync(plan.approval.proposalPath);
 assert.equal(createHash('sha256').update(proposedBytes).digest('hex'),plan.approval.proposalSha256,'Approved proposal bytes must remain available and unchanged');
 const proposed=JSON.parse(proposedBytes);
 assert.equal(proposed.currentScopePlan.state,'proposed');
 assert.deepEqual(plan.rows.map(({historicalScope,...row})=>row),proposed.currentScopePlan.rows,'Approval covers the exact proposed bilingual names/tasks/outcomes');
 assert.deepEqual(plan.environmentRequirement,proposed.currentScopePlan.environmentRequirement);
 assert.equal(plan.approval.decision,'Adopt the proposed 16-row scope plan');
 assert(plan.approval.scope.includes('no manual execution or result approval'));
 assert(typeof plan.basis==='string'&&plan.basis.includes('not reconstruction'));
 assert.deepEqual(plan.rows.map(row=>row.id),matrix.rows.map(row=>row.id),'Exactly one current proposal per AT row');
 const bilingual=value=>{assert.deepEqual(Object.keys(value).sort(),['en','vi']);for(const text of Object.values(value))assert(typeof text==='string'&&text.trim().length>12);};
 bilingual(plan.environmentRequirement);
 for(const [index,row]of plan.rows.entries()){
  bilingual(row.scope);assert.equal(typeof row.historicalScopeKnown,'boolean');
  assert.equal(row.historicalScopeKnown,row.historicalScope!==null,'Historical scope provenance cannot be invented');
  assert.equal(row.historicalScope,proposed.rows[index].scope,'Historical known/null scopes remain byte-bound to the reviewed proposal');
  if(row.historicalScopeKnown)assert.equal(row.scope.en,row.historicalScope,'Known scope names remain preserved');
  else assert.equal(row.historicalScope,null);
  assert.equal(matrix.rows[index].scope,row.scope.en,'Current execution scope follows the owner-approved proposal');
  for(const key of ['tasks','expected']){assert(Array.isArray(row[key])&&row[key].length>=2);row[key].forEach(bilingual);}
 }
}
validateCurrentScopePlan(matrix);
for(const mutate of [x=>x.currentScopePlan.rows.pop(),x=>x.currentScopePlan.rows[1].id='AT-01',x=>x.currentScopePlan.rows[0].scope.vi='',x=>x.currentScopePlan.rows[0].tasks=[],x=>x.currentScopePlan.rows[0].expected.pop(),x=>x.currentScopePlan.rows[0].historicalScopeKnown=true,x=>x.currentScopePlan.rows[2].scope.en='Invented historical name',x=>x.currentScopePlan.approval.proposalSha256='invalid',x=>x.currentScopePlan.approval.approvedAt='invalid',x=>x.currentScopePlan.state='passed']){
 const damaged=structuredClone(matrix);mutate(damaged);assert.throws(()=>validateCurrentScopePlan(damaged));
}
const incomplete=structuredClone(matrix);incomplete.rows[0].status='passed';assert.throws(()=>validateManualAT(incomplete));
const missing=structuredClone(matrix);missing.rows.pop();assert.throws(()=>validateManualAT(missing));
console.log('PASS manual AT record integrity and16owner-approved bilingual scopes/tasks/expected outcomes; historical scopes preserved, pending rows are not manual acceptance');
