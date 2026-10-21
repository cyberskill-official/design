import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
const options = [{value:'a',label:'Alpha'},{value:'b',label:'Beta'}];
const nodes = [{key:'a',label:'Alpha'},{key:'b',label:'Beta'}];
const cases = [
  {name:'Calendar', initial:'2024-01-10T00:00:00.000Z', next:'2024-01-15T00:00:00.000Z', shown:'10', accepted:'15'},
  {name:'DatePicker', initial:'2024-01-10T00:00:00.000Z', next:'2024-01-15T00:00:00.000Z', shown:'10 Jan 2024', accepted:'15 Jan 2024', disabled:'.cs-datepicker__field'},
  {name:'Cascader', initial:['a'], next:['b'], shown:'Alpha', accepted:'Beta', props:{nodes}, disabled:'.cs-treeselect__field'},
  {name:'ColorPicker', initial:'#F4BA17', next:'#45210E', shown:'#F4BA17', accepted:'#45210E'},
  {name:'Combobox', initial:'a', next:'b', shown:'Alpha', accepted:'Beta', props:{options}, disabled:'input'},
  {name:'RadioGroup', initial:'a', next:'b', shown:'a', accepted:'b', props:{options}},
  {name:'SegmentedControl', initial:'a', next:'b', shown:'Alpha', accepted:'Beta', props:{options}},
  {name:'TimePicker', initial:'09:00', next:'10:00', shown:'09:00', accepted:'10:00', disabled:'select'},
  {name:'Transfer', initial:['a'], next:['a','b'], shown:['Alpha'], accepted:['Alpha','Beta'], props:{items:nodes}},
  {name:'TreeSelect', initial:'a', next:'b', shown:'Alpha', accepted:'Beta', props:{nodes}, extraArgs:[nodes[1]], disabled:'.cs-treeselect__field'},
  {name:'Tree', field:'selected', initial:'a', next:'b', shown:'Alpha', accepted:'Beta', props:{nodes}, extraArgs:[nodes[1]]},
  {name:'Sortable', field:'items', initial:nodes, next:[nodes[1],nodes[0]], shown:['Alpha','Beta'], accepted:['Beta','Alpha']},
  {name:'Pagination', field:'page', initial:1, next:2, shown:'1', accepted:'2', props:{pageCount:3}},
  {name:'Tabs', initial:'a', next:'b', shown:'Alpha', accepted:'Beta', props:{tabs:options}},
  {name:'DataGrid', field:'selected', initial:['a'], next:['a','b'], shown:['Alpha'], accepted:['Alpha','Beta'], props:{
    columns:[{key:'name',header:'Name'}], rows:[{id:'a',name:'Alpha'},{id:'b',name:'Beta'}], selectable:true,
  }},
];
await withBrowserFixture(async page => {
  const read = async name => {
    switch (name) {
      case 'Calendar': return page.locator('.cs-cal__grid [aria-pressed="true"]').textContent();
      case 'DatePicker': return page.locator('.cs-datepicker__field > span').textContent();
      case 'Cascader': case 'TreeSelect': return page.locator('.cs-treeselect__field > span').first().textContent();
      case 'ColorPicker': return page.locator('.cs-colorpicker__field code').textContent();
      case 'Combobox': return page.locator('input').inputValue();
      case 'RadioGroup': return page.locator('input:checked').inputValue();
      case 'SegmentedControl': return page.getByRole('radio',{checked:true}).textContent();
      case 'Tabs': return page.getByRole('tab',{selected:true}).textContent();
      case 'TimePicker': return page.locator('select').inputValue();
      case 'Transfer': return page.locator('.cs-transfer__list').last().locator('label').allTextContents().then(values=>values.map(value=>value.trim()));
      case 'Tree': return page.getByRole('treeitem',{selected:true}).locator('.cs-tree__label').textContent();
      case 'Sortable': return page.locator('.cs-sortable__label').allTextContents();
      case 'Pagination': return page.locator('[aria-current="page"]').textContent();
      case 'DataGrid': return page.locator('tbody tr.is-selected td:last-child').allTextContents();
      default: throw Error('Missing value reader: '+name);
    }
  };
  const act = async name => {
    switch (name) {
      case 'DatePicker': await page.locator('.cs-datepicker__field').click();
      // Both date controls expose the same month-grid action.
      case 'Calendar': return page.locator('.cs-cal__grid button').filter({hasText:/^15$/}).click();
      case 'Cascader': await page.locator('.cs-treeselect__field').click(); return page.getByRole('option',{name:'Beta',exact:true}).click();
      case 'ColorPicker': await page.locator('.cs-colorpicker__field').click(); return page.getByRole('button',{name:'#45210E',exact:true}).click();
      case 'Combobox': await page.locator('input').click(); return page.getByRole('option',{name:'Beta',exact:true}).click();
      case 'RadioGroup': return page.getByRole('radio',{name:'Beta',exact:true}).click();
      case 'SegmentedControl': return page.getByRole('radio',{name:'Beta',exact:true}).click();
      case 'Tabs': return page.getByRole('tab',{name:'Beta',exact:true}).click();
      case 'TimePicker': return page.locator('select').selectOption('10:00');
      case 'Transfer': await page.getByRole('checkbox',{name:'Beta',exact:true}).check(); return page.locator('.cs-transfer__ops button').first().click();
      case 'TreeSelect': await page.locator('.cs-treeselect__field').click();
      case 'Tree': return page.locator('.cs-tree__label').filter({hasText:/^Beta$/}).click();
      case 'Sortable': return page.getByRole('button',{name:'Move down',exact:true}).first().click();
      case 'Pagination': return page.getByRole('button',{name:'Next page',exact:true}).click();
      case 'DataGrid': return page.getByRole('checkbox',{name:'Select row: Beta',exact:true}).click();
      default: throw Error('Missing user interaction: '+name);
    }
  };
  for (const item of cases) for (const observed of [false,true]) {
    await page.evaluate(({item,observed})=>{
      window.proposals = [];
      const callback = item.name === 'Tree' || item.name === 'DataGrid' ? 'onSelect' : 'onChange';
      window.drawControlled = (value = item.initial, extra = {}) => renderFixture(React.createElement(CS[item.name],{
        key:item.name+observed,lang:'en',...item.props,[item.field || 'value']:value,
        ...(observed ? {[callback]:(...args)=>proposals.push(args.map(value=>value instanceof Date ? value.toISOString() : value))} : {}),
        ...extra,
      }));
      drawControlled();
    },{item,observed});
    const context = `${item.name}/${observed?'callback':'no callback'}`;
    assert.deepEqual(await read(item.name), item.shown, context+': initial');
    await act(item.name);
    assert.deepEqual(await read(item.name), item.shown, context+': proposal cannot commit parent state');
    const events = observed ? [[item.next,...(item.extraArgs || [])]] : [];
    assert.deepEqual(await page.evaluate(()=>proposals), events, context+': exact callback payload');
    await page.evaluate(()=>drawControlled(undefined,{className:'rerendered'}));
    assert.deepEqual(await read(item.name), item.shown, context+': unrelated rerender');
    await page.evaluate(next=>drawControlled(next), item.next);
    assert.deepEqual(await read(item.name), item.accepted, context+': parent acceptance');
    await page.evaluate(()=>drawControlled());
    assert.deepEqual(await read(item.name), item.shown, context+': parent reset');
    if (item.disabled) {
      await page.evaluate(()=>drawControlled(undefined,{disabled:true}));
      const control = page.locator(item.disabled);
      assert.equal(await control.isDisabled(), true, context+': disabled');
      await control.evaluate(element=>element.click());
      assert.deepEqual(await read(item.name), item.shown, context+': disabled activation');
    }
    if (item.name === 'RadioGroup') {
      await page.evaluate(()=>drawControlled(undefined,{options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta',disabled:true}]}));
      const radio = page.getByRole('radio',{name:'Beta',exact:true});
      assert.equal(await radio.isDisabled(), true);
      await radio.evaluate(element=>element.click());
      assert.deepEqual(await read(item.name), item.shown, context+': disabled option');
    }
    if (item.name === 'Pagination' || item.name === 'Sortable') {
      const button = page.getByRole('button',{name:item.name === 'Pagination' ? 'Previous page' : 'Move up',exact:true}).first();
      assert.equal(await button.isDisabled(), true);
      await button.evaluate(element=>element.click());
    }
    await page.evaluate(()=>drawControlled(undefined,{key:'remount'}));
    assert.deepEqual(await read(item.name), item.shown, context+': remount');
    assert.deepEqual(await page.evaluate(()=>proposals), events, context+': parent/disabled/remount operations do not notify');
  }
  for (const name of ['Dialog','Drawer','CommandPalette','Tour']) for (const observed of [false,true]) {
    await page.evaluate(({name,observed})=>{
      window.proposals = [];
      window.drawModal = (open = true, extra = {})=>renderFixture(React.createElement(CS[name],{
        key:name+observed,open,lang:'en',title:'Parent-owned overlay',
        steps:[{target:'#missing-target',title:'First step'}],
        ...(observed ? {onClose:()=>proposals.push('close')} : {}),...extra,
      }));
      drawModal();
    },{name,observed});
    const context = `${name}/${observed?'callback':'no callback'}`;
    assert.equal(await page.getByRole('dialog').count(), 1, context+': initial');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 1, context+': dismissal awaits parent');
    assert.deepEqual(await page.evaluate(()=>proposals), observed ? ['close'] : [], context+': dismissal callback');
    await page.evaluate(()=>drawModal(true,{className:'rerendered'}));
    assert.equal(await page.getByRole('dialog').count(), 1, context+': rerender');
    await page.evaluate(()=>drawModal(false));
    assert.equal(await page.getByRole('dialog').count(), 0, context+': parent closes');
    await page.evaluate(()=>drawModal(true));
    assert.equal(await page.getByRole('dialog').count(), 1, context+': parent reopens');
    await page.evaluate(()=>drawModal(true,{key:'remount'}));
    assert.equal(await page.getByRole('dialog').count(), 1, context+': remount');
    assert.deepEqual(await page.evaluate(()=>proposals), observed ? ['close'] : [], context+': parent operations do not notify');
    await page.evaluate(()=>renderFixture(null));
  }
}, {browserName:process.env.CS_TEST_BROWSER || 'chromium',contextOptions:{timezoneId:'UTC'}});
console.log('PASS parent-controlled state: 19 components × callback/no-callback; proposals, parent acceptance/reset, rerender, remount and declared disabled controls');
