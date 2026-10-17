import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {unzipEntries} from './lib/docx-zip.mjs';

const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const report = {browserName, cases: []};
const cases = [
  {name: 'callout-unused-slot', tracks: '20px minmax(0,1fr) auto', children: ['Icon', 'Wide prose must retain the rendered content track.']},
  {name: 'four-equal-metrics', tracks: 'repeat(4,minmax(0,1fr))', children: ['One', 'Two', 'Three', 'Four']},
  {name: 'two-unequal-tracks', tracks: '1fr 3fr', children: ['Short', 'Three times wider prose']},
  {name: 'fractional-tracks', tracks: '18.5px 2fr 1fr', children: ['Icon', 'Wide content', 'Aside']},
  {name: 'subpixel-last-track', tracks: '200.046875px 200.046875px 199.90625px 0.015625px', children: ['First', 'Second', 'Third', 'Hairline']},
  {name: 'narrow-positive-tail', tracks: '100.03125px 100.03125px 100.03125px 99.9375px 0.015625px', children: ['One', 'Two', 'Three', 'Four', 'Tail']},
];
try {
  await withBrowserFixture(async page => {
    await page.addScriptTag({url: '/templates/_vendor/doc-export.js'});
    for (const item of cases) {
      const rendered = await page.evaluate(item => {
        document.getElementById('fixture').innerHTML = '';
        const sheet = document.createElement('article');
        sheet.className = 'cs-sheet';
        const grid = document.createElement('div');
        grid.style.cssText = `display:grid;width:600px;grid-template-columns:${item.tracks}`;
        for (const text of item.children) {
          const cell = document.createElement('div');
          cell.style.minWidth = '0';
          cell.textContent = text;
          grid.append(cell);
        }
        sheet.append(grid);
        document.getElementById('fixture').append(sheet);
        return {tracks: getComputedStyle(grid).gridTemplateColumns.split(/\s+/).map(parseFloat)};
      }, item);
      const b64 = await page.evaluate(async () => {
        const bytes = new Uint8Array(await (await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());
        let text = ''; for (const byte of bytes) text += String.fromCharCode(byte);
        return btoa(text);
      });
      const bytes = Buffer.from(b64, 'base64');
      const xml = unzipEntries(bytes)['word/document.xml'].toString();
      const word = await page.evaluate(xml => {
        const document = new DOMParser().parseFromString(xml, 'application/xml');
        const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        const els = (node, name) => [...node.getElementsByTagNameNS(ns, name)];
        const table = els(document, 'tbl')[0];
        return {tracks: els(table, 'gridCol').map(node => Number(node.getAttributeNS(ns, 'w'))),
          cells: els(table, 'tc').map(cell => ({width: Number(els(cell, 'tcW')[0].getAttributeNS(ns, 'w')),
            text: els(cell, 't').map(node => node.textContent).join('')}))};
      }, xml);
      const row = {name: item.name, rendered, word};
      report.cases.push(row);
      assert.equal(word.tracks.length, rendered.tracks.length);
      const htmlTotal = rendered.tracks.reduce((a, b) => a + b, 0);
      const wordTotal = word.tracks.reduce((a, b) => a + b, 0);
      assert.equal(wordTotal, 9000, item.name);
      assert(word.tracks.every(width => width >= 0), item.name);
      for (let index = 0; index < word.tracks.length; index++) {
        assert(Math.abs(word.tracks[index] / wordTotal - rendered.tracks[index] / htmlTotal) < 0.003,
          `Resolved CSS track proportion lost: ${JSON.stringify(row)}`);
        assert.equal(word.cells[index].width, word.tracks[index]);
      }
      assert.deepEqual(word.cells.slice(0, item.children.length).map(cell => cell.text), item.children);
      row.pass = true;
    }
  }, {browserName});
  report.actualExitCode = 0;
} catch (error) {
  report.actualExitCode = 1;
  report.error = String(error);
}
console.log(JSON.stringify({browserName, actualExitCode: report.actualExitCode, cases: report.cases.length, error: report.error}));
process.exitCode = report.actualExitCode;
