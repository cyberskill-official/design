import {writeFileSync} from 'node:fs';import {join} from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));const {withBrowserFixture}=await import(pathToFileURL(join(root,'_audit/ci/lib/browser-fixture.mjs')));const rows=[];
for(const browser of ['chromium','firefox','webkit']) await withBrowserFixture(async page=>{
 await page.goto(new URL('/ui_kits/website/chat.html',page.url()).href);await page.locator('.lumi-page').waitFor();
 for(const width of [320,390,1280])for(const theme of ['light','dark'])for(const lang of ['en','vi']){
  await page.setViewportSize({width,height:900});await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  const toggle=page.locator('.lumi-language');if(await toggle.count() && await page.locator('html').getAttribute('lang')!==lang)await toggle.click();
  await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const geometry=await page.evaluate(()=>{
   const vw=innerWidth,vh=innerHeight;const boxes=[...document.querySelectorAll('.lumi-compose textarea,.lumi-compose button,.lumi-language,.lumi-top')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,class:e.className,x:r.x,y:r.y,w:r.width,h:r.height,contained:r.x>=-1&&r.right<=vw+1&&r.y>=-1&&r.bottom<=vh+1};});
   return {body:document.body.scrollWidth,html:document.documentElement.scrollWidth,vw,vh,boxes};
  });
  rows.push({browser,width,theme,lang,name:'body horizontal containment',actual:Math.max(geometry.body,geometry.html)<=width+1,pass:Math.max(geometry.body,geometry.html)<=width+1,geometry});
  rows.push({browser,width,theme,lang,name:'header/composer control containment',actual:geometry.boxes.every(x=>x.contained),pass:geometry.boxes.every(x=>x.contained),geometry});
 }
},{browserName:browser,contextOptions:{viewport:{width:1280,height:900}}});
const failures=rows.filter(r=>!r.pass).length;const report={recordedAt:new Date().toISOString(),cases:rows.length,failures,exitCode:failures?1:0,rows,scope:'Raw standalone Chat finite initial viewport containment at 320/390/1280x900, light/dark, EN/VI across three engines. Not all routes, conversation lengths, touch/IME/speech or operator acceptance.'};if(process.env.CS_CHAT_REPORT)writeFileSync(process.env.CS_CHAT_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cases:rows.length,failures}));process.exitCode=failures?1:0;
