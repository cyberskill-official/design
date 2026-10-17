import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {inspectCoarseHitRegion} from './lib/coarse-hit-region.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const evidence=process.argv.find(arg=>arg.startsWith('--evidence='))?.slice(11);
const browserName=process.env.CS_BROWSER||'chromium',names=['a11y-harness','apca-dark-preview','dtcg-typing','visual-diff'];
import {diagnosticPaint as paint}from'./lib/diagnostic-paint.mjs';
const helper=readFileSync(root+'/stories/lib/live-tokens.jsx','utf8');const apca=Function(helper.slice(helper.indexOf('export function apcaLc'),helper.indexOf('\nconst MONO')).replace('export ','')+';return apcaLc;')();
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const report={browserName,state:'bounded_source_browser_verification',sourceHashes:Object.fromEntries(names.map(n=>['_audit/'+n+'.html',sha(root+'/_audit/'+n+'.html')])),contexts:[],scope:'Four actual diagnostic pages from canonical local source. All actual gate/advisory verdicts finish; coarse320/390/1280 light/dark/system-light/system-dark with OS media initialized before navigation. Visible actions and associated native radio labels:44px box/clipping and guarded42px integer disk; bounded diagnostic body APCA75, accessible naming, visual comparison native dimensions/local scrolling, pick/mode/opacity/width and copy dispatch. Hidden fixture controls excluded from UI ownership. No public build replay, full/AT/device/human acceptance inferred.'};
const verdicts={'a11y-harness':'__a11ycss','apca-dark-preview':'__apcaPreview','dtcg-typing':'__dtcgtyping','visual-diff':'__visualdiff'};
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 for(const name of names)for(const theme of ['light','dark','system-light','system-dark']){
  await page.emulateMedia({colorScheme:theme.endsWith('dark')?'dark':'light'});
  await page.addInitScript(t=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.dataset.theme=t.startsWith('system')?'system':t,{once:true}),theme);
  await page.goto(origin+'/_audit/'+name+'.html');await page.evaluate(t=>document.documentElement.dataset.theme=t.startsWith('system')?'system':t,theme);
  await page.waitForFunction(key=>window[key],verdicts[name]);const verdict=await page.evaluate(key=>window[key],verdicts[name]);assert.equal(verdict.pass,true,JSON.stringify({name,theme,verdict}));
  await page.evaluate(()=>document.fonts.ready);
  for(const width of [320,390,1280]){
   await page.setViewportSize({width,height:800});await page.evaluate(()=>{window.scrollTo(0,0);for(const el of document.querySelectorAll('[data-candidate-target]'))delete el.dataset.candidateTarget});assert(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert(overflow<=0,JSON.stringify({name,theme,width,overflow}));
   const targets=await page.locator('button,a[href],input:not([type=hidden]),select,textarea').evaluateAll(nodes=>nodes.filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return el.getClientRects().length&&r.bottom>=0&&r.right>=0&&s.visibility!=='hidden'}).map(el=>{const target=el.matches('input[type=radio]')&&el.labels?.[0]?el.labels[0]:el;target.dataset.candidateTarget='true';return {tag:target.tagName,id:target.id,text:target.textContent.trim().slice(0,80)}}));
   const observations=[];for(let i=0;i<targets.length;i++){const el=page.locator('[data-candidate-target]').nth(i);await el.scrollIntoViewIfNeeded();const region=await el.evaluate(inspectCoarseHitRegion);assert(region.pass,JSON.stringify({name,theme,width,i,target:targets[i],region}));observations.push({target:targets[i],bounds:region.targetBounds,samples:region.requiredSamples})}
   const body=await page.locator('.lede,.lede *,.note,.note *,.pk small,.cap,.ctl,#cov td,.row,.row *,#sum,#live-status').evaluateAll(paint);for(const sample of body)assert(apca(sample.fg,sample.bg)>=75,JSON.stringify({name,theme,width,sample,apca:apca(sample.fg,sample.bg)}));
   const paintMin=Math.min(...body.map(s=>apca(s.fg,s.bg)));report.contexts.push({name,theme,width,verdict,observations,bodyMinimumApca:paintMin});
   if(name==='visual-diff'){
    const pane=page.locator('.pane').first();assert.equal(await pane.getAttribute('role'),'region');assert(await pane.getAttribute('aria-label'));
    const before=await pane.evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth,left:el.scrollLeft}));await pane.focus();assert(await pane.evaluate(el=>getComputedStyle(el).outlineStyle!=='none'||getComputedStyle(el).boxShadow!=='none'));
    if(before.scroll>before.client){await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.pane').scrollLeft>0);await page.keyboard.press('End');assert.equal(await pane.evaluate(el=>Math.round(el.scrollLeft)),before.scroll-before.client);await page.keyboard.press('Home');assert.equal(await pane.evaluate(el=>el.scrollLeft),0)}
    assert.equal(await page.locator('.box').first().evaluate(el=>el.getBoundingClientRect().width),562,'Comparison560px content plus2px border preserved');
   }
  }
  if(name==='apca-dark-preview'){
   assert.equal(await page.locator('#css').getAttribute('aria-label'),'Proposed dark-pack CSS');
   await page.addScriptTag({url:origin+'/_audit/vendor/axe.min.js'});
   const names=await page.evaluate(()=>axe.run('#css',{runOnly:{type:'rule',values:['label']}}));assert.equal(names.violations.length,0);assert.equal(names.incomplete.length,0);
   await page.evaluate(()=>{window.__candidateCopies=[];document.execCommand=command=>{__candidateCopies.push({command,text:document.getElementById('css').value});return true}});await page.getByRole('button',{name:'Copy proposed CSS'}).click();const copies=await page.evaluate(()=>__candidateCopies);assert.equal(copies.length,1);assert.equal(copies[0].command,'copy');assert.equal(copies[0].text,await page.locator('#css').inputValue());
  }
  if(name==='visual-diff'){
   const picks=page.locator('button.pick');for(let i=0;i<await picks.count();i++){const pick=picks.nth(i),slug=await pick.textContent();await pick.click();assert(await pick.evaluate(el=>el.classList.contains('on')));assert((await page.locator('.cap').first().textContent()).includes(slug));await page.waitForFunction(selected=>window.__visualLive?.state==='ready'&&__visualLive.slug===selected,slug);if(slug==='dashboard-dark')assert.equal(await page.evaluate(()=>__visualLive.actualTheme),'dark')}
   await page.getByLabel('Overlay (difference)',{exact:true}).check();await page.waitForFunction(()=>__visualLive?.state==='ready');assert.equal(await page.locator('.pane').count(),1);assert.equal(await page.locator('.ov').count(),1);
   await page.evaluate(()=>{window.__opacityIdentityFrame=document.querySelector('#stage iframe');window.__opacityIdentityDocument=__opacityIdentityFrame.contentDocument;});
   await page.locator('#op').focus();await page.keyboard.press('Home');for(let step=0;step<10;step++)await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.ov').evaluate(el=>Number(getComputedStyle(el).opacity)),.5);
   assert.equal(await page.evaluate(()=>__opacityIdentityFrame===document.querySelector('#stage iframe')) ,true,'Opacity must preserve the live iframe');
   assert.equal(await page.evaluate(()=>__opacityIdentityDocument===document.querySelector('#stage iframe').contentDocument),true,'Opacity must preserve the live document and state');
   await page.locator('#nw').fill('1000');await page.locator('#nw').dispatchEvent('change');await page.waitForFunction(()=>__visualLive?.state==='ready');assert.equal(await page.locator('iframe').evaluate(el=>parseFloat(el.style.width)),1000);assert.equal(await page.locator('iframe').evaluate(el=>el.style.transform),'scale(0.56)');
   await page.getByLabel('Side-by-side',{exact:true}).check();await page.waitForFunction(()=>__visualLive?.state==='ready');assert.equal(await page.locator('.pane').count(),2);
  }
 }
},{browserName,contextOptions:{hasTouch:true}});
for(const[path,hash]of Object.entries(report.sourceHashes))assert.equal(sha(root+'/'+path),hash,'Source changed during check: '+path);
if(evidence)writeFileSync(resolve(evidence),JSON.stringify(report,null,2)+'\n');console.log('PASS diagnostic pages',browserName,report.contexts.length,'contexts,',report.contexts.reduce((n,c)=>n+c.observations.length,0),'action observations; declared local source scope');
