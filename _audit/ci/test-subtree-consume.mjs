/** Declared local-runtime copy and actual EN/VI classic-script recipes.
 * Fresh Chromium/Firefox/WebKit pages reject external requests. These are local
 * browser consumers, not proof of loading in Stitch/Claude or runtime rights.
 */
import assert from 'node:assert/strict';
import {cpSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {join,dirname,resolve,extname,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {chromium,firefox,webkit} from 'playwright';

const root=fileURLToPath(new URL('../../',import.meta.url));
const PORTABLE=['styles.css','base','tokens','fonts','_esm','_ds_bundle.js','dist/styles.min.css','_vendor/react','_vendor/NOTICE.md','THIRD-PARTY-NOTICES.md'];
const read=path=>readFileSync(join(root,path),'utf8');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const recipes=Object.fromEntries(['en','vi'].map(lang=>{
 const path=lang==='en'?'docs/consuming.md':'docs/vi/consuming.md';
 const blocks=[...read(path).matchAll(/```html\n([\s\S]*?)\n```/g)];
 assert.equal(blocks.length,1,'Review changed consumer HTML recipes: '+path);
 return[lang,blocks[0][1].replaceAll('<path>/','./')];
}));
const smoke=`<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./styles.css"></head><body><div id="root"></div><script type="module">
try{
 const {Button,default:CS}=await import('./_esm/cs.mjs');
 if(!CS||!Button||CS.__errors.length)throw Error('Component bundle failed');
 function Example(){const[count,setCount]=React.useState(0);return React.createElement(Button,{variant:'primary',onClick:()=>setCount(n=>n+1)},'Subtree: '+count)}
 ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Example));
 window.__subtree={pass:true};
}catch(error){window.__subtree={pass:false,error:String(error)}}
</script></body></html>`;
const scratch=mkdtempSync(join(tmpdir(),'cs-subtree-'));
let server;
try{
 for(const path of PORTABLE){mkdirSync(dirname(join(scratch,path)),{recursive:true});cpSync(join(root,path),join(scratch,path),{recursive:true})}
 const fonts=readdirSync(join(scratch,'fonts'));
 for(const family of ['bevietnampro','jetbrainsmono','spacegrotesk'])assert(fonts.some(file=>file.toLowerCase().includes(family)&&file.endsWith('.woff2')),'Missing copied font family: '+family);
 for(const path of ['_vendor/react/LICENSE','_vendor/react/react-LICENSE','_vendor/react/react-dom-LICENSE','_vendor/NOTICE.md','THIRD-PARTY-NOTICES.md'])assert.equal(sha(readFileSync(join(scratch,path))),sha(readFileSync(join(root,path))),path);
 server=createServer(async(req,res)=>{
  try{
   const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const match=path.match(/^\/(legacy|missing|en|vi)\/(.*)$/);assert(match);
   const[,mode,relative]=match;
   if(relative==='index.html'){
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(mode==='legacy'||mode==='missing'?smoke:`<!doctype html><html lang="${mode}"><head><meta charset="utf-8"></head><body>${recipes[mode]}</body></html>`);return;
   }
   if(mode==='missing'&&relative.startsWith('_vendor/react/')){res.writeHead(404);res.end();return}
   const file=resolve(scratch,relative);assert(file.startsWith(scratch+sep));
   res.setHeader('Content-Type',({'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.woff2':'font/woff2'}[extname(file)]||'application/octet-stream'));
   res.end(await readFile(file));
  }catch{res.writeHead(404);res.end()}
 });
 await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r)});
 const base=`http://127.0.0.1:${server.address().port}`;
 for(const[name,engine]of Object.entries({chromium,firefox,webkit})){
  const browser=await engine.launch();
  try{
   for(const mode of ['legacy','en','vi','missing']){
    const page=await browser.newPage(),errors=[],external=[],badLocal=[],requests=[];
    page.on('pageerror',error=>errors.push(String(error)));
    page.on('request',request=>requests.push(new URL(request.url()).pathname));
    page.on('response',response=>{if(new URL(response.url()).origin===base&&response.status()>=400)badLocal.push({path:new URL(response.url()).pathname,status:response.status()})});
    await page.route('**/*',async route=>{
     if(new URL(route.request().url()).origin!==base){external.push(route.request().url());await route.abort()}else await route.continue();
    });
    await page.goto(`${base}/${mode}/index.html`);
    if(mode==='missing'){
     await page.waitForFunction(()=>window.__subtree);
     const result=await page.evaluate(()=>window.__subtree);
     assert.equal(result.pass,false,'The old copy cannot pass with external access blocked');
     assert(result.error.includes('failed to load'));
     assert(badLocal.some(row=>row.path.endsWith('/_vendor/react/react.production.min.js')&&row.status===404));
     assert(external.some(url=>url.includes('unpkg.com/umd-react@19.2.8/')));
    }else{
     const button=page.locator('button');await button.waitFor();
     const label={legacy:'Subtree: ',en:'Wishes: ',vi:'Điều ước: '}[mode];
     assert.equal(await button.innerText(),label+'0');await button.click();
     await page.waitForFunction(label=>document.querySelector('button')?.textContent===label+'1',label);
     await button.press('Enter');await page.waitForFunction(label=>document.querySelector('button')?.textContent===label+'2',label);
     const state=await page.evaluate(async()=>{
      await document.fonts.ready;
      const CS=window[Object.keys(window).find(key=>/^CyberSkillDesignSystem_/.test(key))],style=getComputedStyle(document.documentElement);
      return{bundleErrors:CS.__errors,umber:style.getPropertyValue('--cs-color-brand-umber').trim(),font:style.getPropertyValue('--cs-font-family-ui').trim(),buttonBackground:getComputedStyle(document.querySelector('button')).backgroundColor};
     });
     assert.deepEqual(state.bundleErrors,[]);assert.equal(state.umber.toLowerCase(),'#45210e');assert(state.font.includes('Be Vietnam Pro'));assert(/69, ?33, ?14/.test(state.buttonBackground),'Rendered Button brand background: '+state.buttonBackground);
     for(const file of ['react.production.min.js','react-dom.production.min.js'])assert(requests.some(path=>path.endsWith('/_vendor/react/'+file)),file);
     assert.deepEqual(external,[],'No external request may make this consumer pass');assert.deepEqual(badLocal,[],'All requested local resources must exist');
    }
    assert.deepEqual(errors,[]);await page.close();
   }
  }finally{await browser.close()}
  console.log(`PASS subtree consumer ${name}: isolated local-runtime ESM copy, actual EN/VI classic-script recipes, native pointer/Enter callbacks and tokens; missing runtime fails with CDN blocked. Not agent-host, full resource/notice closure, all font rendering or rights acceptance.`);
 }
}finally{
 if(server?.listening)await new Promise(r=>server.close(r));
 rmSync(scratch,{recursive:true,force:true});
}
