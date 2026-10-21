import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { apca } from '../../scripts/lib/oklch.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const sourceFiles = ['image-slot.js', 'templates/marketing-page/MarketingPage.dc.html'];
const sha = p => createHash('sha256').update(readFileSync(root + '/' + p)).digest('hex');
const sourceBefore = Object.fromEntries(sourceFiles.map(p => [p, sha(p)]));
const browserName = process.env.CS_BROWSER || 'chromium';
const evidence = process.argv.find(x => x.startsWith('--evidence='))?.slice(11);
const report = {
  browserName,
  node: process.version,
  sourceBefore,
  contexts: [],
  scope: 'Actual marketing template and image-slot shadow caption. All15declared element choices at390px, plus320/1280defaultThostudio; bothdeclared themes/languages, read-only preview and mocked writable bridge. Opaque caption plate, source APCA75, unclipped placement below hero content, native hit surface and hidden/filled transitions. Mock writable bridge is not real host or file upload/keyboard/AT/operator acceptance.'
};
await withBrowserFixture(async page => {
  const url = new URL('/templates/marketing-page/MarketingPage.dc.html', page.url()).href;
  await page.goto(url);
  await page.waitForFunction(() => typeof window.__dcSetProps === 'function' && document.querySelector('image-slot')?.shadowRoot?.querySelector('.cap'));
  const elements = await page.evaluate(() => JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')).element.options);
  assert.equal(elements.length, 15);
  for (const width of [320, 390, 1280]) for (const element of width === 390 ? elements : [elements[0]]) for (const language of ['English', 'Tiếng Việt']) for (const theme of ['light', 'dark']) for (const editable of [false, true]) {
    await page.setViewportSize({
      width,
      height: 900
    });
    await page.evaluate(({
      language,
      theme,
      element,
      editable
    }) => {
      window.omelette = editable ? {
        writeFile() {
          throw Error('Probe must not write a file');
        }
      } : undefined;
      window.__dcSetProps(window.__dcRootName(), {
        language,
        theme,
        element
      });
    }, {
      language,
      theme,
      element,
      editable
    });
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.evaluate(() => {
      document.querySelector('image-slot').dispatchEvent(new Event('pointerenter'));
      return document.fonts.ready;
    });
    const cap = page.locator('image-slot .empty .cap');
    await cap.scrollIntoViewIfNeeded();
    const result = await cap.evaluate(cap => {
      const host = cap.getRootNode().host,
        plate = cap.parentElement;
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
      const s = getComputedStyle(plate),
        t = getComputedStyle(cap);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d');
      const colour = value => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      };
      const r = rect(cap),
        p = rect(plate),
        h = rect(host);
      const contents = rect(host.parentElement.children[3]);
      return {
        text: cap.textContent,
        foreground: colour(t.color),
        background: colour(s.backgroundColor),
        plateOpacity: Number(s.opacity),
        caption: r,
        plate: p,
        host: h,
        contents,
        topNativeHitIsHost: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === host,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        editable: host.hasAttribute('data-editable')
      };
    });
    assert.equal(result.text, language === 'English' ? 'Drop a hero image (optional)' : 'Thả ảnh bìa (không bắt buộc)');
    assert.equal(result.background[3], 255, 'Caption needs an opaque text plate above image overlays: ' + JSON.stringify({
      width,
      element,
      language,
      theme,
      editable,
      result
    }));
    assert.equal(result.foreground[3], 255);
    assert.equal(result.plateOpacity, 1);
    const hex = v => '#' + v.slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('');
    result.apca = apca(hex(result.foreground), hex(result.background));
    assert(result.apca >= 75, JSON.stringify(result));
    assert(result.topNativeHitIsHost, 'Caption must paint above hero overlays');
    assert.equal(result.overflow, 0);
    assert(result.plate.x >= result.host.x - .01 && result.plate.right <= result.host.right + .01);
    assert(result.plate.y >= result.contents.bottom + 3 && result.plate.bottom <= result.host.bottom - .01, 'Caption must remain in reserved bottom padding without covering hero text: ' + JSON.stringify({
      width,
      element,
      language,
      theme,
      editable,
      result
    }));
    assert.equal(result.editable, editable, 'Mock bridge did not refresh: ' + JSON.stringify({
      width,
      element,
      language,
      theme,
      editable,
      result
    }));
    if (editable) {
      const link = page.locator('image-slot .empty .sub u');
      await link.hover();
      const colour = await link.evaluate(el => getComputedStyle(el).color);
      const captionColour = await cap.evaluate(el => getComputedStyle(el).color);
      assert.equal(colour, captionColour, 'Hover must retain readable theme text');
    }
    report.contexts.push({
      width,
      element,
      language,
      theme,
      editable,
      ...result
    });
  }
  // Source hides authoring caption outside the DC context; no blank plate remains.
  const hidden = await page.locator('image-slot').evaluate(host => {
    const setter = window.__dcSetProps;
    delete window.__dcSetProps;
    window.omelette = undefined;
    host._render();
    const result = {
      captionDisplay: getComputedStyle(host.shadowRoot.querySelector('.cap')).display,
      authoring: host.hasAttribute('data-authoring'),
      plateBackground: getComputedStyle(host.shadowRoot.querySelector('.empty')).backgroundColor
    };
    window.__dcSetProps = setter;
    host._render();
    return result;
  });
  assert.equal(hidden.captionDisplay, 'none');
  assert.equal(hidden.authoring, false);
  assert.equal(hidden.plateBackground, 'rgba(0, 0, 0, 0)');
  report.outsideAuthoring = hidden;
  const filled = await page.locator('image-slot').evaluate(async host => {
    host.setAttribute('src', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="blue"/></svg>');
    const img = host.shadowRoot.querySelector('img');
    await img.decode();
    const result = {
      emptyDisplay: getComputedStyle(host.shadowRoot.querySelector('.empty')).display,
      filled: host.hasAttribute('data-filled')
    };
    host.removeAttribute('src');
    return result;
  });
  assert.equal(filled.emptyDisplay, 'none');
  assert.equal(filled.filled, true);
  report.filled = filled;
}, {
  browserName
});
for (const [p, h] of Object.entries(sourceBefore)) assert.equal(sha(p), h, 'Selected source changed: ' + p);
if (evidence) writeFileSync(evidence, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  browserName,
  contexts: report.contexts.length,
  minimumApca: Math.min(...report.contexts.map(x => x.apca)),
  sourceUnchanged: true
}));
