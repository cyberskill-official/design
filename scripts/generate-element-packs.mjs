#!/usr/bin/env node
/**
 * Generate tokens/elements.css (+ mirrors) from tokens/element-seeds.json.
 * Soft / middle / deep intensity ladder · light/dark hue lock · APCA dark floors.
 *
 * Usage:
 *   node scripts/generate-element-packs.mjs           # write elements.css + mirrors
 *   node scripts/generate-element-packs.mjs --check   # exit 1 if committed outputs are stale
 */
import fs from 'node:fs';
import { tokenExportSeed } from './lib/token-export-seed.mjs';
import { emitThemeResolver } from './lib/theme-resolver.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  apca,
  clamp,
  deltaHueDeg,
  hexToLCH,
  hexToRgba,
  hex2rgb,
  lchDegToHex,
  lchToHex,
  rgb2oklab,
  oklab2rgb,
  rgb2hex,
  solveL,
  toLCH,
} from './lib/oklch.mjs';

/** Relative luminance WCAG */
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
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}
/** Darken strong until WCAG ≥ 3.05 and APCA Lc ≥ 60 on light page (bold label floor). */
function ensureStrongOnPage(strongHex, pageHex = '#FFFFFF', minRatio = 3.05, minLc = 60) {
  let hex = strongHex;
  const lch = hexToLCH(hex);
  let L = lch.L;
  for (let i = 0; i < 100 && (wcagRatio(hex, pageHex) < minRatio || apca(hex, pageHex) < minLc); i++) {
    L = clamp(L - 0.01, 0.12, 0.9);
    hex = lchDegToHex(L, lch.C, lch.Hdeg);
  }
  return hex;
}
/**
 * Body links meet WCAG4.5 and APCA78 on actual page/panel/raised plus tint.
 * Tune only link lightness; preserve the ten accent roles and text-accent.
 */
