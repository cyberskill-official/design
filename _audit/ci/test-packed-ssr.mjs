import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,cpSync,rmSync,statSync} from 'node:fs';
import {execFileSync,spawnSync,spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {gzipSync} from 'node:zlib';
import {randomBytes} from 'node:crypto';
import {buildSync} from 'esbuild';
import {chromium,firefox,webkit} from 'playwright';
const root=fileURLToPath(new URL('../../',import.meta.url));
const temp=mkdtempSync(join(tmpdir(),'cs-packed-ssr-'));let server,browser;
const liveChildren=new Set();let releaseLive;const liveDiagnostics=[];let expectedAborts=0;
try {
 const react18=process.argv.includes('--react18');
 const streaming=process.argv.includes('--streaming');
 const nonce=randomBytes(18).toString('base64');
 if(react18) {
   for(const name of ['package.json','package-lock.json'])cpSync(join(root,'_audit/ci/fixtures/react18-consumer',name),join(temp,name));
   execFileSync('npm',['ci','--ignore-scripts','--no-audit','--no-fund'],{cwd:temp,encoding:'utf8',timeout:120000});
 }
 const [pack]=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--pack-destination',temp],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}));
 const peer=JSON.parse(readFileSync(join(react18?temp:root,'node_modules/react/package.json')));
 assert.equal(peer.version.split('.')[0],react18?'18':'19','Unexpected React runtime major');
 const pkg=join(temp,'node_modules/@cyberskill/design');mkdirSync(pkg,{recursive:true});
 execFileSync('tar',['-xzf',join(temp,pack.filename),'-C',pkg,'--strip-components=1']);
 if(!react18)for(const name of ['react','react-dom','scheduler'])cpSync(join(root,'node_modules',name),join(temp,'node_modules',name),{recursive:true});
 writeFileSync(join(temp,'App.jsx'),`import React from 'react'; import {Button,TextField,Combobox,Dialog,Mentions,Editor,Watermark,Chart} from '@cyberskill/design';
 export function App(){const [value,setValue]=React.useState('');const [open,setOpen]=React.useState(false);return <main><Chart lang="en" data={value==='a'?[{label:'Selected',value:1.5}]:[]}/><Chart lang="vi" type="pie" data={[]}/><Watermark text="Internal"><p>Preview</p></Watermark><Editor lang="en" defaultValue="<p>SSR note</p>"/><TextField label="Name" description="Enter a name" defaultValue="An"/><Combobox label="Project" lang="en" value={value} onChange={setValue} options={[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}]}/><label>Mention<Mentions lang="en" users={["anna","ben"]}/></label><output>{value}</output><Button onClick={()=>setOpen(true)}>Review</Button><Dialog open={open} title="Review project" lang="en" onClose={()=>setOpen(false)}>Details</Dialog></main>;}
 const DeferredApp=React.lazy(()=>globalThis.__ssrWait?globalThis.__ssrWait.then(()=>({default:App})):new Promise(resolve=>setTimeout(()=>resolve({default:App}),80)));
 export function StreamingApp(){return <section><h1>Stream preview</h1><React.Suspense fallback={<p data-ssr-fallback="true">Loading preview</p>}><DeferredApp/></React.Suspense></section>;}`);
 writeFileSync(join(temp,'server.jsx'),streaming?`import React from 'react';import {renderToString,renderToPipeableStream} from 'react-dom/server';import {Writable} from 'node:stream';import {App,StreamingApp} from './App.jsx';
 renderToString(<App/>);
 Promise.all(['app','app-b'].map(id=>new Promise((resolve,reject)=>{
   const chunks=[];const sink=new Writable({write(chunk,encoding,done){chunks.push(chunk.toString());done()}});
   sink.on('finish',()=>resolve(chunks));sink.on('error',reject);
   const stream=renderToPipeableStream(<StreamingApp/>,{identifierPrefix:id+'-',nonce:${JSON.stringify(nonce)},onShellReady(){stream.pipe(sink)},onShellError:reject,onError:reject});
 }))).then(chunks=>process.stdout.write(JSON.stringify(chunks))).catch(error=>{console.error(error);process.exitCode=1});`
 :`import React from 'react';import {renderToString} from 'react-dom/server';import {App} from './App.jsx'; renderToString(<App/>); process.stdout.write(JSON.stringify(["app","app-b"].map(id=>renderToString(<App/>,{identifierPrefix:id+"-"}))));`);
 writeFileSync(join(temp,'client.jsx'),`import React from 'react';import {hydrateRoot} from 'react-dom/client';import {App,StreamingApp} from './App.jsx';import '@cyberskill/design/styles.css';window.recoveries=[];for(const id of ['app','app-b'])hydrateRoot(document.getElementById(id),<${streaming?'StreamingApp':'App'}/>,{identifierPrefix:id+'-',onRecoverableError:e=>window.recoveries.push(String(e))});`);
 const shared={absWorkingDir:temp,bundle:true,logLevel:'silent',define:{'process.env.NODE_ENV':'"development"'}};
 buildSync({...shared,entryPoints:['server.jsx'],outfile:join(temp,'server.cjs'),platform:'node',external:['react','react-dom/server']});
 if(streaming){
   writeFileSync(join(temp,'live.jsx'),`import React from 'react';import {renderToPipeableStream} from 'react-dom/server';import {StreamingApp} from './App.jsx';
     let requestedAbort=false;
     globalThis.__ssrWait=new Promise(resolve=>process.stdin.once('data',command=>{
       if(command.toString()==='abort'){requestedAbort=true;stream.abort(new Error('fixture-requested-abort'));}else resolve();
     }));
     const stream=renderToPipeableStream(<StreamingApp/>,{identifierPrefix:'app-',nonce:process.argv[2],onShellReady(){stream.pipe(process.stdout)},onError(error){
       if(requestedAbort&&error.message==='fixture-requested-abort')console.error('EXPECTED_ABORT:fixture-requested-abort');
       else{console.error(error);process.exitCode=1;}
     }});`);
   buildSync({...shared,entryPoints:['live.jsx'],outfile:join(temp,'live.cjs'),platform:'node',external:['react','react-dom/server']});
 }
 const rendered=spawnSync(process.execPath,[join(temp,'server.cjs')],{cwd:temp,encoding:'utf8',timeout:30000});
 assert.equal(rendered.status,0,rendered.stderr);assert.equal(rendered.stderr,'','Server render emitted diagnostics');
 const output=JSON.parse(rendered.stdout);
 if(streaming)for(const chunks of output){
   assert(chunks.length>1,'Suspense stream must emit separate shell and completion chunks');
   assert.match(chunks[0],/data-ssr-fallback/,'First chunk must contain pending fallback');
   assert(!chunks[0].includes('Enter a name'),'Deferred app must not appear in shell');
 }
 const html=streaming?output.map(chunks=>chunks.join('')):output;
 if(streaming)assert(html.every(text=>text.includes('nonce="'+nonce+'"')),'Stream instructions must carry nonce');
 assert.match(html.join(''),/Alpha|Project/);assert.match(html.join(''),/Enter a name/);
 assert.match(html.join(''),/aria-label="Chart with no data"/);assert.match(html.join(''),/aria-label="Biểu đồ chưa có dữ liệu"/);
 const built=buildSync({...shared,entryPoints:['client.jsx'],outdir:join(temp,'public'),platform:'browser',format:'esm',loader:{'.woff2':'file','.webp':'file','.woff':'file','.svg':'file','.png':'file'},metafile:true});
 assert(!Object.keys(built.metafile.inputs).some(p=>p.includes(root)), 'Consumer build leaked checkout sources');
 writeFileSync(join(temp,'public/index.html'),'<!doctype html><html lang="vi"><head><meta charset="utf-8"><link rel="stylesheet" href="/client.css"></head><body><div id="app">'+html[0]+'</div><div id="app-b">'+html[1]+'</div><script type="module" src="/client.js"></script></body></html>');
 const production=buildSync({...shared,entryPoints:['client.jsx'],outdir:join(temp,'production'),platform:'browser',format:'esm',loader:{'.woff2':'file','.webp':'file','.woff':'file','.svg':'file','.png':'file'},define:{'process.env.NODE_ENV':'"production"'},minify:true,write:false});
 const sizes=Object.fromEntries(production.outputFiles.filter(f=>/client\.(js|css)$/.test(f.path)).map(f=>[f.path.split('/').pop(),{bytes:f.contents.length,gzipBytes:gzipSync(f.contents).length}]));
 console.log('Measured production consumer assets (not a budget or network trace): '+JSON.stringify(sizes));
 const publicRoot=join(temp,'public');
 server=createServer((req,res)=>{try {
   const url=new URL(req.url,'http://localhost'),name=url.pathname;
   if(name==='/release-live'||name==='/abort-live'){assert(releaseLive,'No suspended live request');releaseLive(name==='/abort-live'?'abort':'release');releaseLive=null;res.end('released');return;}
   const path=resolve(publicRoot,'.'+(name==='/'||name==='/live'?'/index.html':name));
   assert(path.startsWith(publicRoot+sep)&&statSync(path).isFile());
   res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'})[extname(path)]||'application/octet-stream');
   const responseNonce=randomBytes(18).toString('base64');
   res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'nonce-"+responseNonce+"'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'none'");
   if(streaming&&name==='/live'){
     res.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><link rel="stylesheet" href="/client.css"></head><body><div id="app">');
     const child=spawn(process.execPath,[join(temp,'live.cjs'),responseNonce],{cwd:temp,stdio:['pipe','pipe','pipe']});
     let aborted=false,stderr='';
     liveChildren.add(child);releaseLive=command=>{aborted=command==='abort';child.stdin.end(command)};
     child.stderr.on('data',chunk=>{stderr+=chunk.toString()});
     child.on('error',error=>{liveDiagnostics.push(String(error));res.destroy(error)});
     child.stdout.pipe(res,{end:false});
     child.on('close',code=>{
       liveChildren.delete(child);
       if(aborted&&stderr.trim()==='EXPECTED_ABORT:fixture-requested-abort')expectedAborts++;
       else if(stderr)liveDiagnostics.push(stderr);
       if(code!==0&&!res.destroyed)liveDiagnostics.push('Live renderer exited '+code);
       if(!res.destroyed)res.end('</div><div id="app-b">'+html[1].replaceAll('nonce="'+nonce+'"','nonce="'+responseNonce+'"')+'</div><script type="module" src="/client.js"></script></body></html>');
     });
     res.on('close',()=>{if(liveChildren.has(child)){releaseLive=null;child.kill();}});
     return;
   }
   let body=readFileSync(path);
   if(extname(path)==='.html')body=Buffer.from(body.toString().replaceAll('nonce="'+nonce+'"','nonce="'+responseNonce+'"'));
   if(streaming&&name==='/'&&url.searchParams.has('omitStreamNonce'))body=Buffer.from(body.toString().replaceAll(' nonce="'+responseNonce+'"',''));
   res.end(body);
 }catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const engine=process.env.CS_TEST_BROWSER||'chromium';browser=await({chromium,firefox,webkit}[engine]).launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{window.cspViolations=[];document.addEventListener('securitypolicyviolation',event=>cspViolations.push({directive:event.effectiveDirective,blocked:event.blockedURI}));});
 const app=page.locator('#app'),second=page.locator('#app-b');
 const response=await page.goto('http://127.0.0.1:'+server.address().port);await app.getByRole('combobox',{name:'Project'}).click();await app.getByRole('option',{name:'Alpha'}).waitFor();
 assert.deepEqual(await page.evaluate(()=>window.recoveries),[],'Hydration recovered from mismatched server output');
 for(const instance of [app,second]){assert.equal(await instance.getByRole('img',{name:'Chart with no data',exact:true}).count(),1);assert.equal(await instance.getByRole('img',{name:'Biểu đồ chưa có dữ liệu',exact:true}).count(),1);}
 assert.deepEqual(errors,[],'Hydration/browser errors');
 assert.equal(await app.getByRole('combobox',{name:'Project'}).evaluate(el=>document.getElementById(el.getAttribute('aria-controls'))?.getAttribute('role')),'listbox');
 await app.getByRole('combobox',{name:'Project'}).press('Enter');assert.equal(await app.locator('output').textContent(),'a');
 assert.equal(await app.getByRole('img',{name:'Selected: 1.5',exact:true}).count(),1);assert.equal(await second.getByRole('img',{name:'Chart with no data',exact:true}).count(),1);
 await app.getByRole('combobox',{name:'Mention'}).fill('@an');assert.equal(await app.getByRole('combobox',{name:'Mention'}).evaluate(el=>document.getElementById(el.getAttribute('aria-controls'))?.getAttribute('role')),'listbox');await app.getByRole('combobox',{name:'Mention'}).press('Enter');assert.equal(await app.getByRole('combobox',{name:'Mention'}).inputValue(),'@anna ');
 await app.getByRole('button',{name:'Review',exact:true}).click();await app.getByRole('dialog',{name:'Review project'}).waitFor();assert.equal(await second.evaluate(el=>!!el.closest('[inert]')),true,'Other root must be inert while modal is open');await page.keyboard.press('Escape');await app.getByRole('dialog').waitFor({state:'hidden'});
 await app.getByRole('textbox',{name:'Name'}).fill('Bình');assert.equal(await app.getByRole('textbox',{name:'Name'}).inputValue(),'Bình');
 assert.equal(await second.getByRole('textbox',{name:'Name'}).inputValue(),'An','Independent root state leaked');
 assert.equal(await second.locator('output').textContent(),'');
 await second.getByRole('combobox',{name:'Project'}).click();await second.getByRole('combobox',{name:'Project'}).press('ArrowDown');await second.getByRole('combobox',{name:'Project'}).press('Enter');
 assert.equal(await second.locator('output').textContent(),'b');assert.equal(await app.locator('output').textContent(),'a');
 await second.getByRole('button',{name:'Review',exact:true}).click();await second.getByRole('dialog').waitFor();assert.equal(await app.evaluate(el=>!!el.closest('[inert]')),true);await page.keyboard.press('Escape');await second.getByRole('dialog').waitFor({state:'hidden'});
 const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,'Duplicate IDs across independent roots');
 assert.equal(await page.locator('[inert]').count(),0,'Inert state leaked after modal dismissal');
 assert.equal(await page.locator('[data-ssr-fallback]').count(),0,'Suspense fallback remained after hydration');
 await page.evaluate(()=>document.fonts.ready);assert.deepEqual(errors,[],'Late browser errors');assert.deepEqual(await page.evaluate(()=>window.recoveries),[]);
 assert.deepEqual(await page.evaluate(()=>window.cspViolations),[],'Positive consumer violates CSP');
 if(streaming){
   const blocked=await browser.newPage();
   await blocked.addInitScript(()=>{window.cspViolations=[];document.addEventListener('securitypolicyviolation',event=>cspViolations.push({directive:event.effectiveDirective,blocked:event.blockedURI}));});
   const blockedResponse=await blocked.goto('http://127.0.0.1:'+server.address().port+'/?omitStreamNonce=1');
   assert.notEqual(response.headers()['content-security-policy'],blockedResponse.headers()['content-security-policy'],'HTML responses must use distinct nonces');
   await blocked.waitForFunction(()=>cspViolations.some(v=>v.directive.startsWith('script-src')&&v.blocked==='inline'));
   assert(await blocked.locator('[data-ssr-fallback]').count()>0,'Missing stream nonce must leave unresolved fallback');
   await blocked.close();
   console.log('PASS streamed CSP: nonce permits instructions; missing nonce blocks inline completion');
   const live=await browser.newPage(),liveErrors=[];
   live.on('pageerror',error=>liveErrors.push(String(error)));
   live.on('console',message=>{if(message.type()==='error')liveErrors.push(message.text())});
   await live.goto('http://127.0.0.1:'+server.address().port+'/live',{waitUntil:'commit'});
   await live.locator('[data-ssr-fallback]').waitFor({state:'visible'});
   assert.equal(await live.locator('#app main').count(),0,'Deferred content arrived before release');
   assert.equal(await live.evaluate(()=>document.readyState),'loading','Response must remain open during fallback');
   const released=await live.request.get('http://127.0.0.1:'+server.address().port+'/release-live');assert.equal(released.status(),200);
   await live.waitForLoadState('load');
   const liveApp=live.locator('#app');
   await liveApp.getByRole('combobox',{name:'Project'}).click();
   await liveApp.getByRole('option',{name:'Alpha'}).waitFor();
   await liveApp.getByRole('combobox',{name:'Project'}).press('Enter');
   assert.equal(await liveApp.locator('output').textContent(),'a');
   assert.equal(await live.locator('[data-ssr-fallback]').count(),0);
   assert.deepEqual(await live.evaluate(()=>window.recoveries),[]);
   assert.deepEqual(liveErrors,[]);assert.deepEqual(liveDiagnostics,[]);
   assert.equal(liveChildren.size,0,'Live renderer must finish after release');
   await live.close();
   const disconnected=await browser.newPage();
   await disconnected.goto('http://127.0.0.1:'+server.address().port+'/live',{waitUntil:'commit'});
   await disconnected.locator('[data-ssr-fallback]').waitFor({state:'visible'});
   const pendingChild=[...liveChildren][0];assert(pendingChild,'Suspended renderer absent');
   let cleanupTimer;
   const exited=new Promise((resolve,reject)=>{cleanupTimer=setTimeout(()=>reject(new Error('Disconnected renderer did not exit')),10000);pendingChild.once('close',resolve)});
   try{await disconnected.close();await exited;}finally{clearTimeout(cleanupTimer);}
   assert.equal(liveChildren.size,0,'Disconnected renderer leaked');assert.deepEqual(liveDiagnostics,[]);
   const aborted=await browser.newPage(),abortErrors=[];
   aborted.on('pageerror',error=>abortErrors.push(String(error)));
   aborted.on('console',message=>{if(message.type()==='error')abortErrors.push(message.text())});
   await aborted.goto('http://127.0.0.1:'+server.address().port+'/live',{waitUntil:'commit'});
   await aborted.locator('[data-ssr-fallback]').waitFor({state:'visible'});
   const abortResponse=await aborted.request.get('http://127.0.0.1:'+server.address().port+'/abort-live');assert.equal(abortResponse.status(),200);
   await aborted.waitForLoadState('load');
   const recovered=aborted.locator('#app');
   await recovered.getByRole('combobox',{name:'Project'}).click();
   await recovered.getByRole('option',{name:'Alpha'}).waitFor();
   await recovered.getByRole('combobox',{name:'Project'}).press('Enter');
   assert.equal(await recovered.locator('output').textContent(),'a');
   // Abort recovery commits asynchronously; interaction readiness is not fallback teardown.
   await aborted.locator('[data-ssr-fallback]').waitFor({state:'detached'});
   assert.equal(await aborted.locator('[data-ssr-fallback]').count(),0);
   const recoveries=await aborted.evaluate(()=>window.recoveries);
   assert.equal(recoveries.length,1,'Abort must report exactly its expected client-render recovery');
   assert.match(recoveries[0],/fixture-requested-abort/);
   const recoveredIds=await aborted.locator('[id]').evaluateAll(nodes=>nodes.map(node=>node.id));
   assert.equal(new Set(recoveredIds).size,recoveredIds.length,'Recovered root IDs collide');
   assert.equal(expectedAborts,1);assert.deepEqual(liveDiagnostics,[]);assert.deepEqual(abortErrors,[]);
   assert.equal(liveChildren.size,0);await aborted.close();
   console.log('PASS live HTTP SSR: pending shell, release, disconnect cleanup and graceful abort client recovery');
 }
 console.log(`PASS packed ${streaming?'streamed Suspense':'synchronous'} SSR/hydration (${engine}): repeated server requests, two prefixed hydration roots, unique IDs, isolated state and modal ownership; React ${JSON.parse(readFileSync(join(temp,'node_modules/react/package.json'))).version}`);
} finally {for(const child of liveChildren)child.kill();await browser?.close();if(server)await new Promise(r=>server.close(r));rmSync(temp,{recursive:true,force:true});}
