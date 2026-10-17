import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {tokens} from '../../tokens/tokens.js';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const compiled=await build({stdin:{contents:`
 import React from 'react';
 import {useLiveTokenValues,resolveColorToRgb,rgbToHex} from './stories/lib/live-tokens.jsx';
 import {NguHanhPacks} from './stories/Foundations/Elements.stories.jsx';
 import {SideBySide} from './stories/A11y/ReducedMotion.stories.jsx';
 import {Floors} from './stories/A11y/Contrast.stories.jsx';
 const names=['--cs-color-text-primary','--cs-color-text-muted','--cs-accent','--cs-accent-on-strong','--cs-duration-base','--fixture-resize'];
 window.probeRenders=0;
 function Probe({id='probe',empty=false}) {
   window.probeRenders++;
   const [ref,values,scope]=useLiveTokenValues(empty?[]:names);
   const [measured,setMeasured]=React.useState('');
   React.useEffect(()=>setMeasured(getComputedStyle(ref.current).getPropertyValue('--cs-accent').trim()),[scope.revision,scope.dark]);
   return <output id={id} ref={ref} data-dark={String(scope.dark)} data-revision={scope.revision} data-values={JSON.stringify(values)} data-measured={measured}/>;
 }
 window.Probe=Probe;window.readHex=color=>rgbToHex(resolveColorToRgb(color));
 window.StoryRenders={elements:NguHanhPacks.render,motion:SideBySide.render,contrast:Floors.render};
 `,resolveDir:process.cwd(),loader:'jsx'},bundle:true,write:false,format:'iife',plugins:[{name:'fixture-react',setup(b){
 b.onResolve({filter:/^react$/},()=>({path:'react',namespace:'fixture-react'}));
 b.onLoad({filter:/.*/,namespace:'fixture-react'},()=>({contents:'const React=window.React;export default React;export const {useState,useRef,useEffect,useLayoutEffect,useCallback,useMemo,useId,useReducer,useContext,createContext,Fragment}=React;'}));
}}]});
const packs=Object.keys(tokens.elements).map(key=>{const [element,variant]=key.split('.');return {element,variant};});
const matrix=[];
for(const outer of ['light','dark','system'])for(const inner of ['light','dark','system'])for(const pack of packs)matrix.push({outer,inner,...pack});
const run=async(page,browserName,strict=false)=>{
 await page.evaluate(()=>{const native=window.matchMedia.bind(window);window.liveQueries=[];window.matchMedia=query=>{const mq=native(query);window.liveQueries.push({query,mq});return mq}});
 await page.addScriptTag({content:compiled.outputFiles[0].text});
 await page.addStyleTag({content:':root{--fixture-resize:wide}@media(max-width:500px){:root{--fixture-resize:narrow}}'});
 const settle=()=>page.waitForFunction(()=>[...document.querySelectorAll('output[data-values]')].every(node=>{
  const cs=getComputedStyle(node),shown=JSON.parse(node.dataset.values);
  return Object.keys(shown).length===6&&node.dataset.dark===String(cs.colorScheme==='dark')&&Object.entries(shown).every(([name,value])=>value===cs.getPropertyValue(name).trim());
 }));
 for(const os of ['light','dark']) {
  await page.emulateMedia({colorScheme:os,reducedMotion:'no-preference',contrast:'no-preference'});
  await page.evaluate(rows=>window.renderFixture(React.createElement('div',null,...rows.map((row,i)=>React.createElement('section',{key:i,'data-theme':row.outer},React.createElement('div',{'data-theme':row.inner,'data-cs-element':row.element,'data-cs-variant':row.variant},React.createElement(window.Probe,{id:'case-'+i})))))),matrix);
  await settle();
  assert.equal(await page.locator('output[data-values]').count(),matrix.length);
 }
 await page.evaluate(strict=>{
  let child=React.createElement('section',{id:'ambient','data-theme':'system','data-cs-element':'tho'},React.createElement(window.Probe),React.createElement(window.Probe,{id:'empty',empty:true}));
  if(strict)child=React.createElement(React.StrictMode,null,child);
  window.renderFixture(child);
 },strict);
 const current=()=>page.evaluate(()=>({values:JSON.parse(document.querySelector('#probe').dataset.values),dark:document.querySelector('#probe').dataset.dark,revision:Number(document.querySelector('#empty').dataset.revision),measured:document.querySelector('#empty').dataset.measured}));
 const oneSettle=()=>page.waitForFunction(()=>{
  const node=document.querySelector('#probe'),shown=JSON.parse(node.dataset.values),cs=getComputedStyle(node);
  return Object.keys(shown).length===6&&node.dataset.dark===String(cs.colorScheme==='dark')&&Object.entries(shown).every(([n,v])=>v===cs.getPropertyValue(n).trim())&&document.querySelector('#empty').dataset.measured===cs.getPropertyValue('--cs-accent').trim();
 });
 await oneSettle();
 let before=await current();
 await page.emulateMedia({colorScheme:'light'});await oneSettle();assert.equal((await current()).dark,'false');
 await page.emulateMedia({colorScheme:'dark'});await oneSettle();assert.equal((await current()).dark,'true');
 for(const [attribute,value] of [['data-theme','light'],['data-cs-element','hoa'],['data-cs-variant','lava'],['style','--cs-accent: #123456']]) {
  before=await current();
  await page.evaluate(({attribute,value})=>document.querySelector('#ambient').setAttribute(attribute,value),{attribute,value});
  await page.waitForFunction(revision=>Number(document.querySelector('#empty').dataset.revision)>revision,before.revision);await oneSettle();
 }
 await page.evaluate(()=>document.querySelector('#ambient').removeAttribute('style'));await oneSettle();
 before=await current();await page.emulateMedia({contrast:'more'});
 if(browserName==='firefox') {
  await page.evaluate(()=>window.liveQueries.filter(item=>item.query==='(prefers-contrast: more)').forEach(item=>item.mq.dispatchEvent(new Event('change'))));
  console.log('Firefox contrast limitation: emulated query matches, but CSS color/change notifications did not update in the preserved probe. This preference subscription uses a synthetic change event; actual OS behavior remains unverified.');
 }
 await page.waitForFunction(revision=>matchMedia('(prefers-contrast: more)').matches&&Number(document.querySelector('#empty').dataset.revision)>revision,before.revision);
 await oneSettle();
 console.log(`Contrast emulation ${browserName}: refresh observed; computed muted ${before.values['--cs-color-text-muted']} → ${(await current()).values['--cs-color-text-muted']} (CSS emulation effect is not assumed).`);
 await page.emulateMedia({reducedMotion:'reduce'});await oneSettle();assert.equal((await current()).values['--cs-duration-base'],'0ms');
 await page.setViewportSize({width:400,height:800});await oneSettle();assert.equal((await current()).values['--fixture-resize'],'narrow');
 // An idle mounted hook must converge, rather than triggering a render loop.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const renders=await page.evaluate(()=>window.probeRenders);
 await page.waitForTimeout(60);assert.equal(await page.evaluate(()=>window.probeRenders),renders);
 // Actual source stories, including the no-token Contrast consumer and computed motion labels.
 await page.evaluate(()=>window.renderFixture(window.StoryRenders.elements()));
 await page.waitForFunction(()=>document.body.textContent.includes('on / bright'));
 assert.match(await page.locator('#fixture').innerText(),/The 10 accent roles/);
 await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
 await page.waitForFunction(()=>!document.querySelector('#fixture').textContent.includes('on / bright'));
 assert.equal(await page.getByText('on / strong',{exact:true}).count(),packs.length);
 await page.evaluate(()=>window.renderFixture(window.StoryRenders.contrast()));
 await page.waitForFunction(()=>document.querySelector('#fixture').textContent.includes('accent-on / accent-strong'));
 await page.evaluate(()=>document.documentElement.setAttribute('data-theme','light'));
 await page.waitForFunction(()=>document.querySelector('#fixture').textContent.includes('accent-on / accent-bright'));
 const pairsMatch=()=>page.waitForFunction(()=>[...document.querySelectorAll('#fixture tbody tr')].every(row=>{const cs=getComputedStyle(row.querySelector('td span'));return row.cells[2].textContent===window.readHex(cs.color)+'on '+window.readHex(cs.backgroundColor)}));
 await pairsMatch();
 const pairBefore=await page.locator('#fixture tbody').innerText();
 await page.evaluate(()=>document.documentElement.setAttribute('data-cs-element','hoa'));
 await page.waitForFunction(before=>document.querySelector('#fixture tbody').innerText!==before,pairBefore);await pairsMatch();
 assert.notEqual(await page.locator('#fixture tbody').innerText(),pairBefore);
 await page.evaluate(()=>window.renderFixture(window.StoryRenders.motion()));
 await page.waitForFunction(()=>document.querySelector('#fixture').textContent.includes('duration in effect: 0.01ms (token: 0ms)'));
 assert.equal(await page.getByText('duration in effect: 0.01ms',{exact:true}).count(),1);
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.waitForFunction(()=>document.querySelector('#fixture').textContent.includes('duration in effect: 200ms (token: 200ms)'));
 assert.equal(await page.getByText('duration in effect: 0ms',{exact:true}).count(),1);
 // StrictMode lifecycle and cleanup of subscriptions, including a queued refresh.
 await page.evaluate(()=>{
  window.activeObservers=0;window.activePreferenceListeners=0;
  const NativeObserver=window.MutationObserver,originalMatch=window.matchMedia.bind(window);
  window.MutationObserver=class extends NativeObserver{constructor(callback){super(callback);this.active=false}observe(...args){if(!this.active){window.activeObservers++;this.active=true}return super.observe(...args)}disconnect(){if(this.active){window.activeObservers--;this.active=false}return super.disconnect()}};
  window.matchMedia=query=>{const mq=originalMatch(query),add=mq.addEventListener.bind(mq),remove=mq.removeEventListener.bind(mq);mq.addEventListener=(type,fn,...args)=>{if(type==='change')window.activePreferenceListeners++;return add(type,fn,...args)};mq.removeEventListener=(type,fn,...args)=>{if(type==='change')window.activePreferenceListeners--;return remove(type,fn,...args)};return mq};
  window.renderFixture(null);
  window.renderFixture(React.createElement(React.StrictMode,null,React.createElement('div',{id:'cleanup'},React.createElement(window.Probe))));
 });
 await page.waitForFunction(()=>document.querySelector('#probe')?.dataset.values.includes('--cs-accent'));
 assert.deepEqual(await page.evaluate(()=>[window.activeObservers,window.activePreferenceListeners]),[1,3]);
 await page.evaluate(async()=>{document.querySelector('#cleanup').setAttribute('data-theme','dark');await Promise.resolve();window.renderFixture(null)});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
 assert.deepEqual(await page.evaluate(()=>[window.activeObservers,window.activePreferenceListeners]),[0,0]);
 console.log(`PASS Storybook live CSS ${browserName}${strict?' development StrictMode':''}: ${matrix.length*2} nested theme/pack/OS cases; external attributes/preferences/resize; empty-token consumer; actual Elements/Contrast/Motion stories; convergence and cleanup. No raster or manual acceptance.`);
};
for(const browserName of process.env.CS_TEST_BROWSER?[process.env.CS_TEST_BROWSER]:['chromium','firefox','webkit'])await withBrowserFixture(page=>run(page,browserName),{browserName});
if(!process.env.CS_TEST_BROWSER)await withBrowserFixture(page=>run(page,'chromium',true),{browserName:'chromium',development:true});
