import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, openSync, writeSync, closeSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { apca } from '../../scripts/lib/oklch.mjs';
import { textContrastFloor } from './lib/text-contrast-floor.mjs';
const state = 'current';
const r = new URL('../../', import.meta.url).pathname;
const {
  withBrowserFixture
} = await import(pathToFileURL(r + '/_audit/ci/lib/browser-fixture.mjs'));
const {
  globSync,
  mkdtempSync
} = await import('node:fs');
const {
  tmpdir
} = await import('node:os');
const {
  join
} = await import('node:path');
const out = process.env.CS_PAPER_CONTRAST_OUTPUT || mkdtempSync(join(tmpdir(), 'cs-paper-text-contrast-'));
const outputUrl = new URL('file://' + out.replace(/\/$/, '') + '/');
const paths = globSync('templates/**/*.dc.html', {
    cwd: r
  }).filter(path => readFileSync(r + '/' + path, 'utf8').includes('omelette-owns-print')),
  contexts = [],
  failures = [],
  unsupported = [],
  unmarkedDecorations = [],
  decorativeVisualMeasurements = [];
let rowCount = 0;
const tracePath = new URL('rows.jsonl', outputUrl),
  traceFd = openSync(tracePath, 'w'),
  traceHash = createHash('sha256');
const hex = c => '#' + c.slice(0, 3).map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
const browserResults = await Promise.all(['chromium', 'firefox', 'webkit'].map(async browserName => {
  const bLines = [],
    bContexts = [],
    bFailures = [],
    bUnsupported = [],
    bUnmarked = [],
    bDecorative = [];
  let bRowCount = 0;
  await withBrowserFixture(async page => {
    const origin = new URL(page.url()).origin;
    for (const path of paths) {
      await page.goto(origin + '/' + path);
      await page.waitForFunction(() => window.__dcRootName?.() && document.querySelector('[data-sc-name]') && !document.querySelector('.sc-placeholder'));
      await page.evaluate(() => Promise.all(Object.values(window.__csTemplateBundleLoads || {})));
      await page.evaluate(() => document.fonts.ready);
      const props = await page.locator('script[data-props]').evaluate(el => JSON.parse(el.getAttribute('data-props')));
      const langs = props.language?.options || [props.language?.default || null];
      for (const theme of ['light', 'dark']) for (const language of langs) for (const element of props.element?.options || [null]) {
        const values = await page.evaluate(async ({
          theme,
          language,
          element
        }) => {
          document.documentElement.dataset.theme = theme;
          const p = {};
          if (language !== null) p.language = language;
          if (element !== null) p.element = element;
          if (JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')).theme) p.theme = theme;
          window.__dcSetProps(window.__dcRootName(), p);
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const cx = canvas.getContext('2d', {
            willReadFrequently: true
          });
          const cache = new Map();
          const parse = v => {
            let r = cache.get(v);
            if (r) return r;
            cx.clearRect(0, 0, 1, 1);
            cx.fillStyle = v;
            cx.fillRect(0, 0, 1, 1);
            r = [...cx.getImageData(0, 0, 1, 1).data].map((n, i) => i === 3 ? n / 255 : n);
            cache.set(v, r);
            return r;
          };
          const root = document.querySelector('[data-sc-name]');
          const out = [];
          const all = [root, ...root.querySelectorAll('*')];
          for (const el of all) {
            const direct = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
            if (!direct || !el.getClientRects().length || ['SCRIPT', 'STYLE', 'SC-PLACEHOLDER'].includes(el.tagName)) continue;
            const s = getComputedStyle(el);
            if (s.visibility !== 'visible') continue;
            const fg = parse(s.color);
            const matches = [];
            for (const role of ['success', 'danger', 'warning', 'info']) for (const kind of ['', '-text']) {
              const token = s.getPropertyValue('--cs-color-semantic-' + role + kind).trim();
              if (!token) continue;
              const color = parse(token);
              if (fg.slice(0, 3).every((n, i) => n === color[i])) matches.push(role + kind);
            }
            for (const role of ['text-primary', 'text-muted', 'link']) {
              const token = s.getPropertyValue('--cs-color-' + role).trim();
              if (token && fg.slice(0, 3).every((n, i) => n === parse(token)[i])) matches.push(role);
            }
            if (!matches.length) matches.push('other-text');
            const decorative = direct === '◆ ◆ ◆' && el.tagName === 'DIV' && !el.querySelector('*') && !el.closest('a,button,input,select,textarea,summary,[role=button],[role=link],[tabindex]:not([tabindex="-1"]),[contenteditable="true"]') && !el.onclick;
            const classification = decorative ? el.getAttribute('aria-hidden') === 'true' ? 'decorative-hidden' : 'decorative-unmarked' : 'readable';
            let bg = [0, 0, 0, 0],
              unsupported = null,
              textOpacity = 1;
            for (let n = el; n; n = n.parentElement) {
              const cs = getComputedStyle(n),
                c = parse(cs.backgroundColor);
              if (cs.backgroundImage !== 'none' || cs.mixBlendMode !== 'normal' || cs.filter !== 'none' || Number(cs.opacity) !== 1 && c[3] !== 0) {
                unsupported = {
                  tag: n.tagName,
                  className: n.className,
                  backgroundImage: cs.backgroundImage,
                  opacity: cs.opacity,
                  reason: 'Unresolved image/blend/filter or opaque-background group opacity'
                };
                break;
              }
              textOpacity *= Number(cs.opacity);
              const a = bg[3] + c[3] * (1 - bg[3]);
              bg = [0, 1, 2].map(i => a ? (bg[i] * bg[3] + c[i] * c[3] * (1 - bg[3])) / a : 0).concat(a);
              if (a >= .999) break;
            }
            if (bg[3] < .999 && !unsupported) unsupported = {
              reason: 'Unresolved transparent background'
            };
            const effectiveFg = fg.slice(0, 3).map((v, i) => v * textOpacity + bg[i] * (1 - textOpacity)).concat(fg[3]);
            out.push({
              classification,
              textOpacity,
              rawFg: fg,
              text: direct.slice(0, 160),
              textFull: direct,
              tag: el.tagName,
              className: typeof el.className === 'string' ? el.className : '',
              roles: matches,
              fg: effectiveFg,
              bg,
              size: parseFloat(s.fontSize),
              weight: parseFloat(s.fontWeight),
              unsupported
            });
          }
          return out;
        }, {
          theme,
          language,
          element
        });
        const painted = values.map(v => ({
          browserName,
          path,
          theme,
          language,
          element,
          ...v,
          floor: textContrastFloor(v.size, v.weight),
          lc: v.unsupported ? null : apca(hex(v.fg), hex(v.bg))
        }));
        bRowCount += painted.length;
        bLines.push(painted.map(r => JSON.stringify(r) + '\n').join(''));
        for (const row of painted) {
          if (row.unsupported) bUnsupported.push(row);else if (row.classification === 'readable' && row.lc < row.floor) bFailures.push(row);
          if (row.classification === 'decorative-unmarked') bUnmarked.push(row);
          if (row.classification.startsWith('decorative')) bDecorative.push(row);
        }
        bContexts.push({
          browserName,
          path,
          theme,
          language,
          element,
          renderedTextNodes: painted.length
        });
      }
      console.log(browserName, path, 'done');
    }
  }, {
    browserName
  });
  return {
    bLines,
    bContexts,
    bFailures,
    bUnsupported,
    bUnmarked,
    bDecorative,
    bRowCount
  };
}));
for (const {
  bLines,
  bContexts,
  bFailures,
  bUnsupported,
  bUnmarked,
  bDecorative,
  bRowCount
} of browserResults) {
  rowCount += bRowCount;
  for (const lines of bLines) {
    writeSync(traceFd, lines);
    traceHash.update(lines);
  }
  contexts.push(...bContexts);
  failures.push(...bFailures);
  unsupported.push(...bUnsupported);
  unmarkedDecorations.push(...bUnmarked);
  decorativeVisualMeasurements.push(...bDecorative);
}
closeSync(traceFd);
const rowTrace = {
  path: tracePath.pathname,
  sha256: traceHash.digest('hex'),
  rowCount
};
const report = {
  completedAt: new Date().toISOString(),
  state,
  paths,
  contexts,
  rowTrace,
  failures,
  unsupported,
  unmarkedDecorations,
  decorativeVisualMeasurements,
  scope: 'Actual62printtemplates; every declared language inlight/dark. Every declared Element option is tested. Every rendered directtextnode, includingoffscreen and literals; no color-token-match selection. Large(size>=24px)bold(weight>=700)floor60 otherwise75; invalid computed metrics failclosed. Solid ancestor backgrounds and transparenttext-only opacity composition; opaque-background groupopacity/images/ancestorgradient/filter/blend failclosed. Exact noninteractive literal triple-diamond decorations retained as separate visual measurements; unmarked decorations reported separately and not accepted. Sibling/overlapping decorative gradients are outside this ancestor-only calculation and require pixel/visual proof. No export/device/manual/operatoracceptance claim.'
};
writeFileSync(new URL('result.json', outputUrl), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  state,
  paths: paths.length,
  contexts: contexts.length,
  rows: rowCount,
  failures: failures.length,
  unsupported: unsupported.length,
  unmarkedDecorations: unmarkedDecorations.length,
  decorativeMeasurements: decorativeVisualMeasurements.length,
  examples: failures.slice(0, 3)
}, null, 2));
assert.equal(paths.length, 62, 'Complete print-source coverage');
assert.equal(failures.length, 0, 'Readable body and bold text must clear their APCA floors; see ' + out);
assert.equal(unsupported.length, 0, 'Unsupported paint requires separate evidence; see ' + out);
assert.equal(unmarkedDecorations.length, 0, 'Decorative separators must be explicitly hidden and noninteractive; see ' + out);
console.log('PASS print text; full trace in ' + out);
