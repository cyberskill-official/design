/** Raw kit URLs must mount, resolve their actual assets and support native interaction. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium,firefox,webkit} from 'playwright';
const root=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const external=process.argv.find(x=>x.startsWith('--url='))?.slice(6);
const output=process.argv.find(x=>x.startsWith('--output='))?.slice(9);
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jsx':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
let server,browser;const rows=[];
try{
 if(!external){
  server=createServer(async(req,res)=>{
   try{
    const url=new URL(req.url,'http://localhost');
    const prefix=url.pathname.startsWith('/nested/design/')?'/nested/design':'';
    let path=decodeURIComponent(url.pathname.slice(prefix.length));
    const literal=path.startsWith('/literal/');if(literal)path=path.slice(8);
    if(!literal && /\/ui_kits\/[^/]+\/index\.html$/.test(path)){
     res.writeHead(301,{Location:prefix+path.slice(0,-11)+url.search});res.end();return;
    }
    if(/\/ui_kits\/[^/]+(?:\/index)?\/?$/.test(path))path=path.replace(/(?:\/index)?\/?$/,'/index.html');
    const file=resolve(root,'.'+path);assert(file.startsWith(root+sep));assert((await stat(file)).isFile());
    let bytes=await readFile(file);
    // Literal mounts preserve the extra prefix on all resources.
    res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(bytes);
   }catch{res.writeHead(404);res.end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
 }
 const origin=external||`http://127.0.0.1:${server.address().port}`;
 browser=await ({chromium,firefox,webkit}[browserName]).launch();
 // The standard-server invocation checks actual redirects. The fixture also
 // exercises nested mounts and literal index.html URLs without a redirect.
 const mounts=external?['']:['','/nested/design','/literal','/nested/design/literal'];
 for(const mount of mounts)for(const kit of ['status-hub','website','deck'])for(const suffix of ['/index.html','/index','','/','/index.html?preview=1']){
  const context=await browser.newContext({viewport:{width:rows.length%2?320:390,height:800}});
  const page=await context.newPage(),errors=[],responses=new Map(),speculativeFailures=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{responses.set(r.url(),r.status());if(r.status()>=400)speculativeFailures.push({url:r.url(),status:r.status()});});
  await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(origin).origin?route.continue():route.abort());
  const url=origin.replace(/\/$/,'')+mount+'/ui_kits/'+kit+suffix;
  assert.equal((await page.goto(url)).status(),200,url);
  const selector=kit==='status-hub'?'#root > .sh':kit==='website'?'#root > .site':'deck-stage > section[data-deck-active]';
  try{await page.locator(selector).first().waitFor({state:'visible'});}catch(error){throw new Error('Kit mount failed: '+url+' '+JSON.stringify({errors,speculativeFailures}),{cause:error});}
  await page.evaluate(async()=>{await document.fonts.ready;});
  const snapshot=await page.evaluate(kit=>({base:document.baseURI,styles:[...document.querySelectorAll('link[rel~=stylesheet]')].map(link=>({url:link.href,rules:[...link.sheet.cssRules].length})),umber:getComputedStyle(document.documentElement).getPropertyValue('--cs-color-brand-umber').trim(),scripts:[...document.querySelectorAll('script[src]')].map(x=>x.src),images:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src)}),kit);
  assert.equal(snapshot.umber.toLowerCase(),'#45210e',url);
  for(const sheet of snapshot.styles){assert(sheet.rules>0,JSON.stringify(sheet));assert.equal(responses.get(sheet.url),200,sheet.url);}
  for(const asset of snapshot.scripts)assert.equal(responses.get(asset),200,asset);
  if(kit==='status-hub'){
   await page.getByRole('button',{name:'Toggle language',exact:true}).click();assert.equal(await page.locator('.sh').getAttribute('lang'),'vi');
   await page.getByRole('button',{name:'Đổi giao diện',exact:true}).click();assert.equal(await page.locator('.sh').getAttribute('data-theme'),'dark');
   await page.locator('button.card').first().click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
  }else if(kit==='website'){
   await page.getByRole('button',{name:'Toggle theme',exact:true}).click();assert.equal(await page.locator('.site').getAttribute('data-theme'),'dark');
   const language=page.locator('.hdr-side .mini').first(),before=await language.innerText();await language.click();assert.notEqual(await language.innerText(),before);
  }else{
   assert(await page.evaluate(()=>!!customElements.get('deck-stage')&&!!document.querySelector('deck-stage').shadowRoot));
   await page.locator('#langToggle').click();assert.equal(await page.locator('html').getAttribute('lang'),'vi');
   const before=await page.locator('section[data-deck-active]').getAttribute('data-label');await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('section[data-deck-active]').getAttribute('data-label'),before);
  }
  assert.deepEqual(errors,[],url);
  // Preload scanners may speculate using a URL before an inline base script
  // executes. Require success for every resolved document resource; retain
  // speculative failures separately rather than conflating them with missing UI.
  rows.push({kit,mount,suffix,url:page.url(),...snapshot,errors,speculativeFailures});await context.close();
 }
 if(output)await writeFile(output,JSON.stringify({browserName,cases:rows.length,scope:'Raw entrypoints, literal/clean URLs and nested mounts; resolved styles/scripts, brand token and native interactions. Preload speculation separately retained; no content/rights or full accessibility acceptance.',rows},null,2)+'\n');
 console.log(`PASS raw kit entrypoints (${browserName}): ${rows.length} mounted URL cases; resolved styles/scripts and native language/theme/dialog/deck interactions.`);
}finally{await browser?.close();if(server)await new Promise(r=>server.close(r));}
