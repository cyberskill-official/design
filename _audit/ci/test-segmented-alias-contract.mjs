import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {parse} from 'parse5';
import {readFileSync,writeFileSync,mkdtempSync,rmSync,cpSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {assertNpmVersion} from '../../scripts/check-npm-version.mjs';
const source='components/forms/SegmentedControl.jsx', declaration='components/forms/SegmentedControl.d.ts';
const temp=mkdtempSync(join(tmpdir(),'cs-segmented-alias-'));
const results=[];
const npmCli=resolve('_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js');
const npmVersion=execFileSync(process.execPath,[npmCli,'--version'],{encoding:'utf8'});
assertNpmVersion(JSON.parse(readFileSync('package.json','utf8')),npmVersion);
try {
  const fixture=join(temp,'types.tsx');
  writeFileSync(fixture,`import * as React from 'react';
import {SegmentedControl} from ${JSON.stringify(resolve(source.replace(/\.jsx$/,'')))};
const options=[{value:'a',label:'Alpha'}];
<SegmentedControl options={options}/>;
<SegmentedControl options={options} role="tablist"/>;
<SegmentedControl options={options} role="radiogroup"/>;
<SegmentedControl options={options} role="tablist" mode="radio" ref={React.createRef<HTMLDivElement>()}/>;
<SegmentedControl options={options} role="radiogroup" mode="tabs"/>;
// @ts-expect-error unsupported semantic aliases cannot produce mismatched children
<SegmentedControl options={options} role="button"/>;
// @ts-expect-error native role pass-through is deliberately not supported
<SegmentedControl options={options} role="presentation"/>;
// @ts-expect-error alias remains finite even when mode wins
<SegmentedControl options={options} role="button" mode="tabs"/>;
// @ts-expect-error unsupported mode is rejected
<SegmentedControl options={options} mode="other"/>;
`);
  for(const major of [18,19]) {
    const config=join(temp,'tsconfig.json'),folder=major===18?'@types/react18':'@types/react';
    writeFileSync(config,JSON.stringify({compilerOptions:{strict:true,noEmit:true,skipLibCheck:false,target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',types:[],lib:['ES2022','DOM','DOM.Iterable'],paths:{react:[resolve('node_modules/'+folder+'/index.d.ts')],'react/*':[resolve('node_modules/'+folder+'/*')]}},files:[fixture]}));
    const typed=spawnSync(process.execPath,[resolve('node_modules/typescript/bin/tsc'),'-p',config,'--pretty','false'],{encoding:'utf8'});
    assert.equal(typed.status,0,`React${major} types: ${typed.stdout}\n${typed.stderr}`);
    const consumer=join(temp,'react'+major);mkdirSync(consumer);
    if(major===18){
      for(const file of ['package.json','package-lock.json'])cpSync('_audit/ci/fixtures/react18-consumer/'+file,join(consumer,file));
      execFileSync(process.execPath,[npmCli,'ci','--ignore-scripts','--no-audit','--no-fund'],{cwd:consumer,stdio:'pipe',timeout:120000});
    } else {
      writeFileSync(join(consumer,'package.json'),JSON.stringify({type:'commonjs'}));
      for(const name of ['react','react-dom','scheduler'])cpSync('node_modules/'+name,join(consumer,'node_modules',name),{recursive:true});
    }
    const runtime=join(consumer,'segmented.cjs');
    buildSync({entryPoints:[source],outfile:runtime,bundle:true,platform:'node',format:'cjs',external:['react'],logLevel:'silent'});
    const child=spawnSync(process.execPath,['-e',`const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{SegmentedControl}=require('./segmented.cjs');const options=[{value:'a',label:'Alpha',id:'a','aria-controls':'panel-a'},{value:'b',label:'Beta',id:'b','aria-controls':'panel-b'}];const rows=[{}, {role:'tablist'}, {role:'radiogroup'}, {role:'tablist',mode:'radio'}, {role:'radiogroup',mode:'tabs'}].map(props=>({props,html:renderToStaticMarkup(React.createElement(SegmentedControl,{options,value:'a','aria-label':'Choice',...props}))}));const errors=[{role:'button'},{role:'presentation'},{role:''},{role:null},{role:'button',mode:'tabs'},{mode:'invalid'}].map(props=>{try{renderToStaticMarkup(React.createElement(SegmentedControl,{options,...props}));return null}catch(error){return String(error)}});console.log(JSON.stringify({react:React.version,rows,errors}));`],{cwd:consumer,encoding:'utf8',timeout:30000});
    assert.equal(child.status,0,child.stdout+'\n'+child.stderr);assert.equal(child.stderr,'','SSR emits no warnings');
    const data=JSON.parse(child.stdout),expected=['radio','tab','radio','radio','tab'];
    data.rows.forEach((row,index)=>{
      const elements=[];function visit(node){if(node.tagName)elements.push(node);for(const child of node.childNodes||[])visit(child)}visit(parse(row.html));
      const attr=(el,name)=>el.attrs.find(a=>a.name===name)?.value;
      const root=elements.find(el=>attr(el,'class')==='cs-segmented'),buttons=elements.filter(el=>el.tagName==='button'),role=expected[index],state=role==='tab'?'aria-selected':'aria-checked',other=role==='tab'?'aria-checked':'aria-selected';
      assert.equal(attr(root,'role'),role==='tab'?'tablist':'radiogroup');
      assert.deepEqual(buttons.map(el=>[attr(el,'role'),attr(el,state),attr(el,other),attr(el,'tabindex')]),[[role,'true',undefined,'0'],[role,'false',undefined,'-1']]);
      assert.deepEqual(buttons.map(el=>[attr(el,'id'),attr(el,'aria-controls')]),[['a','panel-a'],['b','panel-b']]);
    });
    assert.equal(data.errors.length,6);for(const error of data.errors)assert.match(error,/Unsupported SegmentedControl (role|mode):/);
    results.push({major,react:data.react,types:'PASS',ssrConfigurations:data.rows.length,invalidInputsRejected:data.errors.length});
  }
  mkdirSync('test-results/segmented-alias',{recursive:true});
  const sha=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
  writeFileSync('test-results/segmented-alias/types-ssr.json',JSON.stringify({status:'PASS',sourceSha256:sha(source),declarationSha256:sha(declaration),testSha256:sha('_audit/ci/test-segmented-alias-contract.mjs'),results,npm:{version:npmVersion.trim(),cli:npmCli,node:process.version},scope:'Real React18/19 SSR plus strict supported/invalid alias types. No release notice clock or publication acceptance.'},null,2)+'\n');
  console.log('PASS React18/19 alias/default/explicit mode SSR, native parent/child/state/ID associations, six invalid inputs each, strict valid/invalid types');
} finally {rmSync(temp,{recursive:true,force:true})}
