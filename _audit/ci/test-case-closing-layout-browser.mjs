import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const templates = ['templates/marketing-case-study/MarketingCaseStudy.dc.html', 'templates/sales-one-pager/SalesOnePager.dc.html', 'templates/finance-quote/FinanceQuote.dc.html'];
const sources = [...templates, 'base/responsive.css', '_audit/ci/lib/browser-fixture.mjs'];
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const before = Object.fromEntries(sources.map(p => [p, sha(p)]));
const browserName = process.env.CS_BROWSER || 'chromium',
  evidence = process.argv.find(x => x.startsWith('--evidence='))?.slice(11),
  captures = process.argv.find(x => x.startsWith('--captures='))?.slice(11);
if (captures) mkdirSync(captures, {
  recursive: true
});
const report = {
  browserName,
  node: process.version,
  sourceBefore: before,
  status: 'running',
  contexts: [],
  scope: 'Case-study, Sales-one-pager and Finance-quote closing text and CTA only. All15declared elements at390px, default320/600/1360px, EN/VI and two outer themes. Screen below640px stacks without collapsing prose or overflowing the CTA; desktop and print retain original row direction. Real DC host, arbitrary copy, PDF export and operator acceptance remain separate.'
};
function save() {
  if (evidence) {
    mkdirSync(dirname(resolve(evidence)), {
      recursive: true
    });
    writeFileSync(evidence, JSON.stringify(report, null, 2) + '\n');
  }
}
try {
  await withBrowserFixture(async page => {
    const origin = new URL(page.url()).origin;
    for (const template of templates) {
      await page.goto(origin + '/' + template);
      await page.waitForFunction(() => typeof __dcSetProps === 'function');
      const elements = await page.evaluate(() => JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')).element.options);
      assert.equal(elements.length, 15);
      for (const width of [320, 390, 600, 1360]) {
        await page.setViewportSize({
          width,
          height: 900
        });
        for (const element of width === 390 ? elements : [elements[0]]) for (const language of ['English', 'Tiếng Việt']) for (const theme of ['light', 'dark']) {
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
          await page.waitForFunction(({
            element,
            language
          }) => {
            const desk = document.querySelector('.cs-desk');
            if (!desk) return false;
            const [name, variant] = element.split(' · ');
            const expectedElement = {
              'Thổ': 'tho',
              'Hỏa': 'hoa',
              'Thủy': 'thuy',
              'Mộc': 'moc',
              'Kim': 'kim'
            }[name];
            const expectedVariant = ['studio', 'ember', 'river', 'leaf', 'champagne'].includes(variant) ? '' : variant;
            return desk.getAttribute('lang') === (language === 'Tiếng Việt' ? 'vi' : 'en') && desk.dataset.csElement === expectedElement && desk.dataset.csVariant === expectedVariant;
          }, {
            element,
            language
          });
          await page.evaluate(() => document.fonts.ready);
          const block = page.locator('div.cs-avoid').filter({
            has: page.locator(':scope > span')
          }).filter({
            has: page.locator(':scope > div')
          });
          assert.equal(await block.count(), 1);
          const measure = () => block.evaluate(el => {
            const content = el.firstElementChild,
              label = el.lastElementChild,
              body = content.lastElementChild;
            const rect = e => {
              const r = e.getBoundingClientRect();
              return {
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
                right: r.right,
                bottom: r.bottom
              };
            };
            return {
              box: rect(el),
              content: rect(content),
              body: rect(body),
              label: rect(label),
              direction: getComputedStyle(el).flexDirection,
              lineHeight: parseFloat(getComputedStyle(body).lineHeight),
              copy: body.textContent,
              labelText: label.textContent,
              contentWidth: el.clientWidth - parseFloat(getComputedStyle(el).paddingLeft) - parseFloat(getComputedStyle(el).paddingRight)
            };
          });
          const row = {
            template,
            width,
            element,
            language,
            theme,
            screen: await measure()
          };
          report.contexts.push(row);
          save();
          const m = row.screen;
          assert(m.body.width >= 100, `Closing prose collapsed: ${JSON.stringify(row)}`);
          assert.equal(m.direction, width <= 640 ? 'column' : 'row', 'Closing flex direction');
          assert(m.label.x >= m.box.x - 1 && m.label.right <= m.box.right + 1, 'Closing CTA overflows block');
          assert(m.body.height / m.lineHeight <= 10, 'Closing prose forced into excessive lines');
          if (width <= 640) {
            assert(Math.abs(m.body.width - m.contentWidth) <= 1, 'Stacked prose must use available inner width');
            assert(m.label.y >= m.content.bottom - 1, 'Stacked CTA overlaps closing prose');
          } else assert(m.label.x >= m.content.right - 1, 'Desktop CTA overlaps closing prose');
          if (captures && element === elements[0]) {
            const name = template.split('/')[1] + '-' + width + '-' + (language === 'English' ? 'en' : 'vi') + '-' + theme + '.png';
            await block.screenshot({
              path: resolve(captures, name),
              animations: 'disabled'
            });
            row.capture = {
              filename: name,
              sha256: sha(resolve(captures, name))
            };
          }
          if (width === 390 && element === elements[0]) {
            await page.emulateMedia({
              media: 'print'
            });
            row.print = await measure();
            assert.equal(row.print.direction, 'row', 'Screen stacking must not override print row');
            await page.emulateMedia({
              media: 'screen'
            });
          }
          save();
        }
      }
    }
  }, {
    browserName
  });
  assert.equal(report.contexts.length, 216);
  report.sourceAfter = Object.fromEntries(sources.map(p => [p, sha(p)]));
  assert.deepEqual(report.sourceAfter, before, 'Source changed during validation');
  report.status = 'passed';
  report.recordedAt = new Date().toISOString();
  save();
  console.log(`PASS case/sales/quote closing layout: ${browserName},216contexts; screen geometry and print direction`);
} catch (error) {
  report.status = 'failed';
  report.error = String(error);
  report.recordedAt = new Date().toISOString();
  save();
  throw error;
}
