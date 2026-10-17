import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {apca} from '../../scripts/lib/oklch.mjs';

const root = new URL('../../', import.meta.url);
const elements = ['neutral', ...Object.keys(JSON.parse(readFileSync(new URL('tokens/tokens.json', root))).elements)];
const rows = [], verdicts = [];
const hex = color => '#' + color.slice(0, 3).map(n => n.toString(16).padStart(2, '0')).join('');
for (const browserName of ['chromium', 'firefox', 'webkit']) {
  await withBrowserFixture(async page => {
    const url = new URL('/_audit/element-geometry.html', page.url()).href;
    for (const colorScheme of ['light', 'dark']) for (const contrast of ['no-preference', 'more']) {
      await page.emulateMedia({colorScheme, contrast});
      await page.goto(url);
      await page.waitForFunction(() => window.__elementgeometry);
      const verdict = await page.evaluate(() => window.__elementgeometry);
      assert.equal(verdict.pass, true, 'The actual geometry gate must still run and pass');
      assert.equal(verdict.packs, 15);
      assert.deepEqual(verdict.problems, []);
      verdicts.push({browserName, colorScheme, contrast, verdict});
      await page.addStyleTag({content: '*{transition:none!important;animation:none!important}:root{--test-contrast:standard}@media(prefers-contrast:more){:root{--test-contrast:high}}'});
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--test-contrast').trim()), contrast === 'more' ? 'high' : 'standard');
      await page.evaluate(() => {
        // Exercise the gate's real failure-row class without changing its data or verdict.
        const failure = document.createElement('div');
        failure.className = 'row bad';
        failure.dataset.testFailure = 'true';
        failure.textContent = '✗ Failure-row legibility fixture';
        document.getElementById('out').append(failure);
      });
      const measured = await page.evaluate(({elements, colorScheme, contrast}) => {
        const root = document.documentElement, result = [];
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d', {willReadFrequently: true});
        const rgba = value => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          return [...context.getImageData(0, 0, 1, 1).data];
        };
        for (const theme of ['light', 'dark', 'system']) for (const density of ['comfortable', 'compact']) for (const csContrast of ['inherit', 'standard', 'high']) for (const element of elements) {
          root.dataset.theme = theme;
          root.dataset.csDensity = density;
          if (csContrast === 'inherit') delete root.dataset.csContrast; else root.dataset.csContrast = csContrast;
          const [name, variant = ''] = element.split('.');
          if (element === 'neutral') { delete root.dataset.csElement; delete root.dataset.csVariant; }
          else { root.dataset.csElement = name; root.dataset.csVariant = variant; }
          for (const el of document.querySelectorAll('#out .row')) {
            const style = getComputedStyle(el), body = getComputedStyle(document.body);
            if (style.backgroundImage !== 'none' || body.backgroundImage !== 'none' || style.opacity !== '1' || body.opacity !== '1' || style.textShadow !== 'none' || rgba(style.backgroundColor)[3] !== 0) throw Error('Unsupported row paint');
            result.push({colorScheme, contrast, theme, density, csContrast, element, kind: el.classList.contains('bad') ? 'failure' : 'success', message: el.textContent, fg: rgba(style.color), bg: rgba(body.backgroundColor), fontSize: style.fontSize, fontWeight: style.fontWeight});
          }
        }
        return result;
      }, {elements, colorScheme, contrast});
      rows.push(...measured.map(row => ({browserName, ...row, lc: apca(hex(row.fg), hex(row.bg))})));
      assert.deepEqual(await page.evaluate(() => window.__elementgeometry), verdict, 'The legibility fixture must not alter the gate verdict');
    }
  }, {browserName});
}
const failures = rows.filter(row => row.lc < 75);
const report = {
  recordedAt: new Date().toISOString(),
  sourceSha256: createHash('sha256').update(readFileSync(new URL('_audit/element-geometry.html', root))).digest('hex'),
  scope: 'Actual geometry gate: all 13 generated successful rows plus one failure-class fixture, all neutral/15 element variants, 3 themes, 2 densities, inherited/explicit Standard/High contrast, 2 OS schemes and 2 contrast preferences in 3 engines. Opaque text on the declared solid body surface; no arbitrary compositing, native, manual AT or owner acceptance claim.',
  verdicts, rows, failures,
};
if (process.env.CS_GEOMETRY_TEXT_RECEIPT) writeFileSync(process.env.CS_GEOMETRY_TEXT_RECEIPT, gzipSync(JSON.stringify(report)));
console.log(JSON.stringify({measurements: rows.length, failures: failures.length, minimumLc: Math.min(...rows.map(row => row.lc)), examples: failures.slice(0, 2)}, null, 2));
assert.equal(verdicts.length, 12);
assert.equal(rows.length, 48384, 'All 14 rows across the complete declared axes');
assert(rows.every(row => row.fg[3] === 255 && row.bg[3] === 255), 'Text and body surface must be opaque');
assert.equal(failures.length, 0, 'Geometry gate verdict text must meet the repository APCA75 body floor');
