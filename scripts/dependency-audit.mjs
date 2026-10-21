import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {evaluateAudit,validateAuditProjects} from './lib/dependency-audit-policy.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,'test-results/dependency-audit');
mkdirSync(output,{recursive:true});
const summary={schemaVersion:1,recordedAt:new Date().toISOString(),pass:false,node:process.version,threshold:'high',scope:'All maintained lockfiles and dependency classes, no exemptions',projects:[]};
try{
 const inventory=JSON.parse(readFileSync(new URL('dependency-audit-projects.json',import.meta.url),'utf8'));
 const projects=validateAuditProjects(inventory);
 const npm=process.env.npm_execpath;if(!npm)throw Error('Run npm run security:audit so the npm CLI path is explicit');
 for(const project of projects){
  const cwd=resolve(root,project.directory),dir=project.id==='root'?output:resolve(output,project.id);mkdirSync(dir,{recursive:true});
  const hash=()=>createHash('sha256').update(readFileSync(resolve(cwd,'package-lock.json'))).digest('hex');
  let row={...project,pass:false,node:process.version};
  try{
   row.lockSha256=hash();
   const result=spawnSync(process.execPath,[npm,'audit','--json','--package-lock-only','--include=dev','--include=optional','--include=peer'],{cwd,encoding:'utf8',timeout:120000,maxBuffer:20*1024*1024});
   writeFileSync(resolve(dir,'audit.raw.json'),result.stdout||'');writeFileSync(resolve(dir,'audit.stderr.txt'),result.stderr||'');
   if(result.error||result.signal||![0,1].includes(result.status))throw Error('Dependency audit did not complete: '+(result.error?.message||result.signal||result.status));
   row={...row,...evaluateAudit(JSON.parse(result.stdout))};
   if(hash()!==row.lockSha256)throw Error('Lockfile changed during audit; rerun against stable input');
  }catch(error){row={...row,pass:false,error:error.message}}
  writeFileSync(resolve(dir,project.id==='root'?'root-summary.json':'summary.json'),JSON.stringify(row,null,2)+'\n');summary.projects.push(row);
 }
 summary.pass=summary.projects.every(row=>row.pass);
}catch(error){summary.error=error.message}
writeFileSync(resolve(output,'summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary));if(!summary.pass)process.exitCode=1;
