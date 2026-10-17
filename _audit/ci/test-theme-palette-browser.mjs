import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const css=readFileSync(new URL('../../tokens/colors.css',import.meta.url),'utf8');
const keys=[...new Set([...css.matchAll(/(--cs-[\w-]+)\s*:/g)].map(match=>match[1]))];
const variants=Object.keys(JSON.parse(readFileSync(new URL('../../tokens/tokens.json',import.meta.url),'utf8')).elements);
const failures=[];
await withBrowserFixture(async page=>{
 for(const colorScheme of ['light','dark'])for(const contrast of ['no-preference','more']){
  await page.emulateMedia({colorScheme,contrast});
  const rows=await page.evaluate(keys=>{
   const themes=['light','dark','system'];const host=document.getElementById('fixture');const result=[];
   const values=el=>{const s=getComputedStyle(el);return Object.fromEntries([...keys.map(key=>[key,s.getPropertyValue(key).trim()]),['color-scheme',s.colorScheme]]);};
   for(const outer of themes)for(const inner of themes)for(const deepest of themes){
    host.innerHTML=`<div data-theme="${inner}" id="reference"></div><div data-theme="${deepest}" id="deep-reference"></div><div data-theme="${outer}"><div data-theme="${inner}" id="nested"><div id="inherited"></div><div data-theme="${deepest}" id="deep"></div></div></div>`;
    const get=id=>values(host.querySelector('#'+id));
    for(const [target,reference] of [['nested','reference'],['inherited','reference'],['deep','deep-reference']]){
     const actual=get(target),expected=get(reference);const differences=Object.keys(expected).filter(key=>actual[key]!==expected[key]).map(key=>({key,actual:actual[key],expected:expected[key]}));
     if(differences.length)result.push({outer,inner,deepest,target,differences});
    }
   }
   return result;
  },keys);
  failures.push(...rows.map(row=>({colorScheme,contrast,...row})));
 }
 const elementPreservation=await page.evaluate(({variants,keys})=>{
   const host=document.getElementById('fixture'),differences=[];
   for(const entry of variants){
    const [element,variant='']=entry.split('.'),attrs=`data-cs-element="${element}" data-cs-variant="${variant}"`;
    host.innerHTML=`<div data-theme="light" ${attrs} id="ref"></div><div ${attrs}><div data-theme="light" id="child"></div></div>`;
    const expected=getComputedStyle(host.querySelector('#ref')),actual=getComputedStyle(host.querySelector('#child'));
    for(const key of keys)if(expected.getPropertyValue(key)!==actual.getPropertyValue(key))differences.push({entry,key});
   }
   return differences;
 },{variants,keys});
 assert.deepEqual(elementPreservation,[],'Neutral reset must not erase inherited light element palettes');
 await page.evaluate(()=>{document.getElementById('fixture').innerHTML='<div data-theme="dark"><div data-theme="system" id="live-system"></div></div><div id="live-reference" data-theme="light"></div>';});
 for(const colorScheme of ['light','dark','light']){
  await page.emulateMedia({colorScheme});
  const differences=await page.evaluate(({keys,colorScheme})=>{
   const ref=document.getElementById('live-reference');ref.dataset.theme=colorScheme;
   const actual=getComputedStyle(document.getElementById('live-system')),expected=getComputedStyle(ref);
   return keys.filter(key=>actual.getPropertyValue(key)!==expected.getPropertyValue(key));
  },{keys,colorScheme});
  assert.deepEqual(differences,[],`Mounted system scope must follow OS switch to ${colorScheme}`);
 }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
if(failures.length)console.log(JSON.stringify({failures:failures.length,examples:failures.slice(0,2)},null,2));
assert.equal(failures.length,0,'Nested palette must match the same independent theme and OS preferences');
console.log(`PASS nested palettes: ${keys.length} color tokens and color-scheme; 108 three-level theme/OS/contrast combinations plus inheritance and live OS changes`);
