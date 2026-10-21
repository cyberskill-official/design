import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { waitForNativeTemplate } from './lib/native-template-ready.mjs';
const file = 'templates/finance-dunning-email/FinanceDunningEmail.dc.html',
  sources = [file, 'base/responsive.css', 'base/reset.css', '_audit/ci/lib/browser-fixture.mjs', '_audit/ci/lib/native-template-ready.mjs', '_audit/ci/test-dunning-reference-layout-browser.mjs'],
  sha = p => createHash('sha256').update(readFileSync(p)).digest('hex'),
  sourceBefore = Object.fromEntries(sources.map(n => [n, sha(n)])),
  browserName = process.env.CS_BROWSER || 'chromium',
  evidence = process.argv.find(x => x.startsWith('--evidence='))?.slice(11),
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
  scope: 'Payment Reminder Email header and five original invoice reference occurrences, exact unchanged due amounts. All15elements390 plus default320/600/1360,3declared languages,2outerthemes. Browser preview only; not actual email-client, arbitrary data, PDF/DOCX export, AT or operator acceptance.'
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
    await page.goto(origin + '/' + file);
    await page.waitForFunction(() => typeof __dcSetProps === 'function');
    const props = await page.evaluate(() => JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props'))),
      elements = props.element.options,
      languages = props.language.options;
    assert.equal(elements.length, 15);
    assert.deepEqual(languages, ['English', 'Tiếng Việt', 'Both']);
    for (const width of [320, 390, 600, 1360]) for (const element of width === 390 ? elements : [elements[0]]) for (const language of languages) for (const theme of ['light', 'dark']) {
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
            box: {
              x: b.x,
              y: b.y,
              width: b.width,
              height: b.height,
              right: b.right
            }
          };
        };
        const spans = [...document.querySelectorAll('[data-cs-element] span')],
          reference = spans.find(e => e.style.fontFamily.includes('mono') && e.textContent === 'INV-2026-0142'),
          money = spans.filter(e => e.style.fontFamily.includes('mono') && /[0-9][,.][0-9]{3}/.test(e.textContent) && e.getBoundingClientRect().height);
        if (!reference) throw Error('Original reference selector');
        return {
          headerReference: text(reference),
          references: [...document.querySelectorAll('.cs-dunning-reference')].filter(e => e.getBoundingClientRect().height).map(text),
          money: money.map(text),
          headings: [...document.querySelectorAll('[data-cs-element] h1')].filter(e => e.getBoundingClientRect().height).map(e => e.textContent),
          documentWidth: document.documentElement.scrollWidth
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
      assert.equal(row.screen.headerReference.text, 'INV-2026-0142');
      assert.equal(row.screen.headerReference.lineCount, 1, 'Top invoice reference must stay whole');
      assert.equal(row.screen.references.length, language === 'Both' ? 5 : 3, 'All original reference occurrences included');
      assert(row.screen.references.every(v => v.text === 'INV-2026-0142' && v.lineCount === 1), 'Every invoice reference stays whole');
      const expectedMoney = language === 'Both' ? ['₫1,423,400,000', '₫1.423.400.000'] : language === 'English' ? ['₫1,423,400,000'] : ['₫1.423.400.000'];
      assert.deepEqual(row.screen.money.map(m => m.text), expectedMoney);
      assert(row.screen.money.every(m => m.lineCount === 1));
      const en = 'Invoice INV-2026-0142 is 7 days past due',
        vi = 'Hóa đơn INV-2026-0142 đã quá hạn 7 ngày';
      assert.deepEqual(row.screen.headings, language === 'Both' ? [en, vi] : [language === 'English' ? en : vi]);
      assert(row.screen.documentWidth <= width + 1, 'Reference must not widen document');
      if (captures && element === elements[0] && theme === 'light') {
        const name = width + '-' + (language === 'English' ? 'en' : language === 'Tiếng Việt' ? 'vi' : 'both') + '.png';
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
        assert(row.print.references.every(v => v.text === 'INV-2026-0142' && v.lineCount === 1));
        assert.deepEqual(row.print.money.map(m => m.text), expectedMoney);
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
  }, {
    browserName
  });
  assert.equal(report.contexts.length, 108);
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = String(error);
  throw error;
} finally {
  report.recordedAt = new Date().toISOString();
  report.sourceAfter = Object.fromEntries(sources.map(n => [n, sha(n)]));
  save();
  assert.deepEqual(report.sourceBefore, report.sourceAfter);
}
console.log(JSON.stringify({
  browserName,
  contexts: report.contexts.length,
  status: report.status
}));
