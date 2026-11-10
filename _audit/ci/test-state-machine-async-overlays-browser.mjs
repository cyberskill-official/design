import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });

const browserName = process.env.CS_TEST_BROWSER || 'chromium';

await withBrowserFixture(async page => {
  // 1. Form + FormFieldArray: stale async validation cancellation on reset + array row removal error clearing
  for (const lang of ['vi', 'en']) {
    for (const theme of ['light', 'dark']) {
      await page.evaluate(({ lang, theme }) => {
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('data-theme', theme);
        window.__formState = { submits: [], asyncSettlers: [] };
        const h = React.createElement;

        function AsyncArrayFormHarness() {
          return h(
            CS.Form,
            {
              lang,
              initialValues: { items: [{ code: 'A1' }, { code: 'B2' }] },
              rules: {
                'items.0.code': 'required',
              },
              asyncRules: {
                'items.0.code': val =>
                  new Promise(resolve => {
                    window.__formState.asyncSettlers.push({ val, resolve });
                  }),
              },
              onSubmit: values => {
                window.__formState.submits.push(structuredClone(values));
              },
            },
            h(
              CS.FormFieldArray,
              { name: 'items', label: lang === 'vi' ? 'Danh sách mã' : 'Code list', defaultItem: { code: '' } },
              ({ index, remove, path }) =>
                h(
                  'div',
                  { className: 'row-item', 'data-row': index },
                  h(
                    CS.FormField,
                    { name: path('code'), label: `Code ${index}` },
                    h('input', { id: `code-input-${index}`, 'aria-label': `Code ${index}` })
                  ),
                  h(
                    'button',
                    { type: 'button', id: `remove-row-${index}`, onClick: remove },
                    lang === 'vi' ? 'Xóa' : 'Remove'
                  )
                )
            ),
            h('button', { type: 'submit', id: 'submit-btn' }, lang === 'vi' ? 'Lưu' : 'Save'),
            h('button', { type: 'reset', id: 'reset-btn' }, lang === 'vi' ? 'Đặt lại' : 'Reset')
          );
        }

        renderFixture(h(AsyncArrayFormHarness));
      }, { lang, theme });

      // Edit row 0 and start async submit
      const input0 = page.locator('#code-input-0');
      await input0.fill('TEMP-99');
      await page.locator('#submit-btn').click();

      // Form is now pending on asyncRules['items.0.code']
      await page.waitForFunction(() => window.__formState.asyncSettlers.length === 1);
      assert.equal(await page.locator('.cs-form').getAttribute('aria-busy'), 'true', `${lang}/${theme}: form is aria-busy during async validation`);

      // Reset form while async validation is in-flight
      await page.evaluate(() => document.querySelector('form').reset());
      await page.waitForFunction(() => !document.querySelector('.cs-form[aria-busy="true"]'));
      assert.equal(await input0.inputValue(), 'A1', `${lang}/${theme}: reset restores initial seed value`);

      // Resolve stale async validation with an error; must be ignored
      await page.evaluate(() => {
        window.__formState.asyncSettlers[0].resolve('Stale async error must not apply');
      });
      await page.waitForTimeout(30);
      assert.equal(await page.locator('.cs-form__summary').count(), 0, `${lang}/${theme}: stale async error after reset is discarded`);
      assert.equal(await page.evaluate(() => window.__formState.submits.length), 0, `${lang}/${theme}: reset cancels pending submit`);

      // Trigger sync error on row 0 by clearing it and submitting
      await input0.fill('');
      await page.locator('#submit-btn').click();
      assert.equal(await page.locator('.cs-form__summary[role="alert"]').count(), 1, `${lang}/${theme}: sync required error summary shown`);

      // Remove row 0 via FormFieldArray remove button -> clears items.* errors and shifts B2 to index 0
      await page.locator('#remove-row-0').click();
      assert.equal(await page.locator('.cs-form__summary').count(), 0, `${lang}/${theme}: removing array row clears stale indexed errors`);
      assert.equal(await page.locator('#code-input-0').inputValue(), 'B2', `${lang}/${theme}: remaining row shifts cleanly to index 0`);

      // Submit again and resolve async rule cleanly
      await page.locator('#submit-btn').click();
      await page.waitForFunction(() => window.__formState.asyncSettlers.length === 2);
      await page.evaluate(() => window.__formState.asyncSettlers[1].resolve(null));
      await page.waitForFunction(() => window.__formState.submits.length === 1);
      assert.deepEqual(
        await page.evaluate(() => window.__formState.submits[0]),
        { 'items.0.code': 'B2', items: [{ code: 'B2' }] },
        `${lang}/${theme}: clean submit after row removal submits updated array`
      );
    }
  }

  // 2. FormWizard: step validation, Back/Next lock during async completion, rejection recovery
  for (const lang of ['vi', 'en']) {
    await page.evaluate(lang => {
      document.documentElement.lang = lang;
      window.__wizardState = { completed: [], settle: null };
      const h = React.createElement;

      function WizardHarness() {
        return h(CS.FormWizard, {
          lang,
          initialValues: { org: '', quota: '10' },
          steps: [
            {
              id: 'org-step',
              title: lang === 'vi' ? 'Tổ chức' : 'Organization',
              rules: { org: 'required' },
              render: () =>
                h(
                  CS.FormField,
                  { name: 'org', label: lang === 'vi' ? 'Tên tổ chức' : 'Organization name', required: true },
                  h('input', { id: 'wiz-org', 'aria-label': 'Organization name' })
                ),
            },
            {
              id: 'quota-step',
              title: lang === 'vi' ? 'Hạn mức' : 'Quota',
              rules: {
                quota: val => (Number(val) > 0 ? null : lang === 'vi' ? 'Hạn mức phải > 0' : 'Quota must be > 0'),
              },
              render: () =>
                h(
                  CS.FormField,
                  { name: 'quota', label: lang === 'vi' ? 'Hạn mức' : 'Quota' },
                  h('input', { id: 'wiz-quota', 'aria-label': 'Quota' })
                ),
            },
          ],
          onComplete: values =>
            new Promise((resolve, reject) => {
              window.__wizardState.settle = { resolve, reject, values: structuredClone(values) };
            }).then(res => {
              window.__wizardState.completed.push(res);
            }),
        });
      }

      renderFixture(h(WizardHarness));
    }, lang);

    const wiz = page.locator('.cs-form-wizard');
    const nextBtn = page.locator('.cs-form-wizard__nav button:last-child');
    const backBtn = page.locator('.cs-form-wizard__nav button:first-child');

    // Step 0 blocked when required field is empty
    await nextBtn.click();
    assert.equal(await wiz.getAttribute('data-step'), '0', `${lang}: wizard stays on step 0 when invalid`);
    assert.equal(await page.locator('.cs-formfield__error[role="alert"]').count(), 1, `${lang}: step 0 field error rendered`);

    // Fill valid step 0 and advance
    await page.locator('#wiz-org').fill('CyberSkill');
    await nextBtn.click();
    assert.equal(await wiz.getAttribute('data-step'), '1', `${lang}: wizard advances to step 1`);

    // Trigger final completion and verify both Back and Finish are locked while pending
    await nextBtn.click();
    await page.waitForFunction(() => window.__wizardState.settle !== null);
    assert.equal(await wiz.getAttribute('aria-busy'), 'true', `${lang}: wizard is aria-busy during onComplete`);
    assert.equal(await backBtn.isDisabled(), true, `${lang}: Back button disabled during pending completion`);
    assert.equal(await nextBtn.isDisabled(), true, `${lang}: Finish button disabled during pending completion`);

    // Reject completion -> error alert shown, controls unlocked
    await page.evaluate(() => window.__wizardState.settle.reject(new Error('Quota service timeout')));
    await page.waitForFunction(() => !document.querySelector('.cs-form-wizard[aria-busy="true"]'));
    assert.equal(await page.locator('.cs-form__summary[role="alert"]').innerText().then(t => t.includes('Quota service timeout')), true);
    assert.equal(await backBtn.isDisabled(), false, `${lang}: Back button unlocked after rejection`);

    // Retry and resolve
    await nextBtn.click();
    await page.waitForFunction(() => document.querySelector('.cs-form-wizard[aria-busy="true"]'));
    await page.evaluate(() => window.__wizardState.settle.resolve(window.__wizardState.settle.values));
    await page.waitForFunction(() => window.__wizardState.completed.length === 1);
    assert.deepEqual(await page.evaluate(() => window.__wizardState.completed[0]), { org: 'CyberSkill', quota: '10' });
  }

  // 3. 3-Level Nested Overlays: Dialog (L1) -> Drawer (L2) -> Popconfirm & Combobox (L3)
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => {
      document.documentElement.setAttribute('data-theme', theme);
      const h = React.createElement;

      function NestedOverlayHarness() {
        const [dialogOpen, setDialogOpen] = React.useState(false);
        const [drawerOpen, setDrawerOpen] = React.useState(false);
        const [comboVal, setComboVal] = React.useState('u1');
        return h(
          'div',
          { style: { padding: 24 } },
          h(
            'button',
            { id: 'open-l1-dialog', type: 'button', onClick: () => setDialogOpen(true) },
            'Open L1 Dialog'
          ),
          h(
            CS.Dialog,
            {
              open: dialogOpen,
              onClose: () => setDialogOpen(false),
              title: 'Level 1 Dialog',
            },
            h(
              'div',
              { style: { display: 'flex', gap: 12, alignItems: 'center' } },
              h(
                'button',
                { id: 'open-l2-drawer', type: 'button', onClick: () => setDrawerOpen(true) },
                'Open L2 Drawer'
              )
            ),
            h(
              CS.Drawer,
              {
                open: drawerOpen,
                onClose: () => setDrawerOpen(false),
                title: 'Level 2 Drawer',
              },
              h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
                h(CS.Popconfirm, {
                  title: 'Confirm archive?',
                  trigger: h('button', { id: 'open-l3-popconfirm', type: 'button' }, 'Open L3 Popconfirm'),
                  onConfirm: () => {},
                }),
                h(CS.Combobox, {
                  id: 'l3-combobox',
                  label: 'Assignee',
                  value: comboVal,
                  onChange: setComboVal,
                  options: [
                    { value: 'u1', label: 'Minh Trần' },
                    { value: 'u2', label: 'Lan Nguyễn' },
                  ],
                })
              )
            )
          )
        );
      }

      renderFixture(h(NestedOverlayHarness));
    }, theme);

    // Open Level 1 Dialog via keyboard activation so WebKit preserves button focus
    await page.locator('#open-l1-dialog').focus();
    await page.keyboard.press('Enter');
    await page.locator('.cs-dialog').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', `${theme}: L1 Dialog locks body scroll`);

    // Open Level 2 Drawer inside Dialog via keyboard activation
    await page.locator('#open-l2-drawer').focus();
    await page.keyboard.press('Enter');
    await page.locator('.cs-drawer').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', `${theme}: L2 Drawer preserves body scroll lock`);

    // Open Level 3A Popconfirm inside Drawer
    await page.locator('#open-l3-popconfirm').focus();
    await page.locator('#open-l3-popconfirm').click();
    await page.locator('.cs-popconfirm__panel').waitFor({ state: 'visible' });

    // First Escape: dismisses ONLY Level 3A Popconfirm, keeps L2 Drawer & L1 Dialog open, restores focus to #open-l3-popconfirm
    await page.keyboard.press('Escape');
    await page.locator('.cs-popconfirm__panel').waitFor({ state: 'detached' });
    assert.equal(await page.locator('.cs-drawer').count(), 1, `${theme}: L2 Drawer stays open after L3 Popconfirm Escape`);
    assert.equal(await page.locator('.cs-dialog').count(), 1, `${theme}: L1 Dialog stays open after L3 Popconfirm Escape`);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', `${theme}: body scroll still locked`);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'open-l3-popconfirm', `${theme}: focus restored to L3 Popconfirm trigger`);

    // Open Level 3B Combobox inside Drawer
    const comboInput = page.locator('.cs-drawer [role="combobox"]');
    await comboInput.click();
    await page.locator('.cs-combobox__list, [role="listbox"]').first().waitFor({ state: 'visible' });

    // Escape on open Combobox: closes ONLY Combobox popup, keeps L2 Drawer & L1 Dialog open
    await page.keyboard.press('Escape');
    await page.locator('[role="listbox"]').waitFor({ state: 'detached' });
    assert.equal(await page.locator('.cs-drawer').count(), 1, `${theme}: L2 Drawer stays open after L3 Combobox Escape`);
    assert.equal(await page.locator('.cs-dialog').count(), 1, `${theme}: L1 Dialog stays open after L3 Combobox Escape`);

    // Next Escape: dismisses Level 2 Drawer, keeps L1 Dialog open, keeps scroll locked, restores focus to #open-l2-drawer
    await page.keyboard.press('Escape');
    await page.locator('.cs-drawer').waitFor({ state: 'detached' });
    assert.equal(await page.locator('.cs-dialog').count(), 1, `${theme}: L1 Dialog stays open after L2 Drawer Escape`);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', `${theme}: body scroll remains locked while L1 Dialog is open`);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'open-l2-drawer', `${theme}: focus restored to L2 Drawer trigger inside L1 Dialog`);

    // Final Escape: dismisses Level 1 Dialog, unlocks body scroll, restores focus to #open-l1-dialog
    await page.keyboard.press('Escape');
    await page.locator('.cs-dialog').waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '', `${theme}: body scroll unlocked when last modal closes`);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'open-l1-dialog', `${theme}: focus restored to outer L1 Dialog trigger`);
  }
}, { browserName });

console.log(
  `PASS state-machine async forms & 3-level nested overlays (${browserName}): Form/FormFieldArray stale async reset & row removal, FormWizard completion lock, and L1 Dialog -> L2 Drawer -> L3 Popconfirm/Combobox Escape/scroll-lock/focus stack`
);
