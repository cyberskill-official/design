import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page => {
  async function check(name, run) {
    try { await run(); console.log('PASS '+name); }
    catch(error) { failures.push(name+': '+error.message); }
  }
  for (const [name,field,panel] of [
    ['DatePicker','.cs-datepicker__field','.cs-datepicker__pop'],
    ['Combobox','input[role="combobox"]','[role="listbox"]'],
    ['TreeSelect','.cs-treeselect__field','.cs-treeselect__pop'],
    ['Cascader','.cs-treeselect__field','.cs-cascader__pop'],
  ]) await check(name+' enabled/open → disabled → enabled',async()=>{
    await page.evaluate(name=>{
      window.transitions=[];
      window.pickerProps={key:name,lang:'en',label:name,onChange:v=>transitions.push(v),
        options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}],nodes:[{key:'a',label:'Alpha'},{key:'b',label:'Beta'}]};
      window.drawPicker=disabled=>renderFixture(React.createElement(CS[name],{...pickerProps,disabled}));
      drawPicker(false);
    },name);
    await page.locator(field).click();
    await page.locator(panel).first().waitFor();
    await page.evaluate(()=>drawPicker(true));
    assert.equal(await page.locator(panel).count(),0,'disabled control leaves an interactive popup mounted');
    assert.equal(await page.locator(field).getAttribute('aria-expanded'),'false');
    await page.evaluate(()=>drawPicker(false));
    assert.equal(await page.locator(panel).count(),0,'reenabling resurrects the old popup');
    assert.deepEqual(await page.evaluate(()=>transitions),[],'disabled transition emits a value');
    await page.locator(field).click();
    await page.locator(panel).first().waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator(panel).count(),0,'reopened layer must dismiss normally');
    await page.evaluate(name=>{
      window.parentCloses=0;
      window.drawNested=disabled=>renderFixture(React.createElement(CS.Dialog,{open:true,title:'Parent',onClose:()=>parentCloses++},
        React.createElement(CS[name],{...pickerProps,key:'nested-'+name,disabled})));
      drawNested(false);
    },name);
    await page.locator(field).click();
    await page.locator(panel).first().waitFor();
    await page.evaluate(()=>drawNested(true));
    assert.equal(await page.locator(panel).count(),0);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>parentCloses),1,'disabled child must release Escape ownership to parent');

  });
  await check('Rating has one selected radio for a multi-star score',async()=>{
    await page.evaluate(()=>{
      window.ratingChanges=[];
      renderFixture(React.createElement(CS.Rating,{key:'rating',defaultValue:3,lang:'en',onChange:n=>ratingChanges.push(n)}));
    });
    const radios=page.getByRole('radio');
    assert.equal(await page.locator('[role="radio"][aria-checked="true"]').count(),1);
    assert.equal(await page.getByRole('radio',{checked:true}).getAttribute('aria-label'),'3 / 5');
    assert.equal(await page.locator('.cs-rating button.on').count(),3,'all earned stars stay visually filled');
    await radios.nth(3).click();
    assert.equal(await page.getByRole('radio',{checked:true}).getAttribute('aria-label'),'4 / 5');
    assert.deepEqual(await page.evaluate(()=>ratingChanges),[4]);
    await radios.nth(3).click();
    assert.equal(await page.getByRole('radio',{checked:true}).count(),0,'click selected score clears');
    assert.equal(await page.locator('.cs-rating [tabindex="0"]').count(),1);
    await page.evaluate(()=>renderFixture(React.createElement(CS.Rating,{key:'controlled',value:2,lang:'en',onChange:n=>ratingChanges.push(n)})));
    await radios.nth(4).click();
    assert.equal(await page.getByRole('radio',{checked:true}).getAttribute('aria-label'),'2 / 5','controlled selection awaits parent');
    await page.evaluate(()=>renderFixture(React.createElement(CS.Rating,{key:'controlled',value:4,readOnly:true,lang:'en',onChange:n=>ratingChanges.push(n)})));
    const before=await page.evaluate(()=>ratingChanges.length);
    await radios.nth(0).click();
    assert.equal(await page.evaluate(()=>ratingChanges.length),before);
    assert.equal(await page.getByRole('radio',{checked:true}).getAttribute('aria-label'),'4 / 5');
  });
  await check('TagInput composition confirmation does not create a tag',async()=>{
    await page.evaluate(()=>{
      window.tagChanges=[];
      renderFixture(React.createElement(CS.TagInput,{key:'tags',label:'Tags',lang:'en',onChange:v=>tagChanges.push(v)}));
    });
    const input=page.getByRole('textbox');
    await input.fill('日本語');
    for(const init of [{key:'Enter',isComposing:true},{key:',',isComposing:true},{key:'Enter',keyCode:229}]) {
      await input.dispatchEvent('keydown',{...init,bubbles:true});
      assert.deepEqual(await page.evaluate(()=>tagChanges),[]);
      assert.equal(await input.inputValue(),'日本語');
    }
    await input.press('Enter');
    assert.deepEqual(await page.evaluate(()=>tagChanges),[['日本語']]);
    await input.fill('pending');
    await page.evaluate(()=>renderFixture(React.createElement(CS.TagInput,{key:'tags',label:'Tags',lang:'en',disabled:true,onChange:v=>tagChanges.push(v)})));
    await input.dispatchEvent('focusout',{bubbles:true});
    assert.deepEqual(await page.evaluate(()=>tagChanges),[['日本語']],'disabled blur must not add pending text');
  });
}, {browserName: process.env.CS_TEST_BROWSER || 'chromium'});
assert.deepEqual(failures,[],'State transition failures:\n'+failures.join('\n'));
console.log('PASS state transitions: four picker disabled lifecycles, Rating selection semantics, TagInput IME and disabled blur');
