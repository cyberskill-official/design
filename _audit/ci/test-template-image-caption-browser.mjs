import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { apca } from '../../scripts/lib/oklch.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const templates = [['templates/marketing-social-kit/MarketingSocialKit.dc.html', 3, null], ['templates/culture-event-invite/CultureEventInvite.dc.html', 1, 34], ['templates/marketing-case-study/MarketingCaseStudy.dc.html', 1, 36], ['templates/marketing-page/MarketingPage.dc.html', 1, null]];
const sources = ['image-slot.js', 'scripts/lib/oklch.mjs', '_audit/ci/lib/browser-fixture.mjs', ...templates.map(x => x[0])];
const sha = p => createHash('sha256').update(readFileSync(root + '/' + p)).digest('hex');
const before = Object.fromEntries(sources.map(p => [p, sha(p)]));
const browserName = process.env.CS_BROWSER || 'chromium',
  evidence = process.argv.find(x => x.startsWith('--evidence='))?.slice(11);
const report = {
  browserName,
  node: process.version,
  sourceBefore: before,
  status: 'running',
  contexts: [],
  scope: 'All six source-declared image-slot captions across four templates. All15element choices at390 plus default320/1360, every declared language, two initialized outer themes, readonly/mocked writer. Caption contrast, native paint/hit, caption-vs-copy bounds, localization, hover, filled/non-authoring and print-media transitions. Fixed social export canvases are intentionally wider than mobile viewport. No real DC/upload, keyboard/AT, photo contrast or exported-PDF/operator acceptance.'
};
const expected = (template, language) => {
  const vi = language === 'Tiếng Việt';
  if (template.includes('marketing-social-kit')) return vi ? 'Thả ảnh thương hiệu' : 'Drop a brand image';
  if (template.includes('culture-event')) return language === 'Both' ? 'Drop an event photo / Thả ảnh sự kiện' : vi ? 'Thả ảnh sự kiện' : 'Drop an event photo';
  if (template.includes('marketing-case-study')) return vi ? 'Thả ảnh kết quả hoặc sản phẩm' : 'Drop a result or product image';
  return vi ? 'Thả ảnh bìa (không bắt buộc)' : 'Drop a hero image (optional)';
};
const hex = v => '#' + v.slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('');
try {
  await withBrowserFixture(async page => {
    const origin = new URL(page.url()).origin;
    for (const [template, count, originalBottomPadding] of templates) {
      await page.goto(origin + '/' + template);
      await page.waitForFunction(() => typeof __dcSetProps === 'function' && document.querySelector('image-slot')?.shadowRoot);
      const props = await page.evaluate(() => JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')));
      assert.equal(props.element.options.length, 15);
      const ids = await page.locator('image-slot').evaluateAll(els => els.map(el => el.id));
      assert.equal(ids.length, count);
      for (const width of [320, 390, 1360]) for (const element of width === 390 ? props.element.options : [props.element.options[0]]) for (const language of props.language.options) for (const theme of ['light', 'dark']) for (const editable of [false, true]) {
        await page.setViewportSize({
          width,
          height: 900
        });
        await page.emulateMedia({
          colorScheme: theme,
          media: 'screen'
        });
        await page.evaluate(({
          language,
          theme,
          element,
          editable,
          hasTheme
        }) => {
          document.documentElement.dataset.theme = theme;
          window.omelette = editable ? {
            writeFile() {
              throw Error('Probe must not write a file');
            }
          } : undefined;
          __dcSetProps(__dcRootName(), {
            language,
            element,
            ...(hasTheme ? {
              theme
            } : {})
          });
        }, {
          language,
          theme,
          element,
          editable,
          hasTheme: !!props.theme
        });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        for (const id of ids) {
          const host = page.locator('#' + id);
          await host.evaluate(el => el.dispatchEvent(new Event('pointerenter')));
          const cap = host.locator('.empty .cap');
          await cap.scrollIntoViewIfNeeded();
          const row = await cap.evaluate(cap => {
            const host = cap.getRootNode().host,
              plate = cap.parentElement,
              container = host.parentElement;
            const rect = el => {
              const r = el.getBoundingClientRect();
              return {
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
                right: r.right,
                bottom: r.bottom
              };
            };
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            const context = canvas.getContext('2d');
            const colour = v => {
              context.clearRect(0, 0, 1, 1);
              context.fillStyle = v;
              context.fillRect(0, 0, 1, 1);
              return [...context.getImageData(0, 0, 1, 1).data];
            };
            const ps = getComputedStyle(plate),
              cs = getComputedStyle(cap),
              texts = [],
              walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode;
              if (!node.textContent.trim() || /SCRIPT|STYLE/.test(node.parentElement.tagName) || node.parentElement.closest('image-slot')) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              const r = range.getBoundingClientRect();
              if (r.width > 0 && r.height > 0) texts.push({
                text: node.textContent.trim(),
                x: r.x,
                y: r.y,
                right: r.right,
                bottom: r.bottom
              });
            }
            const r = rect(cap);
            return {
              text: cap.textContent.trim(),
              foreground: colour(cs.color),
              background: colour(ps.backgroundColor),
              opacity: Number(ps.opacity),
              plate: rect(plate),
              caption: r,
              host: rect(host),
              textBounds: texts,
              nativeHitIsHost: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === host,
              editable: host.hasAttribute('data-editable'),
              bottomPadding: parseFloat(getComputedStyle(container).paddingBottom),
              browseText: host.shadowRoot.querySelector('.sub').textContent.trim().replace(/\s+/g, ' ')
            };
          });
          assert.equal(row.text, expected(template, language), 'Caption must follow the declared language control');
          assert.equal(row.background[3], 255, 'Authoring caption must have an opaque readable plate');
          assert.equal(row.foreground[3], 255);
          assert.equal(row.opacity, 1);
          row.apca = apca(hex(row.foreground), hex(row.background));
          assert(row.apca >= 75, JSON.stringify({
            template,
            id,
            width,
            element,
            language,
            theme,
            row
          }));
          assert.equal(row.editable, editable);
          assert.equal(row.browseText, language === 'Tiếng Việt' ? 'hoặc duyệt tệp' : 'or browse files', 'Browse hint follows the scoped language');
          assert(row.nativeHitIsHost, 'Caption must paint above overlays/content');
          assert(row.plate.x >= row.host.x - .1 && row.plate.right <= row.host.right + .1 && row.plate.y >= row.host.y - .1 && row.plate.bottom <= row.host.bottom + .1, 'Caption plate clipped by image frame');
          const overlaps = row.textBounds.filter(r => Math.min(r.right, row.plate.right) - Math.max(r.x, row.plate.x) > 1 && Math.min(r.bottom, row.plate.bottom) - Math.max(r.y, row.plate.y) > 1);
          assert.deepEqual(overlaps, [], 'Caption must not cover template copy: ' + JSON.stringify({
            template,
            id,
            width,
            language,
            row,
            overlaps
          }));
          if (editable) {
            const link = host.locator('.empty .sub u');
            await link.hover();
            assert.equal(await link.evaluate(el => getComputedStyle(el).color), await cap.evaluate(el => getComputedStyle(el).color), 'Hover must preserve theme text');
          }
          await page.emulateMedia({
            media: 'print'
          });
          assert.equal(await host.locator('.empty').evaluate(el => getComputedStyle(el).display), 'none', 'Authoring hint must not print');
          if (originalBottomPadding !== null) assert.equal(await host.evaluate(el => parseFloat(getComputedStyle(el.parentElement).paddingBottom)), originalBottomPadding, 'Print retains original header spacing');
          await page.emulateMedia({
            media: 'screen'
          });
          const filled = await host.evaluate(async el => {
            el.setAttribute('src', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="blue"/></svg>');
            await el.shadowRoot.querySelector('img').decode();
            return {
              filled: el.hasAttribute('data-filled'),
              display: getComputedStyle(el.shadowRoot.querySelector('.empty')).display,
              bottomPadding: parseFloat(getComputedStyle(el.parentElement).paddingBottom)
            };
          });
          assert(filled.filled);
          assert.equal(filled.display, 'none');
          if (originalBottomPadding !== null) assert.equal(filled.bottomPadding, originalBottomPadding);
          await host.evaluate(el => el.removeAttribute('src'));
          const outside = await host.evaluate(el => {
            const setter = window.__dcSetProps;
            delete window.__dcSetProps;
            el._render();
            const out = {
              authoring: el.hasAttribute('data-authoring'),
              display: getComputedStyle(el.shadowRoot.querySelector('.cap')).display,
              background: getComputedStyle(el.shadowRoot.querySelector('.empty')).backgroundColor,
              bottomPadding: parseFloat(getComputedStyle(el.parentElement).paddingBottom)
            };
            window.__dcSetProps = setter;
            el._render();
            return out;
          });
          assert(!outside.authoring);
          assert.equal(outside.display, 'none');
          assert.equal(outside.background, 'rgba(0, 0, 0, 0)');
          if (originalBottomPadding !== null) assert.equal(outside.bottomPadding, originalBottomPadding);
          report.contexts.push({
            template,
            id,
            width,
            element,
            language,
            theme,
            editable,
            text: row.text,
            apca: row.apca,
            plate: row.plate,
            caption: row.caption,
            bottomPadding: row.bottomPadding,
            printHintHidden: true,
            filledHintHidden: true,
            outsideAuthoringHintHidden: true
          });
        }
      }
    }
    const localeCases = await page.evaluate(() => {
      document.documentElement.lang = 'en';
      window.omelette = {
        writeFile() {
          throw Error('Probe must not write');
        }
      };
      const parent = document.createElement('div');
      parent.lang = 'vi';
      parent.style.cssText = 'width:300px;height:180px;position:relative';
      const slot = document.createElement('image-slot');
      slot.setAttribute('placeholder', 'Scoped English prompt');
      slot.setAttribute('placeholder-vi', 'Lời nhắc tiếng Việt');
      parent.append(slot);
      document.body.append(parent);
      const rows = [],
        take = name => rows.push({
          name,
          caption: slot.shadowRoot.querySelector('.empty .cap').textContent,
          browse: slot.shadowRoot.querySelector('.sub').textContent.trim().replace(/\s+/g, ' '),
          replace: slot.shadowRoot.querySelector('[data-act="replace"]').textContent
        });
      take('parent-vi-root-en');
      slot.lang = 'en';
      take('own-en-parent-vi');
      slot.lang = 'vi';
      take('live-own-vi');
      slot.setAttribute('placeholder-vi', 'Lời nhắc đã cập nhật');
      take('live-vi-placeholder');
      parent.lang = 'en';
      slot.removeAttribute('lang');
      document.documentElement.lang = 'vi';
      slot._render();
      take('parent-en-root-vi');
      parent.removeAttribute('lang');
      slot._render();
      take('root-vi-fallback');
      slot.lang = 'jam';
      take('unknown-english-fallback');
      parent.remove();
      return rows;
    });
    const expectedLocale = [['Lời nhắc tiếng Việt', 'hoặc duyệt tệp', 'Thay ảnh'], ['Scoped English prompt', 'or browse files', 'Replace'], ['Lời nhắc tiếng Việt', 'hoặc duyệt tệp', 'Thay ảnh'], ['Lời nhắc đã cập nhật', 'hoặc duyệt tệp', 'Thay ảnh'], ['Scoped English prompt', 'or browse files', 'Replace'], ['Lời nhắc đã cập nhật', 'hoặc duyệt tệp', 'Thay ảnh'], ['Scoped English prompt', 'or browse files', 'Replace']];
    for (const [row, i] of localeCases.map((row, i) => [row, i])) assert.deepEqual([row.caption, row.browse, row.replace], expectedLocale[i], 'Caption/browse/toolbar scope must agree: ' + row.name);
    report.scopedLocaleCases = localeCases;
  }, {
    browserName
  });
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = String(error);
  throw error;
} finally {
  report.recordedAt = new Date().toISOString();
  report.sourceAfter = Object.fromEntries(sources.map(p => [p, sha(p)]));
  report.changedSources = sources.filter(p => before[p] !== report.sourceAfter[p]);
  if (evidence) writeFileSync(evidence, JSON.stringify(report, null, 2) + '\n');
  assert.equal(report.changedSources.length, 0, 'Selected sources changed during check');
}
console.log(JSON.stringify({
  browserName,
  captionContexts: report.contexts.length,
  minimumApca: Math.min(...report.contexts.map(x => x.apca)),
  sourceUnchanged: true
}));
