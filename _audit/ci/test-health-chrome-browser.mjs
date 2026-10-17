/** Public diagnostic chrome; synthetic child verdicts isolate UI, never certify gates. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {inspectCoarseHitRegion} from './lib/coarse-hit-region.mjs';
const browserName=process.env.CS_BROWSER||'chromium';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const board=read('_audit/run.html');
const globals=[...new Set([...board.matchAll(/w\.(__(?:[A-Za-z0-9_]+))/g)].map(m=>m[1]))];
const report={browserName,sourceHashes:Object.fromEntries(['_audit/run.html','_audit/index.html','base/reset.css','tokens/colors.css','tokens/component-tokens.css','stories/lib/live-tokens.jsx','_audit/ci/lib/diagnostic-paint.mjs'].map(p=>[p,createHash('sha256').update(read(p)).digest('hex')])),contexts:[],scope:'macOS WebKit Option-Tab uses the platform all-control traversal; Chromium/Firefox use Tab. Two actual published diagnostic pages; coarse 320/390/1280 light/dark/system-light/system-dark plus 320x568 double computed font-size. Every enabled authored action: 44px box, clipping and guarded integer-coordinate ownership, native pointer activation, keyboard focus and named links; bounded solid-background leaf-text WCAG contrast and body text APCA at least75. Synthetic immediate child verdicts isolate board chrome; genuine gate correctness, arbitrary compositing, native touch targeting/device/AT and human acceptance are separate.'};
const luminance=rgb=>rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((a,c,i)=>a+c*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{a=luminance(a);b=luminance(b);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
const apcaSource=read('stories/lib/live-tokens.jsx');
const apca=Function(apcaSource.slice(apcaSource.indexOf('export function apcaLc'),apcaSource.indexOf('\nconst MONO')).replace('export ','')+';return apcaLc;')();
import {diagnosticPaint as paint}from'./lib/diagnostic-paint.mjs';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;let pass=true;
 await page.route('**/_audit/*.html*',route=>{
  const path=new URL(route.request().url()).pathname;
  if(path==='/_audit/run.html'||path==='/_audit/index.html')return route.continue();
  const body='<script>'+globals.map(name=>'window.'+name+'='+JSON.stringify({pass,elementFails:pass?0:1,coreMissing:pass?[]:['fixture'],anyThrew:!pass,currentFail:pass?0:1})+';').join('')+'</script>';
  return route.fulfill({contentType:'text/html',body});
 });
 for(const path of ['run','index']){
  await page.goto(origin+'/_audit/'+path+'.html');if(path==='run')await page.waitForFunction(()=>window.__run);
  const configs=[];for(const width of [320,390,1280])for(const theme of ['light','dark','system-light','system-dark'])configs.push({width,height:800,theme,textScale:1});configs.push({width:320,height:568,theme:'dark',textScale:2});
  for(const config of configs){
   await page.setViewportSize({width:config.width,height:config.height});await page.emulateMedia({colorScheme:config.theme.endsWith('dark')?'dark':'light'});
   await page.evaluate(theme=>document.documentElement.dataset.theme=theme.startsWith('system')?'system':theme,config.theme);
   await page.evaluate(scale=>{for(const el of document.querySelectorAll('[data-test-original-font]'))el.style.removeProperty('font-size');if(scale===2){const originals=[...document.querySelectorAll('body,body *:not(script):not(style):not(iframe)')].map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]);for(const[el,size]of originals){el.dataset.testOriginalFont='';el.style.fontSize=(size*scale)+'px'}}},config.textScale);
   await page.evaluate(()=>document.fonts.ready);
   if(path==='run'){const names=await page.locator('.g .open').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('aria-label')));assert.equal(new Set(names).size,43);assert(names.every(n=>n?.startsWith('Open ')));}
   assert(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches));
   assert(await page.evaluate(()=>Boolean(document.querySelector('meta[name=viewport]'))));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),JSON.stringify({path,config,reason:'overflow'}));
   const controls=page.locator('button:not(:disabled),a[href]'),count=await controls.count(),observations=[];
   for(let i=0;i<count;i++){
    const target=controls.nth(i);await target.scrollIntoViewIfNeeded();
    const region=await target.evaluate(inspectCoarseHitRegion);assert(region.pass,JSON.stringify({path,config,index:i,region}));
    observations.push({text:(await target.textContent()).trim(),href:await target.getAttribute('href'),width:region.targetBounds.width,height:region.targetBounds.height,samples:region.requiredSamples});
   }
   const bodyPaint=await page.locator('.sub,.sub *,.meta,.meta *,.progress,.g .n,.g .n *,.note,.note *,.legend p,.legend p *,.wholeset p,.wholeset p *,.d,.d *').evaluateAll(paint);
   for(const sample of bodyPaint)assert(apca(sample.fg,sample.bg)>=75,JSON.stringify({path,config,sample,apca:apca(sample.fg,sample.bg)}));
   const colors=await page.locator('body *:not(script):not(style):not(iframe):not(:disabled)').evaluateAll(paint);
   for(const sample of colors){const threshold=sample.size>=24||(sample.size>=18.66&&sample.weight>=700)?3:4.5;assert(ratio(sample.fg,sample.bg)>=threshold,JSON.stringify({path,config,sample,ratio:ratio(sample.fg,sample.bg),threshold}))}
   console.log('PASS layout',browserName,path,JSON.stringify(config));report.contexts.push({path,...config,controls:observations,minimumContrast:Math.min(...colors.map(c=>ratio(c.fg,c.bg))),textSamples:colors.length,bodyPaint,minimumBodyApca:Math.min(...bodyPaint.map(c=>apca(c.fg,c.bg)))});
  }
  // Native Tab walks the actual DOM order; all enabled actions must get a visible ring.
  await page.evaluate(()=>{document.documentElement.dataset.theme='light';for(const el of document.querySelectorAll('[data-test-original-font]'))el.style.removeProperty('font-size');document.activeElement.blur();window.scrollTo(0,0)});
  const expected=await page.locator('button:not(:disabled),a[href]').count();
  await page.locator('button:not(:disabled),a[href]').evaluateAll(nodes=>nodes.forEach((el,i)=>el.dataset.healthTestTab=String(i)));
  // macOS WebKit Option-Tab includes links/buttons under the default platform preference.
  const tabKey=browserName==='webkit'?'Alt+Tab':'Tab';
  for(let i=0;i<expected;i++){await page.keyboard.press(tabKey);const focused=await page.evaluate(()=>{const el=document.activeElement,s=getComputedStyle(el);return {index:el.dataset.healthTestTab,name:el.getAttribute('aria-label')||el.textContent.trim(),ring:s.outlineStyle!=='none'||s.boxShadow!=='none'}});assert.equal(focused.index,String(i),JSON.stringify({path,i,tabKey,focused}));assert(focused.name&&focused.ring,'visible named keyboard action '+i+' '+path)}
  // Pointer dispatch must land on the measured actions; prevent navigation in test only.
  await page.evaluate(()=>{window.__healthClicks=[];document.addEventListener('click',e=>{const target=e.target.closest('button,a[href]');if(target){e.preventDefault();e.stopImmediatePropagation();__healthClicks.push(target.textContent.trim())}},true)});
  const count=await page.locator('button:not(:disabled),a[href]').count();
  for(let i=0;i<count;i++){const el=page.locator('button:not(:disabled),a[href]').nth(i);await el.click();assert.equal(await page.evaluate(()=>__healthClicks.length),i+1)}
 }
 // Fresh page removes the dispatch observer; genuine board rerun handles both synthetic states.
 await page.goto(origin+'/_audit/run.html');await page.waitForFunction(()=>window.__run);assert((await page.evaluate(()=>window.__run)).pass);
 pass=false;await page.getByRole('button',{name:'Re-run',exact:true}).click();await page.waitForFunction(()=>window.__run?.pass===false);const failed=await page.evaluate(()=>window.__run);assert.equal(failed.failed.length,41);assert.equal(failed.advisoryFailed.length,2);
 assert.equal(await page.getByRole('button',{name:'Re-run',exact:true}).isEnabled(),true);
},{browserName,contextOptions:{hasTouch:true}});
const evidence=process.argv.find(a=>a.startsWith('--evidence='))?.slice(11)||(process.env.CS_HEALTH_CHROME_EVIDENCE_DIR?process.env.CS_HEALTH_CHROME_EVIDENCE_DIR+'/'+browserName+'.json':null);if(evidence)writeFileSync(evidence,JSON.stringify(report,null,2)+'\n');
console.log(`PASS diagnostic chrome ${browserName}: ${report.contexts.length} page/layout/theme/text contexts, ${report.contexts.reduce((n,c)=>n+c.controls.length,0)} action observations; keyboard/pointer and synthetic pass/fail rerun. Child gate correctness and human acceptance are separate.`);
