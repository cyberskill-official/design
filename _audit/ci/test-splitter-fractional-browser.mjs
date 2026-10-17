import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const names=['components/data/Splitter.jsx','components/data/Splitter.d.ts','components/data/Splitter.prompt.md','_audit/ci/lib/browser-fixture.mjs','_audit/ci/test-splitter-browser.mjs','_ds_bundle.js','styles.css','_vendor/react/react.production.min.js','_vendor/react/react-dom.production.min.js'];
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const sourceFiles=Object.fromEntries(names.map(n=>[n,sha(root+'/'+n)]));
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{cwd:root,stdio:'pipe'});
const fractional=[{name:'lower',min:20.4,max:80.6,initial:20.4},{name:'upper',min:20.4,max:80.6,initial:80.6},{name:'middle',min:20.4,max:80.6,initial:50.5},{name:'narrow',min:.4,max:.6,initial:.4}];
const integers=[{name:'integer-lower',min:20,max:80,initial:20},{name:'integer-upper',min:20,max:80,initial:80}];
const observations=[],controls=[],runtime={node:process.version,browsers:{},reactVersions:{}};
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 runtime.browsers[browserName]=page.context().browser().version();runtime.reactVersions[browserName]=await page.evaluate(()=>React.version);
 for(const lang of ['en','vi'])for(const dir of ['ltr','rtl'])for(const sample of [...fractional,...integers]){
  await page.evaluate(({lang,dir,sample})=>{renderFixture(null);window.splitterNativeEvent=null;renderFixture(React.createElement('div',{dir},React.createElement(CS.Splitter,{...sample,start:'Start',end:'End',lang})));document.querySelector('[role=separator]').addEventListener('keydown',e=>window.splitterNativeEvent={key:e.key,isTrusted:e.isTrusted,isComposing:e.isComposing});},{lang,dir,sample});
  const bar=page.getByRole('separator');await bar.focus();let expected=sample.initial;
  for(const action of ['initial','ArrowRight','ArrowLeft']){
   if(action!=='initial'){await page.keyboard.press(action);const delta=(action==='ArrowRight'?2:-2)*(dir==='rtl'?-1:1);expected=Math.min(sample.max,Math.max(sample.min,expected+delta));}
   const value=await bar.evaluate(el=>({ariaNow:Number(el.getAttribute('aria-valuenow')),ariaMin:Number(el.getAttribute('aria-valuemin')),ariaMax:Number(el.getAttribute('aria-valuemax')),grid:el.parentElement.style.gridTemplateColumns,event:window.splitterNativeEvent,focused:el===document.activeElement}));
   assert(value.focused);assert.equal(value.ariaMin,sample.min);assert.equal(value.ariaMax,sample.max);
   if(action!=='initial'){assert.equal(value.event.isTrusted,true);assert.equal(value.event.isComposing,false);}
   const grid=Number(value.grid.match(/minmax\(0(?:px)?,\s*([\d.]+)fr\)/)?.[1]);assert(Number.isFinite(grid));assert(Math.abs(grid-expected)<1e-9,'Rendered pane must use expected unrounded percentage');
   const row={browserName,lang,dir,sample,action,expected,...value,renderedStartPercentage:grid,outOfRange:value.ariaNow<sample.min||value.ariaNow>sample.max,identityMismatch:Math.abs(value.ariaNow-grid)>1e-9};
   if(sample.name.startsWith('integer')){assert.equal(row.outOfRange,false);assert.equal(row.identityMismatch,false);controls.push(row);}else observations.push(row);
  }
 }
 console.log(browserName+': '+observations.filter(r=>r.browserName===browserName).length+' fractional observations, '+controls.filter(r=>r.browserName===browserName).length+' integer controls complete');
},{browserName});
assert.equal(observations.length,144);assert.equal(controls.length,72);assert.deepEqual(Object.fromEntries(names.map(n=>[n,sha(root+'/'+n)])),sourceFiles);
const failures=observations.filter(r=>r.identityMismatch||r.outOfRange).length;const outOfRange=observations.filter(r=>r.outOfRange).length;
if(process.env.CS_SPLITTER_FRACTION_REPORT)writeFileSync(process.env.CS_SPLITTER_FRACTION_REPORT,JSON.stringify({recordedAt:new Date().toISOString(),observations,controls,failures,outOfRange,runtime,sourceFiles,sourceUnchanged:true,scope:'144 finite documented fractional-bound observations and 72 integral controls, native browser arrows, EN/VI LTR/RTL across three engines. Rendered grid percentage verified independently of ARIA. Not physical hardware, AT or conformance acceptance.'},null,2)+'\n');
console.log(JSON.stringify({observations:144,failures,outOfRange,controls:72}));assert.equal(failures,0,'ARIA value must equal rendered percentage and remain in bounds');
