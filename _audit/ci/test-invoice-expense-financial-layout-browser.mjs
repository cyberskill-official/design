import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { waitForNativeTemplate } from './lib/native-template-ready.mjs';
const configs = [{
  slug: 'invoice',
  file: 'templates/finance-invoice/FinanceInvoice.dc.html',
  names: ['Invoice line items and amounts', 'Hạng mục và số tiền hóa đơn'],
  titles: ['INVOICE', 'HÓA ĐƠN'],
  reference: 'INV-2026-0142',
  money: ['1,200,000,000', '1,200,000,000', '18,000,000', '54,000,000', '40,000,000', '40,000,000', '₫1,294,000,000', '₫129,400,000', '₫1,423,400,000']
}, {
  slug: 'expense',
  file: 'templates/finance-expense-report/FinanceExpenseReport.dc.html',
  names: ['Expense items and amounts', 'Khoản chi và số tiền'],
  titles: ['EXP-2026-081', 'EXP-2026-081'],
  reference: 'EXP-2026-081',
  money: ['3,400,000', '1,650,000', '980,000', '₫6,030,000']
}];
const selected = process.argv.find(x => x.startsWith('--template='))?.slice(11),
  active = selected ? configs.filter(c => c.slug === selected) : configs;
assert(active.length > 0);
const sources = [...configs.map(c => c.file), 'base/responsive.css', 'base/reset.css', '_audit/ci/lib/browser-fixture.mjs', '_audit/ci/lib/native-template-ready.mjs', '_audit/ci/test-invoice-expense-financial-layout-browser.mjs'];
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex'),
  sourceBefore = Object.fromEntries(sources.map(p => [p, sha(p)])),
  browserName = process.env.CS_BROWSER || 'chromium';
const evidence = process.argv.find(x => x.startsWith('--evidence='))?.slice(11),
  captures = process.argv.find(x => x.startsWith('--captures='))?.slice(11);
