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
 * Body-link colour: darken seed until WCAG AA (≥4.5:1) on every light surface the pack
 * paints (white, page cream, tint, raised). text-accent may stay on the looser bold floor.
 */
function ensureLinkOnSurfaces(
  seedHex,
  surfaces = ['#FFFFFF', '#FFFDF8', '#FBF4E9', '#F8F1E4'],
  minRatio = 4.5,
) {
  let hex = seedHex;
  const lch = hexToLCH(hex);
  let L = lch.L;
  for (let i = 0; i < 140; i++) {
    if (surfaces.every((bg) => wcagRatio(hex, bg) >= minRatio)) break;
    L = clamp(L - 0.01, 0.08, 0.9);
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
      if (!pinThoStudio) {
        light['--cs-color-text-accent'] = light['--cs-accent-strong'];
        // Links are regular-weight body text — darker than bold-label text-accent (FIND-031).
        light['--cs-color-link'] = ensureLinkOnSurfaces(light['--cs-accent-strong'], [
          '#FFFFFF',
          '#FFFDF8',
          light['--cs-accent-tint'],
          '#FBF4E9',
        ]);
      }
      const dark = deriveDarkRoles(seeds, light);
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
 * TEXT RULE: text sits on -bright or -tint only — never on the mid-tone -accent.
 * Text on -strong uses --cs-accent-on-strong (WCAG AA ≥4.5:1 light and dark).
 * Focus indicator (text-primary contour + ochre halo) and semantic status tokens NEVER remap.
 * Generative cycle (Tương sinh) only for grad-b: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc. */
`;

  const thoMiddle = packs.find((p) => p.el === 'tho' && !p.variant);
  let css = header;
  css += `:root {\n${decls(thoMiddle.light, ROLE_KEYS)}\n}\n\n`;

  css += `/* ---- Element reach beyond accent ---- */
[data-cs-element] {
  --cs-color-surface-panel: color-mix(in oklab, var(--cs-accent) 4%, #FFFFFF);
  --cs-color-surface-page: color-mix(in oklab, var(--cs-accent) 8%, #FFFDF8);
  --cs-color-surface-raised: color-mix(in oklab, var(--cs-accent) 15%, #FBF4E9);
  --cs-color-border-default: color-mix(in oklab, var(--cs-accent) 40%, #E7D9C6);
}
[data-theme="dark"] [data-cs-element], [data-cs-element][data-theme="dark"] {
  --cs-color-surface-panel: color-mix(in oklab, var(--cs-accent) 10%, #221710);
  --cs-color-surface-page: color-mix(in oklab, var(--cs-accent) 8%, #1a1108);
  --cs-color-surface-raised: color-mix(in oklab, var(--cs-accent) 14%, #2b1e14);
  --cs-color-border-default: color-mix(in oklab, var(--cs-accent) 40%, #4a3a2c);
}
@media (prefers-color-scheme: dark) {
  [data-theme="system"] [data-cs-element], [data-cs-element][data-theme="system"] {
    --cs-color-surface-panel: color-mix(in oklab, var(--cs-accent) 10%, #221710);
    --cs-color-surface-page: color-mix(in oklab, var(--cs-accent) 8%, #1a1108);
    --cs-color-surface-raised: color-mix(in oklab, var(--cs-accent) 14%, #2b1e14);
    --cs-color-border-default: color-mix(in oklab, var(--cs-accent) 40%, #4a3a2c);
  }
}

`;

  for (const el of EL_ORDER) {
    const group = packs.filter((p) => p.el === el);
    const middle = group.find((p) => !p.variant);
    css += `/* ---- ${EL_LABEL[el]} — soft / middle / deep ---- */\n`;
    css += `[data-cs-element="${el}"] {\n${decls(middle.light, [...ROLE_KEYS, '--cs-color-text-accent', '--cs-color-link'])}\n}\n`;
    for (const p of group.filter((x) => x.variant)) {
      css += `[data-cs-element="${el}"][data-cs-variant="${p.variant}"] {\n${decls(p.light, [...ROLE_KEYS, '--cs-color-text-accent', '--cs-color-link'])}\n}\n`;
    }
    css += '\n';
  }

  const ctaRemap = `  --cs-component-button-primary-bg: var(--cs-accent-strong);
  --cs-component-button-primary-fg: var(--cs-accent-on);
  --cs-color-text-accent: var(--cs-accent-bright);
  --cs-color-link: var(--cs-accent-bright);
  --cs-color-link-hover: var(--cs-color-text-primary);`;

  css += `/* ---- Dark theme CTA remaps inside element scopes ---- */
[data-theme="dark"] [data-cs-element], [data-cs-element][data-theme="dark"] {
${ctaRemap}
}
@media (prefers-color-scheme: dark) {
  [data-theme="system"] [data-cs-element], [data-cs-element][data-theme="system"] {
${ctaRemap}
  }
}

/* ---- Aurora washes ---- */
.cs-aurora-wash { background-image: url("../assets/aurora-tho.webp"); background-size: cover; background-position: center; }
[data-cs-element="hoa"] .cs-aurora-wash { background-image: url("../assets/aurora-hoa.webp"); }
[data-cs-element="thuy"] .cs-aurora-wash { background-image: url("../assets/aurora-thuy.webp"); }
[data-cs-element="moc"] .cs-aurora-wash { background-image: url("../assets/aurora-moc.webp"); }
[data-cs-element="kim"] .cs-aurora-wash { background-image: url("../assets/aurora-kim.webp"); }

/* ---- APCA-derived DARK elemental packs (generated; hue-locked to light) ---- */
`;

  const darkKeys = ['--cs-accent', '--cs-accent-bright', '--cs-accent-strong', '--cs-accent-on', '--cs-accent-on-strong', '--cs-accent-tint', '--cs-accent-ink'];
  for (const el of EL_ORDER) {
    for (const p of packs.filter((x) => x.el === el)) {
      const darkSel = p.variant
        ? `[data-theme="dark"][data-cs-element="${el}"][data-cs-variant="${p.variant}"]`
        : `[data-theme="dark"][data-cs-element="${el}"]`;
      const sysSel = p.variant
        ? `[data-theme="system"][data-cs-element="${el}"][data-cs-variant="${p.variant}"]`
        : `[data-theme="system"][data-cs-element="${el}"]`;
      css += `${darkSel} {\n${decls(p.dark, darkKeys)}\n}\n`;
      css += `@media (prefers-color-scheme: dark) {\n  ${sysSel} {\n${decls(p.dark, darkKeys).split('\n').map((l) => (l ? '  ' + l : l)).join('\n')}\n  }\n}\n`;
    }
  }
  return css;
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
      light['--cs-color-link'] = p.light['--cs-color-link'];
    }
    elements[lightKey] = light;
    elementsDark[darkKey] = { ...p.dark };
  }
  return { elements, elementsDark };
}

function buildTokensJson(elements) {
  const p = path.join(ROOT, 'tokens/tokens.json');
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.elements = elements;
  const tho = elements.tho;
  if (!j.root.accent) j.root.accent = {};
  for (const k of ROLE_KEYS) {
    if (tho[k] != null) j.root.accent[k] = tho[k];
  }
  return JSON.stringify(j, null, 2) + '\n';
}

function buildTokensJs(elements) {
  // tokens.js: `export const tokens = { ... };` + `export default tokens;`
  const p = path.join(ROOT, 'tokens/tokens.js');
  const raw = fs.readFileSync(p, 'utf8');
  const m = raw.match(/export const tokens = (\{[\s\S]*\n\});/);
  if (!m) throw new Error('tokens.js: unexpected shape');
  const j = JSON.parse(m[1]);
  j.elements = elements;
  const tho = elements.tho;
  if (!j.root.accent) j.root.accent = {};
  for (const k of ROLE_KEYS) {
    if (tho[k] != null) j.root.accent[k] = tho[k];
  }
  const ver = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
  return `// CyberSkill design tokens — generated from tokens/*.css (v${ver}). Do not edit by hand.\nexport const tokens = ${JSON.stringify(j, null, 2)};\nexport default tokens;\n`;
}

function buildDtcg(elements, elementsDark) {
  const p = path.join(ROOT, 'tokens/tokens.dtcg.json');
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ext = j.$extensions['com.cyberskill'];
  if (!ext.overrides) ext.overrides = {};
  ext.overrides.elements = { ...elements };
  ext.overrides.elementsDark = { ...elementsDark };
  // Keep typed accent leaves in lockstep with :root / Thổ middle
  const tho = elements.tho;
  if (!j.accent) j.accent = {};
  for (const k of ROLE_KEYS) {
    if (tho[k] == null) continue;
    if (!j.accent[k]) j.accent[k] = { $type: 'color', $value: tho[k] };
    else j.accent[k].$value = tho[k];
  }
  return JSON.stringify(j, null, 2) + '\n';
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
      ['on', apca(p.dark['--cs-accent-on'], p.dark['--cs-accent-strong']), T.on],
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
  const next = {
    'tokens/elements.css': css,
    'tokens/tokens.json': buildTokensJson(elements),
    'tokens/tokens.js': buildTokensJs(elements),
    'tokens/tokens.dtcg.json': buildDtcg(elements, elementsDark),
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
