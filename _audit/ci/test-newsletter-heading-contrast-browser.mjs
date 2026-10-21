import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { apca } from '../../scripts/lib/oklch.mjs';

const path = 'templates/marketing-newsletter/MarketingNewsletter.dc.html';
const source = readFileSync(path, 'utf8');
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const hash = value => createHash('sha256').update(value).digest('hex');
const inputs = new Map();
for (const name of [path, '_audit/ci/test-newsletter-heading-contrast-browser.mjs', '_audit/ci/lib/browser-fixture.mjs', 'scripts/lib/oklch.mjs', '_ds_bundle.js', '_vendor/react/react.production.min.js', '_vendor/react/react-dom.production.min.js', 'package-lock.json']) inputs.set(name, hash(readFileSync(name)));
const heading = 'Bạn có điều ước của riêng mình?';
const fixed = '<div style="font-size:17px;font-weight:700;margin-bottom:4px">' + heading;
const prior = '<div style="font-size:17px;font-weight:700;color:var(--cs-accent-bright);margin-bottom:4px">' + heading;
assert.equal(source.split(fixed).length, 2, 'One exact reviewed heading source fix');
const oldSource = source.replace(fixed, prior);
const elementMap = JSON.parse(source.match(/const EL = \/\* @generated template-literal:axis\.element-map \*\/ (\{[^\n]+\}) \/\* @endgenerated/)[1]);
const linear = n => (n /= 255) <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
const luminance = rgb => rgb.map(linear).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
const hex = rgb => '#' + rgb.map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
function metric(row) {
  const a = luminance(row.foreground), b = luminance(row.background);
  return { ...row, wcag: (Math.max(a, b) + .05) / (Math.min(a, b) + .05), apca: apca(hex(row.foreground), hex(row.background)), wcagFloor: 4.5, apcaFloor: 75 };
}
const rows = [];
let counterproof;
await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  let useOldSource = false;
  await page.route(origin + '/**', async route => {
    const name = decodeURIComponent(new URL(route.request().url()).pathname).slice(1);
    assert(name && !name.split('/').some(part => !part || part === '..' || part === '.'));
    const bytes = readFileSync(resolve(name));
    inputs.set(name, hash(bytes));
    const contentType = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp' }[extname(name)] || 'application/octet-stream';
    await route.fulfill({ body: useOldSource && name === path ? oldSource : bytes, contentType });
  });
  const url = origin + '/' + path;
  await page.goto(url);
  await page.waitForFunction(() => typeof __dcSetProps === 'function' && document.querySelector('[data-sc-name]'));
  const metadata = await page.locator('script[data-props]').evaluate(node => JSON.parse(node.getAttribute('data-props')));
  assert.deepEqual(metadata.theme.options, ['light', 'dark']);
  assert.deepEqual(metadata.language.options, ['English', 'Tiếng Việt', 'Both']);
  assert.equal(metadata.element.options.length, 15);
  const settle = async () => {
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    await page.screenshot({ animations: 'disabled' });
  };
  const sample = async text => metric(await page.getByText(text, { exact: true }).evaluate(node => {
    const colour = value => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = value; ctx.fillRect(0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data];
    };
    const style = getComputedStyle(node), foreground = colour(style.color), ancestors = [];
    let background;
    for (let current = node; current; current = current.parentElement) {
      const s = getComputedStyle(current), bg = colour(s.backgroundColor);
      ancestors.push({ tag: current.tagName, opacity: Number(s.opacity), backgroundImage: s.backgroundImage });
      if (!background && bg[3] === 255) background = bg.slice(0, 3);
      else if (!background && bg[3] !== 0) throw Error('Unmodeled translucent newsletter background');
    }
    if (!background || foreground[3] !== 255 || ancestors.some(item => item.opacity !== 1 || item.backgroundImage !== 'none')) throw Error('Newsletter proof requires opaque, unattenuated solid paint');
    return { foreground: foreground.slice(0, 3), background, fontSize: parseFloat(style.fontSize), fontWeight: Number(style.fontWeight), text: node.textContent, ancestors };
  }));
  for (const element of metadata.element.options) for (const theme of metadata.theme.options) for (const language of metadata.language.options) {
    await page.evaluate(props => __dcSetProps(__dcRootName(), props), { element, theme, language });
    await settle();
    const actualTheme = await page.locator('[data-sc-name] > div').first().getAttribute('data-theme');
    assert.equal(actualTheme, theme === 'dark' ? 'dark' : '', 'Actual authored selected theme rendered');
    const root = page.locator('[data-sc-name] > div').first();
    assert.equal(await root.getAttribute('data-cs-element'), elementMap[element][0]);
    assert.equal(await root.getAttribute('data-cs-variant'), elementMap[element][1]);
    const texts = language === 'English' ? ['Have a wish of your own?'] : language === 'Tiếng Việt' ? [heading] : ['Have a wish of your own?', heading];
    for (const text of texts) {
      const row = { element, theme, language, ...await sample(text) };
      assert.equal(row.fontSize, 17); assert.equal(row.fontWeight, 700);
      assert(row.wcag >= 4.5 && row.apca >= 75, JSON.stringify(row));
      rows.push(row);
    }
  }
  useOldSource = true;
  await page.goto(url);
  await page.waitForFunction(() => typeof __dcSetProps === 'function' && document.querySelector('[data-sc-name]'));
  await page.evaluate(element => __dcSetProps(__dcRootName(), { element, theme: 'light', language: 'Tiếng Việt' }), metadata.element.options[0]);
  await settle();
  counterproof = await sample(heading);
  assert(counterproof.wcag < 4.5 || counterproof.apca < 75, 'Restoring exact old accent-bright source must reproduce the contrast defect');
}, { browserName });
for (const [name, before] of inputs) assert.equal(hash(readFileSync(name)), before, 'Newsletter input changed during proof: ' + name);
mkdirSync('test-results/newsletter-heading', { recursive: true });
writeFileSync('test-results/newsletter-heading/' + browserName + '.json', JSON.stringify({ pass: true, browserName, contexts: 90, headingSamples: rows.length, inputs: Object.fromEntries(inputs), rows, counterproof, originalSourceSha256: hash(source), oldSourceSha256: hash(oldSource), scope: 'All declared15elements×2themes×3languages, both visible headings in Both. Opaque computed paint, WCAG4.5/APCA75 at17px700; exact old-source negative. No glyph-pixel/physical-device/human acceptance claim.' }, null, 2) + '\n');
console.log('PASS ' + browserName + ':90 newsletter axes,120 heading samples and exact old-source contrast counterproof');
