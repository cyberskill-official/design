import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { unzipEntries } from './lib/docx-zip.mjs';

const cases = [
  { text: 'White board header', html: '<header style="background:rgb(145,109,16);color:white"><span>White board header</span></header>', color: 'FFFFFF', fill: '916D10' },
  { text: 'Nested confidentiality badge', html: '<header style="background:rgb(145,109,16);color:white"><span style="background:rgb(69,33,14)">Nested confidentiality badge</span></header>', color: 'FFFFFF', fill: '45210E' },
  { text: 'Alpha over red', html: '<div style="background:red"><span style="background:rgba(0,0,255,.5);color:white">Alpha over red</span></div>', color: 'FFFFFF', fill: '800080' },
  { text: 'White nested reset', html: '<div style="background:rgb(69,33,14)"><span style="background:white;color:rgb(69,33,14)">White nested reset</span></div>', color: '45210E', fill: null },
  { text: 'Transparent child', html: '<div style="background:rgb(69,33,14);color:white"><span style="background:rgba(255,0,0,0)">Transparent child</span></div>', color: 'FFFFFF', fill: '45210E' },
  { text: 'Placeholder highlight', html: '<span style="background:rgb(253,230,138);color:rgb(69,33,14)">Placeholder highlight</span>', color: '45210E', fill: 'FDE68A', highlight: 'yellow' },
  { text: 'Document paper', html: '<span style="color:rgb(69,33,14)">Document paper</span>', color: '45210E', fill: null, outside: 'background:rgb(69,33,14)' },
  { text: 'Sheet root text', html: 'Sheet root text', sheet: 'background:rgb(145,109,16);color:white', color: 'FFFFFF', fill: '916D10' },
  { text: 'Alpha on white paper', html: '<span style="background:rgba(0,0,0,.5);color:white">Alpha on white paper</span>', color: 'FFFFFF', fill: '808080' },
  { text: 'White reset in umber table', html: '<table><tr><td style="background:rgb(69,33,14);color:white"><span style="background:white;color:rgb(69,33,14)">White reset in umber table</span></td></tr></table>', color: '45210E', fill: 'FFFFFF' },
  { text: 'White reset in yellow table', html: '<table><tr><td style="background:rgb(253,230,138)"><span style="background:white;color:rgb(69,33,14)">White reset in yellow table</span></td></tr></table>', color: '45210E', fill: 'FFFFFF' },
];
await withBrowserFixture(async page => {
  await page.addScriptTag({ url: '/templates/_vendor/doc-export.js' });
  for (const test of cases) {
    await page.evaluate(test => {
      document.getElementById('fixture').innerHTML = `<div style="${test.outside || ''}"><article class="cs-sheet" style="${test.sheet || 'background:white'}">${test.html}</article></div>`;
    }, test);
    const encoded = await page.evaluate(async () => {
      const bytes = new Uint8Array(await (await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());
      let str = ''; for (let i = 0; i < bytes.length; i += 16384) str += String.fromCharCode(...bytes.subarray(i, i + 16384));
      return btoa(str);
    });
    const xml = unzipEntries(Buffer.from(encoded, 'base64'))['word/document.xml'].toString();
    const observed = await page.evaluate(({ xml, text }) => {
      const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const run = [...doc.getElementsByTagNameNS(ns, 'r')].find(r => [...r.getElementsByTagNameNS(ns, 't')].map(t => t.textContent).join('').trim() === text);
      if (!run) return null;
      const value = (tag, attribute) => run.getElementsByTagNameNS(ns, tag)[0]?.getAttributeNS(ns, attribute) || null;
      return { color: value('color', 'val'), fill: value('shd', 'fill'), highlight: value('highlight', 'val') };
    }, { xml, text: test.text });
    assert.deepEqual(observed, { color: test.color, fill: test.fill, highlight: test.highlight || null }, test.text);
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log(`PASS DOCX flat backgrounds: ${cases.length} actual browser exports; nested overrides, alpha composition, white resets, transparent ancestors, paper boundary and legacy yellow highlight`);
