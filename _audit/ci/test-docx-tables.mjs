import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { unzipEntries } from './lib/docx-zip.mjs';
await withBrowserFixture(async page => {
  await page.addScriptTag({
    url: '/templates/_vendor/doc-export.js'
  });
  await page.evaluate(() => {
    document.getElementById('fixture').innerHTML = '<article class="cs-sheet"><table style="width:600px;table-layout:fixed"><colgroup><col style="width:180px"><col style="width:420px"></colgroup><tfoot><tr><td colspan="2">Total footer</td></tr></tfoot><thead><tr><th>Heading A</th><th>Heading B</th></tr></thead><tbody><tr><td>Left</td><td>Right</td></tr><tr><td colspan="2">Merged</td></tr></tbody></table></article>';
  });
  const b64 = await page.evaluate(async () => {
    const bytes = new Uint8Array(await (await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s);
  });
  const xml = unzipEntries(Buffer.from(b64, 'base64'))['word/document.xml'].toString();
  const table = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml'),
      ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const els = (n, name) => [...n.getElementsByTagNameNS(ns, name)];
    const tbl = els(doc, 'tbl')[0];
    return {
      widths: els(tbl, 'gridCol').map(n => Number(n.getAttributeNS(ns, 'w'))),
      rows: els(tbl, 'tr').map(tr => els(tr, 'tc').map(tc => ({
        text: els(tc, 't').map(n => n.textContent).join(''),
        width: Number(els(tc, 'tcW')[0].getAttributeNS(ns, 'w')),
        span: Number(els(tc, 'gridSpan')[0]?.getAttributeNS(ns, 'val') || 1)
      })))
    };
  }, xml);
  assert.deepEqual(table.rows.map(row => row.map(c => c.text)), [['Heading A', 'Heading B'], ['Left', 'Right'], ['Merged'], ['Total footer']]);
  assert.notEqual(table.widths[0], table.widths[1]);
  for (const row of table.rows) {
    let col = 0;
    for (const cell of row) {
      assert.equal(cell.width, table.widths.slice(col, col + cell.span).reduce((a, b) => a + b, 0), cell.text + ' width');
      col += cell.span;
    }
    assert.equal(col, table.widths.length);
  }
}, {
  browserName: process.env.CS_TEST_BROWSER || 'chromium'
});
console.log('PASS DOCX tables: header/body/footer order, unequal column widths and colspan geometry');
