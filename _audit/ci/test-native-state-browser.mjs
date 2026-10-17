import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
await withBrowserFixture(async page => {
  for (const name of ['TextField','Textarea','Checkbox','Radio','Switch','Slider','Select','NativeSelect']) {
    const boolean = ['Checkbox','Radio','Switch'].includes(name);
    const select = ['Select','NativeSelect'].includes(name);
    const initial = boolean ? false : name === 'Slider' ? '4' : select ? 'a' : 'initial';
    const changed = boolean ? true : name === 'Slider' ? '5' : select ? 'b' : 'updated';
    for (const mode of ['uncontrolled','callback-only','controlled']) {
      await page.evaluate(({name, mode, initial, boolean, select}) => {
        window.nativeChanges = [];
        window.drawNative = (extra = {}) => {
          const props = {key:name+mode, label:'Native fixture', 'aria-label':'Native fixture', name:'field'};
          props[boolean ? (mode === 'controlled' ? 'checked' : 'defaultChecked') : (mode === 'controlled' ? 'value' : 'defaultValue')] = initial;
          if (name === 'Slider') Object.assign(props, {min:0,max:10,step:1});
          if (select) props.options = [{value:'a',label:'Alpha'},{value:'b',label:'Beta'}];
          if (mode !== 'uncontrolled') props.onChange = event => nativeChanges.push({
            type:event.type, value:boolean ? event.target.checked : event.target.value,
          });
          renderFixture(React.createElement('form', {onSubmit:event=>event.preventDefault()},
            React.createElement(CS[name], {...props,...extra}),
            React.createElement('button',{type:'reset'},'Reset fixture')));
        };
        drawNative();
      }, {name, mode, initial, boolean, select});
      const control = page.locator('#fixture input, #fixture textarea, #fixture select');
      const read = () => boolean ? control.isChecked() : control.inputValue();
      assert.deepEqual(await read(), initial, `${name}/${mode}: initial`);
      if (name === 'Switch') await page.locator('.cs-switch').click();
      else if (boolean) await control.click();
      else if (select) await control.selectOption('b');
      else if (name === 'Slider') await control.press('ArrowRight');
      else await control.fill('updated');
      const expected = mode === 'controlled' ? initial : changed;
      assert.deepEqual(await read(), expected, `${name}/${mode}: ownership`);
      const events = mode === 'uncontrolled' ? [] : [{type:'change',value:changed}];
      assert.deepEqual(await page.evaluate(()=>nativeChanges), events, `${name}/${mode}: native event callback`);
      await page.evaluate(()=>drawNative({className:'rerendered'}));
      assert.deepEqual(await read(), expected, `${name}/${mode}: unrelated rerender`);
      if (mode === 'controlled') {
        await page.evaluate(({boolean,changed})=>drawNative({[boolean?'checked':'value']:changed}), {boolean,changed});
        assert.deepEqual(await read(), changed, `${name}: parent accepts change`);
        await page.evaluate(({boolean,initial})=>drawNative({[boolean?'checked':'value']:initial}), {boolean,initial});
      } else {
        await page.getByRole('button',{name:'Reset fixture',exact:true}).click();
      }
      assert.deepEqual(await read(), initial, `${name}/${mode}: reset`);
      assert.deepEqual(await page.evaluate(()=>nativeChanges), events, `${name}/${mode}: reset does not emit change`);
      await page.evaluate(()=>drawNative({disabled:true}));
      assert.equal(await control.isDisabled(), true, `${name}/${mode}: disabled`);
      // A real keyboard event cannot edit a disabled native control.
      await page.keyboard.press(boolean ? 'Space' : 'ArrowDown');
      assert.deepEqual(await read(), initial, `${name}/${mode}: disabled value`);
      assert.deepEqual(await page.evaluate(()=>nativeChanges), events, `${name}/${mode}: disabled callback`);
      await page.evaluate(()=>drawNative({key:'remount'}));
      assert.deepEqual(await read(), initial, `${name}/${mode}: remount`);
    }
  }
}, {browserName:process.env.CS_TEST_BROWSER || 'chromium'});
console.log('PASS native state: 8 wrappers × 3 modes, native event payloads, parent acceptance, form/parent reset, rerender, disabled and remount');
