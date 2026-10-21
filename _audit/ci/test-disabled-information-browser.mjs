import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {apca} from '../../scripts/lib/oklch.mjs';
import {textContrastFloor} from './lib/text-contrast-floor.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const bundled=await build({stdin:{contents:`import * as Item from './stories/Item.stories.jsx';import * as TagInput from './stories/TagInput.stories.jsx';window.__disabledStoryCases={Item,TagInput};`,resolveDir:resolve('.')},bundle:true,write:false,format:'iife',jsx:'automatic',plugins:[{name:'shared-react',setup(build){build.onResolve({filter:/^react(?:\/jsx-runtime)?$/},args=>({path:args.path,namespace:'shared-react'}));build.onLoad({filter:/.*/,namespace:'shared-react'},args=>({contents:args.path==='react'?'export default window.React;export const createElement=window.React.createElement;':`export const Fragment=window.React.Fragment;export function jsx(type,props,key){return window.React.createElement(type,{...props,key});}export const jsxs=jsx;`,loader:'js'}));}}]});
const axes=JSON.parse(readFileSync('tokens/modes/index.json')).modes;
const receipt={browserName,sourceHashes:Object.fromEntries(['base/collections.css','base/controls.css','stories/Item.stories.jsx','stories/TagInput.stories.jsx'].map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')])),stories:[],axes:[]};
const settle=page=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
await withBrowserFixture(async page=>{
 await page.addScriptTag({content:bundled.outputFiles[0].text});await page.addScriptTag({url:'/_audit/vendor/axe.min.js'});
 for(const[kind,variant]of [['Item','Matrix'],['Item','FullMatrix'],['TagInput','States'],['TagInput','FullMatrix']]){
  await page.evaluate(({kind,variant})=>{const m=__disabledStoryCases[kind],story=m[variant];renderFixture(story.render({...m.default.args,...story.args}));},{kind,variant});await settle(page);
  const result=await page.evaluate(async()=>axe.run(document.getElementById('fixture'),{runOnly:['color-contrast']}));assert.deepEqual(result.violations,[],kind+variant);receipt.stories.push({kind,variant,passed:true});
 }
 let scheme;
 for(const mode of axes){
  if(scheme!==mode.axes.colorScheme){
   scheme=mode.axes.colorScheme;await page.emulateMedia({colorScheme:scheme});
   // Initialize the unchanged stylesheet under the real OS scheme. This avoids
   // Firefox's already-loaded CSS/media invalidation race, without rewriting CSS.
   await page.evaluate(async()=>{const old=document.querySelector('link[rel=stylesheet]'),next=old.cloneNode();await new Promise((resolve,reject)=>{next.onload=resolve;next.onerror=reject;old.after(next);});old.remove();});
   assert.equal(await page.evaluate(()=>matchMedia('(prefers-color-scheme:dark)').matches),scheme==='dark');
  }
  await page.evaluate(axes=>{const root=document.documentElement;root.dataset.theme=axes.theme;root.dataset.csContrast=axes.contrast;root.dataset.csDensity=axes.density;if(axes.element===null)delete root.dataset.csElement;else root.dataset.csElement=axes.element;if(axes.variant)root.dataset.csVariant=axes.variant;else delete root.dataset.csVariant;
   const h=React.createElement;window.disabledChanges=0;renderFixture(h(React.Fragment,null,h(CS.Item,{disabled:true,title:'Unavailable information',description:'This information remains readable.'}),h(CS.Item,{disabled:true,onClick:()=>window.disabledChanges++,title:'Disabled action'}),h(CS.Item,{disabled:true,href:'#unexpected-navigation',title:'Disabled link'}),h(CS.TagInput,{disabled:true,label:'Committed values',defaultValue:['design','vn'],onChange:()=>window.disabledChanges++})));
  },mode.axes);await settle(page);
  const values=await page.evaluate(()=>{
   const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d',{willReadFrequently:true});const color=value=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=value;ctx.fillRect(0,0,1,1);const a=[...ctx.getImageData(0,0,1,1).data];if(a[3]!==255)throw Error('Expected opaque actual foreground/background');return'#'+a.slice(0,3).map(v=>v.toString(16).padStart(2,'0')).join('');};
   const nodes=[...document.querySelectorAll('div.cs-item.is-disabled .cs-item__title,div.cs-item.is-disabled .cs-item__description,.cs-field.is-disabled > .cs-taginput > .cs-tag')];
   return nodes.map(el=>{const s=getComputedStyle(el);let bg=el;while(bg&&getComputedStyle(bg).backgroundColor==='rgba(0, 0, 0, 0)')bg=bg.parentElement;for(let p=el;p;p=p.parentElement)if(+getComputedStyle(p).opacity!==1)throw Error('Informational text must not inherit dimming');return{text:el.firstChild.textContent,fg:color(s.color),bg:color(getComputedStyle(bg).backgroundColor),fontSize:parseFloat(s.fontSize),fontWeight:parseFloat(s.fontWeight)};});
  });assert.equal(values.length,4);
  for(const value of values){value.lc=apca(value.fg,value.bg);value.floor=textContrastFloor(value.fontSize,value.fontWeight);assert.equal(value.floor,75);assert.ok(value.lc>=value.floor,mode.id+JSON.stringify(value));}
  assert.equal(await page.locator('div.cs-item.is-disabled').evaluate(el=>el.hasAttribute('aria-disabled')),false,'Informational Item must not claim a fake inactive-control exemption');
  assert.equal(await page.locator('button.cs-item').isDisabled(),true);assert.equal(await page.locator('a.cs-item').getAttribute('aria-disabled'),'true');assert.equal(await page.locator('a.cs-item').getAttribute('href'),null);
  assert.equal(await page.locator('.cs-taginput input').isDisabled(),true);for(const button of await page.locator('.cs-taginput button').all())assert.equal(await button.isDisabled(),true);
  const disabledAttempt=await page.evaluate(()=>{document.querySelector('button.cs-item').click();for(const button of document.querySelectorAll('.cs-taginput button'))button.click();const link=document.querySelector('a.cs-item');return {linkDefaultPrevented:!link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})),chips:document.querySelectorAll('.cs-taginput > .cs-tag').length,changes:disabledChanges};});
  assert.deepEqual(disabledAttempt,{linkDefaultPrevented:true,chips:2,changes:0});
  assert.equal(await page.locator('.cs-field.is-disabled').getAttribute('aria-disabled'),null,'Committed values are measured without a fake ARIA exemption');
  const result=await page.evaluate(async()=>axe.run(document.getElementById('fixture'),{runOnly:['color-contrast']}));assert.deepEqual(result.violations,[],mode.id);assert.ok(result.passes.some(r=>r.id==='color-contrast'&&r.nodes.some(n=>n.html.includes('cs-tag'))),'Committed values must actually receive contrast check');
  receipt.axes.push({mode:mode.id,values});
 }
 // Restore original composite dimming: the same axe gate must reject it.
 await page.evaluate(()=>{Object.assign(document.documentElement.dataset,{theme:'light',csElement:'tho',csContrast:'standard'});delete document.documentElement.dataset.csVariant;});
 await page.addStyleTag({content:'div.cs-item.is-disabled{opacity:.55}.cs-field.is-disabled:has(>.cs-taginput){opacity:.58}'});await settle(page);
 const broken=await page.evaluate(async()=>axe.run(document.getElementById('fixture'),{runOnly:['color-contrast']}));assert.ok(broken.violations.some(r=>r.id==='color-contrast'&&r.nodes.some(n=>n.html.includes('cs-item__title'))));assert.ok(broken.violations.some(r=>r.id==='color-contrast'&&r.nodes.some(n=>n.html.includes('cs-tag'))));receipt.originalDimmingRejected=true;receipt.version=page.context().browser().version();
},{browserName});
mkdirSync('test-results',{recursive:true});writeFileSync(`test-results/disabled-information-${browserName}.json`,JSON.stringify(receipt,null,2)+'\n');console.log(`PASS ${browserName}:4actualstories,${axes.length}theme/realOSscheme/element/density/contrastcases,APCA75/WCAG,disabledactions and dimmingmutation`);
