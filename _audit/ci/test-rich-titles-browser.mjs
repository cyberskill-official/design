import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 const results=[];
 for(const [name,role] of [['Anchor','navigation'],['Drawer','dialog'],['Popconfirm','alertdialog']]){
  await page.evaluate(name=>renderFixture(React.createElement(CS[name],{title:React.createElement('span',null,'Rich ',React.createElement('em',null,'title')),items:[],open:true,trigger:React.createElement('button',null,'Open confirmation')})),name);
  if(name==='Popconfirm')await page.getByRole('button',{name:'Open confirmation'}).click();
  results.push([name,await page.getByRole(role,{name:'Rich title',exact:true}).count()]);
  await page.evaluate(()=>renderFixture(null));
 }
 assert.deepEqual(results,[['Anchor',1],['Drawer',1],['Popconfirm',1]],'Supported ReactNode titles must name their surface');
 await page.evaluate(()=>renderFixture(React.createElement(CS.Drawer,{open:true,lang:'en'})));
 assert.ok(await page.getByRole('dialog').getAttribute('aria-label'),'Untitled drawer keeps localized fallback');
 await page.evaluate(()=>renderFixture(React.createElement(CS.Anchor,{items:[]})));
 assert.equal(await page.getByRole('navigation').getAttribute('aria-labelledby'),null,'Absent optional title creates no dangling reference');
 console.log('PASS rich titles: Anchor, Drawer, Popconfirm and absent-title fallbacks');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
