import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {strings} from '../../components/_i18n/strings.js';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
  for(const tag of ['jam','vif','ena','jam-JM','vif-CM','ena-PG','ja-JP','vi-VN','en-US']) {
    const table=tag==='ja-JP'?strings.Pagination.ja:tag==='vi-VN'?strings.Pagination.vi:strings.Pagination.en;
    for(const explicit of [true,false]) {
      await page.evaluate(({tag,explicit})=>{
        renderFixture(null); // Fresh case: previous live DOM mutation is not a new React prop.
        document.documentElement.lang='vi';window.localeChanges=[];
        renderFixture(React.createElement('section',{lang:tag,id:'locale-host'},React.createElement(CS.Pagination,{page:1,pageCount:3,lang:explicit?tag:undefined,onChange:value=>localeChanges.push(value)})));
      },{tag,explicit});
      const nav=page.locator('nav.cs-pagination'), next=nav.locator('button').last();
      try {await page.waitForFunction(label=>document.querySelector('nav.cs-pagination')?.getAttribute('aria-label')===label,table.label,{timeout:2000});}
      catch(error) {throw new Error(`${tag} explicit=${explicit}: expected ${table.label}, actual ${await nav.getAttribute('aria-label')}`,{cause:error});}
      assert.equal(await nav.getAttribute('aria-label'),table.label,tag+': navigation label');
      assert.equal(await next.getAttribute('aria-label'),table.next,tag+': next label');
      await next.click();assert.deepEqual(await page.evaluate(()=>localeChanges),[2],tag+': actual page callback');
      await page.locator('#locale-host').evaluate(el=>el.lang='vi');
      const expected=explicit?table.next:strings.Pagination.vi.next;
      await page.waitForFunction(expected=>document.querySelector('nav.cs-pagination button:last-child')?.getAttribute('aria-label')===expected,expected);
    }
  }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS locale primary browser: 9 tags x explicit/inherited scopes; navigation names, activation and live ancestor changes');
