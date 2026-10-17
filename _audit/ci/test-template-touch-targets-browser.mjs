// Whole manifest coarse-pointer geometry, declared axes, and export-menu states.
// Native activation is covered separately; this verifies effective layout boxes.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const propStates=process.argv.includes('--prop-states');
const allStates=process.argv.includes('--all-states');
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
await withBrowserFixture(async page=>{
 await page.addScriptTag({url:new URL('/_audit/lib/frame-probe.js',page.url()).href});
 const rows=await page.evaluate(async({propStates,allStates})=>{
  const manifest=await(await fetch('/_ds_manifest.json')).json(),rows=[];
  for(const template of manifest.templates){
   const result=await csProbeFrame('/'+template.entryPath,{parent:document.body,width:390,timeout:300000,measure:async({doc,win,wait,rootName,props})=>{
    const style=doc.createElement('style');style.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';doc.head.append(style);
    const choices=key=>props[key]?.options||[props[key]?.default];
    const stateProps=Object.entries(props).filter(([key,value])=>!['language','theme','element'].includes(key)&&['boolean','enum'].includes(value.editor));
    if(propStates&&!allStates&&!stateProps.length)return {scenarios:0,measurements:[],failures:[],skip:'No declared non-axis enum/boolean props'};
    const variants=(propStates||allStates)?stateProps.reduce((all,[key,value])=>all.flatMap(variant=>(value.editor==='boolean'?[false,true]:value.options).map(option=>({...variant,[key]:option}))),[{}]):[{}];
    const measurements=[],failures=[];let scenarios=0;
    const measure=(scenario,state)=>{
     for(const el of doc.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button],[role=option],[role=tab],[role=menuitem],[role=slider],[role=separator][tabindex],[contenteditable=true]')){
      if(el.disabled||el.closest('[inert]'))continue;
      let target=el;if(el.labels?.length){const a=el.getBoundingClientRect(),b=el.labels[0].getBoundingClientRect();if(b.width>=a.width&&b.height>=a.height)target=el.labels[0]}
      const css=win.getComputedStyle(target);let r=target.getBoundingClientRect();if(!r.width||!r.height||css.display==='none'||css.visibility==='hidden')continue;
      const skip=el.matches('a.cs-skip');if(skip){el.focus();r=el.getBoundingClientRect()}
      const row={...scenario,viewport:scenario.width,state,tag:el.tagName,text:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,70),width:r.width,height:r.height,focusedSkip:skip};
      measurements.push(row);if(r.width<43.99||r.height<43.99)failures.push(row);
      if(skip)el.blur();
     }
    };
    for(const width of [320,390,1280]){
     win.frameElement.style.width=width+'px';
     for(const language of choices('language'))for(const theme of choices('theme'))for(const element of choices('element'))for(const variant of variants){
      const overrides=Object.fromEntries(Object.entries({language,theme,element,...variant}).filter(([,v])=>v!==undefined));
      win.__dcSetProps(rootName,overrides);await wait(20);
      await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
      if(overrides.formState!==undefined){
       const primary=doc.querySelector('.cs-button--primary');
       if(!primary||primary.disabled!==(overrides.formState==='loading'))throw Error('Auth state did not settle: '+overrides.formState);
      }
      const scenario={width,...overrides};scenarios++;measure(scenario,'default');
      const trigger=doc.querySelector('[data-cs-export="trigger"]');
      if(trigger){trigger.click();if(trigger.getAttribute('aria-expanded')!=='true')throw Error('Export menu failed to open');measure(scenario,'export-menu');trigger.click();}
     }
    }
    return {scenarios,measurements,failures,stateProps:stateProps.map(([key])=>key),variants};
   }});rows.push({name:template.name,path:template.entryPath,...result});
  }
  return rows;
 },{propStates,allStates});
 if(output)writeFileSync(output,output.endsWith('.gz')?gzipSync(JSON.stringify({browserName,propStates,allStates,rows})):JSON.stringify({browserName,propStates,allStates,rows},null,2)+'\n');
 const errors=rows.filter(row=>row.error),failures=rows.flatMap(row=>(row.failures||[]).map(f=>({path:row.path,...f})));
 console.log(JSON.stringify({browserName,propStates,allStates,templates:rows.length,scenarios:rows.reduce((n,r)=>n+(r.scenarios||0),0),measurements:rows.reduce((n,r)=>n+(r.measurements?.length||0),0),errors,failures:failures.slice(0,25),failureCount:failures.length,output}));
 assert.equal(rows.length,85);assert.equal(errors.length,0,'Template load/measurement errors');assert.equal(failures.length,0,'Template coarse targets below 44px');
},{browserName,contextOptions:{viewport:{width:1400,height:1000},hasTouch:true}});
