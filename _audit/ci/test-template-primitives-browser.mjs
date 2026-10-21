/** Authored primitives: user image persistence and native deck interaction. */
import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_BROWSER || 'chromium';
let imageCases = 0,
  deckCases = 0,
  pdfCases = 0;
await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  const probeStyle = '--paint:#45210e;--line:#f4ba17;--corners:14px;background:var(--paint);border:3px solid var(--line);border-radius:var(--corners);padding:12px 18px;font:600 14px/1.4 system-ui';
  await page.route('**/authored-style-probe.dc.html', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html><script src="/templates/_vendor/support.js"></script><body><x-dc><div id="style-probe" style="' + probeStyle + '">Probe</div></x-dc><script type="text/x-dc" data-dc-script data-props="{}">class Component extends DCLogic {renderVals(){return {}}}</script></body></html>'
  }));
  await page.goto(origin + '/authored-style-probe.dc.html');
  await page.waitForFunction(() => typeof __dcSetProps === 'function' && document.querySelector('[data-sc-name]'));
  const styles = await page.evaluate(style => {
    const reference = document.createElement('div');
    reference.style.cssText = style;
    reference.textContent = 'Reference';
    document.body.append(reference);
    const keys = ['backgroundColor', 'borderTopColor', 'borderTopWidth', 'borderTopStyle', 'borderTopLeftRadius', 'paddingLeft', 'paddingTop', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight'];
    const read = el => Object.fromEntries(keys.map(key => [key, getComputedStyle(el)[key]]));
    const result = {
      actual: read(document.getElementById('style-probe')),
      expected: read(reference)
    };
    reference.remove();
    return result;
  }, probeStyle);
  assert.deepEqual(styles.actual, styles.expected, 'Variable-based shorthand declarations must match native inline CSS');
  await page.goto(origin + '/');
  await page.route('**/.image-slots.state.json', route => route.fulfill({
    json: {
      saved: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"/>',
      untouched: 'images/keep.png'
    }
  }));
  await page.evaluate(() => {
    window.writes = [];
    window.__dcSetProps = () => {};
    window.omelette = {
      async writeFile(path, content) {
        writes.push({
          path,
          state: JSON.parse(content)
        });
      }
    };
  });
  await page.addScriptTag({
    url: origin + '/image-slot.js'
  });
  await page.evaluate(() => document.getElementById('fixture').innerHTML = '<div style="display:flex;gap:12px"><image-slot id="saved" style="width:240px;height:140px"></image-slot><image-slot id="first" style="width:240px;height:140px"></image-slot><image-slot id="second" style="width:240px;height:140px"></image-slot></div>');
  await page.waitForFunction(() => document.getElementById('saved').shadowRoot.querySelector('img').naturalWidth === 30);
  assert.equal(await page.locator('#saved img').evaluate(el => el.naturalWidth), 30);
  imageCases++;
  const png = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 24;
    c.getContext('2d').fillRect(0, 0, 32, 24);
    return c.toDataURL().split(',')[1];
  });
  for (const id of ['first', 'second']) {
    await page.locator('#' + id + ' input[type=file]').setInputFiles({
      name: id + '.png',
      mimeType: 'image/png',
      buffer: Buffer.from(png, 'base64')
    });
    await page.waitForFunction(id => {
      const img = document.getElementById(id).shadowRoot.querySelector('img');
      return img.complete && img.naturalWidth === 32;
    }, id);
  }
  await page.waitForFunction(() => writes.length === 2);
  const writes = await page.evaluate(() => writes);
  assert(writes.every(row => row.path === '.image-slots.state.json'));
  assert.equal(writes[1].state.untouched, 'images/keep.png');
  assert(writes[1].state.saved && writes[1].state.first && writes[1].state.second);
  imageCases++;
  await page.locator('#first [data-act=clear]').click();
  await page.waitForFunction(() => writes.length === 3);
  assert.equal(await page.locator('#first').getAttribute('src'), null);
  assert(!(await page.evaluate(() => Object.hasOwn(writes[2].state, 'first'))));
  assert(await page.evaluate(() => !!writes[2].state.second));
  imageCases++;
  await page.evaluate(() => {
    window.imageErrors = [];
    document.getElementById('second').addEventListener('cs-image-error', event => imageErrors.push(event.detail.reason));
    window.omelette.writeFile = async () => {
      throw Error('Host write rejected');
    };
  });
  await page.locator('#second [data-act=clear]').click();
  await page.waitForFunction(() => imageErrors.length === 1);
  assert.match(await page.evaluate(() => imageErrors[0]), /Host write rejected/);
  imageCases++;
  // A failed write must not poison the queue for the next explicit user action.
  await page.evaluate(() => {
    window.omelette.writeFile = async (path, content) => writes.push({
      path,
      state: JSON.parse(content)
    });
  });
  await page.locator('#first input[type=file]').setInputFiles({
    name: 'retry.png',
    mimeType: 'image/png',
    buffer: Buffer.from(png, 'base64')
  });
  await page.waitForFunction(() => writes.length === 4);
  assert(await page.evaluate(() => !!writes[3].state.first));
  imageCases++;
  await page.evaluate(() => {
    delete window.omelette;
    document.getElementById('first')._render();
  });
  assert.equal(await page.locator('#first').getAttribute('data-editable'), null);
  assert.equal(await page.locator('#first .tools').evaluate(el => getComputedStyle(el).display), 'none');
  imageCases++;
  await page.addScriptTag({
    url: origin + '/templates/_vendor/deck-stage.js'
  });
  for (const width of [320, 768, 1280]) for (const language of ['en', 'vi']) {
    await page.setViewportSize({
      width,
      height: 900
    });
    await page.evaluate(language => {
      document.documentElement.lang = language;
      document.getElementById('fixture').innerHTML = '<deck-stage width="1000" height="600"><section data-label="A"><input aria-label="Slide input"><button id="handled">Nested control</button></section><section data-label="B">Second</section><section data-label="C">Third</section></deck-stage>';
      document.getElementById('handled').addEventListener('keydown', event => event.preventDefault());
    }, language);
    const stage = page.locator('deck-stage'),
      active = () => page.locator('section[data-deck-active]').getAttribute('data-label');
    assert.equal(await active(), 'A');
    await page.getByRole('textbox', {
      name: 'Slide input'
    }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await active(), 'A');
    await page.locator('#handled').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await active(), 'A');
    await page.locator('#handled').evaluate(el => el.blur());
    await page.keyboard.press('ArrowRight');
    assert.equal(await active(), 'B');
    await page.keyboard.press('End');
    assert.equal(await active(), 'C');
    await page.keyboard.press('Home');
    assert.equal(await active(), 'A');
    const next = stage.getByRole('button', {
      name: language === 'vi' ? 'Trang sau' : 'Next slide',
      exact: true
    });
    const box = await next.boundingBox();
    assert(box.width >= 44 && box.height >= 44);
    await next.click();
    assert.equal(await active(), 'B');
    const state = await stage.evaluate(el => ({
      width: el.getBoundingClientRect().width,
      scale: Number(el.style.getPropertyValue('--deck-scale')),
      rows: [...el.children].map(slide => ({
        label: slide.dataset.label,
        inert: slide.inert,
        hidden: slide.getAttribute('aria-hidden'),
        display: getComputedStyle(slide).display
      }))
    }));
    assert(state.scale > 0);
    const canvas = await stage.locator('.canvas').boundingBox();
    assert(canvas.width <= state.width + .5 && canvas.height <= 824.5, 'Scaled slide must fit the viewport above navigation');
    assert(state.width <= width);
    assert(state.rows.every(row => row.label === 'B' ? !row.inert && row.hidden === 'false' && row.display !== 'none' : row.inert && row.hidden === 'true' && row.display === 'none'));
    await page.emulateMedia({
      media: 'print'
    });
    assert(await page.locator('deck-stage > section').evaluateAll(nodes => nodes.every(el => getComputedStyle(el).display !== 'none')));
    const printState = await stage.evaluate(el => ({
      transform: getComputedStyle(el.shadowRoot.querySelector('.canvas')).transform,
      nav: getComputedStyle(el.shadowRoot.querySelector('nav')).display,
      slides: el.slides.map(slide => ({
        ratio: getComputedStyle(slide).aspectRatio,
        minHeight: getComputedStyle(slide).minHeight
      }))
    }));
    assert.equal(printState.transform, 'none');
    assert.equal(printState.nav, 'none');
    assert(printState.slides.every(slide => slide.ratio === '1000 / 600' && slide.minHeight === '0px'));
    if (browserName === 'chromium') {
      const bytes = await page.pdf({
        format: 'Letter',
        preferCSSPageSize: true,
        printBackground: true
      }); /* This count probe is scoped to the pinned Chromium fixture's flat page tree; unsupported serialization fails explicitly. */
      const raw = bytes.toString('latin1');
      const trees = [...raw.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/g)];
      const leaves = [...raw.matchAll(/\/Type\s*\/Page\b/g)];
      assert.equal(trees.length, 1, 'Current Chromium PDF fixture must expose one flat page tree');
      assert.equal(Number(trees[0][1]), leaves.length, 'PDF page tree and leaf count must agree');
      assert.equal(leaves.length, 3, 'Three slides must export as three PDF pages');
      pdfCases++;
    }
    await page.emulateMedia({
      media: 'screen'
    });
    await stage.evaluate(el => {
      el.remove();
      document.getElementById('fixture').append(el);
    });
    await page.keyboard.press('ArrowRight');
    assert.equal(await active(), 'C');
    deckCases++;
  }
}, {
  browserName
});
console.log(JSON.stringify({
  browserName,
  styleCases: 1,
  imageCases,
  deckCases,
  pdfCases,
  scope: 'Intercepted host writer, two real PNG uploads, retained sidecar entries, clear/failure/retry/readonly; native slide keys/buttons, input and handled-event ownership, hidden slide state, print CSS and reconnect. No actual host filesystem, PDF or screen-reader acceptance.'
}));
