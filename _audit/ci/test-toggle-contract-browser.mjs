import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
  async function check(name,run){try{await run();console.log('PASS '+name)}catch(e){failures.push(name+': '+e.message)}}
  await check('Toggle visible label is its accessible name',async()=>{
    await page.evaluate(()=>renderFixture(React.createElement(CS.Toggle,{lang:'en'},React.createElement('strong',null,'Bold'))));
    const button=page.getByRole('button',{name:'Bold',exact:true});
    assert.equal(await button.count(),1);
    await button.press('Space');
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    await button.press('Enter');
    assert.equal(await button.getAttribute('aria-pressed'),'false');
  });
  await check('Toggle click observers preserve state and change callbacks',async()=>{
    await page.evaluate(()=>{
      window.toggleChanges=[];window.clicks=0;
      window.drawToggle=(cancel=false,disabled=false,pressed=undefined)=>renderFixture(React.createElement(CS.Toggle,{
        key:'observer',lang:'en',disabled,pressed,'aria-label':'Formatting',
        onClick:e=>{clicks++;if(cancel)e.preventDefault()},onChange:v=>toggleChanges.push(v)
      }));drawToggle();
    });
    const button=page.getByRole('button',{name:'Formatting'});
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert.deepEqual(await page.evaluate(()=>[clicks,toggleChanges]),[1,[true]]);
    await page.evaluate(()=>drawToggle(true));await button.press('Space');
    assert.deepEqual(await page.evaluate(()=>[clicks,toggleChanges]),[2,[true]]);
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    await page.evaluate(()=>drawToggle(false,true));await button.evaluate(b=>b.click());
    assert.deepEqual(await page.evaluate(()=>[clicks,toggleChanges]),[2,[true]]);
    await page.evaluate(()=>drawToggle(false,false,false));await button.press('Enter');
    assert.equal(await button.getAttribute('aria-pressed'),'false','controlled state waits for parent');
    assert.deepEqual(await page.evaluate(()=>toggleChanges),[true,true]);
  });
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
