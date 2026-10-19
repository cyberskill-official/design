import {join} from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';import {writeFileSync} from 'node:fs';
const root=fileURLToPath(new URL('../../',import.meta.url));const {withBrowserFixture}=await import(pathToFileURL(join(root,'_audit/ci/lib/browser-fixture.mjs')));const rows=[];const scenarios=[];
await Promise.all(['chromium','firefox','webkit'].map(browser=>withBrowserFixture(async page=>{
 const bRows=[],bScenarios=[],chatUrl=new URL('/ui_kits/website/chat.html',page.url()).href;
 for(const width of [320,390,820,821,1280]){
  await page.setViewportSize({width,height:900});await page.goto(chatUrl);await page.locator('.lumi-page').waitFor();
  for(const theme of ['light','dark'])for(const lang of ['en','vi']){
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('.lumi-language').click();
   await page.evaluate(()=>document.fonts.ready);const actual=await page.evaluate(()=>({lang:document.documentElement.lang,theme:document.documentElement.dataset.theme}));if(actual.lang!==lang||actual.theme!==theme)throw new Error('Wrong declared scope');const scenario={browser,width,theme,lang};bScenarios.push(scenario);const check=(name,actual,expected)=>bRows.push({...scenario,name,actual,expected,pass:JSON.stringify(actual)===JSON.stringify(expected)});
   const controls=page.locator('.lumi-new button:visible,.lumi-mobile-new:visible');const count=await controls.count();check('exactly one visible New wish control',count,1);if(count!==1)continue;
   const reset=controls.first(),input=page.locator('.cs-prompt__field');const box=await reset.boundingBox();check('reset target is contained and at least44px high',!!box&&box.x>=0&&box.x+box.width<=width+1&&box.y>=0&&box.y+box.height<=900&&box.height>=44,true);
   await input.fill('Pending caller wish');await page.locator('.cs-prompt__bar button').click();await page.locator('.cs-typing').waitFor();await input.fill('Unsent caller draft');await reset.focus();await reset.press('Enter');
   check('native Enter clears caller history',await page.locator('.cs-chat-msg--user').count(),0);check('reset clears typing',await page.locator('.cs-typing').count(),0);check('reset clears draft',await input.inputValue(),'');check('reset focuses composer',await input.evaluate(el=>document.activeElement===el),true);
   await page.waitForTimeout(1400);check('cancelled reply cannot enter reset conversation',await page.locator('.lumi-answer-card').count(),0);
  }
 }
 rows.push(...bRows);scenarios.push(...bScenarios);
},{browserName:browser,contextOptions:{viewport:{width:1280,height:900}}})));
const failures=rows.filter(r=>!r.pass).length;const report={recordedAt:new Date().toISOString(),cases:rows.length,scenarios:scenarios.length,failures,exitCode:failures?1:0,rows,scope:'Finite keyboard-operated New wish availability,44px containment, draft/caller/typing reset, composer focus and cancellation at320/390/820/821/1280x900, EN/VI light/dark in three engines. Hidden reset controls skip dependent state operations and remain explicit failures. Not real-touch/IME/speech or all conversation geometry.'};if(process.env.CS_CHAT_MOBILE_REPORT)writeFileSync(process.env.CS_CHAT_MOBILE_REPORT,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cases:rows.length,scenarios:scenarios.length,failures}));process.exitCode=failures?1:0;
