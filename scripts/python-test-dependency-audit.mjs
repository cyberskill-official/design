import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseHashPinnedRequirements,evaluatePythonAudit} from './lib/python-audit-policy.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),out=resolve(root,'test-results/python-dependency-audit');mkdirSync(out,{recursive:true});
const summary={schemaVersion:1,recordedAt:new Date().toISOString(),node:process.version,pass:false,scope:'Hash-pinned isolated Python font/PDF test tools; separate from npm audit and package health/malware/license review',projects:[]};
try{
 const paths=['_audit/ci/requirements-pdf.txt','scripts/requirements-fonts.txt'];
 const hashes=new Map(paths.map(path=>[path,createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex')]));
 summary.requirements=Object.fromEntries(hashes);
 const dependencies=paths.flatMap(path=>parseHashPinnedRequirements(readFileSync(resolve(root,path),'utf8')).map(row=>({...row,requirementsPath:path})));
 if(new Set(dependencies.map(row=>row.name)).size!==dependencies.length)throw Error('Duplicate package across Python dependency inventories');
 for(const dependency of dependencies){
  let row={...dependency,pass:false};
  try{
   const query={package:{name:dependency.name,ecosystem:'PyPI'},version:dependency.version};
   const response=await fetch('https://api.osv.dev/v1/query',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(query),signal:AbortSignal.timeout(30000)});
   const raw=await response.text();writeFileSync(resolve(out,dependency.name+'.raw.json'),raw);
   if(!response.ok)throw Error('OSV service HTTP '+response.status);
   row={...row,...evaluatePythonAudit(JSON.parse(raw))};
  }catch(error){row={...row,pass:false,error:error.message}}
  summary.projects.push(row);
 }
 for(const [path,hash]of hashes)if(createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex')!==hash)throw Error('Python requirements changed during audit');
 summary.pass=summary.projects.every(row=>row.pass);
}catch(error){summary.error=error.message}
writeFileSync(resolve(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));if(!summary.pass)process.exitCode=1;
