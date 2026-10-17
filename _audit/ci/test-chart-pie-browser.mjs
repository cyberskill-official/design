import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url)).replace(/\/$/, '');
execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {cwd: repo, stdio: 'pipe'});
const tokens = JSON.parse(readFileSync(repo + '/tokens/tokens.dtcg.json', 'utf8'));
const elements = Object.keys(tokens.$extensions['com.cyberskill'].overrides.elements).map(key => key.replace('.', '-'));
const specimens = [[1], [.5], [0,5], [5,0], [0,5,0], [], [0], [0,0], [1,1], [1,0,2], [.1,.2,.3], [2,5,7,0]];
const palette = ['var(--cs-accent)', 'var(--cs-accent-strong)', 'var(--cs-accent-grad-b)', 'var(--cs-color-text-muted)', 'var(--cs-color-border-default)'];
const report = {scope: 'Current browser bundle: pie ink geometry, zero-sector omission, original-index colors, names and legend in twelve finite nonnegative data shapes, two heights, fifteen element variants, light/dark, EN/VI, both densities and three engines. No arbitrary numeric normalization, computed contrast, screenshots or manual acceptance.', rows: []};

for (const browserName of ['chromium', 'firefox', 'webkit']) {
  await withBrowserFixture(async page => {
    for (const theme of ['light', 'dark']) for (const element of elements) for (const lang of ['en', 'vi']) for (const density of ['compact', 'comfortable']) {
      const rows = await page.evaluate(({theme, element, lang, density, specimens}) => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-element', element);
        document.documentElement.setAttribute('data-density', density);
        document.documentElement.lang = lang;
        return specimens.flatMap(values => [80,160].map(height => {
          renderFixture(React.createElement(CS.Chart, {type: 'pie', height, showValues: true, data: values.map((value, i) => ({label: 'Datum ' + i, value}))}));
          const sectors = [...document.querySelectorAll('.cs-chart svg path, .cs-chart svg circle')].map(node => {
            const box = node.getBBox();
            const length = node.getTotalLength();
            // Shoelace integration of the rendered outline: independent of the component's arc construction.
            const points = Array.from({length: 256}, (_, i) => node.getPointAtLength(length * i / 256));
            const area = Math.abs(points.reduce((sum, p, i) => {
              const q = points[(i + 1) % points.length];
              return sum + p.x * q.y - q.x * p.y;
            }, 0)) / 2;
            return {fill: node.getAttribute('fill'), bounds: {x: box.x, y: box.y, width: box.width, height: box.height}, area};
          });
          return {theme, element, lang, density, values, height, name: document.querySelector('.cs-chart').getAttribute('aria-label'), legend: document.querySelector('.cs-chart__legend').textContent, sectors};
        }));
      }, {theme, element, lang, density, specimens});
      for (const row of rows) {
        const positive = row.values.map((value, index) => ({value, index})).filter(item => item.value > 0);
        assert.equal(row.sectors.length, positive.length, `${browserName}: zero-valued entries must draw no sector`);
        assert.equal(row.name, row.values.length ? row.values.map((value, i) => `Datum ${i}: ${value}`).join(', ') : row.lang === 'vi' ? 'Biểu đồ chưa có dữ liệu' : 'Chart with no data');
        assert.equal(row.legend, row.values.map((value, i) => `Datum ${i} ${value}`).join(''));
        for (const [i, item] of positive.entries()) {
          assert.equal(row.sectors[i].fill, palette[item.index % palette.length], 'Palette uses the original datum index');
          assert(row.sectors[i].area > 0, 'Every positive datum must have visible sector area');
        }
        if (positive.length) {
          const area = row.sectors.reduce((sum, sector) => sum + sector.area, 0);
          assert(Math.abs(area / (Math.PI * 50 * 50) - 1) < .01, 'Positive sectors must cover the full disk within outline sampling tolerance');
        }
        if (positive.length === 1) {
          for (const [key, expected] of Object.entries({x: 10, y: 10, width: 100, height: 100})) {
            assert(Math.abs(row.sectors[0].bounds[key] - expected) < .001, 'Sole-positive full disk bounds: ' + key);
          }
        }
        report.rows.push({browserName, ...row});
      }
    }
  }, {browserName});
  console.log(`PASS Chart pie geometry ${browserName}: 2880 contexts`);
}
assert.equal(report.rows.length, 8640);
report.completedAt = new Date().toISOString();
if (process.env.CS_CHART_PIE_REPORT) {
  const paths = ['components/data/Chart.jsx', 'components/data/Chart.prompt.md', 'components/data/Chart.d.ts', 'tokens/tokens.dtcg.json', '_ds_bundle.js', '_audit/ci/test-chart-pie-browser.mjs', '_audit/ci/lib/browser-fixture.mjs'];
  report.sourceFiles = Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(repo + '/' + path)).digest('hex')]));
  writeFileSync(process.env.CS_CHART_PIE_REPORT, JSON.stringify(report, null, 2) + '\n');
}
console.log('PASS Chart pie: 8640 rendered geometry/name/legend contexts in three engines');
