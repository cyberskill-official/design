import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse, parseFragment } from 'parse5';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { unzipEntries } from './lib/docx-zip.mjs';
import { extractPdfText } from './lib/pdf-text.mjs';

const root = resolve(process.argv.find(value => value.startsWith('--root='))?.slice(7) || '.');
const reportDirectory = resolve(process.argv.find(value => value.startsWith('--output-dir='))?.slice(13) || 'test-results/template-display-fields');
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const read = path => readFileSync(join(root, path), 'utf8');
const source = JSON.parse(read('scripts/template-display-fields.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const compact = value => value.normalize('NFC').replace(/\s/gu, '');
const records = [], inputs = new Map();
let currentCase = null;
inputs.set(fileURLToPath(import.meta.url), hash(readFileSync(fileURLToPath(import.meta.url))));
const ownInputs = ['scripts/generate-template-display-fields.mjs', '_audit/ci/test-template-display-fields-browser.mjs', '_audit/ci/lib/browser-fixture.mjs', '_audit/ci/lib/docx-zip.mjs', '_audit/ci/lib/pdf-text.mjs'];
for (const path of ownInputs) inputs.set(resolve(path), hash(readFileSync(path)));
inputs.set(join(root, 'scripts/template-display-fields.json'), hash(readFileSync(join(root, 'scripts/template-display-fields.json'))));
inputs.set(join(root, 'scripts/generate-template-display-fields.mjs'), hash(readFileSync(join(root, 'scripts/generate-template-display-fields.mjs'))));
function restore(html, entry) {
  const doc = parse(html, { sourceCodeLocationInfo: true }), edits = [];
  for (const field of entry.fields) for (const target of field.targets) {
    const node = target.path.reduce((node, part) => part === 'content' ? node.content : node.childNodes[part], doc);
    edits.push({ start: (target.kind === 'percent-width' ? node.sourceCodeLocation.startTag : node.sourceCodeLocation).startOffset, end: (target.kind === 'percent-width' ? node.sourceCodeLocation.startTag : node.sourceCodeLocation).endOffset, value: target.rawDefault });
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
  return html.replace(/\/\* @generated display-content:defaults \*\/[\s\S]*?\/\* @endgenerated display-content:defaults \*\//, '').replace(' data-content-schema="./content-schema.json"', '');
}
try { await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.route(origin + '/**', async route => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname).slice(1);
    assert(path && !path.split('/').some(part => part === '..' || part === '.'));
    const file = existsSync(join(root, path)) ? join(root, path) : resolve(path);
    const bytes = readFileSync(file); inputs.set(file, hash(bytes));
    const extension = path.split('.').at(-1);
    const type = { html: 'text/html', js: 'application/javascript', mjs: 'application/javascript', json: 'application/json', css: 'text/css', svg: 'image/svg+xml', woff2: 'font/woff2', png: 'image/png', webp: 'image/webp' }[extension] || 'application/octet-stream';
    await route.fulfill({ body: bytes, contentType: type });
  });
  const ready = async () => {
    await page.waitForFunction(() => window.__dcRootName?.() && document.querySelector('[data-sc-name]') && !document.querySelector('.sc-logic-error'));
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    await page.waitForFunction(() => [...document.querySelectorAll('img')].every(image => image.complete));
  };
  const selectLanguage = async language => {
    if (language !== null) await page.evaluate(language => __dcSetProps(__dcRootName(), { language }), language);
    await ready();
  };
  const docx = async () => {
    if (!await page.evaluate(() => window.__csDocExport?.buildDocxBlob)) await page.addScriptTag({ url: origin + '/templates/_vendor/doc-export.js' });
    const bytes = await page.evaluate(async () => Array.from(new Uint8Array(await (await __csDocExport.buildDocxBlob(document.querySelector('.cs-sheet') || document.querySelector('[data-sc-name]'))).arrayBuffer())));
    const parts = unzipEntries(Buffer.from(bytes)), xml = parts['word/document.xml'].toString();
    const text = await page.evaluate(xml => { const parsed = new DOMParser().parseFromString(xml, 'application/xml'); if (parsed.querySelector('parsererror')) throw Error('Malformed editable DOCX'); return parsed.documentElement.textContent; }, xml);
    return { xml, text, media: Object.fromEntries(Object.entries(parts).filter(([name]) => name.startsWith('word/media/')).map(([name, bytes]) => [name, hash(bytes)])) };
  };
  for (const entry of source.templates) {
    const fields = entry.fields.filter(field => field.type !== 'number');
    const authored = read(entry.path), original = restore(authored, entry);
    assert.equal(hash(original), entry.baselineSha256, 'Independent whole-document restoration');
    const document = parse(authored), stack = [document]; let metadata;
    while (stack.length) {
      const node = stack.pop();
      if (node.tagName === 'script' && node.attrs.some(attr => attr.name === 'data-dc-script')) metadata = JSON.parse(node.attrs.find(attr => attr.name === 'data-props')?.value || '{}');
      stack.push(...node.childNodes || []); if (node.content) stack.push(node.content);
    }
    const languages = metadata.language?.options || [null], seen = new Set();
    for (const language of languages) {
      currentCase = { path: entry.path, language };
      const url = origin + '/' + entry.path;
      await page.goto(url); await ready(); await selectLanguage(language);
      const output = page.locator('[data-sc-name]'), currentHtml = await output.innerHTML(), pixels = await page.screenshot({ fullPage: true, animations: 'disabled' }), currentDocx = await docx();
      const currentText = await output.textContent();
      // Count exact authored destinations, including repeated names. Equal defaults in
      // different language branches must never stand in for the actual binding.
      const activeTargets = field => field.targets.filter(target => {
        let node = target.path.reduce((node, part) => part === 'content' ? node.content : node.childNodes[part], document);
        for (; node; node = node.parentNode) if (node.tagName === 'sc-if') {
          const condition = node.attrs.find(attr => attr.name === 'value')?.value;
          const flags = { '{{ isEN }}': language !== 'Tiếng Việt', '{{ isVN }}': language === 'Tiếng Việt' || language === 'Both', '{{ isBoth }}': language === 'Both', '{{ showSignatures }}': metadata.showSignatures?.default === true };
          assert(Object.hasOwn(flags, condition), 'Unreviewed conditional destination ' + condition);
          if (!flags[condition]) return false;
        }
        return true;
      });
      const visible = fields.filter(field => activeTargets(field).length);
      for (const field of visible) assert(currentText.includes(field.default), 'Actual default destination ' + field.id);
      const occurrences = (text, value) => text.split(value).length - 1;
      await page.route(url, route => route.fulfill({ body: original, contentType: 'text/html' }));
      await page.goto(url); await ready(); await selectLanguage(language);
      assert.equal(await output.innerHTML(), currentHtml, 'Complete default rendered markup preserved');
      assert(pixels.equals(await page.screenshot({ fullPage: true, animations: 'disabled' })), 'Complete default rendered pixels preserved');
      assert.deepEqual(await docx(), currentDocx, 'Default editable DOCX XML and media preserved');
      await page.unroute(url);
      await page.goto(url); await ready(); await selectLanguage(language);
      const content = Object.fromEntries(fields.map(field => [field.id, 'Dữ liệu ' + field.id + ' <img src=x> & " literal']));
      await page.evaluate(content => __dcSetContent(__dcRootName(), content), content); await ready();
      const customText = await output.textContent();
      for (const field of visible) {
        assert.equal(occurrences(customText, content[field.id]), activeTargets(field).length, 'Every exact authored DOM destination honors ' + field.id);
        for (const target of activeTargets(field)) {
          const literal = raw => parseFragment(raw || '').childNodes.map(node => node.value).join('');
          assert(customText.includes(literal(target.prefix) + content[field.id] + literal(target.suffix)), 'Literal prefix/suffix preserved around ' + field.id);
        }
        seen.add(field.id);
      }
      assert.equal(await page.locator('img[src="x"]').count(), 0, 'Caller markup remains text');
      const customDocx = await docx();
      for (const field of visible) assert.equal(occurrences(compact(customDocx.text), compact(content[field.id])), activeTargets(field).length, 'Every editable DOCX destination contains ' + field.id);
      await page.emulateMedia({ media: 'print' });
      for (const field of visible) assert((await output.textContent()).includes(content[field.id]));
      let parsedPdf = false;
      if (browserName === 'chromium') {
        const expected = await output.evaluate((root, { fields, content }) => fields.flatMap(field => {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          const destinations = [];
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent.includes(content[field.id])) continue;
            const parent = node.parentElement, style = getComputedStyle(parent);
            if (!parent.getClientRects().length || style.visibility !== 'visible') continue;
            const transform = style.textTransform;
            const language = parent.closest('[lang]')?.lang || document.documentElement.lang || 'en';
            let value = content[field.id];
            if (transform === 'uppercase') value = value.toLocaleUpperCase(language);
            else if (transform === 'lowercase') value = value.toLocaleLowerCase(language);
            else if (transform !== 'none') throw Error('Unreviewed print text transformation: ' + transform);
            destinations.push({ id: field.id, transform, language, value });
          }
          if (!destinations.length) throw Error('No visible print destination for ' + field.id);
          return destinations;
        }), { fields: visible, content });
        const pdfBytes = await page.pdf({ printBackground: true, preferCSSPageSize: true });
        const pdf = extractPdfText(pdfBytes);
        mkdirSync(join(reportDirectory, 'pdf'), { recursive: true });
        const pdfName = entry.template + '-' + String(language).replace(/[^A-Za-z0-9]/g, '_');
        writeFileSync(join(reportDirectory, 'pdf', pdfName) + '.pdf', pdfBytes);
        writeFileSync(join(reportDirectory, 'pdf', pdfName) + '.json', JSON.stringify({ actual: pdf, expected }, null, 2));
        for (const destination of expected) assert.equal(occurrences(compact(pdf.text), compact(destination.value)), expected.filter(other => other.value === destination.value).length, 'Every actual parsed PDF destination contains ' + destination.id + ' with declared ' + destination.transform + ' print styling');
        parsedPdf = true;
      }
      await page.emulateMedia({ media: 'screen' });
      const rejected = await page.evaluate(fields => {
        const before = document.querySelector('[data-sc-name]').innerHTML; let count = 0, getters = 0;
        const reject = value => { try { __dcSetContent(__dcRootName(), value); } catch { count++; return; } throw Error('Unsafe content accepted'); };
        for (const { id, maxLength } of fields) {
          for (const bad of [null, [], {}, () => {}, '', 'bad\u0000value', 'bad\uD800value', 'x'.repeat(maxLength + 1)]) reject({ [id]: bad });
          const value = {}; Object.defineProperty(value, id, { enumerable: true, get() { getters++; return 'bad'; } }); reject(value);
        }
        reject({ unknown: 'bad' }); reject({ element: 'bad' }); reject(JSON.parse('{"__proto__":"bad"}'));
        if (getters || before !== document.querySelector('[data-sc-name]').innerHTML) throw Error('Rejected content executed an accessor or changed accepted state');
        return { count, getters };
      }, fields);
      await page.evaluate(() => __dcSetContent(__dcRootName(), {})); await ready();
      assert.equal(await output.innerHTML(), currentHtml, 'Reset preserves every original default');
      records.push({ path: entry.path, language, fields: visible.map(field => field.id), exactDestinations: Object.fromEntries(visible.map(field => [field.id, activeTargets(field).length])), defaultHtmlPixelsDocxIdentical: true, screenshotScope: 'entire visible page including display-contents host children', customPlainTextDocx: true, print: true, parsedPdf, rejected });
    }
    assert.deepEqual([...seen].sort(), fields.map(field => field.id).sort(), 'Every declared display field honored in a supported language view');
  }
}, { browserName }); } catch (error) {
  mkdirSync(reportDirectory, { recursive: true });
  writeFileSync(join(reportDirectory, browserName) + '-failure.json', JSON.stringify({ pass: false, browserName, root, currentCase, error: String(error.stack || error), records, inputs: Object.fromEntries(inputs) }, null, 2) + '\n');
  throw error;
}
for (const [path, before] of inputs) assert.equal(hash(readFileSync(path)), before, 'Tested display input changed during proof');
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(join(reportDirectory, browserName) + '.json', JSON.stringify({ pass: true, browserName, root, sourceSha256: hash(read('scripts/template-display-fields.json')), inputs: Object.fromEntries(inputs), templates: source.templates.length, fields: source.templates.reduce((sum, entry) => sum + entry.fields.length, 0), records, scope: 'Observed plain display data, exact original defaults, editable DOCX and print; parsed PDF Chromium only. No arithmetic, legal/date validation, target Office or physical-device acceptance.' }, null, 2) + '\n');
console.log('PASS ' + browserName + ': exact original display defaults/HTML/pixels/DOCX, actual custom fields and atomic hostile-input rejection');
