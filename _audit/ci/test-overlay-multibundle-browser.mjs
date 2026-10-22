import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const source = 'components/overlays/OverlayManager.jsx';
async function compile(name) {
  const result = await build({
    stdin: {
      contents: `import * as Components from './_esm/react.mjs'; import {getOverlayManager,overlayScopeContext} from './${source}'; window.${name}={...Components,getOverlayManager,overlayScopeContext};`,
      resolveDir: resolve('.')
    },
    bundle: true,
    write: false,
    format: 'iife',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    plugins: [{
      name: 'shared-external-react',
      setup(builder) {
        builder.onResolve({
          filter: /^react(?:-dom)?$/
        }, args => ({
          path: args.path,
          namespace: 'fixture-peers'
        }));
        builder.onLoad({
          filter: /.*/,
          namespace: 'fixture-peers'
        }, args => ({
          contents: args.path === 'react' ? 'module.exports=window.React;' : 'module.exports=window.ReactDOM;',
          loader: 'js'
        }));
      }
    }]
  });
  return result.outputFiles[0].text;
}
const [a, b] = await Promise.all([compile('MultiA'), compile('MultiB')]);
const evidence = {
  browserName,
  sourceSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
  bundles: [a, b].map(code => createHash('sha256').update(code).digest('hex'))
};
assert.notEqual(evidence.bundles[0], evidence.bundles[1]);
await withBrowserFixture(async page => {
  await page.addScriptTag({
    content: a
  });
  await page.addScriptTag({
    content: b
  });
  evidence.initial = await page.evaluate(() => {
    const x = MultiA.getOverlayManager(),
      y = MultiB.getOverlayManager();
    window.multiDismissals = [];
    const first = document.createElement('div'),
      second = document.createElement('div');
    document.body.append(first, second);
    const cleanA = x.register({
        kind: 'popover',
        panelEl: first,
        onEscape: () => multiDismissals.push('A')
      }),
      cleanB = y.register({
        kind: 'popover',
        panelEl: second,
        onEscape: () => multiDismissals.push('B')
      });
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true
    }));
    const result = {
      sameManager: x === y,
      sameOwnershipContext: MultiA.overlayScopeContext === MultiB.overlayScopeContext,
      dismissals: multiDismissals.slice()
    };
    cleanB();
    cleanA();
    first.remove();
    second.remove();
    return result;
  });
  mkdirSync('test-results/overlay-multibundle', {
    recursive: true
  });
  writeFileSync(`test-results/overlay-multibundle/${process.argv.includes('--baseline') ? 'baseline-' : ''}${browserName}.json`, JSON.stringify(evidence, null, 2) + '\n');
  assert.equal(evidence.initial.sameManager, true, 'Independently compiled bundles share the document manager');
  assert.equal(evidence.initial.sameOwnershipContext, true, 'React ownership context crosses bundle boundaries');
  assert.deepEqual(evidence.initial.dismissals, ['B'], 'One document key dismisses only the top registered layer');
  await page.evaluate(() => {
    const h = React.createElement;
    window.multiEvents = [];
    window.multiPop = [];
    const occupied = document.createElement('div');
    occupied.id = 'cs-overlay-root-1';
    occupied.dataset.multiOccupied = '';
    document.body.append(occupied);
    const prior = document.createElement('aside');
    prior.inert = true;
    prior.dataset.multiPrior = '';
    document.body.append(prior);
    document.body.style.overflow = 'scroll';
    function App() {
      const [outer, setOuter] = React.useState(false),
        [inner, setInner] = React.useState(false);
      window.multiSetOuter = setOuter;
      return h(React.StrictMode, null, h(MultiA.OverlayProvider, null, h('button', {
        id: 'multi-open',
        onClick: () => setOuter(true)
      }, 'Open outer'), h(MultiA.Dialog, {
        open: outer,
        title: 'Cross bundle outer',
        onClose: () => {
          multiEvents.push('outer');
          setOuter(false);
        }
      }, h('button', {
        id: 'multi-inner',
        onClick: () => setInner(true)
      }, 'Open inner'), h(MultiB.OverlayProvider, null, h(MultiB.AlertDialog, {
        open: inner,
        title: 'Cross bundle inner',
        onOpenChange: setInner,
        onCancel: () => multiEvents.push('inner')
      }), h(MultiB.Popover, {
        trigger: h('button', {
          id: 'multi-popup-trigger',
          type: 'button'
        }, 'Open cross popup'),
        'aria-label': 'Cross popup',
        onOpenChange: value => multiPop.push(value)
      }, h('button', {
        id: 'multi-popup-control',
        type: 'button'
      }, 'Cross popup control')), h('form', {
        id: 'multi-native-form'
      }, h('fieldset', {
        id: 'multi-native-fieldset'
      }, h(MultiB.Popover, {
        trigger: h('button', {
          id: 'multi-native-trigger',
          type: 'button'
        }, 'Native popup'),
        'aria-label': 'Native cross popup'
      }, h('input', {
        id: 'multi-native-input',
        name: 'draft',
        defaultValue: 'kept',
        required: true
      }), h('button', {
        type: 'submit'
      }, 'Save native'))))))));
    }
    renderFixture(h(App));
  });
  await page.locator('#multi-open').focus();
  assert.equal(await page.locator('#multi-open').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  await page.getByRole('dialog', {
    name: 'Cross bundle outer',
    exact: true
  }).waitFor();
  await page.locator('#multi-inner').focus();
  assert.equal(await page.locator('#multi-inner').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  await page.getByRole('alertdialog', {
    name: 'Cross bundle inner',
    exact: true
  }).waitFor();
  assert.equal(await page.evaluate(() => MultiA.getOverlayManager().depth), 2);
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  assert.equal(await page.locator('#multi-open').evaluate(el => Boolean(el.closest('[inert]'))), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.closest('[role="alertdialog"]')?.getAttribute('aria-modal')), 'true');
  await page.keyboard.press('Escape');
  await page.getByRole('alertdialog').waitFor({
    state: 'hidden'
  });
  assert.deepEqual(await page.evaluate(() => multiEvents), ['inner']);
  assert.equal(await page.locator('#multi-inner').evaluate(el => el === document.activeElement), true, 'Nested cross-bundle close restores its own connected opener');
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', 'Parent modal retains scroll lock');
  await page.locator('#multi-popup-trigger').click();
  await page.locator('#multi-popup-control').waitFor();
  assert.equal(await page.locator('#multi-popup-control').evaluate(el => Boolean(el.closest('[inert]'))), false, 'Body portal remains owned by modal from another bundle');
  assert.equal(await page.evaluate(() => MultiA.getOverlayManager().containsOwned(document.querySelector('[role="dialog"][aria-modal="true"]'), document.getElementById('multi-popup-control'))), true);
  await page.locator('#multi-popup-control').focus();
  await page.locator('#multi-popup-control').evaluate(el => el.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Escape',
    isComposing: true,
    bubbles: true,
    cancelable: true
  })));
  assert.equal(await page.locator('#multi-popup-control').count(), 1, 'Composing Escape does not dismiss across copies');
  await page.keyboard.press('Escape');
  await page.locator('#multi-popup-control').waitFor({
    state: 'hidden'
  });
  assert.deepEqual(await page.evaluate(() => multiEvents), ['inner']);
  await page.locator('#multi-native-trigger').click();
  await page.locator('#multi-native-input').waitFor();
  assert.deepEqual(await page.locator('#multi-native-input').evaluate(el => ({
    form: el.form?.id,
    disabled: el.matches(':disabled'),
    entry: new FormData(el.form).get('draft'),
    local: Boolean(el.closest('[data-cs-floating-inline]'))
  })), {
    form: 'multi-native-form',
    disabled: false,
    entry: 'kept',
    local: true
  });
  await page.locator('#multi-native-fieldset').evaluate(el => el.disabled = true);
  assert.equal(await page.locator('#multi-native-input').isDisabled(), true);
  assert.equal(await page.evaluate(() => new FormData(document.getElementById('multi-native-form')).has('draft')), false);
  await page.locator('#multi-native-fieldset').evaluate(el => el.disabled = false);
  assert.equal(await page.locator('#multi-native-input').isDisabled(), false);
  await page.keyboard.press('Escape');
  await page.locator('#multi-native-input').waitFor({
    state: 'hidden'
  });
  await page.evaluate(() => {
    const node = document.createElement('button');
    node.id = 'multi-dynamic-background';
    document.body.append(node);
  });
  await page.waitForFunction(() => document.getElementById('multi-dynamic-background').inert);
  const ids = await page.locator('[data-cs-overlay-root]').evaluateAll(nodes => nodes.map(el => el.id));
  assert(ids.every(Boolean));
  assert.equal(new Set(ids).size, ids.length, 'Every independent provider marker has a unique document ID');
  assert(!ids.includes('cs-overlay-root-1'), 'Existing native IDs cannot collide with provider markers');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', {
    name: 'Cross bundle outer',
    exact: true
  }).waitFor({
    state: 'hidden'
  });
  assert.deepEqual(await page.evaluate(() => multiEvents), ['inner', 'outer']);
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'scroll');
  assert.equal(await page.locator('#multi-open').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('#multi-dynamic-background').evaluate(el => el.inert), false);
  assert.equal(await page.locator('[data-multi-prior]').evaluate(el => el.inert), true);
  assert.equal(await page.evaluate(() => MultiA.getOverlayManager().depth), 0);
  await page.evaluate(() => renderFixture(null));
  assert.equal(await page.locator('[data-cs-overlay-root]').count(), 0);
  assert.equal(await page.locator('[data-cs-floating-root]').count(), 0);
  evidence.componentProof = {
    nestedModal: true,
    bodyPortalOwned: true,
    nativeFormFieldset: true,
    imeEscapeIgnored: true,
    scrollAndInertRestored: true,
    providerIds: ids,
    strictReplay: true
  };
  evidence.protocolNegatives = await page.evaluate(code => {
    const cases = ['protocol', 'capability', 'contexts', 'allocator', 'accessor', 'react-context'],
      results = [];
    for (const mode of cases) {
      const frame = document.createElement('iframe');
      document.body.append(frame);
      const w = frame.contentWindow;
      w.React = React;
      w.ReactDOM = ReactDOM;
      w.eval(`const methods=["register","registerScope","top","topDismissible","activeModal","focusScope","containsOwned","focusOrder"]; const manager=Object.fromEntries(methods.map(name=>[name,()=>{}]));manager.depth=0;manager.scrollLocked=false;window.invalidRecord={protocol:"cyberskill.overlay-manager/1",manager,contexts:new WeakMap(),nextProviderId:()=>"fixture"};`);
      if (mode === 'protocol') w.invalidRecord.protocol = 'cyberskill.overlay-manager/999';
      if (mode === 'capability') delete w.invalidRecord.manager.registerScope;
      if (mode === 'contexts') w.invalidRecord.contexts = {};
      if (mode === 'allocator') w.invalidRecord.nextProviderId = 'unreviewed';
      if (mode === 'react-context') w.invalidRecord.contexts.set(React, {
        manager: null,
        scope: null
      });
      const key = Symbol.for('@cyberskill/design/overlay-manager');
      if (mode === 'accessor') Object.defineProperty(w.document, key, {
        get() {
          w.accessorInvoked = true;
          throw Error('Registry getter must not run');
        }
      });else Object.defineProperty(w.document, key, {
        value: w.invalidRecord
      });
      let message;
      try {
        w.eval(code);
      } catch (error) {
        message = String(error.message);
      }
      results.push({
        mode,
        message,
        accessorInvoked: Boolean(w.accessorInvoked),
        overflow: w.document.body.style.overflow,
        markers: w.document.querySelectorAll('[data-cs-overlay-root]').length
      });
      frame.remove();
    }
    return results;
  }, a);
  for (const row of evidence.protocolNegatives) {
    assert.match(row.message, /Incompatible CyberSkill overlay registry/);
    assert.equal(row.accessorInvoked, false);
    assert.equal(row.overflow, '');
    assert.equal(row.markers, 0);
  }
  evidence.layerIdentity = await page.evaluate(code => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const w = frame.contentWindow;
    w.React = React;
    w.ReactDOM = ReactDOM;
    w.eval(code);
    const manager = w.MultiA.getOverlayManager(),
      first = w.document.createElement('div'),
      second = w.document.createElement('div');
    w.document.body.append(first, second);
    const provided = manager.register({
        id: 'cs-ov-2',
        kind: 'popover',
        panelEl: first
      }),
      generated = manager.register({
        kind: 'popover',
        panelEl: second
      });
    const ids = [manager.top().id];
    generated();
    ids.unshift(manager.top().id);
    provided();
    const cleanA = manager.register({
        id: 'same-caller-id',
        kind: 'popover',
        panelEl: first
      }),
      cleanB = manager.register({
        id: 'same-caller-id',
        kind: 'popover',
        panelEl: second
      });
    cleanA();
    const retained = manager.top().panelEl === second && manager.depth === 1;
    cleanB();
    w.document.body.style.setProperty('overflow', 'scroll', 'important');
    const modal = manager.register({
      kind: 'modal',
      panelEl: first
    });
    const locked = w.document.body.style.overflow;
    modal();
    const result = {
      ids,
      retained,
      depth: manager.depth,
      overflow: {
        locked,
        value: w.document.body.style.overflow,
        priority: w.document.body.style.getPropertyPriority('overflow')
      }
    };
    frame.remove();
    return result;
  }, a);
  assert.equal(new Set(evidence.layerIdentity.ids).size, 2, 'Generated IDs do not collide with caller IDs');
  assert.equal(evidence.layerIdentity.retained, true, 'Cleanup uses registration identity even when callers reuse an ID');
  assert.equal(evidence.layerIdentity.depth, 0);
  assert.deepEqual(evidence.layerIdentity.overflow, {
    locked: 'hidden',
    value: 'scroll',
    priority: 'important'
  }, 'Scroll cleanup restores the original inline CSS priority');
  evidence.status = 'PASS';
  writeFileSync(`test-results/overlay-multibundle/${browserName}.json`, JSON.stringify(evidence, null, 2) + '\n');
}, {
  browserName,
  development: true,
  contextOptions: {
    reducedMotion: 'reduce'
  }
});
console.log('PASS ' + browserName + ': independently compiled source bundles share document ownership and top-only Escape');
