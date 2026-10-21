import assert from 'node:assert/strict';
/** Owner-selected threshold includes all dependency classes; no advisory exceptions. */
export function evaluateAudit(report){
 assert(report&&typeof report==='object'&&!Array.isArray(report),'Audit must return a JSON object');
 assert(!report.error,'Audit service returned an error');
 assert.equal(report.auditReportVersion,2,'Unsupported audit report format');
 const counts=report.metadata?.vulnerabilities;assert(counts&&typeof counts==='object','Missing vulnerability counts');
 for(const key of ['info','low','moderate','high','critical','total'])assert(Number.isSafeInteger(counts[key])&&counts[key]>=0,'Invalid vulnerability count: '+key);
 assert.equal(counts.total,counts.info+counts.low+counts.moderate+counts.high+counts.critical,'Inconsistent vulnerability totals');
 assert(report.vulnerabilities&&typeof report.vulnerabilities==='object'&&!Array.isArray(report.vulnerabilities),'Missing vulnerability details');
 assert.equal(Object.keys(report.vulnerabilities).length,counts.total,'Missing vulnerability records');
 const actual={info:0,low:0,moderate:0,high:0,critical:0};
 for(const [name,entry]of Object.entries(report.vulnerabilities)){assert(name&&entry&&Object.hasOwn(actual,entry.severity),'Invalid vulnerability severity');actual[entry.severity]++}
 for(const key of Object.keys(actual))assert.equal(actual[key],counts[key],'Severity/detail mismatch: '+key);
 return {pass:counts.high===0&&counts.critical===0,threshold:'high',scope:'runtime, development, optional and peer dependencies; no exclusions or advisory suppressions',counts};
}

/** A reviewed inventory keeps nested maintained dependency graphs in audit scope. */
export function validateAuditProjects(inventory){
 assert.equal(inventory?.schemaVersion,1,'Unsupported audit inventory');
 assert(Array.isArray(inventory.projects)&&inventory.projects.length>0,'Missing audit projects');
 const ids=new Set(),directories=new Set();
 for(const row of inventory.projects){
  assert(row&&typeof row==='object'&&typeof row.id==='string'&&/^[a-z][a-z0-9-]*$/.test(row.id),'Invalid audit project id');
  assert(typeof row.directory==='string'&&(row.directory==='.'||/^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+$/.test(row.directory)),'Audit directory must be repository relative');
  assert(typeof row.purpose==='string'&&row.purpose.trim(),'Audit purpose required');
  assert(!ids.has(row.id)&&!directories.has(row.directory),'Duplicate audit project');ids.add(row.id);directories.add(row.directory);
 }
 assert(inventory.projects.some(row=>row.id==='root'&&row.directory==='.'),'Root dependency graph is required');
 return inventory.projects;
}
