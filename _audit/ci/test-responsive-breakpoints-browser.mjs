import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const evidencePath = process.env.CS_RESPONSIVE_BREAKPOINT_EVIDENCE ? resolve(process.env.CS_RESPONSIVE_BREAKPOINT_EVIDENCE) : null;
if (evidencePath) mkdirSync(dirname(evidencePath), {recursive: true});
const expectedTemplates = JSON.parse(readFileSync(root + '_ds_manifest.json', 'utf8')).templates.length;
assert(expectedTemplates > 0);
const report = {scope: 'Three-engine ordinary-grid reflow, fixed-canvas geometry, all responsive templates/kits and all forced-Vietnamese templates', browsers: []};
const hash = path => createHash('sha256').update(readFileSync(root + path)).digest('hex');
report.sourceHashes = Object.fromEntries(['base/responsive.css', 'styles.css', 'dist/styles.min.css', 'templates/bod-deck/BodDeck.dc.html', '_audit/ci/test-responsive-breakpoints-browser.mjs'].map(path => [path, hash(path)]));
for (const browserName of ['chromium', 'firefox', 'webkit']) {
  const result = {browserName, grids: [], slides: [], responsive: [], vietnamese: null};
  await withBrowserFixture(async page => {
    const origin = new URL(page.url()).origin;
    // Both inline spellings and both fractional syntaxes must retain authored
    // fixed-canvas tracks, while otherwise identical ordinary grids reflow.
    for (const width of [390, 768, 1280]) {
      await page.setViewportSize({width, height: 1000});
      await page.goto(origin);
      await page.evaluate(() => {
        document.getElementById('fixture').innerHTML = ['repeat(4,minmax(0,1fr))', 'repeat(4, minmax(0, 1fr))', 'repeat(4,1fr)', 'repeat(4, 1fr)'].flatMap((columns, index) => ['ordinary', 'canvas'].map(kind => `<div class="${kind === 'canvas' ? 'cs-canvas-desk' : ''}"><div data-grid="${kind}-${index}" style="display:grid;grid-template-columns:${index % 2 ? ' ' : ''}${columns}"><i>A</i><i>B</i><i>C</i><i>D</i></div></div>`)).join('');
      });
      const grids = await page.locator('[data-grid]').evaluateAll(nodes => nodes.map(node => ({id: node.dataset.grid, tracks: getComputedStyle(node).gridTemplateColumns.split(/\s+/).length})));
      for (const grid of grids) assert.equal(grid.tracks, grid.id.startsWith('canvas') ? 4 : width <= 640 ? 1 : width <= 768 ? 2 : 4, JSON.stringify({browserName, width, grid}));
      result.grids.push({width, grids});
      for (const language of ['English', 'Tiếng Việt']) for (const theme of ['light', 'dark']) {
        await page.goto(origin + '/templates/bod-deck/BodDeck.dc.html');
        await page.waitForFunction(() => window.__dcSetProps && window.__dcRootName?.());
        await page.evaluate(({language, theme}) => window.__dcSetProps(window.__dcRootName(), {language, theme}), {language, theme});
        await page.waitForFunction(lang => document.querySelector('.cs-canvas-desk')?.lang === lang, language === 'English' ? 'en' : 'vi');
        await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
        const slides = await page.locator('.cs-canvas-desk section').evaluateAll(nodes => nodes.map(section => {
          const rect = section.getBoundingClientRect(), outside = [];
          const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const text = walker.currentNode;
            if (!text.textContent.trim()) continue;
            const range = document.createRange(); range.selectNodeContents(text);
            for (const box of range.getClientRects()) if (box.left < rect.left - 1 || box.right > rect.right + 1 || box.top < rect.top - 1 || box.bottom > rect.bottom + 1) outside.push(text.textContent.trim());
          }
          return {width: rect.width, height: rect.height, scrollWidth: section.scrollWidth, clientWidth: section.clientWidth, scrollHeight: section.scrollHeight, clientHeight: section.clientHeight, outside};
        }));
        assert.equal(await page.locator('.cs-canvas-desk').getAttribute('data-theme'), theme === 'dark' ? 'dark' : '');
        assert.equal(slides.length, 5);
        for (const slide of slides) {
          assert(slide.width >= 960, JSON.stringify({browserName, width, language, theme, slide}));
          assert(Math.abs(slide.width / slide.height - 16 / 9) < .01);
          assert(slide.scrollHeight <= slide.clientHeight + 1 && slide.scrollWidth <= slide.clientWidth + 1, JSON.stringify({browserName, width, language, theme, slide}));
          assert.deepEqual(slide.outside, [], JSON.stringify({browserName, width, language, theme, slide}));
        }
        result.slides.push({width, language, theme, slides});
      }
      await page.goto(`${origin}/_audit/responsive-overflow.html?width=${width}`);
      await page.waitForFunction(() => typeof window.__overflow?.pass === 'boolean', null, {timeout: 180000});
      const verdict = await page.evaluate(() => window.__overflow);
      assert.equal(verdict.pass, true, JSON.stringify({browserName, width, ...verdict}));
      assert.equal(verdict.done, verdict.total);
      assert(verdict.total > 0 && verdict.results.every(item => item.width === width));
      result.responsive.push({width, ...verdict});
      console.log(`PASS ${browserName} whole-set responsive overflow: ${width}px, ${verdict.total} templates/kits`);
    }
    await page.goto(origin + '/_audit/language-overflow.html');
    await page.waitForFunction(() => typeof window.__language?.pass === 'boolean', null, {timeout: 240000});
    const vietnamese = await page.evaluate(() => window.__language);
    assert.equal(vietnamese.done, vietnamese.total);
    assert.equal(vietnamese.total, expectedTemplates, 'Every current manifest template must be probed');
    assert.equal(vietnamese.results.length, expectedTemplates);
    assert.equal(vietnamese.pass, true, JSON.stringify({browserName, vietnamese}));
    assert(vietnamese.results.every(item => !item.error && !item.fail && item.over <= 0 && item.clip === 0 && item.leaks.length === 0), JSON.stringify({browserName, vietnamese}));
    result.vietnamese = vietnamese;
    console.log(`PASS ${browserName} canonical forced-Vietnamese language board: ${expectedTemplates} templates`);
  }, {browserName});
  report.browsers.push(result);
  if (evidencePath) writeFileSync(evidencePath, JSON.stringify(report, null, 2) + '\n');
}
for (const [path, before] of Object.entries(report.sourceHashes)) assert.equal(hash(path), before, `Source changed during verification: ${path}`);
report.sourceArtifactsUnchanged = true;
if (evidencePath) writeFileSync(evidencePath, JSON.stringify(report, null, 2) + '\n');
