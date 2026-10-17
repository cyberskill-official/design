import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>renderFixture(React.createElement('section',{lang:'vi'},React.createElement(CS.FormFieldArray,{name:'rows'}))));
 await page.waitForFunction(()=>document.querySelector('[role=alert]')?.textContent==='FormFieldArray phải được đặt bên trong Form');
 await page.locator('section').evaluate(el=>el.lang='en');
 await page.waitForFunction(()=>document.querySelector('[role=alert]')?.textContent==='FormFieldArray must be used inside Form');
 await page.evaluate(()=>renderFixture(React.createElement('section',{key:'forms',lang:'vi'},
  React.createElement(CS.Form,{initialValues:{rows:[]}},React.createElement(CS.FormFieldArray,{name:'rows'},()=>null)),
  React.createElement(CS.FormWizard,{steps:[{id:'one',title:'One',render:()=>null},{id:'two',title:'Two',render:()=>null}]}))));
 await page.getByRole('button',{name:'Thêm dòng',exact:true}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Thêm dòng',exact:true}).count(),1);
 await page.getByRole('button',{name:'Tiếp',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Hoàn tất',exact:true}).count(),1);
 assert.equal(await page.getByRole('button',{name:'Quay lại',exact:true}).count(),1);
 await page.locator('section').evaluate(el=>el.lang='en');
 await page.getByRole('button',{name:'Finish',exact:true}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Add row',exact:true}).count(),1);
 assert.equal(await page.getByRole('button',{name:'Back',exact:true}).count(),1);
 await page.evaluate(()=>renderFixture(React.createElement('section',{key:'disclosure',lang:'vi'},
  React.createElement(CS.AIDisclosureBadge,{sources:['Reference']}),React.createElement(CS.FormWizard,{steps:[{render:()=>null}]}))));
 await page.getByRole('button',{name:'Có AI hỗ trợ',exact:true}).waitFor();
 await page.getByRole('button',{name:'Có AI hỗ trợ',exact:true}).click();
 assert.equal(await page.locator('.cs-ai-disclosure__details').textContent(),'Nội dung này được tạo hoặc chuyển đổi với sự hỗ trợ của AI.');
 assert.equal(await page.locator('.cs-ai-disclosure__sources').textContent(),'Nguồn: Reference');
 assert.ok((await page.locator('.cs-form-wizard__steps').textContent()).includes('Bước 1'));
 await page.locator('section').evaluate(el=>el.lang='en');
 await page.getByRole('button',{name:'AI assisted',exact:true}).waitFor();
 assert.equal(await page.locator('.cs-ai-disclosure__sources').textContent(),'Sources: Reference');
 assert.ok((await page.locator('.cs-form-wizard__steps').textContent()).includes('Step 1'));
 console.log('PASS Form locale: missing-context alert, array action, wizard actions and live EN/VI changes');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
