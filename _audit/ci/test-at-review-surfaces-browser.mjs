import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const failures=[];
await withBrowserFixture(async page=>{
 const base=new URL(page.url()).origin;
 const check=async(name,fn)=>{try{await fn();console.log('PASS '+name)}catch(e){failures.push(name+': '+e.message)}};
 await check('DataGrid contextual selection',async()=>{
  await page.evaluate(()=>renderFixture(React.createElement(CS.DataGrid,{lang:'en',selectable:true,rowKey:'id',columns:[{key:'name',header:'Name'}],rows:[{id:'a',name:'Alpha'},{id:'b',name:'Beta'}]})));
  assert.equal(await page.getByRole('checkbox',{name:'Select row: Alpha',exact:true}).count(),1);assert.equal(await page.getByRole('checkbox',{name:'Select row: Beta',exact:true}).count(),1);
 });
 await check('Atomic View controls remain usable',async()=>{
  await page.goto(base+'/guidelines/atomic-view.html');await page.getByRole('button',{name:'Open command palette',exact:true}).waitFor();
  assert.equal(await page.locator('[role="dialog"][aria-modal="true"]').count(),0);
  await page.getByRole('button',{name:'Open command palette',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('[role="dialog"][aria-modal="true"]').count(),0);
 });
 await check('Auth single main and skip progression',async()=>{
  await page.goto(base+'/templates/auth/Auth.dc.html');await page.locator('input[type="email"]').waitFor();
  assert.equal(await page.locator('#main').count(),1);assert.equal(await page.locator('main,[role="main"]').count(),1);
  await page.locator('.cs-skip').focus();await page.keyboard.press('Enter');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.type),'email');
 });
 await check('Website index skip stays on page',async()=>{
  await page.goto(base+'/ui_kits/website/index.html');await page.locator('.cs-skip').waitFor();const url=page.url();await page.locator('.cs-skip').focus();await page.keyboard.press('Enter');assert.equal(page.url(),url);assert.equal(await page.evaluate(()=>document.activeElement.id),'main');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.matches('.cs-skip')),false);
 });
 await check('Status settings panels match tabs',async()=>{
  await page.goto(base+'/ui_kits/status-hub/settings.html');await page.getByRole('tab',{name:'Profile',exact:true}).focus();await page.keyboard.press('ArrowRight');await page.getByRole('tabpanel',{name:'Notifications',exact:true}).waitFor();assert.equal(await page.getByRole('tabpanel').count(),1);await page.getByRole('switch',{name:'Release notes'}).check();
 });
 await check('Status lens panel association',async()=>{
  await page.goto(base+'/ui_kits/status-hub/index.html');await page.locator('[role="tab"]').first().waitFor();for(const tab of await page.locator('[role="tab"]').all()){await tab.click();const id=await tab.getAttribute('id');assert.equal(await page.locator('#lens-panel').getAttribute('aria-labelledby'),id);assert.equal(await tab.getAttribute('aria-controls'),'lens-panel');}
 });
 await check('Vietnamese image authoring labels',async()=>{
  await page.goto(base+'/templates/marketing-page/MarketingPage.dc.html');await page.locator('image-slot').waitFor();await page.waitForFunction(()=>typeof __dcSetProps==='function');await page.evaluate(()=>__dcSetProps(__dcRootName(),{language:'Tiếng Việt'}));await page.waitForFunction(()=>document.querySelector('image-slot')?.getAttribute('lang')==='vi');
  const labels=await page.locator('image-slot').evaluate(el=>({placeholder:el.getAttribute('placeholder'),replace:el.shadowRoot.querySelector('[data-act="replace"]').textContent,edit:el.shadowRoot.querySelector('[data-act="edit"]').textContent}));assert.deepEqual(labels,{placeholder:'Thả ảnh bìa (không bắt buộc)',replace:'Thay ảnh',edit:'Chỉnh sửa'});
 });
}, {browserName:process.env.CS_BROWSER || 'chromium'});
assert.deepEqual(failures,[]);
