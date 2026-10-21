import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
const fixture=JSON.parse(readFileSync(resolve(root,'scripts/fixtures/static-html-reference.json'),'utf8'));
function expression(value){
 if(Array.isArray(value))return '['+value.map(expression).join(',')+']';
 if(value&&typeof value==='object'){
  if(value.$render!==undefined)return '()=>('+expression(value.$render)+')';
  if(value.$element){const e=value.$element;return 'React.createElement('+(e.component?'CS.'+e.component:JSON.stringify(e.tag))+','+expression(e.props||{})+','+expression(e.children)+')'}
  return '{'+Object.entries(value).map(([key,item])=>JSON.stringify(key)+':'+expression(item)).join(',')+'}';
 }return JSON.stringify(value)??'undefined';
}
const temp=mkdtempSync(join(tmpdir(),'cs-static-reference-types-'));
try{
 const consumer=join(temp,'consumer.tsx');writeFileSync(consumer,"import React from 'react';\nimport * as CS from "+JSON.stringify(resolve(root,'_esm/react'))+';\n'+fixture.components.map(entry=>'// '+entry.name+'\nReact.createElement(CS.'+entry.name+','+expression(entry.props)+');').join('\n'));
 for(const[major,folder]of [[18,'@types/react18'],[19,'@types/react']]){
  const config=join(temp,'tsconfig.json');writeFileSync(config,JSON.stringify({compilerOptions:{noEmit:true,strict:true,skipLibCheck:false,target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',types:[],lib:['ES2022','DOM','DOM.Iterable'],paths:{react:[resolve(root,'node_modules/'+folder+'/index.d.ts')],'react/*':[resolve(root,'node_modules/'+folder+'/*')]}},files:[consumer]}));
  const result=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'-p',config,'--pretty','false'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+'\n'+result.stderr);console.log('PASS React '+major+': all'+fixture.components.length+' static reference fixtures use declared prop types');
 }
}finally{rmSync(temp,{recursive:true,force:true})}
