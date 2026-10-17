#!/usr/bin/env node
/** Regenerate the EN/VI contrast reports from tokens/elements.css. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apca, hex2rgb } from './lib/oklch.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DARK_PANEL = '#221710';
const VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

function parsePacks(css) {
  const packs = {};
  const re = /((?:\[[^\]]+\])+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sel = m[1];
    const body = m[2];
    const el = (/\[data-cs-element="(\w+)"\]/.exec(sel) || [])[1];
    if (!el) continue;
    const va = (/\[data-cs-variant="(\w+)"\]/.exec(sel) || [])[1] || '';
    // system twins duplicate dark under prefers-color-scheme — skip so they don't
    // overwrite light roles when the media wrapper is stripped by naive parsers.
    if (/data-theme="system"/.test(sel)) continue;
    const dark = /data-theme="dark"/.test(sel);
    if (/data-cs-element\]/.test(sel) && !/data-cs-element="/.test(sel)) continue;
    const decls = {};
    let d;
    const dr = /(--cs-[\w-]+)\s*:\s*([^;]+);/g;
    while ((d = dr.exec(body))) decls[d[1]] = d[2].trim();
    if (!decls['--cs-accent'] || !hex2rgb(decls['--cs-accent'])) continue;
    const k = el + (va ? ' · ' + va : '');
    packs[k] = packs[k] || { light: {}, dark: {} };
    Object.assign(dark ? packs[k].dark : packs[k].light, decls);
  }
  return packs;
}

function role(p, name, dark) {
  if (dark && p.dark[name] != null) return p.dark[name];
  return p.light[name];
}

function main() {
  const css = fs.readFileSync(path.join(ROOT, 'tokens/elements.css'), 'utf8');
  const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/tokens.json'), 'utf8'));
  const packs = parsePacks(css);
  const rootAccent = json.root.color['--cs-color-text-accent'];
  const rootTint = json.root.accent['--cs-accent-tint'];
  const rootBright = json.root.accent['--cs-accent-bright'];
  const rootOn = json.root.accent['--cs-accent-on'];
  const rootInk = json.root.accent['--cs-accent-ink'];

  const lines = [];
  lines.push('# Contrast report — elemental pairings (APCA)');
  lines.push('');
  // Deterministic stamp (VERSION only) so --check can byte-compare (FIND-026).
  lines.push(`Generated · sweep at VERSION ${VERSION}.`);
  lines.push('');
  lines.push('Published on Storybook **Docs** at `design.cyberskill.world`.');
  lines.push('');
  lines.push('**Doctrine encoded by this sweep:** text uses `-bright` or `-tint`, or a `-strong` fill paired with `--cs-accent-on-strong`; never the mid-tone `-accent` — at any size. The accent is for bars, borders, progress fills, and non-text fills only. Read the pairing and floor recorded for each row; `test:strong-text-contrast` separately checks rendered body text on strong fills. (Rule stated in `tokens/elements.css` and conventions.)');
  lines.push('');
  lines.push('Packs are generated from `tokens/element-seeds.json` (soft / middle / deep ladder, light↔dark hue lock). Geometry gate: `_audit/element-geometry.html`.');
  lines.push('| Scope | Pairing | fg / bg | Lc | Verdict |');
  lines.push('|---|---|---|---|---|');

  const row = (scope, pair, fg, bg, floor = 60) => {
    const lc = apca(fg, bg);
    const ok = lc >= floor;
    lines.push(`| ${scope} | ${pair} | ${fg} / ${bg} | ${lc} | ${ok ? '✓' : '✗'} |`);
    return ok;
  };

  let fails = 0;
  const rootPairs = [
    ['text-accent on white (bold labels)', rootAccent, '#FFFFFF'],
    ['text-accent on tint (bold labels)', rootAccent, rootTint],
    ['accent-bright on ink (headings)', rootBright, rootInk],
    ['accent-on on accent-bright (CTA text)', rootOn, rootBright],
    ['accent-bright on dark panel (dark labels)', rootBright, DARK_PANEL],
  ];
  for (const [pair, fg, bg] of rootPairs) {
    if (!row('root (Thổ default)', pair, fg, bg)) fails++;
  }

  /** Relative luminance WCAG for body-link pairs (FIND-031). */
  function relLum(hex) {
    const rgb = hex2rgb(hex);
    if (!rgb) return 0;
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  }
  function wcagRatio(a, b) {
    const L1 = relLum(a);
    const L2 = relLum(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  const linkRows = [];
  let linkFails = 0;

  for (const [scope, p] of Object.entries(packs)) {
    const textAccent = p.light['--cs-color-text-accent'] || json.root.color['--cs-color-text-accent'];
    const tint = p.light['--cs-accent-tint'];
    const bright = role(p, '--cs-accent-bright', false);
    const on = role(p, '--cs-accent-on', false);
    const ink = role(p, '--cs-accent-ink', false);
    const brightDark = role(p, '--cs-accent-bright', true);
    const pairs = [
      ['text-accent on white (bold labels)', textAccent, '#FFFFFF'],
      ['text-accent on tint (bold labels)', textAccent, tint],
      ['accent-bright on ink (headings)', bright, ink],
      ['accent-on on accent-bright (CTA text)', on, bright],
      ['accent-bright on dark panel (dark labels)', brightDark, DARK_PANEL],
    ];
    for (const [pair, fg, bg] of pairs) {
      if (!row(scope, pair, fg, bg)) fails++;
    }
    const link = p.light['--cs-color-link'];
    if (link && hex2rgb(link)) {
      const referencePage = '#FFFDF8';
      const referenceRaised = '#FBF4E9';
      for (const [pair, bg] of [
        ['link on white (body)', '#FFFFFF'],
        ['link on reference page (body)', referencePage],
        ['link on tint (body)', tint || referenceRaised],
        ['link on reference raised cream (body)', referenceRaised],
      ]) {
        const r = wcagRatio(link, bg);
        const ok = r >= 4.5;
        linkRows.push(`| ${scope} | ${pair} | ${link} / ${bg} | ${r.toFixed(2)}:1 | ${ok ? '✓' : '✗'} |`);
        if (!ok) linkFails++;
      }
      const linkDark = role(p, '--cs-color-link', true);
      const rDark = wcagRatio(linkDark, DARK_PANEL);
      const okDark = rDark >= 4.5;
      linkRows.push(`| ${scope} | link on reference dark panel (body) | ${linkDark} / ${DARK_PANEL} | ${rDark.toFixed(2)}:1 | ${okDark ? '✓' : '✗'} |`);
      if (!okDark) linkFails++;
    }
  }

  lines.push('');
  lines.push(`**Failures: ${fails}.** All text pairings ${fails ? 'reviewed above' : 'pass Lc ≥ 60'}.`);
  lines.push('');
  lines.push('## Element-pack link contrast (WCAG AA · body text)');
  lines.push('');
  lines.push('`--cs-color-link` is scored at **4.5:1** (regular-weight body). `--cs-color-text-accent` remains on the APCA Lc ≥ 60 bold-label floor above.');
  lines.push('');
  lines.push("Rows use the declared light or dark `--cs-color-link` colour. White, reference-page, reference-raised and reference-dark-panel backgrounds are fixed literals; element surface roles use `color-mix()` and are not measured by these rows. Rendered surface, preference and interaction checks have separate scopes.");
  lines.push('| Scope | Pairing | fg / bg | Ratio | Verdict |');
  lines.push('|---|---|---|---|---|');
  lines.push(...linkRows);
  lines.push('');
  lines.push(`**Link failures: ${linkFails}.**`);
  lines.push('');
  lines.push('## Strong callout text (body APCA)');
  lines.push('');
  lines.push('Pair `--cs-accent-strong` with `--cs-accent-on-strong`: both light and dark packs must meet body Lc ≥ 75 (generator target 78) and WCAG ≥ 4.5:1. Dark primary buttons consume this paired foreground. Brand anchors and the other eight accent roles retain their values.');
  lines.push('| Scope | Mode | fg / bg | Lc | Verdict |');
  lines.push('|---|---|---|---|---|');
  let strongBodyFails = 0;
  for (const [scope,p] of Object.entries(packs)) for (const dark of [false,true]) {
    const strong = role(p,'--cs-accent-strong',dark), onStrong = role(p,'--cs-accent-on-strong',dark);
    const lc = apca(onStrong,strong), ok = lc >= 75 && wcagRatio(onStrong,strong) >= 4.5;
    if (!ok) strongBodyFails++;
    lines.push(`| ${scope} | ${dark ? 'dark' : 'light'} | ${onStrong} / ${strong} | ${lc.toFixed(1)} | ${ok ? '✓' : '✗'} |`);
  }
  lines.push('');
  lines.push(`**Strong body failures: ${strongBodyFails}.** Static declared-pair calculation; the browser regressions and actual template/raster checks establish their separate scopes. Opacity, gradients, transitions and arbitrary overlaps are not implied by this table.`);
  lines.push('');
  lines.push('## Dark pack APCA floors (gate twin)');
  lines.push('');
  lines.push('Proposal targets in `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent and bright are not unrestricted regular-body roles.');
  lines.push('| Pack | bright | accent | on | ink |');
  lines.push('|---|---|---|---|---|');
  for (const [scope, p] of Object.entries(packs)) {
    const bright = role(p, '--cs-accent-bright', true);
    const accent = role(p, '--cs-accent', true);
    const strong = role(p, '--cs-accent-strong', true);
    const on = role(p, '--cs-accent-on-strong', true);
    const tint = role(p, '--cs-accent-tint', true);
    const ink = role(p, '--cs-accent-ink', true);
    lines.push(
      `| ${scope} | ${apca(bright, DARK_PANEL)} | ${apca(accent, DARK_PANEL)} | ${apca(on, strong)} | ${apca(ink, tint)} |`,
    );
  }
  lines.push('');

  const enBody = lines.join('\n') + '\n';
  // Translate presentation only; both locales use the same calculated rows.
  // An added prose line must have an explicit translation rather than falling
  // back to the English report unnoticed.
  const viProse = new Map([
    ["Rows use the declared light or dark `--cs-color-link` colour. White, reference-page, reference-raised and reference-dark-panel backgrounds are fixed literals; element surface roles use `color-mix()` and are not measured by these rows. Rendered surface, preference and interaction checks have separate scopes.", "Các dòng dùng màu `--cs-color-link` đã khai báo cho light hoặc dark. Nền trắng, trang tham chiếu, nền nâng tham chiếu và panel tối tham chiếu là các màu cố định; vai trò nền của element dùng `color-mix()` và không được đo trong những dòng này. Kiểm tra nền đã render, tùy chọn và tương tác có phạm vi riêng."],
    [`**Failures: ${fails}.** All text pairings ${fails ? 'reviewed above' : 'pass Lc ≥ 60'}.`, `**Số cặp không đạt: ${fails}.** ${fails ? 'Xem các cặp chữ đã kiểm tra ở trên' : 'Mọi cặp chữ đều đạt Lc ≥ 60'}.`],
    ['## Element-pack link contrast (WCAG AA · body text)', '## Tương phản liên kết của element pack (WCAG AA · chữ thân)'],
    ['`--cs-color-link` is scored at **4.5:1** (regular-weight body). `--cs-color-text-accent` remains on the APCA Lc ≥ 60 bold-label floor above.', '`--cs-color-link` được đánh giá ở ngưỡng **4.5:1** (chữ thân có độ đậm thông thường). `--cs-color-text-accent` vẫn áp dụng ngưỡng APCA Lc ≥ 60 cho nhãn đậm ở trên.'],
    [`**Link failures: ${linkFails}.**`, `**Số cặp liên kết không đạt: ${linkFails}.**`],
    ['## Strong callout text (body APCA)', '## Chữ trên nền strong (APCA cho chữ thân)'],
    ['Pair `--cs-accent-strong` with `--cs-accent-on-strong`: both light and dark packs must meet body Lc ≥ 75 (generator target 78) and WCAG ≥ 4.5:1. Dark primary buttons consume this paired foreground. Brand anchors and the other eight accent roles retain their values.', 'Ghép `--cs-accent-strong` với `--cs-accent-on-strong`: cả pack light và dark phải đạt ngưỡng chữ thân Lc ≥ 75 (mục tiêu của generator là 78) và WCAG ≥ 4.5:1. Nút primary ở chế độ dark dùng màu chữ đi cặp này. Các màu neo thương hiệu và tám vai trò accent còn lại giữ nguyên giá trị.'],
    [`**Strong body failures: ${strongBodyFails}.** Static declared-pair calculation; the browser regressions and actual template/raster checks establish their separate scopes. Opacity, gradients, transitions and arbitrary overlaps are not implied by this table.`, `**Số cặp chữ thân trên nền strong không đạt: ${strongBodyFails}.** Đây là phép tính tĩnh cho cặp màu đã khai báo; kiểm tra hồi quy browser và kiểm tra template/raster thực tế có phạm vi riêng. Bảng này không chứng minh tương phản khi có độ trong suốt, gradient, chuyển tiếp hay lớp phủ tùy ý.`],
    ['## Dark pack APCA floors (gate twin)', '## Ngưỡng APCA của pack dark (đối chiếu gate)'],
    ['Proposal targets in `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent and bright are not unrestricted regular-body roles.', 'Các ngưỡng đề xuất trong `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent và bright không phải vai trò chữ thân thông thường dùng được trên mọi nền.'],
  ]);
  const viLabels = new Map([
    ['Scope', 'Phạm vi'], ['Pairing', 'Cặp màu'], ['fg / bg', 'chữ / nền'], ['Verdict', 'Kết quả'], ['Ratio', 'Tỷ lệ'], ['Mode', 'Chế độ'], ['Pack', 'Pack'],
    ['root (Thổ default)', 'root (Thổ mặc định)'], ['light', 'sáng'], ['dark', 'tối'],
    ['text-accent on white (bold labels)', 'text-accent trên trắng (nhãn đậm)'],
    ['text-accent on tint (bold labels)', 'text-accent trên tint (nhãn đậm)'],
    ['accent-bright on ink (headings)', 'accent-bright trên ink (tiêu đề)'],
    ['accent-on on accent-bright (CTA text)', 'accent-on trên accent-bright (chữ CTA)'],
    ['accent-bright on dark panel (dark labels)', 'accent-bright trên panel tối (nhãn dark)'],
    ['link on white (body)', 'liên kết trên trắng (chữ thân)'],
    ['link on reference page (body)', 'liên kết trên trang tham chiếu (chữ thân)'],
    ['link on tint (body)', 'liên kết trên tint (chữ thân)'],
    ['link on reference raised cream (body)', 'liên kết trên nền kem nâng tham chiếu (chữ thân)'],
    ['link on reference dark panel (body)', 'liên kết trên panel tối tham chiếu (chữ thân)'],
  ]);
  const viLine = (line) => {
    if (!line) return line;
    if (line.startsWith('|')) return line.split('|').map(cell => {
      const label = viLabels.get(cell.trim());
      return label === undefined ? cell : ` ${label} `;
    }).join('|');
    if (!viProse.has(line)) throw new Error(`Missing Vietnamese contrast-report prose: ${line}`);
    return viProse.get(line);
  };
  const tableIdx = lines.findIndex((l) => l.startsWith('| Scope | Pairing |'));
  const vi = [
    '# Báo cáo contrast — cặp elemental (APCA)',
    '',
    `Tạo · quét tại VERSION ${VERSION}.`,
    '',
    'Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.',
    '',
    '**Doctrine của sweep này:** chữ dùng nền `-bright` hoặc `-tint`, hoặc nền `-strong` đi cặp với `--cs-accent-on-strong`; không bao giờ trên mid-tone `-accent`. Accent chỉ cho bar, border, progress, fill không chữ. Đọc cặp màu và ngưỡng ghi ở từng dòng; `test:strong-text-contrast` kiểm tra riêng chữ thân đã render trên nền strong. (Rule trong `tokens/elements.css` và conventions.)',
    '',
    'Pack được generate từ `tokens/element-seeds.json` (thang soft / middle / deep, khóa hue light↔dark). Gate hình học: `_audit/element-geometry.html`.',
    ...lines.slice(tableIdx).map(viLine),
  ];
  const viBody = vi.join('\n') + '\n';
  const enPath = path.join(ROOT, 'docs/contrast-report.md');
  const viPath = path.join(ROOT, 'docs/vi/contrast-report.md');

  if (checkOnly) {
    const problems = [];
    if (!fs.existsSync(enPath) || fs.readFileSync(enPath, 'utf8') !== enBody) {
      problems.push('docs/contrast-report.md drifted — run: npm run tokens:contrast');
    }
    if (!fs.existsSync(viPath) || fs.readFileSync(viPath, 'utf8') !== viBody) {
      problems.push('docs/vi/contrast-report.md drifted — run: npm run tokens:contrast');
    }
    if (problems.length) {
      console.error('FAIL generate-contrast-report --check:');
      for (const p of problems) console.error('  ✗ ' + p);
      process.exit(1);
    }
    console.log(`PASS generate-contrast-report --check · failures=${fails}`);
    return;
  }

  fs.writeFileSync(enPath, enBody);
  fs.writeFileSync(viPath, viBody);
  console.log(`contrast-report written · failures=${fails}`);
}

main();
