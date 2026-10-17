#!/usr/bin/env node
// Bounded packed-consumer measurements, not product performance budgets.
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,cpSync,rmSync,statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve,extname,sep,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {buildSync,version as esbuildVersion} from 'esbuild';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const temp=mkdtempSync(join(tmpdir(),'cs-consumer-costs-'));
const browserConditions={viewport:{width:1280,height:800},colorScheme:'light',locale:'vi-VN',reducedMotion:'reduce'};
let server,browser;
try {
 execFileSync(process.execPath,['scripts/flatten-styles.mjs','--check'],{cwd:root,stdio:'pipe'});
 const [pack]=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--pack-destination',temp],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}));
 const pkg=join(temp,'node_modules/@cyberskill/design');mkdirSync(pkg,{recursive:true});
 execFileSync('tar',['-xzf',join(temp,pack.filename),'-C',pkg,'--strip-components=1']);
 for(const name of ['react','react-dom','scheduler'])cpSync(join(root,'node_modules',name),join(temp,'node_modules',name),{recursive:true});
 const app=`function App(){const [value,setValue]=React.useState('');return React.createElement('main',null,
 React.createElement('h1',null,'Hiện Thực Hoá Ý Chí'),React.createElement('p',null,'Turn Your Will Into Real · '+'Tiếng Việt'.normalize('NFD')),
 React.createElement('code',{style:{fontFamily:'var(--cs-font-family-mono)'}},'const message = "Xin chào";'),
 React.createElement('p',{style:{fontFamily:'var(--cs-font-family-display)'}},'Hiện Thực Hoá Ý Chí'),
 React.createElement(TextField,{label:'Tên',value,onChange:setValue}),React.createElement(Button,{onClick:()=>setValue('An')},'Điền mẫu'),React.createElement('output',null,value));}
 createRoot(document.getElementById('app')).render(React.createElement(App));`;
 writeFileSync(join(temp,'client.js'),`import React from 'react';import {createRoot} from 'react-dom/client';import {Button,TextField} from '@cyberskill/design';import '@cyberskill/design/styles.css';${app}`);
 const built=buildSync({absWorkingDir:temp,entryPoints:['client.js'],outdir:join(temp,'production'),bundle:true,format:'esm',platform:'browser',minify:true,metafile:true,define:{'process.env.NODE_ENV':'"production"'},loader:{'.woff2':'file','.woff':'file','.webp':'file','.png':'file','.svg':'file'}});
 const inputs=Object.keys(built.metafile.inputs);
 assert(!inputs.some(path=>resolve(temp,path).startsWith(root)),'Build must consume the extracted package');
 assert(!inputs.some(path=>/\.development\.js$|[\\/]babel[\\/]|_ds_bundle\.js/.test(path)),'Bundler production graph includes a development/compiler or legacy runtime');
 const shell=(css,body,script='')=>'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="'+css+'"></head><body style="font-family:var(--cs-font-family-ui)">'+body+script+'</body></html>';
 const staticBody='<main><h1>Hiện Thực Hoá Ý Chí</h1><p>Turn Your Will Into Real · '+ 'Tiếng Việt'.normalize('NFD')+'</p><code style="font-family:var(--cs-font-family-mono)">const message = "Xin chào";</code><p style="font-family:var(--cs-font-family-display)">Hiện Thực Hoá Ý Chí</p><label>Tên<input class="cs-input"></label><button class="cs-button">Điền mẫu</button></main>';
 const routes={
  'static-source':shell('/package/styles.css',staticBody),
  'static-flattened':shell('/package/dist/styles.min.css',staticBody),
  'legacy-browser':shell('/package/dist/styles.min.css','<div id="app"></div>','<script type="module">import {Button,TextField} from "/package/_esm/cs.mjs";const React=window.React;const createRoot=window.ReactDOM.createRoot;'+app+'</script>'),
  'bundler-react':shell('/production/client.css','<div id="app"></div>','<script type="module" src="/production/client.js"></script>'),
 };
 let requests=[];
 server=createServer((req,res)=>{
  try {
   const path=new URL(req.url,'http://localhost').pathname;
   let data,type;
   if(routes[path.slice(1)]){data=Buffer.from(routes[path.slice(1)]);type='text/html';}
   else {
    const base=path.startsWith('/package/')?pkg:path.startsWith('/production/')?join(temp,'production'):null;
    assert(base,'Unexpected request '+path);
    const file=resolve(base,decodeURIComponent(path.replace(/^\/(package|production)\//,'')));
    assert(file.startsWith(base+sep)&&statSync(file).isFile(),'Invalid resource '+path);
    data=readFileSync(file);type=({'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff'})[extname(file)]||'application/octet-stream';
   }
   requests.push({path,type,bodyBytes:data.length,gzipBytes:gzipSync(data).length,sha256:sha(data)});
   res.setHeader('Content-Type',type);res.setHeader('Cache-Control','no-store');res.end(data);
  }catch(error){res.writeHead(404);res.end(String(error));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch();const results=[];
 for(const name of Object.keys(routes)){
  const context=await browser.newContext(browserConditions);const page=await context.newPage();const failures=[];
  page.on('pageerror',error=>failures.push(error.message));page.on('requestfailed',request=>failures.push(request.url()));page.on('response',response=>{if(response.status()>=400)failures.push(response.url()+' '+response.status());});
  await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  requests=[];await page.goto(origin+'/'+name,{waitUntil:'networkidle'});await page.getByRole('heading').waitFor();
  await page.evaluate(async()=>{document.body.getBoundingClientRect();await document.fonts.ready;});
  if(name==='legacy-browser'||name==='bundler-react'){await page.getByRole('button',{name:'Điền mẫu'}).click();await page.waitForFunction(()=>document.querySelector('output')?.textContent==='An');}
  assert.deepEqual(failures,[],name+' failed resources/runtime');
  assert(requests.some(r=>r.type==='font/woff2'),name+' must exercise shipped fonts');
  assert(!requests.some(r=>r.path.includes('/babel/')),name+' must not load a compiler');
  const byType={};for(const resource of requests){const group=byType[resource.type]??={requests:0,bodyBytes:0,gzipBytes:0};group.requests++;group.bodyBytes+=resource.bodyBytes;group.gzipBytes+=resource.gzipBytes;}
  results.push({path:name,requests:requests.length,bodyBytes:requests.reduce((n,r)=>n+r.bodyBytes,0),gzipBytes:requests.reduce((n,r)=>n+r.gzipBytes,0),byType:Object.fromEntries(Object.entries(byType).sort(([a],[b])=>a.localeCompare(b))),resources:[...requests].sort((a,b)=>a.path.localeCompare(b.path))});await context.close();
 }
 const report={schemaVersion:1,scope:'One cold Chromium reference screen per supported static source, flattened static, legacy browser and production esbuild React path; mixed EN/VI NFC/NFD and all three font roles. This is an isolated tarball fixture, not real-product adoption or a performance budget.',
 measurement:'Actual HTTP response bodies served uncompressed on loopback with cache disabled. gzipBytes is an offline gzip estimate per body, not measured transfer or recommended compression for WOFF2. Excludes headers, protocol overhead, timing, CPU, memory, repeated visits and unvisited interaction states.',
 source:{version:pack.version,packageSha256:sha(readFileSync(join(temp,pack.filename))),lockSha256:sha(readFileSync(join(root,'package-lock.json'))),measurementScriptSha256:sha(readFileSync(fileURLToPath(import.meta.url)))},
 browserConditions,
 tools:{platform:process.platform,architecture:process.arch,node:process.version,esbuild:esbuildVersion,chromium:browser.version(),react:JSON.parse(readFileSync(join(temp,'node_modules/react/package.json'))).version},
 productionOutputs:Object.entries(built.metafile.outputs).map(([path,data])=>({path:relative(join(temp,'production'),resolve(temp,path)),bytes:data.bytes})),results};
 console.log(JSON.stringify(results.map(({path,requests,bodyBytes,gzipBytes,byType})=>({path,requests,bodyBytes,gzipBytes,byType})),null,2));
}finally{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));rmSync(temp,{recursive:true,force:true});}
