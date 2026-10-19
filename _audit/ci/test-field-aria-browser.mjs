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
  const pickerCases=[
    {kind:'Combobox',props:{options:[{value:'a',label:'Alpha'}]},trigger:'[role="combobox"]',popup:'[role="listbox"]'},
    {kind:'DatePicker',props:{value:'2026-10-19'},trigger:'.cs-datepicker__field',popup:'.cs-datepicker__pop[role="dialog"]'},
    {kind:'TimePicker',props:{value:'09:30'},trigger:'.cs-timepicker select'},
    {kind:'ColorPicker',props:{value:'#F4BA17'},trigger:'.cs-colorpicker__field',popup:'.cs-colorpicker__pop[role="dialog"]'},
    {kind:'Cascader',props:{nodes:[{key:'vn',label:'Vietnam',children:[{key:'hn',label:'Hanoi'}]}]},trigger:'.cs-cascader .cs-treeselect__field',popup:'.cs-cascader__col[role="listbox"]'},
    {kind:'TreeSelect',props:{nodes:[{key:'root',label:'Root'}]},trigger:'.cs-treeselect .cs-treeselect__field',popup:'.cs-treeselect__pop .cs-tree[role="tree"]'},
  ];
  for(const item of pickerCases)try{
    await page.evaluate(({kind,props})=>{
      renderFixture(React.createElement(React.Fragment,null,
        React.createElement('span',{id:'picker-label'},kind+' External Label'),
        React.createElement(CS[kind],{key:kind,...props,lang:'en','aria-labelledby':'picker-label'})));
    },item);
    const trigger=page.locator(item.trigger);
    assert.equal(await trigger.getAttribute('aria-labelledby'),'picker-label',item.kind+' trigger forwards aria-labelledby');
    assert.equal(await trigger.getAttribute('aria-label'),null,item.kind+' trigger omits default aria-label when aria-labelledby is set');
    if(item.popup){
      await trigger.click();
      const popup=page.locator(item.popup).first();
      assert.equal(await popup.getAttribute('aria-labelledby'),'picker-label',item.kind+' popup forwards aria-labelledby');
    }
    console.log('PASS '+item.kind+': aria-labelledby names trigger'+(item.popup?' and popup':''));
  }catch(error){failures.push(item.kind+': '+error.message)}
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
