import assert from'node:assert/strict';import{readFileSync,writeFileSync,mkdtempSync,rmSync}from'node:fs';import{join,resolve}from'node:path';import{tmpdir}from'node:os';import{spawnSync}from'node:child_process';
const targets=JSON.parse(readFileSync('_audit/ci/fixtures/floating-panel-targets.json')).components;const temp=mkdtempSync(join(tmpdir(),'cs-floating-types-'));
try{const lines=['import * as React from"react";'];for(const[index,target]of targets.entries()){
 lines.push(`import{${target.name}}from${JSON.stringify(resolve(target.source.replace(/\.jsx$/,'')))};declare const props${index}:React.ComponentProps<typeof ${target.name}>;`);
 for(const side of['top','bottom','left','right'])for(const suffix of['','-start','-end'])lines.push(`<${target.name} {...props${index}} portal={true} placement="${side+suffix}"/>;`);
 lines.push(`<${target.name} {...props${index}} portal={false}/>;`);
 lines.push(`// @ts-expect-error boolean portal contract\n<${target.name} {...props${index}} portal="body"/>;`);
 lines.push(`// @ts-expect-error unsupported placement is not guessed\n<${target.name} {...props${index}} placement="auto"/>;`);
 }const fixture=join(temp,'consumer.tsx');writeFileSync(fixture,lines.join('\n'));
 for(const major of[18,19]){const folder=major===18?'@types/react18':'@types/react';const config=join(temp,'tsconfig.json');writeFileSync(config,JSON.stringify({compilerOptions:{strict:true,noEmit:true,skipLibCheck:false,target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',types:[],paths:{react:[resolve('node_modules/'+folder+'/index.d.ts')],'react/*':[resolve('node_modules/'+folder+'/*')]}},files:[fixture]}));const r=spawnSync(process.execPath,[resolve('node_modules/typescript/bin/tsc'),'-p',config,'--pretty','false'],{encoding:'utf8'});assert.equal(r.status,0,`React${major}: ${r.stdout}\n${r.stderr}`);}
 console.log('PASS all17 floating prop contracts: body/inline,12 placements, invalid values rejected, strict React18/19');
}finally{rmSync(temp,{recursive:true,force:true});}
