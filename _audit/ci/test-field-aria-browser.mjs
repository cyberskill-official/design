import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
  for(const kind of ['TextField','Textarea','Select','NativeSelect'])try{
    await page.evaluate(kind=>{
      window.drawField=(error,description,invalid='grammar')=>renderFixture(React.createElement(React.Fragment,null,
        React.createElement('span',{id:'outside'},'External guidance'),
        React.createElement(CS[kind],{key:kind,id:'field',lang:'en',label:'Field',error,...(kind==='NativeSelect'?{}:{description}),
          'aria-describedby':'outside','aria-invalid':invalid,...(kind.endsWith('Select')?{options:[{value:'a',label:'A'}]}:{})})));
      drawField();
    },kind);
    const control=page.locator('#field');
    assert.equal(await control.getAttribute('aria-describedby'),'outside',kind+' preserves external description');
    assert.equal(await control.getAttribute('aria-invalid'),'grammar',kind+' preserves external invalid state');
    await page.evaluate(()=>drawField('Wrong','Local guidance',false));
    assert.equal(await control.getAttribute('aria-invalid'),'true','local error takes precedence');
    const ids=(await control.getAttribute('aria-describedby')).split(/\s+/);
    assert.equal(ids[0],'outside');assert.equal(ids.length,kind==='NativeSelect'?2:3);
    assert.deepEqual(await page.evaluate(ids=>ids.map(id=>document.getElementById(id)?.textContent),ids),kind==='NativeSelect'?['External guidance','Wrong']:['External guidance','Local guidance','Wrong']);
    await page.evaluate(()=>drawField(undefined,undefined,false));
    assert.equal(await control.getAttribute('aria-invalid'),'false');
    assert.equal(await control.getAttribute('aria-describedby'),'outside');
    console.log('PASS '+kind+': external descriptions and invalid state compose with local help/error');
  }catch(error){failures.push(kind+': '+error.message)}
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
