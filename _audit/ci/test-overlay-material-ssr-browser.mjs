import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const require=createRequire(new URL('../../package.json',import.meta.url));
const entry=`import React from 'react'; import {renderToString} from 'react-dom/server';
import {Dialog} from './components/dialog/Dialog.jsx';
import {AlertDialog} from './components/overlays/AlertDialog.jsx';
import {Drawer} from './components/overlays/Drawer.jsx';
export function render(kind,material){const C={Dialog,AlertDialog,Drawer}[kind];
 const props={open:true,title:'Server material',lang:'en',className:material,onClose:()=>{},onOpenChange:()=>{}};
 if(kind==='AlertDialog')props.description='Content';
 return renderToString(React.createElement(C,props,kind==='AlertDialog'?null:'Content'));}`;
const code=buildSync({stdin:{contents:entry,resolveDir:fileURLToPath(new URL('../../',import.meta.url)),loader:'jsx'},bundle:true,
 platform:'node',format:'cjs',packages:'external',write:false}).outputFiles[0].text;
const loaded={exports:{}};
new Function('require','module','exports',code)(require,loaded,loaded.exports);
const rows=[];
let failure;
try {
for(const browserName of process.env.CS_BROWSER ? [process.env.CS_BROWSER] : ['chromium','firefox','webkit']) {
for(const kind of ['Dialog','AlertDialog','Drawer'])for(const material of ['cs-surface-heavy','cs-surface-light']){
 const markup=loaded.exports.render(kind,material);
 assert.ok(markup.includes('data-cs-overlay-material'));
 assert.ok(!markup.includes('data-cs-overlay-surface-ready'));
 await withBrowserFixture(async page=>{
  const errors=[];page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  const fallback=await page.evaluate(({markup,material})=>{
   ReactDOM.flushSync(()=>fixtureRoot.unmount());
   document.documentElement.lang='en';
   const mount=document.getElementById('fixture');mount.innerHTML=markup;
   const reference=document.createElement('div');reference.id='ssr-reference';reference.className=material;
   reference.style.cssText='position:fixed;left:-2000px;width:100px;height:100px';document.body.append(reference);
   const panel=mount.querySelector('[role=dialog], [role=alertdialog]');
   return {background:getComputedStyle(panel).backgroundColor,referenceBackground:getComputedStyle(reference).backgroundColor,
    ready:panel.hasAttribute('data-cs-overlay-surface-ready')};
  },{markup,material});
  assert.equal(fallback.ready,false);assert.equal(fallback.background,fallback.referenceBackground);
  assert.ok(!['transparent','rgba(0, 0, 0, 0)'].includes(fallback.background),'SSR material remains painted');
  await page.evaluate(({kind,material})=>{
   const props={open:true,title:'Server material',lang:'en',className:material,onClose:()=>{},onOpenChange:()=>{}};
   if(kind==='AlertDialog')props.description='Content';
   window.hydratedMaterial=ReactDOM.hydrateRoot(document.getElementById('fixture'),React.createElement(CS[kind],props,kind==='AlertDialog'?null:'Content'));
  },{kind,material});
  await page.waitForFunction(()=>{
   const p=document.querySelector('[role=dialog], [role=alertdialog]'),s=p.previousElementSibling;
   if(!p.hasAttribute('data-cs-overlay-surface-ready'))return false;
   const a=p.getBoundingClientRect(),b=s.getBoundingClientRect();return Math.abs(a.x-b.x)<1&&Math.abs(a.width-b.width)<1&&a.height>0;
  });
  await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
  const hydrated=await page.evaluate(()=>{
   const p=document.querySelector('[role=dialog], [role=alertdialog]'),s=p.previousElementSibling;
   return {panelBackground:getComputedStyle(p).backgroundColor,backingBackground:getComputedStyle(s).backgroundColor,backingFilter:getComputedStyle(s).backdropFilter,
    referenceBackground:getComputedStyle(document.getElementById('ssr-reference')).backgroundColor,referenceFilter:getComputedStyle(document.getElementById('ssr-reference')).backdropFilter,
    panelFilter:getComputedStyle(p).backdropFilter,ready:p.hasAttribute('data-cs-overlay-surface-ready')};
  });
  assert.equal(hydrated.panelFilter,'none');assert.equal(hydrated.panelBackground,hydrated.referenceBackground);assert.equal(hydrated.backingFilter,hydrated.referenceFilter);assert.equal(hydrated.backingBackground,'rgba(0, 0, 0, 0)');
  assert.deepEqual(errors,[],'No hydration console errors');
  await page.evaluate(()=>ReactDOM.flushSync(()=>hydratedMaterial.unmount()));
  assert.equal(await page.locator('.cs-overlay-surface').count(),0);
  rows.push({browserName,kind,material,fallback,hydrated,consoleErrors:errors,cleanup:true});
 },{browserName});
}
}
} catch(error) { failure=error; }
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if(output)fs.writeFileSync(output,JSON.stringify({result:failure?'fail':'pass',react:require('react/package.json').version,
 rows,failure:failure?.message,scope:'Actual installed React SSR, painted material fallback and hydration for Dialog/AlertDialog/Drawer with Heavy/Light Glass. Three engines by default; no React18 matrix, full-system or human acceptance.'},null,2)+'\n');
if(failure)throw failure;
console.log(`PASS overlay material SSR/hydration: ${rows.length} cases; no human acceptance inferred.`);
