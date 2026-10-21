import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync}from'node:fs';import{join,resolve}from'node:path';import{tmpdir}from'node:os';import{spawnSync}from'node:child_process';import{parse}from'@babel/parser';
import{collectSources}from'../../scripts/build-bundle.mjs';
const root=new URL('../../',import.meta.url).pathname;
let count=0;
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node))if(!['loc','start','end'].includes(key)){if(Array.isArray(value))value.forEach(n=>walk(n,visit));else if(value&&typeof value==='object')walk(value,visit)}}
for(const file of collectSources(root).filter(path=>path.endsWith('.jsx'))){
 const source=readFileSync(join(root,file),'utf8');const ast=parse(source,{sourceType:'module',plugins:['jsx']});
 const calls=[];walk(ast,node=>{if(node.type==='CallExpression'&&node.callee.name==='makeT'&&node.arguments[0]?.type==='StringLiteral')calls.push(node)});
 if(!calls.length)continue;count++;
 for(const call of calls)assert.equal(call.arguments[2]?.name,'localeMessages',file+': built-in translator must receive provider context');
 assert(/\[[^\]]*,\s*localeMessages\]\s*=\s*useLang\(/.test(source),file+': context obtained from existing locale hook');
}
assert(count>0,'All current built-in translator consumers are scanned');
const temp=mkdtempSync(join(tmpdir(),'cs-locale-types-'));
try{
 const source=join(temp,'consumer.tsx');writeFileSync(source,`import React from 'react';import{LocaleProvider,useMessages,Pagination}from${JSON.stringify(resolve(root,'_esm/react'))};
 const messages={Checkout:{fr:{pay:'Payer'}}}as const;
 function Consumer(){const t=useMessages('Checkout','fr');return <LocaleProvider messages={messages}><p>{t('pay')}</p><Pagination lang="fr" pageCount={10}/></LocaleProvider>}
 // @ts-expect-error explicit lang required for application namespaces
 useMessages('Checkout');
 // @ts-expect-error strings only
 const bad=<LocaleProvider messages={{X:{en:{bad:3}}}}/>;
 // @ts-expect-error context-only provider does not select language
 const lang=<LocaleProvider messages={messages} lang="fr"/>;
 // @ts-expect-error provider has no DOM root
 const root=<LocaleProvider messages={messages} rootProps={{id:'x'}}/>;`);
 for(const[major,folder]of[[18,'@types/react18'],[19,'@types/react']]){
  const config=join(temp,'tsconfig.json');writeFileSync(config,JSON.stringify({compilerOptions:{noEmit:true,strict:true,skipLibCheck:false,target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',types:[],lib:['ES2022','DOM','DOM.Iterable'],paths:{react:[resolve(root,'node_modules/'+folder+'/index.d.ts')],'react/*':[resolve(root,'node_modules/'+folder+'/*')]}},files:[source]}));
  const result=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'-p',config,'--pretty','false'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);console.log('PASS React '+major+' locale API declarations and invalid usage checks');
 }
}finally{rmSync(temp,{recursive:true,force:true})}
console.log('PASS '+count+' source translator consumers carry scoped messages; no fixed consumer count substitutes for current source discovery');
