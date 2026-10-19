import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {inspectCoarseHitRegion} from './lib/coarse-hit-region.mjs';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const title=p=>read(p).toString().match(/^# (.*)$/m)[1].replaceAll('`','');
const headers=Object.fromEntries(JSON.parse(read('vercel.json')).headers.find(r=>r.source==='/(.*)').headers.map(({key,value})=>[key,value]));
const report={scope:'Actual 46 EN/VI reader routes per coarse context; 320/390/1280px, light/dark, comfortable/compact in each engine. Every sidebar control, active navigation link, article link and full CyberSkill search-result set has 44px box/clipped floor and existing integer CSS 42px inset-disk ownership checks after scrolling. Native pointer/keyboard route activation, Tab/Option-Tab focus and intercepted native center event targeting are separate checks. No continuous/subpixel guard ownership, OS finger adjustment, external link correctness, arbitrary Markdown or AT/human acceptance.',sourceHashes:{'docs/viewer.html':sha(read('docs/viewer.html'))},rows:[],nativeCenters:0,routes:0};
await Promise.all((process.env.CS_TEST_BROWSER?[process.env.CS_TEST_BROWSER]:['chromium','firefox','webkit']).map(async browserName=>{
 await withBrowserFixture(async page=>{
  const bRows=[];let bNativeCenters=0,bRoutes=0;
  const base=new URL(page.url()).origin;
  await page.route('**/docs/viewer.html*',async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),...headers}})});
  const ready=()=>page.waitForFunction(()=>document.querySelector('#doc')?.dataset.state==='ready'&&document.querySelector('#err').hidden);
  const measure=async(selector,context)=>{
   const count=await page.locator(selector).count();
   for(let index=0;index<count;index++){
    const target=page.locator(selector).nth(index);
    // Capture only event targeting; prevent document links from opening external
    // destinations. Actual navigation behavior is exercised independently below.
    const result=await target.evaluate((target)=>{
     target.scrollIntoView({block:'center',inline:'center',behavior:'instant'});
     const region=csInspectCoarseHitRegion(target);
     window.csTouchCenter=null;
     const observe=event=>{event.preventDefault();event.stopImmediatePropagation();window.csTouchCenter=target===event.target||target.contains(event.target);};
     document.addEventListener('click',observe,{capture:true,once:true});
     return {id:target.id,href:target.getAttribute('href'),text:target.textContent.slice(0,90),region};
    });
    const row={...context,selector,index,...result};bRows.push(row);
    assert.equal(result.region.pass,true,JSON.stringify(row));
    await page.mouse.click(result.region.chosenCenter.x,result.region.chosenCenter.y);
    assert.equal(await page.evaluate(()=>csTouchCenter),true,JSON.stringify(row));bNativeCenters++;
   }
  };
  await page.goto(base+'/docs/viewer.html?touch=1#touch-reset');await ready();
  // Script bindings live in the actual reader document, not the fixture page.
  await page.addScriptTag({content:'window.csInspectCoarseHitRegion='+inspectCoarseHitRegion.toString()+';'});
  assert.equal(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),true);
  for(const width of [320,390,1280])for(const theme of ['light','dark'])for(const density of ['comfortable','compact']){
   await page.setViewportSize({width,height:900});
   await page.evaluate(({theme,density})=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.csDensity=density},{theme,density});
   await page.evaluate(()=>document.fonts.ready);
   for(const language of ['en','vi']){
    await page.getByRole('button',{name:language.toUpperCase(),exact:true}).click();await ready();
    const context={browserName,width,theme,density,language};
    assert.equal(await page.locator('html').getAttribute('lang'),language);
    const paths=await page.locator('#navlinks a[data-p]').evaluateAll(nodes=>nodes.map(n=>n.dataset.p));assert.equal(paths.length,23);
    await measure('.langtog button,#docsearch,#navlinks a[data-p]',{...context,state:'sidebar'});
    // WebKit's native link-navigation convention is Option-Tab (verified
    // by the actual reader probe); do not force a browser setting or tabindex.
    await page.locator('#docsearch').focus();await page.keyboard.press(browserName==='webkit'?'Alt+Tab':'Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.p),paths[0]);
    assert.equal(await page.evaluate(()=>{const css=getComputedStyle(document.activeElement);return css.outlineStyle!=='none'||css.boxShadow!=='none'}),true,'Keyboard focus must remain visible');
    for(const [index,path]of paths.entries()){
     const fetched=language==='vi'&&path.startsWith('docs/')?'docs/vi/'+path.slice(5):path;
     const responsePromise=page.waitForResponse(r=>new URL(r.url()).pathname==='/'+fetched);
     const link=page.locator(`#navlinks a[data-p="${path}"]`);
     if(index%2===0)await link.click();else{await link.focus();await page.keyboard.press('Enter')}
     const response=await responsePromise;assert.equal(response.status(),200,fetched);assert.equal(sha(await response.body()),sha(read(fetched)),fetched);
     await ready();assert.equal(await page.locator('#doc h1').innerText(),title(fetched));
     assert.equal(await page.locator('#doc').getAttribute('lang'),path.startsWith('docs/')?language:'en');
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,'Reader must not cause document overflow');
     await measure(`#navlinks a[data-p="${path}"],#doc a[href]`,{...context,state:'article',path,fetched});bRoutes++;
    }
    await page.locator('#docsearch').fill('CyberSkill');
    await page.waitForFunction(()=>document.querySelector('.searchres')?.textContent.includes('CyberSkill'));
    assert(await page.locator('.searchhit').count()>1);
    await measure('.langtog button,#docsearch,.searchhit',{...context,state:'search'});
    await page.locator('#docsearch').fill('');await page.locator('#navlinks a[data-p]').first().waitFor();
    console.log(`Reader touch ${browserName}: ${width}px ${theme} ${density} ${language} complete`);
   }
  }
  report.rows.push(...bRows);report.nativeCenters+=bNativeCenters;report.routes+=bRoutes;
 },{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
 // Fine-pointer controls preserve the pre-repair source dimensions. The new
 // rules are conditional; do not make desktop prose/navigation artificially tall.
 await withBrowserFixture(async page=>{
  const base=new URL(page.url()).origin;await page.goto(base+'/docs/viewer.html');await page.waitForFunction(()=>document.querySelector('#doc')?.dataset.state==='ready');
  assert.equal(await page.evaluate(()=>matchMedia('(pointer:fine)').matches),true);
  assert.equal(await page.locator('#lang-en').evaluate(el=>el.getBoundingClientRect().height),27);
  assert.equal(await page.locator('#docsearch').evaluate(el=>el.getBoundingClientRect().height),36.75);
  assert.equal(await page.locator('#navlinks a[data-p="README.md"]').evaluate(el=>el.getBoundingClientRect().height),33.5);
  assert.equal(await page.locator('#doc a[href]').first().evaluate(el=>getComputedStyle(el).display),'inline');
 },{browserName});
 console.log(`PASS ${browserName} reader touch: 552 source-bound route activations; complete sidebar/article/search target geometry and clipped ownership, native center targeting, keyboard focus and unchanged fine-pointer control dimensions.`);
}));
const output=process.argv.find(arg=>arg.startsWith('--evidence='))?.slice(11);
if(output)writeFileSync(output,output.endsWith('.gz')?gzipSync(JSON.stringify(report)):JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({routes:report.routes,targets:report.rows.length,nativeCenters:report.nativeCenters,scope:report.scope}));
