import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_BROWSER || 'chromium';
const rows = [];
const avif = 'AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAALAAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAQAAAACAAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBAAwAAAAAE2NvbHJuY2x4AAEADQAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAANG1kYXQSAAoJGBU/+0QENBoQMh0Ux4eGZQIIIJ5QAAAAx5O05wWHawTocr6LH36NEA==';
const webp = 'UklGRjQCAABXRUJQVlA4WAoAAAAgAAAAPwAAHwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggRgAAALADAJ0BKkAAIAA+bTaXSKQjIiEkCACADYlnAM+SgH4AACCNJGGgAP7wm0P/5BcsLrka//yA/5Af8gP/498QmTfnzwAAAAA=';
const frames = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const record = row => {
  rows.push(row);
  console.log('IMAGE_STATE_CASE ' + JSON.stringify({
    browserName,
    ...row
  }));
};
async function fixture(kind, check, language = 'en') {
  await withBrowserFixture(async page => {
    const origin = new URL(page.url()).origin;
    const data = await page.evaluate(webpFallback => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 32;
      canvas.getContext('2d').fillRect(0, 0, 64, 32);
      const author = canvas.toDataURL();
      canvas.getContext('2d').fillStyle = 'red';
      canvas.getContext('2d').fillRect(0, 0, 64, 32);
      const webpCandidate = canvas.toDataURL('image/webp', .85);
      const nativeEncoding = webpCandidate.split(';')[0].slice(5);
      return {
        author,
        saved: canvas.toDataURL(),
        jpeg: canvas.toDataURL('image/jpeg'),
        webp: nativeEncoding === 'image/webp' ? webpCandidate : 'data:image/webp;base64,' + webpFallback,
        nativeEncoding
      };
    }, webp);
    assert(['image/webp', 'image/png'].includes(data.nativeEncoding), 'Unexpected native Canvas encoding');
    let releaseState;
    const stateGate = new Promise(resolve => {
      releaseState = resolve;
    });
    let remoteRequests = 0;
    await page.route(origin + '/saved-remote.png', route => {
      remoteRequests++;
      return route.fulfill({
        contentType: 'image/png',
        body: Buffer.from(data.saved.split(',')[1], 'base64')
      });
    });
    const sidecar = kind === 'remote-state' ? {
      probe: {
        u: origin + '/saved-remote.png'
      },
      unrelated: 'retain-opaque-entry'
    } : kind.startsWith('hydrate-') ? {
      probe: {
        u: data.saved,
        s: 1,
        x: 0,
        y: 0
      },
      unrelated: {
        u: origin + '/saved-remote.png',
        s: 2
      }
    } : {};
    await page.route('**/.image-slots.state.json', async route => {
      if (kind.startsWith('hydrate-')) await stateGate;
      return route.fulfill({
        json: sidecar
      });
    });
    const stateResponse = page.waitForResponse('**/.image-slots.state.json');
    await page.evaluate(({
      data,
      language
    }) => {
      document.documentElement.lang = language;
      window.writes = [];
      window.errors = [];
      window.holdWrites = false;
      window.omelette = {
        writeFile(path, content) {
          writes.push({
            path,
            value: JSON.parse(content)
          });
          return holdWrites ? new Promise(() => {}) : Promise.resolve();
        }
      };
      window.__dcSetProps = () => {};
      document.addEventListener('cs-image-error', event => errors.push(event.detail));
      const slot = document.createElement('image-slot');
      slot.id = 'probe';
      slot.style = 'width:300px;height:180px';
      slot.setAttribute('src', data.author);
      document.getElementById('fixture').append(slot);
    }, {
      data,
      language
    });
    await page.addScriptTag({
      url: origin + '/image-slot.js'
    });
    if (!kind.startsWith('hydrate-')) {
      await (await stateResponse).finished();
      await frames(page);
    }
    const slot = page.locator('image-slot'),
      image = slot.locator('.frame img');
    await page.waitForFunction(() => document.getElementById('probe').shadowRoot.querySelector('.frame img').naturalWidth === 64);
    const edit = async () => {
      await slot.getByRole('button', {
        name: language === 'vi' ? 'Chỉnh sửa' : 'Edit',
        exact: true
      }).click();
      await page.keyboard.press('+');
      await page.keyboard.press('+');
    };
    await check({
      page,
      origin,
      data,
      slot,
      image,
      edit,
      releaseState,
      stateResponse,
      remoteRequests: () => remoteRequests
    });
    releaseState();
  }, {
    browserName
  });
}
await fixture('remote-state', async ({
  page,
  slot,
  image,
  data,
  remoteRequests
}) => {
  assert.equal(remoteRequests(), 0, 'Writable sidecar must not initiate a remote image request');
  assert.equal(await image.getAttribute('src'), data.author);
  await slot.getByRole('button', {
    name: 'Edit',
    exact: true
  }).click();
  await page.keyboard.press('+');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => writes.length === 1);
  assert.equal(await page.evaluate(() => writes[0].value.unrelated), 'retain-opaque-entry');
  record({
    kind: 'sidecar-remote-blocked-author-fallback',
    unrelatedRetained: true
  });
});
await fixture('blob-author', async ({
  page,
  slot,
  image
}) => {
  const blobURL = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 71;
    canvas.height = 37;
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    const url = URL.createObjectURL(blob);
    document.getElementById('probe').setAttribute('src', url);
    return url;
  });
  await page.waitForFunction(() => document.getElementById('probe').shadowRoot.querySelector('img').naturalWidth === 71);
  assert.equal(await image.getAttribute('src'), blobURL);
  assert.equal(await slot.getAttribute('data-filled'), '');
  await page.evaluate(url => URL.revokeObjectURL(url), blobURL);
  record({
    kind: 'author-blob-loaded'
  });
});
for (const language of ['en', 'vi']) await fixture('mime', async ({
  page,
  slot,
  image,
  data
}) => {
  const input = slot.locator('input[type=file]');
  assert.equal(await input.getAttribute('accept'), 'image/png,image/jpeg,image/webp,image/avif');
  for (const [mimeType, name, buffer] of [['image/svg+xml', 'unsupported.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32"/>')], ['image/gif', 'unsupported.gif', Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')]]) {
    await input.setInputFiles({
      name,
      mimeType,
      buffer
    });
    assert.equal(await image.getAttribute('src'), data.author);
    assert.equal(await page.evaluate(() => writes.length), 0);
    assert.equal(await slot.locator('.error').isVisible(), true);
    assert.equal(await slot.locator('.error').textContent(), language === 'vi' ? 'Thả ảnh PNG, JPEG, WebP hoặc AVIF.' : 'Drop a PNG, JPEG, WebP, or AVIF image.');
  }
  for (const [mimeType, value] of [['image/jpeg', data.jpeg], ['image/webp', data.webp], ['image/png', data.saved], ['image/avif', 'data:image/avif;base64,' + avif]]) {
    const before = await page.evaluate(() => writes.length);
    await input.setInputFiles({
      name: 'supported.' + mimeType.split('/')[1],
      mimeType,
      buffer: Buffer.from(value.split(',')[1], 'base64')
    });
    await page.waitForFunction(before => writes.length > before, before);
    await page.waitForFunction(() => !document.getElementById('probe').hasAttribute('data-swapping'));
    assert.equal(await slot.locator('.error').isVisible(), false);
    const src = await image.getAttribute('src');
    assert.equal(src.split(',')[0], `data:${data.nativeEncoding};base64`);
    const encodedBytes = Buffer.from(src.split(',')[1], 'base64');
    if (data.nativeEncoding === 'image/webp') {
      assert.equal(encodedBytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(encodedBytes.toString('ascii', 8, 12), 'WEBP');
    } else {
      assert.deepEqual([...encodedBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    }
  }
  record({
    kind: 'mime-and-visible-errors',
    language,
    encodedMime: data.nativeEncoding,
    rejected: ['SVG', 'GIF'],
    decoded: ['JPEG', 'WebP', 'PNG', 'AVIF']
  });
}, language);
await fixture('disconnect', async ({
  page,
  slot,
  image,
  edit
}) => {
  const original = await image.boundingBox();
  await edit();
  assert((await image.boundingBox()).width > original.width);
  await slot.evaluate(el => {
    const parent = el.parentElement;
    el.remove();
    parent.append(el);
  });
  await frames(page);
  assert.equal(await page.evaluate(() => writes.length), 0, 'Disconnect is cancellation, not commit');
  const restored = await image.boundingBox();
  assert(Math.abs(restored.width - original.width) < .1);
  assert.equal(await slot.getAttribute('data-reframe'), null);
  record({
    kind: 'disconnect-cancels-and-restores'
  });
});
await fixture('pagehide', async ({
  page,
  edit
}) => {
  await page.evaluate(() => holdWrites = true);
  await edit();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => writes.length === 1);
  await edit();
  const result = await page.evaluate(() => {
    window.dispatchEvent(new Event('pagehide'));
    return {
      count: writes.length,
      scales: writes.map(row => row.value.probe.s)
    };
  });
  assert.equal(result.count, 2, 'Pagehide must invoke the writer without waiting for the first acknowledgement');
  assert(result.scales[1] > result.scales[0]);
  record({
    kind: 'pagehide-immediate-inflight-flush',
    writes: result.count
  });
});
for (const action of ['crop', 'clear', 'upload']) await fixture('hydrate-' + action, async ({
  page,
  slot,
  image,
  edit,
  releaseState,
  stateResponse,
  data,
  origin,
  remoteRequests
}) => {
  if (action === 'crop') {
    await edit();
    await page.keyboard.press('Escape');
  } else if (action === 'clear') await slot.getByRole('button', {
    name: 'Remove',
    exact: true
  }).click();else {
    await slot.locator('input[type=file]').setInputFiles({
      name: 'own.png',
      mimeType: 'image/png',
      buffer: Buffer.from(data.author.split(',')[1], 'base64')
    });
    await page.waitForFunction(prefix => document.getElementById('probe').shadowRoot.querySelector('img').getAttribute('src').startsWith(prefix), `data:${data.nativeEncoding};base64,`);
  }
  releaseState();
  await (await stateResponse).finished();
  await page.waitForFunction(() => writes.length > 0);
  await frames(page);
  const state = await page.evaluate(() => writes.at(-1).value);
  assert.deepEqual(state.unrelated, {
    u: origin + '/saved-remote.png',
    s: 2
  });
  assert.equal(remoteRequests(), 0);
  if (action === 'crop') {
    assert.equal(state.probe.u, data.saved);
    assert(state.probe.s > 1);
    assert.equal(await image.getAttribute('src'), data.saved);
  } else if (action === 'clear') {
    assert.equal(Object.hasOwn(state, 'probe'), false);
    assert.equal(await image.getAttribute('src'), data.author);
  } else {
    assert.equal(state.probe.split(',')[0], `data:${data.nativeEncoding};base64`);
    assert.equal(await image.getAttribute('src'), state.probe);
  }
  record({
    kind: 'hydration-race',
    action,
    unrelatedRawRecordPreserved: true
  });
});
await fixture('toolbar', async ({
  page,
  slot
}) => {
  const geometry = await slot.evaluate(el => {
    const frame = el.getBoundingClientRect(),
      tools = el.shadowRoot.querySelector('.tools'),
      box = tools.getBoundingClientRect();
    return {
      top: box.top - frame.top,
      right: frame.right - box.right,
      height: box.height,
      margin: getComputedStyle(tools).margin
    };
  });
  assert.equal(geometry.top, 8);
  assert.equal(geometry.right, 8);
  assert.equal(geometry.margin, '0px');
  assert(geometry.height >= 44);
  await slot.dblclick({
    position: {
      x: 16,
      y: 150
    }
  });
  assert.equal(await slot.getAttribute('data-reframe'), '');
  await page.keyboard.press('Escape');
  record({
    kind: 'toolbar-placement-and-real-image-hit',
    ...geometry
  });
});
await fixture('replacement', async ({
  page,
  origin,
  slot,
  image,
  data
}) => {
  let release;
  const pending = new Promise(resolve => release = resolve);
  await page.route(origin + '/slow.png', async route => {
    await pending;
    return route.fulfill({
      contentType: 'image/png',
      body: Buffer.from(data.saved.split(',')[1], 'base64')
    });
  });
  const request = page.waitForRequest(origin + '/slow.png');
  await slot.evaluate((el, url) => {
    el.setAttribute('src', url);
    el.setAttribute('alt', 'same-task rerender');
  }, origin + '/slow.png');
  await request;
  assert.equal(await slot.getAttribute('data-swapping'), '');
  assert.equal(await image.evaluate(el => getComputedStyle(el).visibility), 'hidden');
  assert.equal(await slot.locator('.loading').isVisible(), true);
  release();
  await page.waitForFunction(() => !document.getElementById('probe').hasAttribute('data-swapping'));
  assert.equal(await image.evaluate(el => getComputedStyle(el).visibility), 'visible');
  record({
    kind: 'replacement-masked-until-settled'
  });
});
await fixture('stale-encode', async ({
  page,
  slot,
  image,
  data
}) => {
  await page.evaluate(() => {
    window.realDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      window.decodeStarted = true;
      return new Promise(resolve => window.releaseDecode = () => realDecode.call(this).then(resolve));
    };
  });
  await slot.locator('input[type=file]').setInputFiles({
    name: 'delayed.png',
    mimeType: 'image/png',
    buffer: Buffer.from(data.saved.split(',')[1], 'base64')
  });
  await page.waitForFunction(() => window.decodeStarted);
  assert.equal(await slot.getAttribute('data-swapping'), '');
  await slot.evaluate(el => el.setAttribute('alt', 'rerender while encoding'));
  assert.equal(await slot.getAttribute('data-swapping'), '', 'Same-src rerender must not release the pending encode mask');
  await slot.getByRole('button', {
    name: 'Remove',
    exact: true
  }).click();
  await page.waitForFunction(() => writes.length > 0);
  await page.evaluate(async () => {
    releaseDecode();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    HTMLImageElement.prototype.decode = realDecode;
  });
  assert.equal(await image.getAttribute('src'), data.author);
  assert.equal(await page.evaluate(() => writes.some(row => row.value.probe)), false);
  assert.equal(await slot.getAttribute('data-swapping'), null);
  record({
    kind: 'clear-invalidates-pending-encode'
  });
});
await fixture('failed-decode', async ({
  page,
  slot,
  image,
  edit
}) => {
  await edit();
  const before = await image.boundingBox();
  await slot.locator('input[type=file]').setInputFiles({
    name: 'corrupt.png',
    mimeType: 'image/png',
    buffer: Buffer.from('invalid PNG bytes')
  });
  await page.waitForFunction(() => errors.length === 1);
  assert.equal(await slot.getAttribute('data-reframe'), '');
  assert.equal(await slot.getAttribute('data-swapping'), null);
  assert.equal(await page.evaluate(() => writes.length), 0);
  assert.equal(await slot.locator('.error').textContent(), 'Unable to read image');
  assert(Math.abs((await image.boundingBox()).width - before.width) < .1);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => writes.length === 1);
  record({
    kind: 'failed-decode-retains-uncommitted-crop'
  });
});
await fixture('identical-upload', async ({
  page,
  slot,
  data
}) => {
  const input = slot.locator('input[type=file]'),
    buffer = Buffer.from(data.saved.split(',')[1], 'base64');
  for (const count of [1, 2]) {
    await input.setInputFiles({
      name: 'same.png',
      mimeType: 'image/png',
      buffer
    });
    await page.waitForFunction(count => writes.length === count, count);
    await page.waitForFunction(() => !document.getElementById('probe').hasAttribute('data-swapping'));
  }
  const values = await page.evaluate(() => writes.map(row => row.value.probe));
  assert.equal(values[0], values[1]);
  record({
    kind: 'byte-identical-upload-releases-mask'
  });
});
await fixture('id-state', async ({
  page,
  slot,
  image,
  data
}) => {
  await slot.locator('input[type=file]').setInputFiles({
    name: 'own.png',
    mimeType: 'image/png',
    buffer: Buffer.from(data.saved.split(',')[1], 'base64')
  });
  await page.waitForFunction(() => writes.length === 1);
  const uploaded = await image.getAttribute('src');
  assert.notEqual(uploaded, data.author);
  await slot.evaluate(el => el.id = 'new-slot');
  assert.equal(await image.getAttribute('src'), data.author, 'Changing ID must not retain another identified slot image');
  await slot.evaluate(el => el.id = 'probe');
  assert.equal(await image.getAttribute('src'), uploaded);
  await slot.evaluate(el => el.removeAttribute('id'));
  assert.equal(await image.getAttribute('src'), data.author, 'An identified upload must not become idless local state');
  record({
    kind: 'id-switch-selects-own-state'
  });
});
await fixture('id-crop', async ({
  page,
  slot,
  image,
  edit
}) => {
  const original = await image.boundingBox();
  await edit();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => writes.length === 1);
  const cropped = await image.boundingBox();
  assert(cropped.width > original.width);
  await slot.evaluate(el => el.id = 'fresh-crop');
  const reset = await image.boundingBox();
  assert(Math.abs(reset.width - original.width) < .1, 'Crop-only ID switch must reset framing without a source change');
  await slot.evaluate(el => el.id = 'probe');
  assert(Math.abs((await image.boundingBox()).width - cropped.width) < .1);
  record({
    kind: 'crop-only-id-switch-restores-framing'
  });
});
await fixture('writer-failure', async ({
  page,
  edit
}) => {
  await page.evaluate(() => {
    window.failedWrites = 0;
    omelette.writeFile = (path, content) => {
      failedWrites++;
      if (failedWrites === 1) return Promise.reject(new Error('fixture writer failure'));
      writes.push({
        path,
        value: JSON.parse(content)
      });
      return Promise.resolve();
    };
  });
  await edit();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => errors.length === 1);
  await edit();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => writes.length === 1);
  assert.equal(await page.evaluate(() => failedWrites), 2);
  assert((await page.evaluate(() => writes[0].value.probe.s)) > 1);
  record({
    kind: 'writer-failure-does-not-poison-next-save'
  });
});
console.log(JSON.stringify({
  browserName,
  scenarios: rows.length,
  rows,
  scope: 'Source-derived image trust/lifecycle, MIME errors, delayed request and encode behavior. Writer intercepted, pagehide dispatched; No real unload/backend, host, rights or human acceptance.'
}));
