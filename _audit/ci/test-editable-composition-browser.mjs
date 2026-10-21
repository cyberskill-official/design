import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const report = process.env.CS_EDITABLE_COMPOSITION_REPORT;
const names = ['components/forms/ColorPicker.jsx', 'components/forms/ColorPicker.d.ts', 'components/forms/ColorPicker.prompt.md', 'components/forms/InputOTP.jsx', 'components/forms/InputOTP.d.ts', 'components/forms/InputOTP.prompt.md', 'components/overlays/OverlayManager.jsx', 'components/_utils/renderCount.js', '_audit/ci/lib/browser-fixture.mjs', '_ds_bundle.js', 'styles.css', '_vendor/react/react.production.min.js', '_vendor/react/react-dom.production.min.js'];
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const sourceFiles = Object.fromEntries(names.map(n => [n, sha(root + '/' + n)]));
execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {
  cwd: root,
  stdio: 'pipe'
});
const observations = [],
  controls = [],
  runtime = {
    node: process.version,
    browsers: {},
    reactVersions: {}
  };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.reactVersions[browserName] = await page.evaluate(() => React.version);
  for (const lang of ['en', 'vi']) for (const dir of ['ltr', 'rtl']) for (const owner of ['ColorPicker', 'InputOTP']) {
    const samples = owner === 'ColorPicker' ? [{
      draft: '#123456'
    }, {
      draft: 'invalid'
    }] : [{
      controlled: true,
      index: 1
    }, {
      controlled: true,
      index: 3
    }, {
      controlled: false,
      index: 1
    }, {
      controlled: false,
      index: 3
    }];
    for (const sample of samples) for (const flag of ['composing', '229', 'both', 'native']) {
      await page.evaluate(({
        lang,
        dir,
        owner,
        sample
      }) => {
        renderFixture(null);
        window.editableCalls = [];
        window.editableEvents = [];
        function Case() {
          const [value, setValue] = React.useState(owner === 'ColorPicker' ? '#F4BA17' : '123');
          const props = {
            lang,
            onChange: v => {
              window.editableCalls.push(v);
              if (owner === 'ColorPicker' || sample.controlled) setValue(v);
            }
          };
          if (owner === 'ColorPicker' || sample.controlled) props.value = value;
          if (owner === 'InputOTP') props.length = 4;
          return React.createElement('div', {
            lang,
            dir
          }, React.createElement(CS[owner], props));
        }
        renderFixture(React.createElement(Case));
      }, {
        lang,
        dir,
        owner,
        sample
      });
      if (owner === 'ColorPicker') {
        await page.locator('.cs-colorpicker__field').click();
        await page.locator('.cs-colorpicker__hex input').fill(sample.draft);
      } else if (!sample.controlled) {
        for (let i = 0; i < 3; i++) await page.locator('.cs-otp input').nth(i).fill(String(i + 1));
      }
      const target = owner === 'ColorPicker' ? page.locator('.cs-colorpicker__hex input') : page.locator('.cs-otp input').nth(sample.index);
      await target.focus();
      await target.evaluate(el => {
        window.editableCalls = [];
        el.addEventListener('keydown', e => window.editableEvents.push({
          key: e.key,
          isComposing: e.isComposing,
          keyCode: e.keyCode,
          isTrusted: e.isTrusted
        }));
      });
      const before = await page.evaluate(({
        owner
      }) => owner === 'ColorPicker' ? {
        open: !!document.querySelector('.cs-colorpicker__pop'),
        value: document.querySelector('.cs-colorpicker__field code').textContent,
        hex: document.querySelector('.cs-colorpicker__hex input').value,
        focus: document.activeElement === document.querySelector('.cs-colorpicker__hex input')
      } : {
        value: Array.from(document.querySelectorAll('.cs-otp input'), e => e.value).join(''),
        focusIndex: Array.from(document.querySelectorAll('.cs-otp input')).indexOf(document.activeElement)
      }, {
        owner
      });
      if (owner === 'ColorPicker') {
        assert(before.open && before.focus);
        assert.equal(before.hex, sample.draft);
      } else {
        assert.equal(before.value, '123');
        assert.equal(before.focusIndex, sample.index);
      }
      const key = owner === 'ColorPicker' ? 'Enter' : 'Backspace';
      let dispatched = null;
      if (flag === 'native') await page.keyboard.press(key);else dispatched = await target.evaluate((el, {
        flag,
        key
      }) => {
        const e = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
          isComposing: flag === 'composing' || flag === 'both',
          keyCode: flag === '229' || flag === 'both' ? 229 : 0
        });
        const dispatchReturned = el.dispatchEvent(e);
        return {
          dispatchReturned,
          defaultPrevented: e.defaultPrevented,
          isComposing: e.isComposing,
          keyCode: e.keyCode,
          isTrusted: e.isTrusted
        };
      }, {
        flag,
        key
      });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const after = await page.evaluate(({
        owner
      }) => owner === 'ColorPicker' ? {
        open: !!document.querySelector('.cs-colorpicker__pop'),
        value: document.querySelector('.cs-colorpicker__field code').textContent,
        hex: document.querySelector('.cs-colorpicker__hex input')?.value ?? null,
        focus: document.activeElement === document.querySelector('.cs-colorpicker__hex input'),
        calls: window.editableCalls.slice(),
        events: window.editableEvents.slice()
      } : {
        value: Array.from(document.querySelectorAll('.cs-otp input'), e => e.value).join(''),
        focusIndex: Array.from(document.querySelectorAll('.cs-otp input')).indexOf(document.activeElement),
        calls: window.editableCalls.slice(),
        events: window.editableEvents.slice()
      }, {
        owner
      });
      assert.equal(after.events.length, 1);
      assert.equal(after.events[0].key, key);
      const row = {
        browserName,
        lang,
        dir,
        owner,
        sample,
        flag,
        key,
        before,
        after,
        dispatched
      };
      if (flag === 'native') {
        assert.equal(after.events[0].isTrusted, true);
        assert.equal(after.events[0].isComposing, false);
        row.controlMismatch = owner === 'ColorPicker' ? after.open || after.value !== (sample.draft === '#123456' ? '#123456' : '#F4BA17') || JSON.stringify(after.calls) !== JSON.stringify(sample.draft === '#123456' ? ['#123456'] : []) : after.value !== (sample.index === 1 ? '13' : '12') || JSON.stringify(after.calls) !== JSON.stringify([sample.index === 1 ? '13' : '12']) || after.focusIndex !== Math.max(0, sample.index - 1);
        controls.push(row);
      } else {
        assert.equal(dispatched.isTrusted, false);
        assert.equal(dispatched.isComposing, flag === 'composing' || flag === 'both');
        assert.equal(dispatched.keyCode, flag === '229' || flag === 'both' ? 229 : 0);
        row.changed = owner === 'ColorPicker' ? !after.open || after.value !== before.value || after.hex !== before.hex || after.calls.length > 0 || !after.focus : after.value !== before.value || after.focusIndex !== before.focusIndex || after.calls.length > 0 || dispatched.defaultPrevented;
        observations.push(row);
      }
    }
  }
  console.log(browserName + ': ' + observations.filter(r => r.browserName === browserName).length + ' flagged observations and ' + controls.filter(r => r.browserName === browserName).length + ' native controls complete');
}, {
  browserName
});
assert.equal(observations.length, 216);
assert.equal(controls.length, 72);
assert.deepEqual(Object.fromEntries(names.map(n => [n, sha(root + '/' + n)])), sourceFiles);
const failures = observations.filter(r => r.changed).length;
const nativeControlFailures = controls.filter(r => r.controlMismatch).length;
const byOwner = Object.fromEntries(['ColorPicker', 'InputOTP'].map(owner => [owner, {
  observations: observations.filter(r => r.owner === owner).length,
  failures: observations.filter(r => r.owner === owner && r.changed).length,
  nativeControls: controls.filter(r => r.owner === owner).length
}]));
if (report) writeFileSync(report, JSON.stringify({
  recordedAt: new Date().toISOString(),
  observations,
  controls,
  failures,
  nativeControlFailures,
  byOwner,
  runtime,
  sourceFiles,
  sourceUnchanged: true,
  scope: '216 synthetic composition/keyCode229 handler observations and72 native controls across3engines EN/VI LTR/RTL. ColorPicker valid/invalid hex Enter, controlled/uncontrolled InputOTP populated/empty Backspace; finite app-handler consistency, not physical OS IME/AT/conformance or acceptance.'
}, null, 2) + '\n');
console.log(JSON.stringify({
  observations: 216,
  failures,
  nativeControlFailures,
  byOwner,
  controls: 72
}));
assert.equal(failures, 0, 'Composition-marked keys must preserve state and focus');
assert.equal(nativeControlFailures, 0, 'Ordinary native Enter/Backspace must retain documented behavior');
