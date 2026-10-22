import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {readFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {join,resolve,extname,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {chromium,firefox,webkit} from 'playwright';
import {waitForNativeTemplate} from './lib/native-template-ready.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const temp=mkdtempSync(join(tmpdir(),'cs-packed-templates-'));
let server;
try {
 const pack=JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',temp],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}));
 const installed=join(temp,'node_modules/@cyberskill/design');mkdirSync(installed,{recursive:true});
 execFileSync('tar',['-xzf',join(temp,pack[0].filename),'--strip-components=1','-C',installed]);
 const manifest=JSON.parse(readFileSync(join(installed,'_ds_manifest.json'),'utf8'));
 const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
 server=createServer(async(request,response)=>{
  try {const path=decodeURIComponent(new URL(request.url,'http://local').pathname);const file=resolve(temp,'.'+path);assert(file.startsWith(temp+sep));response.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');response.end(await readFile(file));}
  catch {response.writeHead(404).end();}
 });
 await new Promise((done,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',done)});
 const origin=`http://127.0.0.1:${server.address().port}`, results=[];
 for(const [name,engine] of Object.entries({chromium,firefox,webkit})) {
  const browser=await engine.launch();
  try {
   const page=await browser.newPage();const external=[];
   await page.route('**/*',route=>{if(new URL(route.request().url()).origin===origin)return route.continue();external.push(route.request().url());return route.abort();});
   for(const template of manifest.templates){
    const response=await page.goto(origin+'/node_modules/@cyberskill/design/'+template.entryPath);
    assert.equal(response.status(),200,template.entryPath);
    await page.waitForFunction(() => window.__dcRootName?.() &&
      document.querySelector('[data-sc-name]') && !document.querySelector('.sc-placeholder'));
    const library = await page.evaluate(() => document.querySelector('meta[name="cs-template-library"]')?.content || null);
    if (library === 'static-logo') {
      await waitForNativeTemplate(page);
      assert.equal(await page.evaluate(() => window.CyberSkillDS), undefined,
        'Declared static artwork must not need the component bundle');
    } else {
      await page.waitForFunction(() => !!window.CyberSkillDS);
      assert.deepEqual(await page.evaluate(() => window.CyberSkillDS.__errors), [],
        `${name} ${template.entryPath}: component exports must load without errors`);
    }
    const state = await page.evaluate(() => ({
      renderError: document.querySelector('.sc-logic-error,.sc-placeholder-error')?.textContent || null,
      root: !!document.querySelector('[data-sc-name]'),
    }));
    assert.equal(state.renderError, null);
    assert(state.root, `${name} ${template.entryPath}: rendered root required`);
   }
   assert.deepEqual(external,[],'Installed templates must not depend on CDN requests');
   results.push({browser:name,templates:manifest.templates.length,externalRequests:external.length});
   console.log('PASS packed templates installed under node_modules:',JSON.stringify(results.at(-1)));
  }finally{await browser.close()}
 }
}finally{if(server)await new Promise(done=>server.close(done));rmSync(temp,{recursive:true,force:true})}
