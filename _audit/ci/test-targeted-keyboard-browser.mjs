import assert from 'node:assert/strict';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const bundlePath = new URL('../../_ds_bundle.js', import.meta.url);
const bundleHash = () => createHash('sha256').update(readFileSync(bundlePath)).digest('hex');
const beforeBundle = bundleHash();
const receipt = {browserName, bundleSha256: beforeBundle, checks: []};
const focusRing = style => {
  assert.equal(style.outlineStyle, 'solid', 'Button focus contour must remain solid');
  assert(parseFloat(style.outlineWidth) >= 2, 'Button focus contour must remain at least 2px');
  assert(parseFloat(style.outlineOffset) >= 2, 'Button focus contour must remain separated from the control');
};

await withBrowserFixture(async page => {
  await page.evaluate(() => {
    function Commands() {
      const [opened, setOpened] = React.useState(false);
      return React.createElement(CS.HotKeys, {
        help: false,
        bindings: [{keys: 'mod+k', description: 'Open command', onTrigger: () => setOpened(true)}],
      },
      React.createElement(CS.Button, {onClick: () => setOpened(false)}, 'Command anchor'),
      React.createElement('input', {'aria-label': 'Editable command text'}),
      React.createElement('output', {role: 'status'}, opened ? 'Command open' : 'Command idle'));
    }
    renderFixture(React.createElement(Commands));
  });
  const command = page.getByRole('button', {name: 'Command anchor', exact: true});
  await command.click();
  await page.keyboard.press('Control+Shift+k');
  assert.equal(await page.getByRole('status').innerText(), 'Command idle', 'Unexpected modifiers cannot run the binding');
  await page.keyboard.press('Control+k');
  await page.getByRole('status').getByText('Command open', {exact: true}).waitFor();
  await command.click();
  await page.getByRole('textbox', {name: 'Editable command text', exact: true}).click();
  await page.keyboard.press('Control+k');
  assert.equal(await page.getByRole('status').innerText(), 'Command idle', 'Editing controls retain keyboard ownership');
  receipt.checks.push('HotKeys: real modifier keys update application state; extra modifiers and editable targets do not');

  await page.evaluate(() => {
    function CodeEntry() {
      const [code, setCode] = React.useState('');
      const [complete, setComplete] = React.useState('');
      return React.createElement('div', null,
        React.createElement(CS.InputOTP, {
          length: 4, label: 'Access code', lang: 'en', value: code,
          onChange: next => {setCode(next); setComplete('');},
          onComplete: next => setComplete(next),
        }),
        React.createElement('output', {role: 'status'}, complete ? 'Ready: ' + complete : 'Editing: ' + code));
    }
    renderFixture(React.createElement(CodeEntry));
  });
  const digits = page.locator('.cs-otp input');
  await digits.nth(0).click();
  for (let index = 0; index < 4; index++) {
    assert(await digits.nth(index).evaluate(el => el === document.activeElement), 'Actual typing advances digit focus');
    await page.keyboard.type(String(index + 1));
    assert.equal(await digits.nth(index).inputValue(), String(index + 1));
  }
  assert.equal(await page.getByRole('status').innerText(), 'Ready: 1234', 'Controlled value and completion drive visible application state');
  await page.keyboard.press('Backspace');
  assert.equal(await page.getByRole('status').innerText(), 'Editing: 123');
  assert.deepEqual(await digits.evaluateAll(nodes => nodes.map(node => node.value)), ['1', '2', '3', '']);
  assert(await digits.nth(2).evaluate(el => el === document.activeElement), 'Backspace returns focus to the previous digit');
  receipt.checks.push('InputOTP: real digit typing, automatic focus, controlled value/completion and Backspace');

  await page.evaluate(() => {
    function Activation() {
      const [activated, setActivated] = React.useState(false);
      return React.createElement('div', null,
        React.createElement('input', {'aria-label': 'Before button'}),
        React.createElement(CS.Button, {onClick: () => setActivated(true)}, 'Focus target'),
        React.createElement('input', {'aria-label': 'After button'}),
        React.createElement('output', {role: 'status'}, activated ? 'Activated' : 'Waiting'));
    }
    renderFixture(React.createElement(Activation));
  });
  await page.getByRole('textbox', {name: 'Before button', exact: true}).click();
  // WebKit's Option-Tab path includes all controls under its native tab preference.
  const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(tabKey);
  const button = page.getByRole('button', {name: 'Focus target', exact: true});
  assert(await button.evaluate(el => el === document.activeElement), 'Native keyboard navigation reaches Button');
  assert(await button.evaluate(el => el.matches(':focus-visible')), 'Actual keyboard modality activates the focus-visible state');
  const measure = () => button.evaluate(el => {
    const style = getComputedStyle(el);
    return {outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset};
  });
  focusRing(await measure());
  await button.evaluate(el => el.style.setProperty('outline', '0', 'important'));
  const missingRing = await measure();
  assert.throws(() => focusRing(missingRing), 'Removing the actual Button outline must fail the regression');
  await button.evaluate(el => el.style.removeProperty('outline'));
  focusRing(await measure());
  await page.keyboard.press('Space');
  assert.equal(await page.getByRole('status').innerText(), 'Activated', 'Focused Button retains native Space activation');
  await page.keyboard.press(tabKey);
  assert(await page.getByRole('textbox', {name: 'After button', exact: true}).evaluate(el => el === document.activeElement));
  receipt.checks.push('Button: real keyboard focus-visible contour, actual outline-removal mutation and native Space activation');
}, {browserName});

assert.equal(bundleHash(), beforeBundle, 'The tested bundle cannot change during keyboard validation');
const directory = new URL('../../test-results/targeted-keyboard/', import.meta.url);
mkdirSync(directory, {recursive: true});
writeFileSync(new URL(browserName + '.json', directory), JSON.stringify(receipt, null, 2) + '\n');
console.log(`PASS ${browserName}: real HotKeys, InputOTP typing/Backspace and Button keyboard focus/activation`);
