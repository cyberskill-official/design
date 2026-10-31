import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

const browserName = process.env.CS_TEST_BROWSER || process.env.CS_BROWSER || 'chromium';

function channel(css) {
  const match = css.match(/rgba?\(([^)]+)\)/);
  assert(match, 'Expected an rgb color, got ' + css);
  return match[1].split(',').slice(0, 3).map(part => Math.round(Number(part)));
}

function contrast(fg, bg) {
  const lin = value => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  const L = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  const light = L(fg);
  const dark = L(bg);
  const [hi, lo] = light > dark ? [light, dark] : [dark, light];
  return (hi + 0.05) / (lo + 0.05);
}

function near(actual, expected, label) {
  assert.equal(actual.length, 3, label);
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(actual[i] - expected[i]) <= 1, `${label} ${actual} vs ${expected}`);
}

await withBrowserFixture(async page => {
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
  await page.evaluate(() => {
    document.getElementById('fixture').innerHTML = '<button class="cs-button cs-button--primary" id="cta">Save</button>';
  });
  const read = () => page.evaluate(() => {
    const button = document.getElementById('cta');
    const paint = getComputedStyle(button);
    const root = getComputedStyle(document.documentElement);
    return {
      bg: paint.backgroundColor,
      fg: paint.color,
      body: getComputedStyle(document.body).backgroundColor,
      tokenBg: root.getPropertyValue('--cs-component-button-primary-bg').trim(),
      surface: root.getPropertyValue('--cs-color-surface-page').trim(),
    };
  });
  const expectPair = async (label, bg, fg, minimum = 4.5) => {
    const paint = await read();
    const fill = channel(paint.bg);
    const text = channel(paint.fg);
    near(fill, bg, label + ' fill');
    near(text, fg, label + ' text');
    const ratio = contrast(text, fill);
    assert.ok(ratio >= minimum, `${label} contrast ${ratio.toFixed(2)} < ${minimum}`);
    assert.equal(paint.tokenBg.includes(' '), false, label + ' token still has a channel space');
    return paint;
  };

  const light = await expectPair('light', [69, 33, 14], [255, 255, 255]);
  near(channel(light.body), [255, 253, 248], 'light page');

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const dark = await expectPair('dark', [244, 186, 23], [26, 17, 8]);
  near(channel(dark.body), [26, 17, 8], 'dark page');

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  const restored = await expectPair('light after dark', [69, 33, 14], [255, 255, 255]);
  near(channel(restored.body), [255, 253, 248], 'page after dark');

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-cs-element', 'hoa');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await expectPair('hoa dark', [138, 74, 48], [255, 255, 255]);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await expectPair('hoa light after dark', [69, 33, 14], [255, 255, 255]);

  await page.evaluate(() => {
    document.documentElement.removeAttribute('data-cs-element');
    document.getElementById('fixture').innerHTML = '<div data-theme="dark"><div data-theme="light"><button class="cs-button cs-button--primary" id="cta">Save</button></div></div>';
  });
  await expectPair('nested light inside dark', [69, 33, 14], [255, 255, 255]);
}, { browserName });

console.log('PASS theme toggle contrast ' + browserName);
