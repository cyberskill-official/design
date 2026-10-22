import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { unzipEntries } from './lib/docx-zip.mjs';
await withBrowserFixture(async page => {
  await page.addScriptTag({
    url: '/templates/_vendor/doc-export.js'
  });
  await page.evaluate(() => {
    document.getElementById('fixture').innerHTML = '<article class="cs-sheet"><ol start="3"><li>Three<ul><li>Nested bullet</li></ul>Continuation</li><li value="7">Seven</li><li>Eight</li></ol><ol><li>Restart one</li></ol><table><tr><td><ul style="list-style-type:square"><li>Cell bullet</li></ul></td></tr></table><div style="display:grid;grid-template-columns:1fr 1fr"><div><ol type="A"><li>Grid alpha</li></ol></div><div>Other cell</div></div><ol reversed start="4"><li>Four</li><li>Reverse three</li></ol></article>';
  });
  const b64 = await page.evaluate(async () => {
    const bytes = new Uint8Array(await (await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s);
  });
  const parts = unzipEntries(Buffer.from(b64, 'base64'));
  assert(parts['word/numbering.xml'], 'Missing numbering part');
  assert.match(parts['[Content_Types].xml'].toString(), /word\/numbering.xml/);
  assert.match(parts['word/_rels/document.xml.rels'].toString(), /relationships\/numbering/);
  const rows = await page.evaluate(({
    documentXml,
    numberingXml
  }) => {
    const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const parse = s => new DOMParser().parseFromString(s, 'application/xml');
    const doc = parse(documentXml),
      num = parse(numberingXml);
    if (doc.querySelector('parsererror') || num.querySelector('parsererror')) throw Error('Malformed OOXML');
    const elements = (node, name) => [...node.getElementsByTagNameNS(ns, name)];
    const val = n => n?.getAttributeNS(ns, 'val');
    return elements(doc, 'p').map(p => {
      const text = elements(p, 't').map(t => t.textContent).join('').trim();
      const id = val(elements(p, 'numId')[0]);
      const level = val(elements(p, 'ilvl')[0]);
      const instance = elements(num, 'num').find(n => n.getAttributeNS(ns, 'numId') === id);
      const aid = val(instance && elements(instance, 'abstractNumId')[0]);
      const abstract = elements(num, 'abstractNum').find(n => n.getAttributeNS(ns, 'abstractNumId') === aid);
      const lvl = abstract && elements(abstract, 'lvl').find(n => n.getAttributeNS(ns, 'ilvl') === level);
      return {
        text,
        id,
        level,
        format: lvl && val(elements(lvl, 'numFmt')[0]),
        start: instance && val(elements(instance, 'startOverride')[0])
      };
    }).filter(r => r.text);
  }, {
    documentXml: parts['word/document.xml'].toString(),
    numberingXml: parts['word/numbering.xml'].toString()
  });
  const get = text => {
    const row = rows.find(r => r.text === text);
    assert(row, 'Missing paragraph ' + text);
    return row;
  };
  assert.equal(get('Three').start, '3');
  assert.equal(get('Three').format, 'decimal');
  assert.equal(get('Nested bullet').level, '1');
  assert.equal(get('Nested bullet').format, 'bullet');
  assert.equal(get('Continuation').id, undefined);
  assert.equal(get('Seven').start, '7');
  assert.equal(get('Seven').id, get('Eight').id);
  assert.equal(get('Restart one').start, '1');
  assert.notEqual(get('Restart one').id, get('Three').id);
  assert.equal(get('Cell bullet').format, 'bullet');
  assert.equal(get('Grid alpha').format, 'upperLetter');
  assert.equal(get('Four').start, '4');
  assert.equal(get('Reverse three').start, '3');
  assert.match(parts['word/numbering.xml'].toString(), /▪/);
  const errors = await page.evaluate(async () => {
    const probe = async html => {
      const el = document.createElement('article');
      el.innerHTML = html;
      document.body.append(el);
      try {
        await window.__csDocExport.buildDocxBlob(el);
        return null;
      } catch (e) {
        return e.message;
      } finally {
        el.remove();
      }
    };
    return [await probe('<ul style="list-style-type:lower-greek"><li>Unsupported</li></ul>'), await probe('<ul><li>'.repeat(10) + 'Deep' + '</li></ul>'.repeat(10))];
  });
  assert.match(errors[0], /Unsupported DOCX list style/);
  assert.match(errors[1], /nine nested list levels/);
}, {
  browserName: process.env.CS_TEST_BROWSER || 'chromium'
});
console.log('PASS DOCX lists: nested bullets, starts, item resets, separate restarts, reversed, table and grid lists');
