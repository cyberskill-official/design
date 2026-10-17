import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;let cases=0,targets=0;
 const tap=async locator=>{await locator.scrollIntoViewIfNeeded();const r=await locator.boundingBox();assert(r?.width>=43.99&&r.height>=43.99,'44px target required');await locator.tap({position:{x:r.width/2,y:r.height-3}});targets++};
 for(const width of [320,390,1280])for(const language of ['English','Tiếng Việt'])for(const theme of ['light','dark']){
  const vn=language==='Tiếng Việt';
  for(const name of ['dashboard/Dashboard','settings/Settings','auth/Auth']){
   await page.setViewportSize({width,height:900});await page.goto(origin+'/templates/'+name+'.dc.html');
   await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]'));
   await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
   await page.evaluate(props=>window.__dcSetProps(window.__dcRootName(),props),{language,theme});await page.waitForTimeout(100);
   if(name.startsWith('dashboard')){
    await tap(page.getByRole('tab',{name:vn?/Danh sách/:/Table/}));await page.waitForSelector('table');
    assert.equal(await page.locator('table').count(),1);await tap(page.getByRole('tab',{name:vn?'Bảng':'Board',exact:true}));assert.equal(await page.locator('table').count(),0);
   }else if(name.startsWith('settings')){
    await tap(page.getByRole('tab',{name:vn?'Thông báo':'Notifications',exact:true}));
    const switches=page.getByRole('switch');assert.equal(await switches.count(),2);
    for(let i=0;i<2;i++){const sw=switches.nth(i),before=await sw.isChecked();await tap(sw.locator('..'));assert.equal(await sw.isChecked(),!before);}
    const collapse=page.locator('.cs-collapsible__trigger');await tap(collapse);assert.equal(await collapse.getAttribute('aria-expanded'),'true');await tap(collapse);assert.equal(await collapse.getAttribute('aria-expanded'),'false');
    const danger=page.getByRole('button',{name:vn?'Xoá không gian làm việc':'Delete workspace',exact:true});await danger.focus();await tap(danger);
    const dialog=page.getByRole('alertdialog');await dialog.waitFor();for(const button of await dialog.getByRole('button').all()){const r=await button.boundingBox();assert(r.width>=43.99&&r.height>=43.99)}
    await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);assert(await danger.evaluate(el=>el===document.activeElement));
   }else{
    for(const formState of ['default','loading','error','invalid'])for(const showBrandPanel of [false,true]){
     await page.evaluate(props=>window.__dcSetProps(window.__dcRootName(),props),{language,theme,formState,showBrandPanel});await page.waitForTimeout(100);
     const primary=page.locator('.cs-button--primary');assert.equal(await primary.isDisabled(),formState==='loading');
     assert.equal(await page.locator('input[aria-invalid="true"]').count(),formState==='invalid'?1:0);
     if(formState==='error')assert(await page.getByText(vn?'Đăng nhập thất bại':'Sign-in failed',{exact:true}).isVisible());
     const r=await primary.boundingBox();assert(r.width>=44&&r.height>=44);targets++;
    }
   }
   cases++;
  }
 }
 console.log(JSON.stringify({browserName,cases,targets}));
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true}});
