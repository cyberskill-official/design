import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });
await withBrowserFixture(async page => {
  for (const name of ['NumberField','SearchField','PromptInput']) {
    for (const mode of ['uncontrolled','callback-only','controlled']) {
      await page.evaluate(({ name, mode }) => {
        window.stateChanges = [];
        const props = { key: name + mode, lang: 'en' };
        if (mode !== 'uncontrolled') props.onChange = v => stateChanges.push(v);
        if (mode === 'controlled') props.value = name === 'NumberField' ? 5 : 'initial';
        window.drawState = (extra = {}) => renderFixture(React.createElement(CS[name], {...props,...extra}));
        drawState();
      }, { name, mode });
      const input = page.locator(name === 'PromptInput' ? 'textarea' : '#fixture input');
      await input.waitFor();
      if (name === 'NumberField') await page.getByRole('button', { name: 'Increase', exact: true }).click();
      else await input.fill('updated');
      const changed = name === 'NumberField' ? (mode === 'controlled' ? 6 : 1) : 'updated';
      const shown = mode === 'controlled' ? (name === 'NumberField' ? '5' : 'initial') : String(changed);
      assert.equal(await input.inputValue(), shown, `${name}/${mode}: visible state`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [changed], `${name}/${mode}: notification`);
      await page.evaluate(() => drawState({className:'rerendered'}));
      assert.equal(await input.inputValue(), shown, `${name}/${mode}: unrelated rerender`);
      if (mode === 'controlled') {
        await page.evaluate(changed => drawState({value:changed}), changed);
        assert.equal(await input.inputValue(), String(changed), `${name}: parent accepts proposal`);
        await page.evaluate(() => drawState());
        assert.equal(await input.inputValue(), shown, `${name}: parent resets`);
      }
      await page.evaluate(() => drawState({disabled:true}));
      assert.equal(await input.isDisabled(), true, `${name}/${mode}: disabled input`);
      assert.equal(await input.inputValue(), shown, `${name}/${mode}: disabled preserves value`);
      if (name === 'NumberField') {
        const increase = page.getByRole('button',{name:'Increase',exact:true});
        assert.equal(await increase.isDisabled(), true);
        await increase.evaluate(element=>element.click());
      }
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [changed], `${name}/${mode}: non-user operations do not notify`);
      await page.evaluate(() => drawState());
      if (name === 'SearchField' && mode !== 'controlled') {
        await page.locator('.cs-search__clear').click();
        assert.equal(await input.inputValue(), '', 'clear updates uncontrolled state');
      }
      await page.evaluate(() => drawState({key:'reset'}));
      assert.equal(await input.inputValue(), mode === 'controlled' ? shown : name === 'NumberField' ? '0' : '', `${name}/${mode}: remount reset`);
      if (name === 'SearchField' && mode !== 'controlled') {
        await page.evaluate(() => drawState({key:'seed',defaultValue:'Seed'}));
        assert.equal(await input.inputValue(), 'Seed');
        await page.evaluate(() => drawState({key:'seed',defaultValue:'New seed'}));
        assert.equal(await input.inputValue(), 'Seed', 'SearchField defaultValue is mount-only');
      }

    }
  }
  for (const name of ['Toggle', 'Rating', 'InputOTP']) {
    for (const mode of ['uncontrolled', 'callback-only', 'controlled']) {
      await page.evaluate(({name, mode}) => {
        window.stateChanges = [];
        window.drawState = (extra = {}) => {
          const props = {key: name + mode, lang: 'en'};
          if (mode !== 'uncontrolled') props.onChange = v => stateChanges.push(v);
          if (mode === 'controlled') props[name === 'Toggle' ? 'pressed' : 'value'] =
            name === 'Toggle' ? false : name === 'Rating' ? 2 : '12';
          renderFixture(React.createElement(CS[name], {...props,...extra}));
        };
        drawState();
      }, {name, mode});
      const read = async () => name === 'Toggle'
        ? await page.locator('.cs-toggle').getAttribute('aria-pressed')
        : name === 'Rating' ? await page.locator('.cs-rating button.on').count()
        : await page.locator('.cs-otp input').evaluateAll(nodes => nodes.map(n => n.value).join(''));
      const initial = name === 'Toggle' ? 'false' : name === 'Rating' ? (mode === 'controlled' ? 2 : 0) : (mode === 'controlled' ? '12' : '');
      const changed = name === 'Toggle' ? true : name === 'Rating' ? 4 : (mode === 'controlled' ? '72' : '7');
      const shown = name === 'Toggle' ? 'true' : changed;
      if (name === 'Toggle') await page.locator('.cs-toggle').click();
      else if (name === 'Rating') await page.getByRole('radio').nth(3).click();
      else await page.locator('.cs-otp input').first().fill('7');
      assert.equal(await read(), mode === 'controlled' ? initial : shown, `${name}/${mode}: visible state`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [changed], `${name}/${mode}: callback`);
      await page.evaluate(() => drawState({className: 'rerendered'}));
      assert.equal(await read(), mode === 'controlled' ? initial : shown, `${name}/${mode}: unrelated rerender preserves state`);
      if (mode === 'controlled') {
        await page.evaluate(({name,changed}) => drawState({[name === 'Toggle' ? 'pressed' : 'value']:changed}), {name,changed});
        assert.equal(await read(), shown, `${name}: parent accepts proposal`);
        await page.evaluate(() => drawState());
        assert.equal(await read(), initial, `${name}: parent reset`);
      }
      await page.evaluate(name => drawState(name === 'Rating' ? {readOnly:true} : {disabled:true}), name);
      if (name === 'Rating') await page.getByRole('radio').first().click();
      else {
        const control = page.locator(name === 'Toggle' ? '.cs-toggle' : '.cs-otp input').first();
        assert.equal(await control.isDisabled(), true);
      }
      assert.equal(await read(), mode === 'controlled' ? initial : shown, `${name}/${mode}: locked state`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [changed], `${name}/${mode}: no locked notification`);
      await page.evaluate(() => drawState({key:'reset'}));
      assert.equal(await read(), initial, `${name}/${mode}: remount reset`);
      if (mode !== 'controlled' && name !== 'InputOTP') {
        await page.evaluate(name => drawState({key:'seed',[name === 'Toggle' ? 'defaultPressed' : 'defaultValue']:name === 'Toggle' ? true : 3}), name);
        assert.equal(await read(), name === 'Toggle' ? 'true' : 3, `${name}: default seed`);
        await page.evaluate(name => drawState({key:'seed',[name === 'Toggle' ? 'defaultPressed' : 'defaultValue']:name === 'Toggle' ? false : 1}), name);
        assert.equal(await read(), name === 'Toggle' ? 'true' : 3, `${name}: default is mount-only`);
      }

    }
  }
  for (const name of ['InputGroup', 'InlineEdit', 'TagInput', 'Mentions']) {
    for (const mode of ['uncontrolled', 'callback-only', 'controlled']) {
      await page.evaluate(({name, mode}) => {
        window.stateChanges = [];
        window.drawState = (extra = {}) => {
          const props = {key: name + mode, lang:'en', label:'State fixture', users:['alice']};
          if (mode !== 'uncontrolled') props.onChange = v => stateChanges.push(v);
          if (mode === 'controlled') props.value = name === 'TagInput' ? ['initial'] : 'initial';
          renderFixture(React.createElement(CS[name], {...props, ...extra}));
        };
        drawState();
      }, {name, mode});
      const read = async () => name === 'InlineEdit'
        ? await page.locator('.cs-inline-edit__view span').textContent()
        : name === 'TagInput' ? await page.locator('.cs-taginput .cs-tag').allTextContents()
        : await page.locator(name === 'Mentions' ? 'textarea' : '#fixture input').inputValue();
      const initial = await read();
      if (name === 'InlineEdit') await page.locator('.cs-inline-edit__view').click();
      const input = page.locator(name === 'Mentions' ? 'textarea' : '#fixture input');
      await input.fill('updated');
      if (name === 'InlineEdit' || name === 'TagInput') await input.press('Enter');
      const changed = name === 'TagInput' ? (mode === 'controlled' ? ['initial','updated'] : ['updated']) : 'updated';
      assert.deepEqual(await read(), mode === 'controlled' ? initial : changed, `${name}/${mode}: visible value`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [changed], `${name}/${mode}: notification`);
      await page.evaluate(() => drawState({className:'rerendered'}));
      assert.deepEqual(await read(), mode === 'controlled' ? initial : changed, `${name}/${mode}: rerender`);
      if (mode === 'controlled') {
        await page.evaluate(changed => drawState({value:changed}), changed);
        assert.deepEqual(await read(), changed, `${name}: parent accepts proposed value`);
        await page.evaluate(name => drawState({value:name === 'TagInput' ? [] : ''}), name);
        const reset = await read();
        assert.deepEqual(reset, name === 'TagInput' ? [] : name === 'InlineEdit' ? 'Add text' : '', `${name}: parent reset`);
      }
      await page.evaluate(() => drawState({key:'reset'}));
      assert.deepEqual(await read(), initial, `${name}/${mode}: remount reset`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [changed], `${name}/${mode}: rerenders do not notify`);
      if (mode !== 'controlled') {
        const seed = name === 'TagInput' ? ['Seed'] : 'Seed';
        await page.evaluate(seed => drawState({key:'seed',defaultValue:seed}), seed);
        assert.deepEqual(await read(), seed, `${name}: default seed`);
        await page.evaluate(name => drawState({key:'seed',defaultValue:name === 'TagInput' ? ['New seed'] : 'New seed'}), name);
        assert.deepEqual(await read(), seed, `${name}: default is mount-only`);
      }
      if (name === 'InputGroup' || name === 'TagInput') {
        await page.evaluate(() => drawState({key:'reset',disabled:true}));
        assert.equal(await input.isDisabled(), true, `${name}: disabled`);
      }
    }
  }
  for (const mode of ['uncontrolled','callback-only','controlled']) {
    await page.evaluate(mode => {
      window.stateChanges = [];
      window.confirmations = 0;
      window.drawAlert = (extra = {}) => renderFixture(React.createElement(CS.AlertDialog, {
        key: mode, lang:'en', title:'State fixture', defaultOpen:true,
        ...(mode === 'controlled' ? {open:true} : {}),
        ...(mode === 'uncontrolled' ? {} : {onOpenChange:v=>stateChanges.push(v)}),
        onConfirm:()=>confirmations++, ...extra,
      }));
      drawAlert();
    }, mode);
    await page.getByRole('button',{name:'Confirm',exact:true}).click();
    assert.equal(await page.getByRole('alertdialog').count(), mode === 'controlled' ? 1 : 0, `AlertDialog/${mode}: close ownership`);
    assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [false]);
    assert.equal(await page.evaluate(() => confirmations), 1);
    await page.evaluate(() => drawAlert({className:'rerendered'}));
    assert.equal(await page.getByRole('alertdialog').count(), mode === 'controlled' ? 1 : 0, `AlertDialog/${mode}: rerender preserves state`);
    if (mode === 'controlled') {
      await page.evaluate(() => drawAlert({open:false}));
      assert.equal(await page.getByRole('alertdialog').count(), 0, 'AlertDialog: parent accepts dismissal');
      await page.evaluate(() => drawAlert({open:true}));
      assert.equal(await page.getByRole('alertdialog').count(), 1, 'AlertDialog: parent reopens');
    }
    await page.evaluate(() => drawAlert({key:'reset'}));
    assert.equal(await page.getByRole('alertdialog').count(), 1, `AlertDialog/${mode}: remount reset`);
    assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [false], 'AlertDialog: rerenders do not notify');
    if (mode !== 'controlled') {
      await page.evaluate(() => drawAlert({key:'reset',defaultOpen:false}));
      assert.equal(await page.getByRole('alertdialog').count(), 1, 'AlertDialog defaultOpen is mount-only');
      await page.evaluate(() => drawAlert({key:'closed-seed',defaultOpen:false}));
      assert.equal(await page.getByRole('alertdialog').count(), 0, 'AlertDialog remount applies closed seed');
    }

    await page.evaluate(() => renderFixture(null));
  }
  for (const mode of ['uncontrolled','callback-only','controlled']) {
    await page.evaluate(mode => {
      window.stateChanges = [];
      window.drawPanel = (extra = {}) => renderFixture(React.createElement(CS.Collapsible, {
        key:mode, title:'Expand fixture',
        ...(mode === 'controlled' ? {open:false} : {}),
        ...(mode === 'uncontrolled' ? {} : {onOpenChange:v=>stateChanges.push(v)}),
        ...extra,
      }, 'Panel body'));
      drawPanel();
    }, mode);
    const trigger = page.getByRole('button',{name:'Expand fixture'});
    await trigger.click();
    assert.equal(await trigger.getAttribute('aria-expanded'), mode === 'controlled' ? 'false' : 'true');
    assert.equal(await page.getByRole('region').count(), mode === 'controlled' ? 0 : 1);
    assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [true]);
    await page.evaluate(() => drawPanel({className:'rerendered'}));
    assert.equal(await page.getByRole('region').count(), mode === 'controlled' ? 0 : 1);
    if (mode === 'controlled') {
      await page.evaluate(() => drawPanel({open:true}));
      assert.equal(await page.getByRole('region').count(), 1, 'Collapsible parent accepts expansion');
      await page.evaluate(() => drawPanel({open:false}));
      assert.equal(await page.getByRole('region').count(), 0, 'Collapsible parent resets closed');
    }
    await page.evaluate(() => drawPanel({key:'reset'}));
    assert.equal(await page.getByRole('region').count(), 0, 'Collapsible remount resets closed');
    if (mode !== 'controlled') {
      await page.evaluate(() => drawPanel({key:'open-seed',defaultOpen:true}));
      assert.equal(await page.getByRole('region').count(), 1, 'Collapsible default open seed');
      await page.evaluate(() => drawPanel({key:'open-seed',defaultOpen:false}));
      assert.equal(await page.getByRole('region').count(), 1, 'Collapsible defaultOpen is mount-only');
    }

    assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [true]);
  }
  for (const name of ['Menu','Popover']) {
    for (const mode of ['uncontrolled','callback-only','controlled']) {
      await page.evaluate(({ name, mode }) => {
        window.stateChanges = [];
        const props = { key: name + mode, trigger: React.createElement('button', null, 'Open fixture') };
        if (mode !== 'uncontrolled') props.onOpenChange = v => stateChanges.push(v);
        if (mode === 'controlled') props.open = false;
        const child = name === 'Menu' ? React.createElement(CS.MenuItem, null, 'Action') : React.createElement('button', null, 'Action');
        window.drawOverlay = (extra = {}) => renderFixture(React.createElement(CS[name], {...props,...extra}, child));
        drawOverlay();
      }, { name, mode });
      await page.getByRole('button', { name: 'Open fixture', exact: true }).click();
      const panel = page.getByRole(name === 'Menu' ? 'menu' : 'dialog');
      assert.equal(await panel.count(), mode === 'controlled' ? 0 : 1, `${name}/${mode}: open state`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : [true]);
      await page.evaluate(() => drawOverlay({className:'rerendered'}));
      assert.equal(await panel.count(), mode === 'controlled' ? 0 : 1, `${name}/${mode}: rerender preserves open`);
      if (mode === 'controlled') {
        await page.evaluate(() => drawOverlay({open:true}));
        assert.equal(await panel.count(), 1, `${name}: parent accepts open`);
        await page.evaluate(() => drawOverlay({open:false}));
        assert.equal(await panel.count(), 0, `${name}: parent resets closed`);
      }
      if (mode !== 'controlled') {
        await page.keyboard.press('Escape');
        assert.equal(await panel.count(), 0, `${name}/${mode}: dismissed`);
        assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'callback-only' ? [true,false] : []);
      }
      await page.evaluate(() => drawOverlay({key:'reset'}));
      assert.equal(await panel.count(), 0, `${name}/${mode}: remount resets closed`);
      assert.deepEqual(await page.evaluate(() => stateChanges), mode === 'uncontrolled' ? [] : mode === 'controlled' ? [true] : [true,false]);

    }
  }
  await page.evaluate(() => {
    window.submissions = [];
    renderFixture(React.createElement(CS.PromptInput, { key: 'ime', lang: 'ja', onSubmit: value => submissions.push(value) }));
  });
  const prompt = page.locator('textarea');
  await prompt.fill('日本語');
  await prompt.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', isComposing: true, bubbles: true });
  assert.deepEqual(await page.evaluate(() => submissions), [], 'composition confirmation does not submit');
  await prompt.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 229, bubbles: true });
  assert.deepEqual(await page.evaluate(() => submissions), [], 'legacy IME keyCode guard');
  await prompt.press('Enter');
  assert.deepEqual(await page.evaluate(() => submissions), ['日本語'], 'ordinary Enter submits once');
  await prompt.press('Shift+Enter');
  assert.ok((await prompt.inputValue()).includes('\n'), 'Shift+Enter inserts newline');
  assert.equal(await page.evaluate(() => submissions.length), 1);
  for (const state of ['busy','disabled']) {
    await page.evaluate(state => renderFixture(React.createElement(CS.PromptInput, { key: state, value: 'pending', [state]: true, onSubmit: value => submissions.push(value) })), state);
    await page.locator('.cs-prompt__bar button:disabled').waitFor();
    await prompt.dispatchEvent('keydown', { key: 'Enter', bubbles: true });
    assert.equal(await page.evaluate(() => submissions.length), 1, `${state} cannot submit`);
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log('PASS state browser: 42 control modes, remount reset/rerender/locked state, clear/dismiss, composition, multiline, busy and disabled');
