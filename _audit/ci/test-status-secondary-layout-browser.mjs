import {join} from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';import {writeFileSync} from 'node:fs';
const root=fileURLToPath(new URL('../../',import.meta.url));const {withBrowserFixture}=await import(pathToFileURL(join(root,'_audit/ci/lib/browser-fixture.mjs')));const rows=[];
for(const browser of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 for(const name of ['login','settings','project']){
  await page.goto(new URL(`/ui_kits/status-hub/${name}.html`,page.url()).href);
  for(const [width,height] of [[320,568],[320,900],[390,844],[1280,900]])for(const theme of ['light','dark'])for(const lang of ['en','vi']){
   await page.setViewportSize({width,height});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   if(await page.locator('html').getAttribute('lang')!==lang){if(name==='settings')await page.locator('#panel-profile select').last().selectOption({label:lang==='vi'?'Tiếng Việt':'English'});else{const t=page.locator('[data-preview-language-toggle]');if(await t.count())await t.click();}}
   await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   if(name==='settings'){
    const tabs=page.locator('[role=tab]');await tabs.first().focus();await tabs.first().press('End');
    const ownership=await tabs.last().evaluate(el=>{const host=el.closest('[role=tablist]'),r=el.getBoundingClientRect(),h=host.getBoundingClientRect();return {scope:document.documentElement.lang,active:document.activeElement===el,overflow:getComputedStyle(host).overflowX,contained:r.left>=h.left-1&&r.right<=h.right+1,hostContained:h.left>=-1&&h.right<=innerWidth+1};});
    rows.push({browser,page:name,width,height,theme,lang,name:'tab scroll ownership and native End focus',ownership,pass:ownership.active&&ownership.contained&&ownership.hostContained&&ownership.overflow==='auto'});
    await tabs.last().press('Home');
   }
   const geometry=await page.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    const nodes=[...document.querySelectorAll('button,input,select,.state-bar,.pd-actions,.task,.pd-stats,.hd-id,.danger')].filter(e=>e.getBoundingClientRect().width>0 && e.getAttribute('role')!=='tab').map(e=>({tag:e.tagName,id:e.id,class:e.className,box:box(e)}));
    const bar=document.querySelector('.state-bar'),theme=document.querySelector('#themeToggle');let overlap=false;if(bar&&theme){const a=box(bar),b=box(theme);overlap=Math.min(a.right,b.right)>Math.max(a.x,b.x)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y)+1;}
    return {scope:document.documentElement.lang,width:innerWidth,scrollWidth:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),nodes,overlap};
   });
   rows.push({browser,page:name,width,height,theme,lang,name:'body and actual language scope',geometry,pass:geometry.scrollWidth<=width+1&&geometry.scope===lang});
   rows.push({browser,page:name,width,height,theme,lang,name:'control/row horizontal containment',geometry,pass:geometry.nodes.every(x=>x.box.x>=-1&&x.box.right<=width+1)});
   if(name==='login')rows.push({browser,page:name,width,height,theme,lang,name:'demo state and theme controls do not overlap',geometry,pass:!geometry.overlap});
  }
 }
},{browserName:browser});
const failures=rows.filter(x=>!x.pass).length;const report={recordedAt:new Date().toISOString(),cases:rows.length,failures,exitCode:failures?1:0,rows,scope:'Raw static Status Hub finite horizontal containment and Login fixed-control overlap in three engines at 320x568/320x900/390x844/1280x900, light/dark and actual EN/VI. Not all element/density/contrast, IME, speech, device or operator acceptance.'};if(process.env.CS_STATUS_SECONDARY_REPORT)writeFileSync(process.env.CS_STATUS_SECONDARY_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cases:rows.length,failures}));process.exitCode=failures?1:0;
