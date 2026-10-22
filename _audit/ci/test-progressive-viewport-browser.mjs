import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {transform} from 'esbuild';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const baseline=read('_audit/ci/fixtures/g30-dialog-before.css'),source=read('base/components.css'),collections=read('base/collections.css');
assert(source.includes('max-block-size: min(80vh, calc(100vh - 4rem))'));assert(source.includes('top: 12vh;'));assert(source.includes('top: 4vh;'));
const minified=(await transform(source,{loader:'css',minifyWhitespace:true})).code;
const synthetic=source.replace(/env\(safe-area-inset-(top|right|bottom|left), 0px\)/g,(_,edge)=>({top:'64px',right:'43px',bottom:'37px',left:'23px'})[edge]);
const unsupported=source.replace('@supports (height: 100dvh) and (top: max(1px, env(safe-area-inset-top, 0px)))','@supports not (height: 1px)');
const rows=[];mkdirSync('test-results/progressive-viewport',{recursive:true});
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 let css=source;await page.route('**/base/components.css',r=>r.fulfill({status:200,contentType:'text/css',body:css}));const origin=new URL(page.url()).origin;
 async function render(next,kind,dir){css=next;await page.goto(origin+'/');await page.evaluate(({kind,dir})=>{document.documentElement.dir=dir;const C=window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(k))],e=React.createElement;ReactDOM.flushSync(()=>ReactDOM.createRoot(document.getElementById('fixture')).render(e(C[kind],{open:true,title:'Viewport bounds',onClose:()=>{}},e('div',{style:{height:1800}},'Long readable content'))));},{kind,dir});await page.evaluate(()=>document.fonts.ready);return geometry();}
 async function geometry(){return page.evaluate(()=>{const panel=document.querySelector('.cs-dialog'),r=panel.getBoundingClientRect(),s=getComputedStyle(panel);return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,maxHeight:s.maxHeight,padding:s.padding,scrollable:panel.scrollHeight>panel.clientHeight};});}
 let comparisons=0;
 for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390},{width:390,height:420}]){await page.setViewportSize(viewport);for(const kind of ['Dialog','AlertDialog'])for(const dir of ['ltr','rtl']){
  const before=await render(baseline,kind,dir);for(const [name,next]of [['source',source],['minified-leaf',minified],['feature-query-negative-control',unsupported]]){assert.deepEqual(await render(next,kind,dir),before,browserName+'/'+kind+'/'+dir+'/'+name+' env-zero fallback geometry');comparisons++;}
  const bounded=await render(synthetic,kind,dir);assert(bounded.x>=23-0.1);assert(bounded.right<=viewport.width-43+0.1);assert(bounded.y>=64-0.1);assert(bounded.bottom<=viewport.height-37+0.1);assert(bounded.scrollable,'Long content remains internally scrollable');
 }}
 // Real resize uses current dvh geometry; no virtual keyboard/device claim.
 await page.setViewportSize({width:390,height:844});await render(source,'Dialog','ltr');await page.setViewportSize({width:390,height:420});const resized=await geometry();const fresh=await render(source,'Dialog','ltr');assert.deepEqual(resized,fresh,'Existing panel responds to viewport resize');
 rows.push({browserName,comparisons,syntheticInsetCases:16,resize:true,pass:true});console.log('PASS progressive viewport '+browserName);
},{browserName,contextOptions:{viewport:{width:1280,height:900}}});
for(const browserName of ['chromium','firefox','webkit'])for(const coarse of [false,true])await withBrowserFixture(async page=>{
 await page.evaluate(()=>{const C=window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(k))],e=React.createElement;ReactDOM.flushSync(()=>ReactDOM.createRoot(document.getElementById('fixture')).render(e('div',{style:{width:360,'--cs-color-surface-raised':'rgb(100, 110, 120)'}},e(C.List,null,e(C.ListItem,{title:'List',onClick:()=>{}})),e(C.Item,{title:'Item',onClick:()=>{}}),e(C.Accordion,{items:[{title:'Accordion',content:'Text'}]}))));});
 assert.equal(await page.evaluate(()=>matchMedia('(hover: hover)').matches),!coarse);
 for(const selector of ['.cs-list__item--button','.cs-item--interactive','.cs-accordion__trigger']){await page.mouse.move(1000,800);const before=await page.locator(selector).evaluate(el=>getComputedStyle(el).backgroundColor);await page.locator(selector).hover();const hovered=await page.locator(selector).evaluate(el=>getComputedStyle(el).backgroundColor);assert.equal(hovered,coarse?before:'rgb(100, 110, 120)');await page.locator(selector).focus();assert.equal(await page.locator(selector).evaluate(el=>document.activeElement===el),true);}
 rows.push({browserName,pointer:coarse?'coarse':'fine',hoverCases:3,pass:true});console.log('PASS visual hover guards '+browserName+'/'+(coarse?'coarse':'fine'));
},{browserName,contextOptions:{hasTouch:coarse,viewport:{width:1280,height:900}}});
assert.equal(read('base/components.css'),source);assert.equal(read('base/collections.css'),collections);writeFileSync('test-results/progressive-viewport/final.json',JSON.stringify({pass:true,node:process.version,scope:'Real three-engine desktop viewport resize; env-zero geometry parity and synthetic inset arithmetic, explicit unsupported-query control; actual fine/coarse visual hover guards. No physical iOS toolbar/keyboard or hardware safe-area acceptance claimed.',hashes:{baseline:hash(baseline),source:hash(source),collections:hash(collections)},rows},null,2)+'\n');
