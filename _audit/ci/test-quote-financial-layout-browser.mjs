import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { waitForNativeTemplate } from './lib/native-template-ready.mjs';
const template = 'templates/finance-quote/FinanceQuote.dc.html';
const sources = [template, 'base/responsive.css', 'base/reset.css', '_audit/ci/lib/browser-fixture.mjs', '_audit/ci/lib/native-template-ready.mjs', '_audit/ci/test-quote-financial-layout-browser.mjs'];
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const sourceBefore = Object.fromEntries(sources.map(p => [p, sha(p)]));
const browserName = process.env.CS_BROWSER || 'chromium';
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
  scope: 'Finance Quote header, original VND price strings and total only. All15declared elements at390, default320/600/1360, ENVI/twoouterthemes, named native table scroll with actual keyboard12contexts and print checks. No arbitrary copy, PDF/DOCX export, email, AT or operator acceptance.'
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
    await page.goto(origin + '/' + template);
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
        const rect = e => {
          const b = e.getBoundingClientRect();
          return {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            right: b.right
          };
        };
        const text = e => {
          const range = document.createRange();
          range.selectNodeContents(e);
          const tops = [...new Set([...range.getClientRects()].filter(r => r.width && r.height).map(r => Math.round(r.y * 10) / 10))];
          return {
            text: e.textContent.trim(),
            box: rect(e),
            lineCount: tops.length
          };
        };
        const header = [...document.querySelector('header').lastElementChild.querySelectorAll('div')].find(e => e.style.fontSize === '26px'),
          total = [...document.querySelectorAll('.cs-sheet div')].find(e => e.style.fontSize === '26px' && e.style.fontFamily.includes('mono')),
          prices = [...document.querySelectorAll('.cs-sheet table td:last-child')].filter(e => e.getBoundingClientRect().height);
        if (!header || !total || prices.length !== 4) throw Error('Incomplete financial source selectors');
        return {
          header: text(header),
          total: text(total),
          prices: prices.map(text),
          documentWidth: document.documentElement.scrollWidth,
          viewport: innerWidth,
          headerDirection: getComputedStyle(document.querySelector('header')).flexDirection
        };
      });
      const row = {
        width,
        element,
        language,
        theme,
        screen: await measure()
      };
      report.contexts.push(row);
      save();
      assert.equal(row.screen.header.lineCount, 1, 'Document heading must not fragment');
      assert.equal(row.screen.total.lineCount, 1, 'Monetary total must remain an unbroken amount');
      assert(row.screen.prices.every(p => p.lineCount === 1), 'Every price must remain an unbroken amount');
      const vi = language === 'Tiếng Việt',
        expected = vi ? ['₫1.800.000.000', '₫900.000.000', '₫400.000.000', '+₫220.000.000'] : ['₫1,800,000,000', '₫900,000,000', '₫400,000,000', '+₫220,000,000'];
      assert.deepEqual(row.screen.prices.map(p => p.text), expected, 'Original prices and currency must remain exact');
      assert.equal(row.screen.total.text, vi ? '₫3.100.000.000' : '₫3,100,000,000');
      assert.equal(row.screen.header.text, vi ? 'BÁO GIÁ' : 'QUOTE');
      assert(row.screen.documentWidth <= width + 1, 'Scrolling table must not widen document');
      const region = page.getByRole('region', {
        name: vi ? 'Phạm vi và giá báo giá' : 'Quote scope and prices',
        exact: true
      });
      assert.equal(await region.count(), 1, 'Exactly one localized financial scroll region');
      row.table = await region.evaluate(el => ({
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        label: el.getAttribute('aria-label'),
        tabindex: el.getAttribute('tabindex'),
        tableDisplay: getComputedStyle(el.querySelector('table')).display
      }));
      assert.equal(row.table.tableDisplay, 'table', 'Keep actual table layout inside scroll region');
      assert.equal(row.table.tabindex, '0');
      if (width <= 600) {
        assert(row.table.scrollWidth > row.table.clientWidth + 1, 'Narrow financial table must scroll instead of splitting money');
        if (element === elements[0]) {
          await region.evaluate(el => {
            el.scrollLeft = 0;
          });
          await region.focus();
          assert(await region.evaluate(el => document.activeElement === el), 'Scroll region receives native focus');
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(label => {
            const el = [...document.querySelectorAll('[role="region"]')].find(e => e.getAttribute('aria-label') === label && e.getBoundingClientRect().height);
            return el?.scrollLeft > 0;
          }, vi ? 'Phạm vi và giá báo giá' : 'Quote scope and prices');
          row.keyboard = await region.evaluate(el => ({
            scrollLeft: el.scrollLeft,
            focused: document.activeElement === el,
            outlineWidth: getComputedStyle(el).outlineWidth,
            outlineStyle: getComputedStyle(el).outlineStyle,
            boxShadow: getComputedStyle(el).boxShadow
          }));
          assert(row.keyboard.scrollLeft > 0 && row.keyboard.focused);
          assert(parseFloat(row.keyboard.outlineWidth) >= 2 && row.keyboard.outlineStyle !== 'none', 'Scroll keyboard focus retains system contour');
          await page.keyboard.press('ArrowLeft');
          assert(await region.evaluate(el => el.scrollLeft <= 1), 'Left restores row context');
          await page.keyboard.press('End');
          row.keyboard.end = await region.evaluate(el => ({
            left: el.scrollLeft,
            max: el.scrollWidth - el.clientWidth
          }));
          assert(Math.abs(row.keyboard.end.left - row.keyboard.end.max) <= 1, 'End reveals rightmost prices');
          await page.keyboard.press('Home');
          assert(await region.evaluate(el => el.scrollLeft <= 1), 'Home returns to row context');
          report.keyboardContexts++;
        }
      }
      if (captures && element === elements[0] && theme === 'light') {
        const name = width + '-' + (vi ? 'vi' : 'en') + '-screen.png';
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
        assert.equal(row.print.headerDirection, 'row', 'Screen header stacking must not override print');
        assert.equal(row.print.header.lineCount, 1);
        assert.equal(row.print.total.lineCount, 1);
        assert(row.print.prices.every(p => p.lineCount === 1));
        assert.deepEqual(row.print.prices.map(p => p.text), expected);
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
  }, {
    browserName
  });
  assert.equal(report.contexts.length, 72);
  assert.equal(report.keyboardContexts, 12);
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = String(error);
  throw error;
} finally {
  report.recordedAt = new Date().toISOString();
  report.sourceAfter = Object.fromEntries(sources.map(p => [p, sha(p)]));
  save();
  assert.deepEqual(report.sourceAfter, sourceBefore, 'Financial regression sources changed');
}
console.log(JSON.stringify({
  browserName,
  contexts: report.contexts.length,
  keyboardContexts: report.keyboardContexts,
  status: report.status
}));
