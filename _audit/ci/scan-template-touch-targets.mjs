// Diagnostic default-state scan. Small boxes are candidates, not automatic defects:
// hidden skip links and proxy label/hit areas require classification. No pass verdict.
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {writeFileSync} from 'node:fs';
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if(!output)throw Error('Usage: node _audit/ci/scan-template-touch-targets.mjs --output=<json path>');
await withBrowserFixture(async page=>{
 await page.addScriptTag({url:new URL('/_audit/lib/frame-probe.js',page.url()).href});
 const result=await page.evaluate(async()=>{
  const manifest=await(await fetch('/_ds_manifest.json')).json(),rows=[];
  for(const template of manifest.templates){
   const result=await csProbeFrame('/'+template.entryPath,{parent:document.body,width:390,measure:async({doc,win,wait})=>{
    const style=doc.createElement('style');style.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';doc.head.append(style);await wait(100);
    const targets=[];
    for(const el of doc.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button],[role=option],[role=tab],[role=menuitem],[role=slider],[role=separator][tabindex],[contenteditable=true]')){
     if(el.disabled||el.closest('[inert]'))continue;
     let target=el;if(el.labels?.length){const a=el.getBoundingClientRect(),b=el.labels[0].getBoundingClientRect();if(b.width>=a.width&&b.height>=a.height)target=el.labels[0]}
     const r=target.getBoundingClientRect(),css=win.getComputedStyle(target);if(!r.width||!r.height||css.display==='none'||css.visibility==='hidden')continue;
     targets.push({tag:el.tagName,cls:el.className,text:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,70),width:r.width,height:r.height,fail:r.width<43.99||r.height<43.99,html:el.outerHTML.slice(0,240)});
    }
    return {targets};
   }});rows.push({name:template.name,path:template.entryPath,...result});
  }
  return rows;
 });writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({templates:result.length,errors:result.filter(row=>row.error).length,targets:result.reduce((n,row)=>n+(row.targets?.length||0),0),smallBoxCandidates:result.reduce((n,row)=>n+(row.targets?.filter(t=>t.fail).length||0),0),output}));
},{contextOptions:{viewport:{width:390,height:900},hasTouch:true,isMobile:true}});
