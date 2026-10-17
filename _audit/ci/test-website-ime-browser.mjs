import {readFileSync,writeFileSync} from 'node:fs';import {join} from 'node:path';import {createRequire} from 'node:module';import {pathToFileURL,fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),require=createRequire(join(root,'package.json')),{transformSync}=require('esbuild'),{withBrowserFixture}=await import(pathToFileURL(join(root,'_audit/ci/lib/browser-fixture.mjs')));
const compiled=transformSync(readFileSync(join(root,'ui_kits/website/Website.jsx'),'utf8'),{loader:'jsx',jsxFactory:'React.createElement',jsxFragment:'React.Fragment'}).code,copy=readFileSync(join(root,'ui_kits/website/copy.js'),'utf8'),css=readFileSync(join(root,'ui_kits/website/site.css'),'utf8'),rows=[];
const check=(browser,name,actual,expected)=>rows.push({browser,name,actual,expected,pass:JSON.stringify(actual)===JSON.stringify(expected)});
for(const browser of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 await page.evaluate(({compiled,copy})=>{(0,eval)(copy);(0,eval)(compiled);},{compiled,copy});await page.addStyleTag({content:css});
 for(const target of ['hero','chat'])for(const mode of ['composing','legacy229','plain']){
  await page.evaluate(key=>renderFixture(React.createElement(window.Website,{key})),target+mode);
  await page.locator('.wish input').waitFor();
  if(target==='chat')await page.locator('.hdr-side button').last().click();
  const input=page.locator(target==='hero'?'.wish input':'.chat-f input');await input.fill('Điều ước đang gõ');
  await input.evaluate((el,mode)=>el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:mode==='legacy229'?229:13,which:mode==='legacy229'?229:13,isComposing:mode==='composing',bubbles:true})),mode);
  const submits=mode==='plain';
  if(target==='hero'){
   check(browser,target+' '+mode+' chat visibility',await page.locator('.chat').count(),submits?1:0);
   check(browser,target+' '+mode+' wish retained',await page.locator('.wish input').inputValue(),'Điều ước đang gõ');
  }else{
   check(browser,target+' '+mode+' user messages',await page.locator('.msg.me').count(),submits?1:0);
   check(browser,target+' '+mode+' draft state',await input.inputValue(),submits?'':'Điều ước đang gõ');
  }
 }
},{browserName:browser,contextOptions:{viewport:{width:1280,height:900}}});
const failures=rows.filter(x=>!x.pass).length,report={recordedAt:new Date().toISOString(),cases:rows.length,failures,exitCode:failures?1:0,rows,scope:'Finite synthetic composition Enter and legacy keyCode 229 controls for two home-page inputs in three browser engines; ordinary Enter stays supported. Does not establish real OS IME, candidate selection, assistive speech or operator acceptance.'};console.log(JSON.stringify({cases:rows.length,failures}));process.exitCode=failures?1:0;
