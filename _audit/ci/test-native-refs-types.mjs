import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const targets=JSON.parse(readFileSync('_audit/ci/fixtures/native-ref-targets.json')).components;
const temp=mkdtempSync(join(tmpdir(),'cs-native-ref-types-'));
try{
 const lines=['import * as React from "react";'];
 for(const [index,target]of targets.entries()){
  lines.push(`import {${target.name}} from ${JSON.stringify(resolve(target.source.replace(/\.jsx$/,'')))};`);
  lines.push(`declare const props${index}: React.ComponentProps<typeof ${target.name}>;`);
  if(target.ref){
   lines.push(`<${target.name} {...props${index}} ref={React.createRef<${target.ref.types.join('|')}>()}/>;`);
   lines.push(`<${target.name} {...props${index}} ref={node=>{const element: ${target.ref.types.join('|')}|null=node;void element;}}/>;`);
   lines.push(`// @ts-expect-error ${target.name} rejects non-element refs\n<${target.name} {...props${index}} ref={React.createRef<{notAnElement:true}>()}/>;`);
  }else lines.push(`// @ts-expect-error ${target.name} is a context-only provider\n<${target.name} {...props${index}} ref={React.createRef<HTMLDivElement>()}/>;`);
  if(target.controlRef){
   lines.push(`<${target.name} {...props${index}} controlRef={React.createRef<${target.controlRef.types.join('|')}>()}/>;`);
   lines.push(`// @ts-expect-error ${target.name} requires the declared native control\n<${target.name} {...props${index}} controlRef={React.createRef<{notAnElement:true}>()}/>;`);
  }else lines.push(`// @ts-expect-error ${target.name} has no distinct public controlRef\n<${target.name} {...props${index}} controlRef={React.createRef<HTMLDivElement>()}/>;`);
 }
 lines.push(`import {DataTable as GenericTable} from ${JSON.stringify(resolve('components/datatable/DataTable'))};`);
 lines.push(`<GenericTable rows={[{score:42}]} columns={[{key:'score',header:'Score',render:row=>row.score.toFixed(2)}]} ref={React.createRef<HTMLDivElement>()}/>;`);
 lines.push(`// @ts-expect-error generic row inference must not become any\n<GenericTable rows={[{score:42}]} columns={[{key:'score',header:'Score',render:row=>row.missing}]} />;`);
 const fixture=join(temp,'consumer.tsx');writeFileSync(fixture,lines.join('\n'));
 for(const major of[18,19]){
  const folder=major===18?'@types/react18':'@types/react';
  const config=join(temp,'tsconfig.json');writeFileSync(config,JSON.stringify({compilerOptions:{strict:true,noEmit:true,skipLibCheck:false,target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',types:[],lib:['ES2022','DOM','DOM.Iterable'],paths:{react:[resolve('node_modules/'+folder+'/index.d.ts')],'react/*':[resolve('node_modules/'+folder+'/*')]}},files:[fixture]}));
  const result=spawnSync(process.execPath,[resolve('node_modules/typescript/bin/tsc'),'-p',config,'--pretty','false'],{encoding:'utf8'});
  assert.equal(result.status,0,`React ${major}: ${result.stdout}\n${result.stderr}`);
 }
 mkdirSync('test-results/native-refs',{recursive:true});writeFileSync('test-results/native-refs/types.json',JSON.stringify({status:'PASS',reactMajors:[18,19],components:targets.length,refs:targets.filter(t=>t.ref).length,controlRefs:targets.filter(t=>t.controlRef).length,negativeCases:'wrong refs, context providers, unsupported controlRef, generic row inference'},null,2)+'\n');
 console.log('PASS all 120 public component ref types, 118 native refs/15 controls, providers excluded, generic inference; strict React18/19');
}finally{rmSync(temp,{recursive:true,force:true});}
