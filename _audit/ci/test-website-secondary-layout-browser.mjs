import {join} from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';import {writeFileSync} from 'node:fs';
const root=fileURLToPath(new URL('../../',import.meta.url));const {withBrowserFixture}=await import(pathToFileURL(join(root,'_audit/ci/lib/browser-fixture.mjs')));const rows=[];
for(const browser of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 for(const name of ['work','careers']){
  await page.goto(new URL(`/ui_kits/website/${name}.html`,page.url()).href);
  for(const width of [320,390,1280])for(const theme of ['light','dark'])for(const lang of ['en','vi']){
   await page.setViewportSize({width,height:900});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('#langToggle').click();
   await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const geometry=await page.evaluate(()=>{const vw=innerWidth;return {width:vw,scope:document.documentElement.lang,scrollWidth:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),boxes:[...document.querySelectorAll('.hdr-side .mini,.case,.role,.results,.vals,.ft-in')].map(e=>{const r=e.getBoundingClientRect();return {class:e.className,x:r.x,right:r.right,width:r.width,contained:r.left>=-1&&r.right<=vw+1};})};});
   rows.push({browser,page:name,width,theme,lang,name:'body horizontal containment',geometry,pass:geometry.scrollWidth<=width+1&&geometry.scope===lang});rows.push({browser,page:name,width,theme,lang,name:'header/cards/metrics/footer containment',geometry,pass:geometry.boxes.every(x=>x.contained)});
  }
 }
},{browserName:browser});
const failures=rows.filter(x=>!x.pass).length;const report={recordedAt:new Date().toISOString(),cases:rows.length,failures,exitCode:failures?1:0,rows,scope:'Raw Work/Careers finite horizontal body/control/card/footer containment at 320/390/1280px, light/dark and actual EN/VI scope in three engines; no all element/density, text contrast, speech or visual/operator acceptance.'};if(process.env.CS_WEBSITE_SECONDARY_REPORT)writeFileSync(process.env.CS_WEBSITE_SECONDARY_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cases:rows.length,failures}));process.exitCode=failures?1:0;
