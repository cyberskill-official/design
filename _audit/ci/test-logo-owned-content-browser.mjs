import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {assertNpmVersion} from '../../scripts/check-npm-version.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const root=resolve('.'),browserName=process.env.CS_TEST_BROWSER||'chromium',source=resolve('components/logo/Logo.jsx');
const scratch=mkdtempSync(join(tmpdir(),'cs-logo-owned-content-')),rows=[];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),inputs={};
async function compile({browser=false,old=false}={}){
  let applied=false;
  const result=await build({entryPoints:[source],bundle:true,write:false,metafile:true,platform:browser?'browser':'node',format:browser?'iife':'cjs',...(browser?{globalName:'LogoProof'}:{external:['react']}),plugins:[{name:'logo-peer-and-old-source-control',setup(builder){
    if(browser){builder.onResolve({filter:/^react$/},()=>({path:'react',namespace:'peer'}));builder.onLoad({filter:/.*/,namespace:'peer'},()=>({contents:'module.exports=window.React;',loader:'js'}));}
    if(old)builder.onLoad({filter:/components\/logo\/Logo\.jsx$/},args=>{const text=readFileSync(args.path,'utf8');assert(text.includes('className, children, ...props'));applied=true;return{contents:text.replace('className, children, ...props','className, ...props'),loader:'jsx'}});
  }}]});
  if(old)assert(applied);else for(const path of Object.keys(result.metafile.inputs))if(!path.startsWith('peer:'))inputs[path]=sha(readFileSync(path));
  return result.outputFiles[0].text;
}
try{
  const react18=join(scratch,'react18');mkdirSync(react18);
  for(const name of ['package.json','package-lock.json'])copyFileSync(resolve('_audit/ci/fixtures/react18-consumer',name),join(react18,name));
  const cli=resolve('_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js'),version=spawnSync(process.execPath,[cli,'--version'],{encoding:'utf8'});
  assert.equal(version.status,0);assertNpmVersion(JSON.parse(readFileSync('package.json','utf8')),version.stdout);
  const installed=spawnSync(process.execPath,[cli,'ci','--ignore-scripts'],{cwd:react18,encoding:'utf8',timeout:120000});assert.equal(installed.status,0,installed.stdout+installed.stderr);
  const [current,previous,client]=await Promise.all([compile(),compile({old:true}),compile({browser:true})]);
  for(const [major,runtimeRoot]of [[18,react18],[19,root]]){
    const require=createRequire(join(runtimeRoot,'package.json')),React=require('react'),server=require('react-dom/server');assert(React.version.startsWith(major+'.'));
    const load=code=>{const module={exports:{}};new Function('module','exports','require',code)(module,module.exports,require);return module.exports.Logo};
    const Logo=load(current),OldLogo=load(previous),h=React.createElement,props={title:'Official < & title',size:48,'data-native':'retained'};
    const children=[h('title',null,'Caller title'),h(React.Fragment,null,h('title',null,'Injected title'),h('path',{d:'M0 0L1 1'})),'Caller text',null];
    const baseline=server.renderToString(h(OldLogo,props));
    for(const child of children)assert.equal(server.renderToString(h(Logo,props,child)),baseline,'Children do not change official SVG/title/attributes');
    for(const child of children.slice(0,3))assert.throws(()=>server.renderToString(h(OldLogo,props,child)),/children.*dangerouslySetInnerHTML/,'Actual pre-fix source counter-control');
    await withBrowserFixture(async page=>{
      const errors=[];page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});await page.addScriptTag({content:client});
      await page.evaluate(()=>{const h=React.createElement;window.logoRefs=Array.from({length:4},()=>React.createRef());window.logoClicks=0;window.logoCallbackRef=null;const children=[h('title',null,'Caller title'),h(React.Fragment,null,h('title',null,'Injected title'),h('path',{d:'M0 0L1 1'})),'Caller text',null];renderFixture(h('div',null,...children.map((child,index)=>h(LogoProof.Logo,{key:index,id:'owned-logo-'+index,title:'Official < & title',size:48,'data-native':'retained',ref:logoRefs[index]},child)),h(LogoProof.Logo,{id:'callback-logo',title:'Callback logo',ref:node=>{window.logoCallbackRef=node},onClick:()=>logoClicks++},h('title',null,'Ignored')),h(LogoProof.Logo,{id:'decorative-logo',decorative:true},h('title',null,'Ignored decorative'))));});
      assert.equal(await page.getByRole('img',{name:'Official < & title',exact:true}).count(),4);
      const baselineInner=await page.locator('#owned-logo-3').innerHTML();
      for(let i=0;i<4;i++){
        const logo=page.locator('#owned-logo-'+i);assert.equal(await logo.innerHTML(),baselineInner);assert.equal(await logo.getAttribute('data-native'),'retained');assert.equal(await logo.getAttribute('width'),'48');
        assert.equal(await logo.locator('title').count(),1);assert.equal(await logo.locator('title').textContent(),'Official < & title');assert.equal(await logo.evaluate((el,index)=>el instanceof SVGSVGElement&&el===logoRefs[index].current,i),true);
      }
      assert.equal(await page.locator('#callback-logo').evaluate(el=>el===logoCallbackRef&&el instanceof SVGSVGElement),true);await page.locator('#callback-logo').click();assert.equal(await page.evaluate(()=>logoClicks),1);
      assert.equal(await page.locator('#decorative-logo').getAttribute('aria-hidden'),'true');assert.equal(await page.locator('#decorative-logo title').count(),0);
      assert.deepEqual(errors,[],'Owned children emit no React18/19 native SVG warnings');
      await page.evaluate(()=>renderFixture(null));assert.equal(await page.evaluate(()=>logoRefs.every(ref=>ref.current===null)&&logoCallbackRef===null),true);
    },{browserName,development:true,reactRuntimeRoot:runtimeRoot});
    rows.push({react:React.version,browserName,ssrBaselineSha256:sha(baseline),childCases:4,originalSourceFailures:3,status:'PASS'});
  }
  for(const[path,hash]of Object.entries(inputs))assert.equal(sha(readFileSync(path)),hash,'Logo source changed during proof');
  mkdirSync('test-results/semantic-completion',{recursive:true});writeFileSync('test-results/semantic-completion/logo-'+browserName+'.json',JSON.stringify({status:'PASS',browserName,inputs,sourceCompiledSha256:sha(client),rows,scope:'Official SVG/title output unchanged, inherited children safely ignored without type removal; React18/19 SSR + native attributes/names/decorative/ref/click/cleanup; actual pre-fix source counter-control.'},null,2)+'\n');
  console.log('PASS '+browserName+': React18/19 Logo child/title/fragment SSR, official artwork, native SVG attributes/name/ref/cleanup and pre-fix controls');
}finally{rmSync(scratch,{recursive:true,force:true});}
