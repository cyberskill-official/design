import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,cpSync,rmSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
const root=fileURLToPath(new URL('../../',import.meta.url)),temp=mkdtempSync(join(tmpdir(),'cs-compiled-packed-'));
try{
 const react18=process.argv.includes('--react18');
 if(react18){for(const name of ['package.json','package-lock.json'])cpSync(join(root,'_audit/ci/fixtures/react18-consumer',name),join(temp,name));execFileSync('npm',['ci','--ignore-scripts','--no-audit','--no-fund'],{cwd:temp,stdio:'pipe',timeout:120000})}
 else{writeFileSync(join(temp,'package.json'),JSON.stringify({type:'module'}));for(const name of ['react','react-dom','scheduler'])cpSync(join(root,'node_modules',name),join(temp,'node_modules',name),{recursive:true})}
 const[pack]=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--pack-destination',temp],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}));
 const pkg=join(temp,'node_modules/@cyberskill/design');mkdirSync(pkg,{recursive:true});execFileSync('tar',['-xzf',join(temp,pack.filename),'-C',pkg,'--strip-components=1']);
 writeFileSync(join(temp,'consumer.mjs'),`import assert from 'node:assert/strict';
import React from 'react';import {renderToString}from'react-dom/server';
import * as CS from '@cyberskill/design';import * as ReactEntry from '@cyberskill/design/react';
import {Form}from'@cyberskill/design/components/forms/Form.jsx';
import {TagInput}from'@cyberskill/design/components/forms/TagInput.jsx';
import {NumberField}from'@cyberskill/design/components/forms/NumberField.jsx';
import {InputOTP}from'@cyberskill/design/components/forms/InputOTP.jsx';
import {Button}from'@cyberskill/design/components/button/Button.jsx';
assert.equal(CS.Button,Button);assert.equal(CS.Form,Form);assert.equal(CS.TagInput,TagInput);assert.equal(CS.InputOTP,InputOTP);
const api=JSON.parse((await import('node:fs')).readFileSync(new URL('./node_modules/@cyberskill/design/components/api-index.json',import.meta.url)));
for(const item of api.exports.filter(item=>item.kind==='component')){const granular=await import('@cyberskill/design/'+item.sourcePath);assert.equal(CS[item.name],granular[item.name],item.name+' root/deep identity')}
for(const name of Object.keys(CS))assert.equal(CS[name],ReactEntry[name],name+' root/react identity');
const h=React.createElement;
const markup=renderToString(h(Form,{rules:{tags:'required'},initialValues:{tags:['Alpha'],quantity:7,code:'1234'}},
 h(CS.FormField,{name:'tags',label:'Tag field'},h(TagInput)),
 h(CS.FormField,{name:'quantity',label:'Quantity field'},h(NumberField)),
 h(CS.FormField,{name:'code',label:'Code field'},h(InputOTP,{length:4})),h(Button,null,'Render <safe>')));
assert(markup.includes('Alpha'));assert(markup.includes('value="7"'));assert(markup.includes('value="4"'));assert(markup.includes('aria-labelledby='));assert(markup.includes('Render &lt;safe&gt;'));
const metadata=JSON.parse((await import('node:fs')).readFileSync(new URL('./node_modules/@cyberskill/design/package.json',import.meta.url)));
assert.equal(metadata.exports['./source'].import,'./_esm/react.mjs');assert.equal(metadata.exports['./source/components/*'],'./components/*');
console.log(JSON.stringify({pass:true,react:React.version,exports:Object.keys(CS).length,scope:'Plain Node ESM import+SSR without loader/transpiler; root/react/deep function identity; cross-entry Form controller and field associations; explicit source entry retained. CommonJS unpromised.'}));`);
 const result=spawnSync(process.execPath,[join(temp,'consumer.mjs')],{cwd:temp,encoding:'utf8',timeout:30000});assert.equal(result.status,0,result.stdout+'\n'+result.stderr);assert.equal(result.stderr,'','Plain Node SSR emits no diagnostics');console.log(result.stdout.trim());
 const sourceConsumer=join(temp,'source-consumer.mjs');
 writeFileSync(sourceConsumer,`import assert from 'node:assert/strict';import React from 'react';import {renderToString}from'react-dom/server';import {Button,Form,FormField,NumberField}from'@cyberskill/design/source';import {Button as DeepButton}from'@cyberskill/design/source/components/button/Button.jsx';assert.equal(Button,DeepButton);const html=renderToString(React.createElement(Form,{rules:{n:'required'},initialValues:{n:9}},React.createElement(FormField,{name:'n',label:'Quantity'},React.createElement(NumberField))));assert(html.includes('value="9"'));console.log('PASS explicit JSX source workflow: bundled consumer retains source-family component/context identity');`);
 const sourceOutput=join(temp,'source-consumer.cjs');buildSync({absWorkingDir:temp,entryPoints:[sourceConsumer],outfile:sourceOutput,bundle:true,platform:'node',format:'cjs',external:['react','react-dom/server'],define:{'process.env.NODE_ENV':'"production"'},logLevel:'silent'});
 const sourceResult=spawnSync(process.execPath,[sourceOutput],{cwd:temp,encoding:'utf8',timeout:30000});assert.equal(sourceResult.status,0,sourceResult.stdout+'\n'+sourceResult.stderr);console.log(sourceResult.stdout.trim());
}finally{rmSync(temp,{recursive:true,force:true})}
