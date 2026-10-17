import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  // Dialog/Drawer visibility is parent-controlled. Establish the focused
  // external opener with keyboard activation before testing focus return;
  // native pointer clicks do not focus buttons consistently across engines.
  const activate = async selector => {
    await page.locator(selector).focus();
    await page.locator(selector).press('Enter');
  };
  await page.evaluate(() => {
    const h = React.createElement;
    document.body.style.overflow = 'clip';
    window.strictEffectStarts = 0;
    const untouched = document.createElement('div'); untouched.id = 'prior-inert'; untouched.inert = true; document.body.append(untouched);
    function App() {
      React.useEffect(() => { strictEffectStarts += 1; }, []);
      const [outer, setOuter] = React.useState(false);
      const [inner, setInner] = React.useState(false);
      window.closeOuter = () => setOuter(false);
      return h(React.StrictMode, null,
        h('button', { id: 'open-outer', onClick: () => setOuter(true) }, 'Open'),
        h('button', { id: 'background' }, 'Background'),
        h(CS.ToastStack, null, h(CS.Toast, { id: 'notification' }, 'Background notification')),
        h(CS.Dialog, { open: outer, title: 'Outer', onClose: () => setOuter(false) },
          h('button', { id: 'hidden-button', hidden: true }, 'Hidden'),
          h('button', { id: 'open-inner', onClick: () => setInner(true) }, 'Nested'),
          h('button', { id: 'outer-last' }, 'Last'),
          h(CS.Drawer, { open: inner, title: 'Inner', onClose: () => setInner(false) }, h('button', { id: 'inner-last' }, 'Inside'))));
    }
    renderFixture(h(React.StrictMode, null, h(App)));
  });
  await page.waitForFunction(() => strictEffectStarts === 2);
  await activate('#open-outer');
  assert.ok(await page.locator('#background').evaluate(el => !!el.closest('[inert]')), 'modal makes background inert');
  assert.equal(await page.locator('#notification').evaluate(el => !!el.closest('[inert]')), false, 'live notification remains accessible');
  await page.locator('#background').evaluate(el => el.focus());
  assert.ok(await page.evaluate(() => !!document.activeElement.closest('.cs-dialog')), 'background cannot take focus');
  await page.evaluate(() => { const button = document.createElement('button'); button.id = 'late-background'; button.textContent = 'Late'; document.body.append(button); });
  await page.waitForFunction(() => document.getElementById('late-background').inert);
  await activate('#open-inner');
  assert.ok(await page.locator('#outer-last').evaluate(el => !!el.closest('[inert]')), 'nested modal excludes parent controls');
  await page.locator('#inner-last').focus();
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(() => !!document.activeElement.closest('.cs-drawer')));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#open-inner').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('#outer-last').evaluate(el => !!el.closest('[inert]')), false);
  assert.ok(await page.locator('#background').evaluate(el => !!el.closest('[inert]')));
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#open-outer').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('#background').evaluate(el => !!el.closest('[inert]')), false);
  assert.equal(await page.locator('#late-background').evaluate(el => el.inert), false);
  assert.equal(await page.locator('#prior-inert').evaluate(el => el.inert), true, 'pre-existing inert preserved');
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'clip');
  await activate('#open-outer');
  await page.locator('.cs-dialog__overlay').click({ position: { x: 3, y: 3 } });
  assert.equal(await page.getByRole('dialog').count(), 0, 'backdrop remains interactive');
  await activate('#open-outer');
  await activate('#open-inner');
  await page.evaluate(() => ReactDOM.flushSync(() => closeOuter()));
  assert.equal(await page.locator('#open-outer').evaluate(el => el === document.activeElement), true, 'removing a parent with an open child restores the surviving opener');
  await page.evaluate(() => { renderFixture(null); document.getElementById('prior-inert').remove(); document.getElementById('late-background').remove(); document.body.style.overflow = ''; });
  await page.evaluate(() => {
    const h = React.createElement;
    const host = document.createElement('div'); host.id = 'portal-host'; host.style.cssText = 'position:fixed;top:20px;left:20px;z-index:calc(var(--cs-depth-modal) + 1)'; document.body.append(host);
    function PortalApp({ initial = false }) {
      const [open, setOpen] = React.useState(false);
      const [child, setChild] = React.useState(initial);
      return h(CS.OverlayProvider, null, h('button', { id: 'portal-opener', onClick: () => setOpen(true) }, 'Open portal modal'),
        h(CS.Dialog, { open, title: 'Portal parent', onClose: () => setOpen(false) },
          h('button', { id: 'modal-action' }, 'Modal action'),
          open ? ReactDOM.createPortal(h(CS.Popover, { open: child, onOpenChange: setChild, trigger: h('button', { id: 'portal-trigger' }, 'Portal trigger') }, h('button', { id: 'portal-action' }, 'Portal action')), host) : null));
    }
    window.mountPortalApp = initial => renderFixture(h(PortalApp, { key: String(initial), initial }));
    mountPortalApp(false);
  });
  await activate('#portal-opener');
  assert.equal(await page.locator('#portal-trigger').evaluate(el => !!el.closest('[inert]')), false, 'closed portalled trigger belongs to modal');
  await page.locator('#portal-trigger').click();
  await page.locator('#portal-action').focus();
  assert.equal(await page.locator('#portal-action').evaluate(el => el === document.activeElement), true, 'portal can keep focus');
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(() => !!document.activeElement.closest('.cs-dialog')), 'Tab wraps across portal scope');
  await page.locator('#portal-action').focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#portal-action').count(), 0);
  assert.equal(await page.locator('#portal-trigger').evaluate(el => el === document.activeElement), true, 'restore to portalled trigger');
  assert.equal(await page.getByRole('dialog', { name: 'Portal parent' }).count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#portal-opener').evaluate(el => el === document.activeElement), true);
  await page.evaluate(() => mountPortalApp(true));
  await activate('#portal-opener');
  await page.locator('#portal-action').waitFor();
  assert.equal(await page.locator('#portal-action').evaluate(el => !!el.closest('[inert]')), false, 'initially open portal respects React ancestry');
  await page.locator('#portal-action').focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#portal-action').count(), 0);
  assert.equal(await page.getByRole('dialog', { name: 'Portal parent' }).count(), 1, 'child-first effect order preserves parent');
  await page.keyboard.press('Escape');
  await page.evaluate(() => { renderFixture(null); document.getElementById('portal-host').remove(); });

  await page.evaluate(() => {
    const h = React.createElement;
    function LateToastApp() {
      const [open, setOpen] = React.useState(false);
      const [toast, setToast] = React.useState(false);
      return h(React.Fragment, null,
        h('button', { id: 'toast-opener', onClick: () => setOpen(true) }, 'Open'),
        h(CS.Dialog, { open, title: 'Late notification', onClose: () => setOpen(false) },
          h('button', { id: 'notify', onClick: () => setToast(true) }, 'Notify')),
        toast && h(CS.ToastStack, null, h(CS.Toast, { id: 'late-toast' }, 'Notice')));
    }
    renderFixture(h(LateToastApp));
  });
  await activate('#toast-opener');
  await activate('#notify');
  await page.locator('#late-toast').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.equal(await page.locator('#toast-opener').evaluate(el => el === document.activeElement), true, 'a newer toast cannot suppress modal focus restoration');
  assert.equal(await page.locator('#late-toast').count(), 1, 'toast remains mounted while modal focus returns');

  // The operator-approved policy protects the initial Enter action while
  // retaining ordinary confirmation, alias precedence and both state modes.
  const focusPolicies = [
    { label: 'default', props: {}, cancelFirst: false },
    { label: 'ordinary', props: { tone: 'default' }, cancelFirst: false },
    { label: 'destructive', props: { tone: 'destructive' }, cancelFirst: true },
    { label: 'destructive alias', props: { variant: 'destructive' }, cancelFirst: true },
    { label: 'ordinary overrides alias', props: { tone: 'default', variant: 'destructive' }, cancelFirst: false },
    { label: 'destructive overrides alias', props: { tone: 'destructive', variant: 'default' }, cancelFirst: true },
  ];
  for (const lang of ['en', 'vi']) for (const controlled of [false, true]) for (const policy of focusPolicies) {
    const label = `${lang}/${controlled ? 'controlled' : 'uncontrolled'}/${policy.label}`;
    for (const action of ['Enter', 'Escape']) {
      await page.evaluate(({ lang, controlled, props }) => {
        renderFixture(null); window.alertPolicyEvents = { confirm: 0, cancel: 0, openChanges: [] };
        const h = React.createElement;
        function App() {
          const [mounted, setMounted] = React.useState(false), [open, setOpen] = React.useState(false);
          const change = value => { alertPolicyEvents.openChanges.push(value); if (controlled) setOpen(value); };
          return h(React.Fragment, null,
            h('button', { id: 'alert-policy-opener', onClick: () => { setMounted(true); setOpen(true); } }, 'Open alert'),
            mounted && h(CS.AlertDialog, { ...props, lang, title: 'Policy test',
              ...(controlled ? { open } : { defaultOpen: true }), onOpenChange: change,
              onConfirm: () => alertPolicyEvents.confirm++, onCancel: () => alertPolicyEvents.cancel++ }));
        }
        renderFixture(h(App));
      }, { lang, controlled, props: policy.props });
      await activate('#alert-policy-opener');
      const initial = policy.cancelFirst ? '.cs-alert-dialog__cancel' : '.cs-alert-dialog__confirm';
      const other = policy.cancelFirst ? '.cs-alert-dialog__confirm' : '.cs-alert-dialog__cancel';
      await page.waitForFunction(selector => document.activeElement.matches(selector), initial);
      assert.equal(await page.locator('.cs-alert-dialog__cancel').textContent(), lang === 'vi' ? 'Hủy' : 'Cancel', label + ': localized cancel');
      assert.equal(await page.locator('.cs-alert-dialog__confirm').textContent(), lang === 'vi' ? 'Xác nhận' : 'Confirm', label + ': localized confirm');
      await page.keyboard.press('Tab');
      assert(await page.locator(other).evaluate(el => el === document.activeElement), label + ': forward focus remains inside');
      await page.keyboard.press('Shift+Tab');
      assert(await page.locator(initial).evaluate(el => el === document.activeElement), label + ': reverse focus returns to initial action');
      await page.keyboard.press(action);
      await page.getByRole('alertdialog').waitFor({ state: 'detached' });
      assert(await page.locator('#alert-policy-opener').evaluate(el => el === document.activeElement), label + ': opener restored');
      const cancelled = action === 'Escape' || policy.cancelFirst;
      assert.deepEqual(await page.evaluate(() => alertPolicyEvents), { confirm: cancelled ? 0 : 1, cancel: cancelled ? 1 : 0, openChanges: [false] }, label + ': ' + action + ' activates exactly the intended callback');
    }
  }
  for (const lang of ['en', 'vi']) for (const controlled of [false, true]) {
    await page.evaluate(({ lang, controlled }) => {
      renderFixture(null); const h = React.createElement;
      function App() {
        const [outer, setOuter] = React.useState(false), [mounted, setMounted] = React.useState(false), [inner, setInner] = React.useState(false);
        return h(React.Fragment, null, h('button', { id: 'policy-parent-opener', onClick: () => setOuter(true) }, 'Open parent'),
          h(CS.Dialog, { open: outer, title: 'Policy parent', onClose: () => setOuter(false) },
            h('button', { id: 'policy-inner-opener', onClick: () => { setMounted(true); setInner(true); } }, 'Open nested alert'),
            mounted && h(CS.AlertDialog, { tone: 'destructive', lang, title: 'Nested policy',
              ...(controlled ? { open: inner } : { defaultOpen: true }), onOpenChange: value => { if (controlled) setInner(value); } })));
      }
      renderFixture(h(App));
    }, { lang, controlled });
    await activate('#policy-parent-opener'); await activate('#policy-inner-opener');
    await page.waitForFunction(() => document.activeElement.matches('.cs-alert-dialog__cancel'));
    await page.keyboard.press('Escape'); await page.getByRole('alertdialog').waitFor({ state: 'detached' });
    assert.equal(await page.getByRole('dialog', { name: 'Policy parent', exact: true }).count(), 1, 'nested alert Escape preserves parent');
    assert(await page.locator('#policy-inner-opener').evaluate(el => el === document.activeElement), 'nested alert returns to parent trigger');
    await page.keyboard.press('Escape');
    assert(await page.locator('#policy-parent-opener').evaluate(el => el === document.activeElement), 'second Escape restores external trigger');
  }

}, { development: true, browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log('PASS modal focus isolation: nested inert ownership, dynamic backgrounds, focus/scroll restoration, backdrop, portal ordering, notifications development StrictMode replay, 48 EN/VI AlertDialog action-policy cases and four nested policy cases');
