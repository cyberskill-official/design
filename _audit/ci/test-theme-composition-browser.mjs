import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const tokens=JSON.parse(readFileSync(new URL('../../tokens/tokens.json',import.meta.url)));
const variants=Object.keys(tokens.elements);
const references=JSON.parse(readFileSync(new URL('./fixtures/theme-colocated.json',import.meta.url))).cases;
const keys=[...new Set([...Object.keys(tokens.root.colors||{}),...Object.values(tokens.root).flatMap(Object.keys).filter(k=>k.startsWith('--cs-color-')||k.startsWith('--cs-accent')||k.startsWith('--cs-doc-')), '--cs-component-button-primary-bg','--cs-component-button-primary-fg'])];
const browserName=process.argv.find(a=>a.startsWith('--browser='))?.slice('--browser='.length)||'chromium';
const staticOnly=process.argv.includes('--static-only');
const failures=[];let scenarios=0;
await withBrowserFixture(async page=>{
 const fixtureUrl=page.url();
 async function media(colorScheme,contrast,reload=true){
  await page.emulateMedia({colorScheme,contrast});
  if(reload) await page.goto(fixtureUrl);
  await page.waitForFunction(({colorScheme,contrast})=>
   matchMedia('(prefers-color-scheme: dark)').matches===(colorScheme==='dark') &&
   matchMedia('(prefers-contrast: more)').matches===(contrast==='more'),{colorScheme,contrast});
 }

 for(const colorScheme of ['light','dark']) {
  await media(colorScheme,'no-preference');
  const changes=await page.evaluate(rows=>{
   const host=document.getElementById('fixture'),changes=[];
   for(const row of rows){
    const [el,v='']=row.entry.split('.');
    host.innerHTML=`<div data-theme="${row.theme}" ${row.entry?`data-cs-element="${el}" data-cs-variant="${v}"`:''}></div>`;
    const css=getComputedStyle(host.firstElementChild);
    for(const [key,value] of Object.entries(row.values))if(css.getPropertyValue(key).trim()!==value)changes.push({entry:row.entry,theme:row.theme,key,value,actual:css.getPropertyValue(key)});
   }
   return changes;
  },references.filter(row=>row.os===colorScheme));
  assert.deepEqual(changes,[],'Existing colocated palettes must stay unchanged');
 }
 for(const colorScheme of ['light','dark'])for(const contrast of ['no-preference','more']){
  await media(colorScheme,contrast);
  const result=await page.evaluate(({variants,keys})=>{
   const host=document.getElementById('fixture'),bad=[];let count=0;
   const attrs=entry=>{const [el,v='']=entry.split('.');return `data-cs-element="${el}" data-cs-variant="${v}"`;};
   const values=el=>{const css=getComputedStyle(el);return keys.map(k=>css.getPropertyValue(k).trim());};
   for(const entry of variants)for(const theme of ['light','dark','system'])for(const contrast of ['standard','high']){
    const a=attrs(entry),t=`data-theme="${theme}"`,c=`data-cs-contrast="${contrast}"`;
    const layouts=[`<div ${t} ${c}><div ${a} id="actual"></div></div>`,`<div ${a}><div ${t} ${c} id="actual"></div></div>`,`<div data-theme="dark" data-cs-contrast="high" ${attrs('kim.steel')}><div ${t}><div ${a}><div ${c} id="actual"></div></div></div></div>`,`<div ${c}><div ${a}><div ${t} id="actual"></div></div></div>`];
    for(const markup of layouts){
     host.innerHTML=`<div ${a} ${t} ${c} id="reference"></div>${markup}`;
     const actual=values(host.querySelector('#actual')),expected=values(host.querySelector('#reference'));count++;
     const diff=keys.filter((k,i)=>!actual[i]||actual[i]!==expected[i]);if(diff.length)bad.push({entry,theme,contrast,layout:layouts.indexOf(markup),diff});
    }
   }
   return {bad,count};
  },{variants,keys});scenarios+=result.count;failures.push(...result.bad.map(x=>({colorScheme,osContrast:contrast,...x})));
 }
 // Live OS changes must update already-mounted split scopes; explicit standard
 // overrides the OS preference and high resets correctly below standard.
 if(!staticOnly){
 await page.evaluate(()=>{document.getElementById('fixture').innerHTML='<div data-cs-element="hoa"><div data-theme="system" id="live"><div data-cs-contrast="standard" id="standard"><div data-cs-contrast="high" id="high"></div></div></div></div>';});
 for(const colorScheme of ['light','dark','light'])for(const contrast of ['more','no-preference']){
  await media(colorScheme,contrast,false);
  const result=await page.evaluate(()=>Object.fromEntries(['live','standard','high'].map(id=>{
   const el=document.getElementById(id);el.style.color='var(--cs-color-text-muted)';
   return [id,{token:getComputedStyle(el).getPropertyValue('--cs-color-text-muted').trim(),color:getComputedStyle(el).color,scheme:getComputedStyle(el).colorScheme}];
  })));
  const standard=colorScheme==='dark'?'#E9D6C2':'#3F2D21';
  const high=colorScheme==='dark'?'#F5EAD9':'#45210E';
  assert.equal(result.standard.token,standard);
  assert.equal(result.high.token,high);
  assert.equal(result.live.token,contrast==='more'?high:standard);
  assert.equal(result.live.scheme,colorScheme);
  assert.equal(result.standard.color,colorScheme==='dark'?'rgb(233, 214, 194)':'rgb(63, 45, 33)');
 }
 }
}, {browserName});
if(failures.length)console.log(JSON.stringify({failures:failures.length,examples:failures.slice(0,3)},null,2));
assert.equal(failures.length,0,'Theme, element and explicit contrast scopes must compose independently');
console.log(`PASS theme composition (${browserName}): ${scenarios} placement/reset scenarios, ${keys.length} public color/role/CTA tokens; live media ${staticOnly?"NOT VERIFIED (static-only run)":"passed"}`);
