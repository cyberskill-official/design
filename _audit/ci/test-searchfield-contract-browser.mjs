import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
  async function check(name,run){try{await run();console.log('PASS '+name)}catch(e){failures.push(name+': '+e.message)}}
  for(const mode of ['disabled','readOnly'])await check('SearchField '+mode+' clear action',async()=>{
    await page.evaluate(mode=>{
      window.changes=[];window.clears=0;
      window.drawSearch=(locked,value='query')=>renderFixture(React.createElement(CS.SearchField,{key:mode,lang:'en',value,[mode]:locked,onChange:v=>changes.push(v),onClear:()=>clears++}));
      drawSearch(true);
    },mode);
    const clear=page.locator('.cs-search__clear');
    assert.equal(await clear.isDisabled(),true);
    await clear.evaluate(b=>b.click());
    assert.deepEqual(await page.evaluate(()=>[changes,clears]),[[],0]);
    await page.evaluate(()=>drawSearch(true,'parent update'));
    assert.equal(await page.getByRole('searchbox').inputValue(),'parent update');
    await page.evaluate(()=>drawSearch(false,'parent update'));await clear.click();
    assert.deepEqual(await page.evaluate(()=>[changes,clears]),[[''],1]);
    assert.equal(await page.getByRole('searchbox').inputValue(),'parent update','controlled input waits for parent');
  });
  await check('SearchField defaultValue initializes uncontrolled state once',async()=>{
    await page.evaluate(()=>{
      window.changes=[];window.clears=0;
      window.drawDefault=value=>renderFixture(React.createElement(CS.SearchField,{key:'default',lang:'en',defaultValue:value,onChange:v=>changes.push(v),onClear:()=>clears++}));
      drawDefault('seed');
    });
    const input=page.getByRole('searchbox');assert.equal(await input.inputValue(),'seed');
    await input.fill('typed');await page.evaluate(()=>drawDefault('replacement'));
    assert.equal(await input.inputValue(),'typed');
    await page.locator('.cs-search__clear').press('Enter');
    assert.equal(await input.inputValue(),'');
    assert.deepEqual(await page.evaluate(()=>[changes,clears]),[['typed',''],1]);
  });
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