if (captures) mkdirSync(captures, {
  recursive: true
});
const report = {
  browserName,
  node: process.version,
  sourceBefore,
  status: 'running',
  contexts: [],
  keyboardContexts: 0,
  scope: 'Original Invoice/Expense exact financial strings and header/reference geometry.72contexts/template/browser,12actual keyboard contexts/template/browser, bounded print-media checks. No exported files, arbitrary copy, email, AT or operator acceptance.'
};
const save = () => {
  if (evidence) {
    mkdirSync(dirname(resolve(evidence)), {
      recursive: true
    });
    writeFileSync(evidence, JSON.stringify(report, null, 2) + '\n');
  }
};
try {
  await withBrowserFixture(async page => {
    const origin = new URL(page.url()).origin;
    for (const config of active) {
      await page.goto(origin + '/' + config.file);
      await page.waitForFunction(() => typeof __dcSetProps === 'function');
      const elements = await page.evaluate(() => JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')).element.options);
      assert.equal(elements.length, 15);
      for (const width of [320, 390, 600, 1360]) for (const element of width === 390 ? elements : [elements[0]]) for (const language of ['English', 'Tiếng Việt']) for (const theme of ['light', 'dark']) {
        await page.setViewportSize({
          width,
          height: 900
        });
        await page.emulateMedia({
          media: 'screen',
          colorScheme: theme
        });
        await page.evaluate(({
          element,
          language,
          theme
        }) => {
          document.documentElement.dataset.theme = theme;
          __dcSetProps(__dcRootName(), {
            element,
            language
          });
        }, {
          element,
          language,
          theme
        });
        await waitForNativeTemplate(page);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        const measure = () => page.evaluate(() => {
          const text = e => {
            const range = document.createRange();
            range.selectNodeContents(e);
            const b = e.getBoundingClientRect();
            return {
              text: e.textContent.trim(),
              lineCount: new Set([...range.getClientRects()].filter(r => r.width && r.height).map(r => Math.round(r.y * 10) / 10)).size,
              width: b.width
            };
          };
          const header = [...document.querySelectorAll('header div')].find(e => e.style.fontSize === '26px') || document.querySelector('header>span'),
            reference = [...document.querySelectorAll('header div,header span')].find(e => e.style.fontFamily.includes('mono')),
            money = [...document.querySelectorAll('.cs-sheet td,.cs-sheet span')].filter(e => e.style.fontFamily.includes('mono') && /[0-9][,.][0-9]{3}/.test(e.textContent) && e.getBoundingClientRect().height);
          if (!header || !reference) throw Error('Incomplete header/reference selectors');
          return {
            header: text(header),
            reference: text(reference),
            money: money.map(text),
            documentWidth: document.documentElement.scrollWidth,
            headerDirection: getComputedStyle(document.querySelector('header')).flexDirection
          };
        });
        const vi = language === 'Tiếng Việt',
          expected = config.money.map(s => vi ? s.replaceAll(',', '.') : s),
          row = {
            template: config.file,
            width,
            element,
            language,
            theme,
            screen: await measure()
          };
        report.contexts.push(row);
        save();
        assert.equal(row.screen.header.text, config.titles[vi ? 1 : 0]);
        assert.equal(row.screen.header.lineCount, 1, 'Financial title/reference must remain whole');
        assert.equal(row.screen.reference.text, config.reference);
        assert.equal(row.screen.reference.lineCount, 1, 'Document reference must remain whole');
        assert.deepEqual(row.screen.money.map(m => m.text), expected, 'Amounts and separators must remain exact');
        assert(row.screen.money.every(m => m.lineCount === 1), 'Every financial amount must stay on one line');
        assert(row.screen.documentWidth <= width + 1, 'Financial region must not widen document');
        const region = page.getByRole('region', {
          name: config.names[vi ? 1 : 0],
          exact: true
        });
        assert.equal(await region.count(), 1);
        row.table = await region.evaluate(el => ({
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
          tabindex: el.getAttribute('tabindex'),
          display: getComputedStyle(el.querySelector('table')).display
        }));
        assert.equal(row.table.tabindex, '0');
        assert.equal(row.table.display, 'table');
        if (width <= 600) {
          assert(row.table.scrollWidth > row.table.clientWidth + 1);
          if (element === elements[0]) {
            await region.evaluate(el => {
              el.scrollLeft = 0;
            });
            await region.focus();
            assert(await region.evaluate(el => document.activeElement === el));
            await page.keyboard.press('ArrowRight');
            row.keyboard = await region.evaluate(el => ({
              left: el.scrollLeft,
              focused: document.activeElement === el,
              outlineWidth: getComputedStyle(el).outlineWidth,
              outlineStyle: getComputedStyle(el).outlineStyle
            }));
            assert(row.keyboard.left > 0 && row.keyboard.focused);
            assert(parseFloat(row.keyboard.outlineWidth) >= 2 && row.keyboard.outlineStyle !== 'none');
            await page.keyboard.press('ArrowLeft');
            assert(await region.evaluate(el => el.scrollLeft <= 1));
            await page.keyboard.press('End');
            row.keyboard.end = await region.evaluate(el => ({
              left: el.scrollLeft,
              max: el.scrollWidth - el.clientWidth
            }));
            assert(Math.abs(row.keyboard.end.left - row.keyboard.end.max) <= 1);
            await page.keyboard.press('Home');
            assert(await region.evaluate(el => el.scrollLeft <= 1));
            report.keyboardContexts++;
          }
        }
        if (captures && element === elements[0] && theme === 'light') {
          const name = config.slug + '-' + width + '-' + (vi ? 'vi' : 'en') + '-screen.png';
          await page.screenshot({
            path: resolve(captures, name),
            fullPage: true,
            animations: 'disabled'
          });
          row.capture = {
            filename: name,
            sha256: sha(resolve(captures, name))
          };
        }
        if (width === 390 && element === elements[0]) {
          await page.setViewportSize({
            width: 1360,
            height: 900
          });
          await page.emulateMedia({
            media: 'print'
          });
          row.print = await measure();
          assert.equal(row.print.headerDirection, 'row');
          assert.equal(row.print.header.lineCount, 1);
          assert.equal(row.print.reference.lineCount, 1);
          assert.deepEqual(row.print.money.map(m => m.text), expected);
          assert(row.print.money.every(m => m.lineCount === 1));
          await page.emulateMedia({
            media: 'screen'
          });
          await page.setViewportSize({
            width,
            height: 900
          });
        }
        save();
      }
    }
  }, {
    browserName
  });
  assert.equal(report.contexts.length, 72 * active.length);
  assert.equal(report.keyboardContexts, 12 * active.length);
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = String(error);
  throw error;
} finally {
  report.recordedAt = new Date().toISOString();
  report.sourceAfter = Object.fromEntries(sources.map(p => [p, sha(p)]));
  save();
  assert.deepEqual(report.sourceAfter, sourceBefore);
}
console.log(JSON.stringify({
  browserName,
  contexts: report.contexts.length,
  keyboardContexts: report.keyboardContexts,
  status: report.status
}));