function ensureLinkOnSurfaces(
  seedHex,
  surfaces = ['#FFFFFF', '#FFFDF8', '#FBF4E9', '#F8F1E4'],
  minRatio = 4.5,
  minLc = 78,
  mode = 'light',
) {
  let hex = seedHex;
  const lch = hexToLCH(hex);
  let L = lch.L;
  for (let i = 0; i < 140; i++) {
    if (surfaces.every((bg) => wcagRatio(hex, bg) >= minRatio && apca(hex, bg) >= minLc)) break;
    L = clamp(L + (mode === 'dark' ? 0.005 : -0.005), 0.04, 0.98);
    hex = lchDegToHex(L, lch.C, lch.Hdeg);
  }
  return hex;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEEDS_PATH = path.join(ROOT, 'tokens/element-seeds.json');

const ROLE_KEYS = [
  '--cs-accent',
  '--cs-accent-strong',
  '--cs-accent-bright',
  '--cs-accent-on',
  '--cs-accent-on-strong',
  '--cs-accent-tint',
  '--cs-accent-ink',
  '--cs-accent-glow',
  '--cs-accent-grad-a',
  '--cs-accent-grad-b',
];

/** Pick / tune a text colour that clears WCAG AA (≥4.5:1) on a strong fill. */
function ensureOnStrong(strongHex, candidates = ['#1A1108', '#45210E', '#FFFDF8', '#FFFFFF']) {
  let best = candidates[0];
  let bestR = 0;
  for (const c of candidates) {
    const r = wcagRatio(c, strongHex);
    if (r > bestR) {
      bestR = r;
      best = c;
    }
  }
  if (bestR >= 4.5) return best;
  // Darken ink until AA, or lighten cream the other way.
  const preferDark = bestR < 4.5 && relLum(best) < relLum(strongHex);
  let hex = preferDark ? '#1A1108' : '#FFFDF8';
  const lch = hexToLCH(hex);
  let L = lch.L;
  for (let i = 0; i < 120 && wcagRatio(hex, strongHex) < 4.5; i++) {
    L = preferDark ? clamp(L - 0.01, 0.02, 0.5) : clamp(L + 0.01, 0.7, 0.99);
    hex = lchDegToHex(L, Math.min(lch.C, 0.04), lch.Hdeg);
  }
  return hex;
}

const EL_ORDER = ['tho', 'hoa', 'thuy', 'moc', 'kim'];
const EL_LABEL = {
  tho: 'Thổ · Earth',
  hoa: 'Hỏa · Fire',
  thuy: 'Thủy · Water',
  moc: 'Mộc · Wood',
  kim: 'Kim · Metal',
};

function loadSeeds() {
  return JSON.parse(fs.readFileSync(SEEDS_PATH, 'utf8'));
}

function slotAccent(seeds, elKey, slot, variantName) {
  const el = seeds.elements[elKey];
  const inten = seeds.intensity[slot];
  const off = (variantName && el.offsets && el.offsets[variantName]) || {};
  if (slot === 'middle' && el.pinMiddleHex) {
    const pinned = hexToLCH(el.pinMiddleHex);
    return { L: pinned.L, C: pinned.C, H: pinned.Hdeg, hex: el.pinMiddleHex.toUpperCase() };
  }
  const h = (((el.h + (off.dh || 0)) % 360) + 360) % 360;
  const cTarget = Math.max(0.01, inten.c * el.cScale + (off.dc || 0));
  let L = inten.l;
  let hex = lchDegToHex(L, cTarget, h);
  // Soft washes: if gamut crushing wiped the tint, ease L down slightly until a pastel chroma reads.
  if (slot === 'soft') {
    const minC = Math.min(0.035, Math.max(0.028, cTarget * 0.55));
    for (let i = 0; i < 40 && hexToLCH(hex).C < minC; i++) {
      L = clamp(L - 0.003, 0.90, inten.l);
      hex = lchDegToHex(L, cTarget, h);
    }
  }
  const out = hexToLCH(hex);
  return { L: out.L, C: out.C, H: out.Hdeg, hex };
}

function deriveLightRoles(seeds, accent, gradB, { pinThoStudio }) {
  const { L, C, H } = accent;
  const r = seeds.roles;
  const strongSeed = lchDegToHex(clamp(L + r.strongDeltaL, 0.2, 0.75), C * 0.95, H);
  // Bright is always a pastel heading colour (not a slight nudge of deep midtones).
  const brightL = Math.max(0.84, L + r.brightDeltaL);
  const bright = lchDegToHex(clamp(brightL, 0.78, 0.94), Math.min(C * 0.75, 0.12), H);
  const on = lchDegToHex(r.onL, Math.min(C * r.inkCScale, 0.08), H);
  const tint = lchDegToHex(r.tintL, Math.min(C * r.tintCScale, 0.035), H);
  const ink = lchDegToHex(r.inkL, Math.min(C * r.inkCScale, 0.08), H);
  const accentHex = accent.hex;

  const finishStrong = (seed) => {
    let hex = ensureStrongOnPage(seed);
    // Also clear APCA ≥ 60 on the tint wash (bold labels on tint).
    const lch = hexToLCH(hex);
    let Ls = lch.L;
    for (let i = 0; i < 80 && apca(hex, tint) < 60; i++) {
      Ls = clamp(Ls - 0.01, 0.12, 0.9);
      hex = lchDegToHex(Ls, lch.C, lch.Hdeg);
    }
    return hex;
  };

  if (pinThoStudio) {
    const strong = finishStrong(lchDegToHex(0.65, accent.C * 0.85, accent.H));
    return {
      '--cs-accent': accentHex,
      '--cs-accent-strong': strong,
      '--cs-accent-bright': accentHex,
      '--cs-accent-on': '#45210E',
      '--cs-accent-on-strong': ensureOnStrong(strong, ['#1A1108', '#45210E', '#FFFDF8']),
      '--cs-accent-tint': '#FBF4E9',
      '--cs-accent-ink': '#45210E',
      '--cs-accent-glow': hexToRgba(accentHex, r.glowAlpha),
      '--cs-accent-grad-a': accentHex,
      '--cs-accent-grad-b': gradB,
    };
  }
  const strong = finishStrong(strongSeed);
  return {
    '--cs-accent': accentHex,
    '--cs-accent-strong': strong,
    '--cs-accent-bright': bright,
    '--cs-accent-on': on,
    '--cs-accent-on-strong': ensureOnStrong(strong, [ink, on, '#1A1108', '#FFFDF8', '#FFFFFF']),
    '--cs-accent-tint': tint,
    '--cs-accent-ink': ink,
    '--cs-accent-glow': hexToRgba(accentHex, r.glowAlpha),
    '--cs-accent-grad-a': accentHex,
    '--cs-accent-grad-b': gradB,
  };
}

function deriveDarkRoles(seeds, light) {
  const D = seeds.dark;
  const T = D.targets;
  const lightH = hexToLCH(light['--cs-accent']).Hdeg;

  let accent = solveL(light['--cs-accent'], D.panel, T.accent);
  let bright = solveL(light['--cs-accent-bright'], D.panel, T.bright);

  // Re-pin hue after solve (solveL preserves H, but clamp gamut for safety)
  const pinH = (hex) => {
    const lch = hexToLCH(hex);
    return lchDegToHex(lch.L, lch.C, lightH);
  };
  accent = pinH(accent);
  bright = pinH(bright);
  accent = solveL(accent, D.panel, T.accent);
  bright = solveL(bright, D.panel, T.bright);

  const bestOn = (s) => {
    const d = apca(D.ink, s);
    const l = apca(D.text, s);
    return d >= l ? { on: D.ink, lc: d } : { on: D.text, lc: l };
  };

  let strong = pinH(light['--cs-accent-strong']);
  let bo = bestOn(strong);
  if (bo.lc < T.on) {
    const [L0, C0, Hrad] = toLCH(rgb2oklab(hex2rgb(strong)));
    const tryDir = (dir) => {
      for (let i = 1; i <= 60; i++) {
        const L = clamp(L0 + dir * 0.01 * i, 0.05, 0.97);
        const hx = lchToHex(L, C0, Hrad);
        if (bestOn(hx).lc >= T.on) return { hx, steps: i };
      }
      return null;
    };
    const up = tryDir(1);
    const down = tryDir(-1);
    const pick = up && down ? (up.steps <= down.steps ? up : down) : up || down;
    if (pick) {
      strong = pinH(pick.hx);
      bo = bestOn(strong);
    }
  }

  const aLCH = hexToLCH(accent);
  const tint = lchDegToHex(D.tintL, Math.min(aLCH.C, D.tintCMax), lightH);
  let ink = pinH(light['--cs-accent-ink']);
  if (!hex2rgb(ink) || apca(ink, tint) < T.ink) {
    ink = solveL(bright, tint, T.ink);
    ink = pinH(ink);
  }

  const onStrong = ensureOnStrong(strong, [bo.on, D.ink, D.text, '#1A1108', '#FFFDF8']);
  return {
    '--cs-accent': accent,
    '--cs-accent-bright': bright,
    '--cs-accent-strong': strong,
    '--cs-accent-on': bo.on,
    '--cs-accent-on-strong': onStrong,
    '--cs-accent-tint': tint,
    '--cs-accent-ink': ink,
  };
}

// Match the authored OKLab surface mixes in theme-resolver.mjs. Rounded sRGB
// matches browser paint; the APCA78 target leaves slack above the body75 floor.
function bodyLinkSurfaces(roles, mode) {
  const css = fs.readFileSync(path.join(ROOT, 'tokens/colors.css'), 'utf8');
  const selector = mode === 'dark' ? '[data-theme="dark"]' : ':root';
  const start = css.indexOf(selector + ' {');
  const block = css.slice(start, css.indexOf('}', start));
  const accent = rgb2oklab(hex2rgb(roles['--cs-accent']));
  return [['page',8,8],['panel',4,10],['raised',15,14]].map(([surface,lo,hi]) => {
    const match = block.match(new RegExp('--cs-color-surface-' + surface + ':\\s*(#[0-9a-f]{6})', 'i'));
    if (!match) throw Error('Missing neutral surface ' + mode + '.' + surface);
    const neutral = rgb2oklab(hex2rgb(match[1]));
    const weight = (mode === 'dark' ? hi : lo) / 100;
    return rgb2hex(...oklab2rgb(accent.map((v,i) => v * weight + neutral[i] * (1-weight))));
  }).concat(roles['--cs-accent-tint']);
}

// A strong callout can contain regular body text as well as bold labels.
// WCAG-only foreground selection can choose an APCA-weak pair; tune only
// strong lightness, preserving the source hue and all other accent roles.
function ensureBodyOnStrong(roles) {
  const seed = roles['--cs-accent-strong'];
  const lch = hexToLCH(seed);
  const candidates = ['#FFFDF8', '#FFFFFF', '#1A1108', '#45210E'];
  const choose = hex => candidates.filter(fg => wcagRatio(fg, hex) >= 4.5 && apca(fg, hex) >= 78)
    .sort((a,b) => apca(b, hex) - apca(a, hex))[0];
  let strong = seed, on = choose(strong), L = lch.L;
  for (let i = 0; i < 180 && !on; i++) {
    L -= 0.005;
    if (L < 0.04) throw Error('Cannot solve body-on-strong pair');
    let C = lch.C;
    strong = lchDegToHex(L, C, lch.Hdeg);
    for (let g = 0; g < 150 && deltaHueDeg(hexToLCH(strong).Hdeg,lch.Hdeg) > 1; g++) {
      C *= 0.98;
      strong = lchDegToHex(L, C, lch.Hdeg);
    }
    if (deltaHueDeg(hexToLCH(strong).Hdeg,lch.Hdeg) > 1) throw Error('Strong hue drift exceeds1degree');
    on = choose(strong);
  }
  if (!on) throw Error('Unresolved body-on-strong foreground');
  roles['--cs-accent-strong'] = strong;
  roles['--cs-accent-on-strong'] = on;
}

function buildAllPacks(seeds) {
  const packs = [];
  const middleAccent = {};
  for (const elKey of Object.keys(seeds.elements)) {
    middleAccent[elKey] = slotAccent(seeds, elKey, 'middle', null).hex;
  }
  for (const [elKey, el] of Object.entries(seeds.elements)) {
    const slots = [
      { slot: 'soft', variant: el.soft },
      { slot: 'middle', variant: null, name: el.middleName },
      { slot: 'deep', variant: el.deep },
    ];
    for (const s of slots) {
      const accent = slotAccent(seeds, elKey, s.slot, s.variant);
      const neighbor = seeds.tuongSinh[elKey];
      const gradB = middleAccent[neighbor] || accent.hex;
      const pinThoStudio = elKey === 'tho' && !s.variant;
      const light = deriveLightRoles(seeds, accent, gradB, { pinThoStudio });
      const darkSeedLight = { ...light };
      ensureBodyOnStrong(light);
      light['--cs-color-link'] = ensureLinkOnSurfaces(light['--cs-accent-strong'], bodyLinkSurfaces(light, 'light'));
      // Semantic accent text supports small body copy on the same surfaces as links.
      light['--cs-color-text-accent'] = pinThoStudio ? '#6E3B0E' : light['--cs-color-link'];
      const dark = deriveDarkRoles(seeds, darkSeedLight);
      ensureBodyOnStrong(dark);
      dark['--cs-color-link'] = ensureLinkOnSurfaces(dark['--cs-accent-bright'], bodyLinkSurfaces(dark, 'dark'), 4.5, 78, 'dark');
      dark['--cs-color-text-accent'] = dark['--cs-color-link'];
      packs.push({
        el: elKey,
        variant: s.variant,
        slot: s.slot,
        middleName: s.name || null,
        light,
        dark,
      });
    }
  }
  return packs;
}

function decls(obj, keys) {
  return keys
    .filter((k) => obj[k] != null)
    .map((k) => `  ${k}: ${obj[k]};`)
    .join('\n');
}

function emitCss(packs) {
  const header = `/* CyberSkill — Ngũ Hành elemental identity (the L1 product layer).
 * GENERATED from tokens/element-seeds.json by scripts/generate-element-packs.mjs
 * DO NOT HAND-EDIT pack values — change seeds and re-run the generator.
 *
 * Five elements: Kim (metal) · Mộc (wood) · Thủy (water) · Hỏa (fire) · Thổ (earth).
 * Soft / middle / deep intensity ladder (middle = default). Thổ middle pins logo ochre.
 *
 * Contract — every element/variant sets exactly these 10 role tokens:
 *   --cs-accent · --cs-accent-strong · --cs-accent-bright · --cs-accent-on
 *   --cs-accent-on-strong · --cs-accent-tint · --cs-accent-ink
 *   --cs-accent-glow · --cs-accent-grad-a/b
 * TEXT RULE: body accent text uses --cs-color-text-accent; strong fills pair with on-strong.
 * The ten accent roles retain their palette duties; never assume -bright supports small text.
 * Text on -strong uses --cs-accent-on-strong (WCAG AA ≥4.5:1 light and dark).
 * Focus indicator (text-primary contour + ochre halo) and semantic status tokens NEVER remap.
 * Generative cycle (Tương sinh) only for grad-b: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc. */
`;

  const thoMiddle = packs.find((p) => p.el === 'tho' && !p.variant);
  let css = header;
  css += `:root {\n${decls(thoMiddle.light, ROLE_KEYS)}\n}\n\n`;

  // The scope resolver below owns all scoped public values. Retain only the
  // unconditional root export defaults and non-token aurora presentation here.
  css += `/* ---- Aurora washes ---- */
.cs-aurora-wash { background-image: url("../assets/aurora-tho.webp"); background-size: cover; background-position: center; }
[data-cs-element="hoa"] .cs-aurora-wash { background-image: url("../assets/aurora-hoa.webp"); }
[data-cs-element="thuy"] .cs-aurora-wash { background-image: url("../assets/aurora-thuy.webp"); }
[data-cs-element="moc"] .cs-aurora-wash { background-image: url("../assets/aurora-moc.webp"); }
[data-cs-element="kim"] .cs-aurora-wash { background-image: url("../assets/aurora-kim.webp"); }
`;

  return css + emitThemeResolver(new URL('../', import.meta.url), packs, ROLE_KEYS);
}

function patchJsonElements(packs) {
  const elements = {};
  const elementsDark = {};
  for (const p of packs) {
    const lightKey = p.variant ? `${p.el}.${p.variant}` : p.el;
    const darkKey = p.variant ? `${p.el}-${p.variant}` : p.el;
    const light = {};
    for (const k of ROLE_KEYS) light[k] = p.light[k];
    if (p.light['--cs-color-text-accent']) {
      light['--cs-color-text-accent'] = p.light['--cs-color-text-accent'];
    }
    light['--cs-color-link'] = p.light['--cs-color-link'];
    elements[lightKey] = light;
    elementsDark[darkKey] = { ...p.dark };
  }
  return { elements, elementsDark };
}


function selfCheck(seeds, packs) {
  let fails = 0;
  for (const slot of ['soft', 'middle', 'deep']) {
    const Ls = packs.filter((p) => p.slot === slot).map((p) => hexToLCH(p.light['--cs-accent']).L);
    const avg = Ls.reduce((a, b) => a + b, 0) / Ls.length;
    for (const L of Ls) {
      if (Math.abs(L - avg) > seeds.tolerance.l + 0.001) {
        console.warn(`  WARN intensity L drift in ${slot}: ${L.toFixed(3)} vs avg ${avg.toFixed(3)}`);
        fails++;
      }
    }
  }
  for (const p of packs) {
    const lh = hexToLCH(p.light['--cs-accent']).Hdeg;
    const dh = hexToLCH(p.dark['--cs-accent']).Hdeg;
    if (deltaHueDeg(lh, dh) > seeds.tolerance.hueLockDeg) {
      console.warn(`  WARN hue lock ${p.el}.${p.variant || 'middle'}: Δh=${deltaHueDeg(lh, dh).toFixed(1)}`);
      fails++;
    }
    const D = seeds.dark;
    const T = D.targets;
    const checks = [
      ['bright', apca(p.dark['--cs-accent-bright'], D.panel), T.bright],
      ['accent', apca(p.dark['--cs-accent'], D.panel), T.accent],
      ['on-strong (body)', apca(p.dark['--cs-accent-on-strong'], p.dark['--cs-accent-strong']), 78],
      ['ink', apca(p.dark['--cs-accent-ink'], p.dark['--cs-accent-tint']), T.ink],
    ];
    for (const [name, lc, t] of checks) {
      if (lc < t) {
        console.warn(`  WARN APCA ${p.el}.${p.variant || 'middle'} ${name} Lc=${lc} < ${t}`);
        fails++;
      }
    }
    const onStrongL = p.light['--cs-accent-on-strong'];
    const strongL = p.light['--cs-accent-strong'];
    const onStrongD = p.dark['--cs-accent-on-strong'];
    const strongD = p.dark['--cs-accent-strong'];
    if (wcagRatio(onStrongL, strongL) < 4.5) {
      console.warn(`  WARN WCAG on-strong light ${p.el}.${p.variant || 'middle'} = ${wcagRatio(onStrongL, strongL).toFixed(2)}`);
      fails++;
    }
    if (wcagRatio(onStrongD, strongD) < 4.5) {
      console.warn(`  WARN WCAG on-strong dark ${p.el}.${p.variant || 'middle'} = ${wcagRatio(onStrongD, strongD).toFixed(2)}`);
      fails++;
    }
    const link = p.light['--cs-color-link'];
    if (link) {
      for (const bg of ['#FFFFFF', '#FFFDF8', p.light['--cs-accent-tint'] || '#FBF4E9']) {
        const r = wcagRatio(link, bg);
        if (r < 4.5) {
          console.warn(`  WARN WCAG link light ${p.el}.${p.variant || 'middle'} on ${bg} = ${r.toFixed(2)}`);
          fails++;
        }
      }
    }
  }
  if (fails) console.warn(`Self-check warnings: ${fails}`);
  else console.log('Self-check: intensity + hue-lock + APCA OK');
  return fails;
}

function main() {
  const check = process.argv.includes('--check');
  const seeds = loadSeeds();
  const packs = buildAllPacks(seeds);
  const css = emitCss(packs);
  const { elements, elementsDark } = patchJsonElements(packs);
  const exports = tokenExportSeed(ROOT, css, elements, elementsDark);
  const version = fs.readFileSync(path.join(ROOT,'VERSION'),'utf8').trim();
  // Preserve the public metadata field, but derive its release identity from VERSION.
  // Palette seeds remain authored inputs; $meta.version is a checked projection.
  const projectedSeeds = {...seeds, $meta: {...seeds.$meta, version}};
  const next = {
    'tokens/element-seeds.json': JSON.stringify(projectedSeeds,null,2)+'\n',
    'tokens/elements.css': css,
    'tokens/tokens.json': JSON.stringify(exports.json,null,2)+'\n',
    'tokens/tokens.js': `// CyberSkill design tokens — generated from tokens/*.css (v${version}). Do not edit by hand.\nexport const tokens = ${JSON.stringify(exports.json,null,2)};\nexport default tokens;\n`,
    'tokens/tokens.dtcg.json': JSON.stringify(exports.dtcg,null,2)+'\n',
  };

  if (check) {
    const stale = [];
    for (const [rel, text] of Object.entries(next)) {
      let current = null;
      try {
        current = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      } catch {
        /* missing */
      }
      if (current !== text) stale.push(rel);
    }
    if (stale.length) {
      console.error('✗ Element packs are stale vs tokens/element-seeds.json:');
      for (const s of stale) console.error('  - ' + s);
      console.error('  Regenerate with: npm run tokens:elements');
      console.error('  Then: node _audit/ci/generate-native-tokens.mjs');
      process.exit(1);
    }
    console.log(
      `✓ Element packs are fresh (${packs.length} packs / ${packs.length * 2} theme sets; elements.css + JSON/JS/DTCG mirrors)`,
    );
    selfCheck(seeds, packs);
    return;
  }

  for (const [rel, text] of Object.entries(next)) {
    fs.writeFileSync(path.join(ROOT, rel), text);
  }
  console.log(`Generated ${packs.length} packs (${packs.length * 2} theme sets) → tokens/elements.css + mirrors`);
  for (const p of packs) {
    console.log(`  ${p.el}${p.variant ? '.' + p.variant : ''} [${p.slot}] ${p.light['--cs-accent']}`);
  }
  selfCheck(seeds, packs);
}

main();
