import assert from 'node:assert/strict';
/** Only exact, hash-pinned test tools are accepted; never execute requirements text. */
export function parseHashPinnedRequirements(text){
 const rows=[],seen=new Set();
 for(const raw of text.split(/\r?\n/)){
  const line=raw.trim();if(!line||line.startsWith('#'))continue;
  const match=/^([A-Za-z0-9][A-Za-z0-9._-]*)==([0-9][A-Za-z0-9.!+-]*) ((?:--hash=sha256:[a-f0-9]{64})(?: --hash=sha256:[a-f0-9]{64})*)$/.exec(line);
  assert(match,'Unsupported or unhashed Python test dependency');
  const name=match[1].toLowerCase().replace(/[-_.]+/g,'-');assert(!seen.has(name),'Duplicate Python dependency');seen.add(name);
  const wheelSha256=match[3].split(' ').map(value=>value.slice('--hash=sha256:'.length));
  assert.equal(new Set(wheelSha256).size,wheelSha256.length,'Duplicate wheel hash');
  rows.push({name,version:match[2],wheelSha256});
 }
 assert(rows.length,'Empty Python dependency inventory');return rows;
}
/** Use advisory-provider severity; missing/unknown classification fails closed. */
export function evaluatePythonAudit(report){
 assert(report&&typeof report==='object'&&!Array.isArray(report)&&!report.error,'Invalid OSV response');
 assert(Object.keys(report).every(key=>key==='vulns'),'Unexpected OSV response fields');
 const vulns=Object.hasOwn(report,'vulns')?report.vulns:[];assert(Array.isArray(vulns),'Invalid OSV advisory list');
 const seen=new Set(),advisories=vulns.map(v=>{
  assert(v&&typeof v.id==='string'&&v.id.trim()&&!seen.has(v.id),'Invalid/duplicate OSV advisory');seen.add(v.id);
  const raw=v.database_specific?.severity??v.ecosystem_specific?.severity;
  const label=typeof raw==='string'?raw.toLowerCase():'unknown';
  const severity=({info:'info',low:'low',medium:'moderate',moderate:'moderate',high:'high',critical:'critical'})[label]||'unknown';
  return {id:v.id,severity,classificationSource:severity==='unknown'?null:v.database_specific?.severity!==undefined?'database_specific.severity':'ecosystem_specific.severity'};
 });
 return {pass:advisories.every(v=>['info','low','moderate'].includes(v.severity)),threshold:'high',unknownSeverity:'fail closed for review; CVSS vectors are not independently scored',advisories};
}
