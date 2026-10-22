import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
const temporary=mkdtempSync(join(tmpdir(),'cs-composite-target-types-'));
try{
 for(const [major,folder]of [[18,'@types/react18'],[19,'@types/react']]){
  const config=join(temporary,'tsconfig.json');
  writeFileSync(config,JSON.stringify({compilerOptions:{noEmit:true,strict:true,skipLibCheck:false,target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',types:[],lib:['ES2022','DOM','DOM.Iterable'],paths:{react:[resolve(root,'node_modules/'+folder+'/index.d.ts')],'react/*':[resolve(root,'node_modules/'+folder+'/*')]}},files:[resolve(root,'_audit/ci/fixtures/composite-field-targets.tsx')]}));
  const result=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'-p',config,'--pretty','false'],{encoding:'utf8'});
  assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
  console.log('PASS React '+major+': valid target consumers and rejected unsupported ownership/required props');
 }
}finally{rmSync(temporary,{recursive:true,force:true})}
