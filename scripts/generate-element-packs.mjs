#!/usr/bin/env node
/**
 * Generate tokens/elements.css (+ mirrors) from tokens/element-seeds.json.
 * Soft / middle / deep intensity ladder · light/dark hue lock · APCA dark floors.
 *
 * Usage: node scripts/generate-element-packs.mjs
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEEDS_PATH = path.join(ROOT, 'tokens/element-seeds.json');

const ROLE_KEYS = [
  '--cs-accent',
  '--cs-accent-strong',
  '--cs-accent-bright',
  '--cs-accent-on',
  '--cs-accent-tint',
  '--cs-accent-ink',
  '--cs-accent-glow',
  '--cs-accent-grad-a',
  '--cs-accent-grad-b',
];

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
  const c = Math.max(0.01, inten.c * el.cScale + (off.dc || 0));
  return { L: inten.l, C: c, H: h, hex: lchDegToHex(inten.l, c, h) };
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
    return {
      '--cs-accent': accentHex,
      '--cs-accent-strong': finishStrong(lchDegToHex(0.65, accent.C * 0.85, accent.H)),
      '--cs-accent-bright': accentHex,
      '--cs-accent-on': '#45210E',
      '--cs-accent-tint': '#FBF4E9',
      '--cs-accent-ink': '#45210E',
      '--cs-accent-glow': hexToRgba(accentHex, r.glowAlpha),
      '--cs-accent-grad-a': accentHex,
      '--cs-accent-grad-b': gradB,
    };
  }
  return {
    '--cs-accent': accentHex,
    '--cs-accent-strong': finishStrong(strongSeed),
    '--cs-accent-bright': bright,
    '--cs-accent-on': on,
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

  return {
    '--cs-accent': accent,
    '--cs-accent-bright': bright,
    '--cs-accent-strong': strong,
    '--cs-accent-on': bo.on,
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
        light['--cs-color-link'] = light['--cs-accent-strong'];
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
 * Contract — every element/variant sets exactly these 9 role tokens:
 *   --cs-accent · --cs-accent-strong · --cs-accent-bright · --cs-accent-on
 *   --cs-accent-tint · --cs-accent-ink · --cs-accent-glow · --cs-accent-grad-a/b
 * TEXT RULE: text sits on -bright or -tint only — never on the mid-tone -accent.
 * Focus ring --cs-color-accent-ochre and semantic status tokens NEVER remap.
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

  css += `/* ---- Dark theme CTA remaps inside element scopes ---- */
[data-theme="dark"] [data-cs-element], [data-cs-element][data-theme="dark"] {
  --cs-component-button-primary-bg: var(--cs-accent-strong);
  --cs-component-button-primary-fg: var(--cs-accent-on);
  --cs-color-text-accent: var(--cs-accent-bright);
  --cs-color-link: var(--cs-accent-bright);
  --cs-color-link-hover: var(--cs-color-text-primary);
}

/* ---- Aurora washes ---- */
.cs-aurora-wash { background-image: url("../assets/aurora-gold.jpg"); background-size: cover; background-position: center; }
[data-cs-element="hoa"] .cs-aurora-wash { background-image: url("../assets/aurora-hoa.png"); }
[data-cs-element="thuy"] .cs-aurora-wash { background-image: url("../assets/aurora-thuy.png"); }
[data-cs-element="moc"] .cs-aurora-wash { background-image: url("../assets/aurora-moc.png"); }
[data-cs-element="kim"] .cs-aurora-wash { background-image: url("../assets/aurora-kim.png"); }

/* ---- APCA-derived DARK elemental packs (generated; hue-locked to light) ---- */
`;

  for (const el of EL_ORDER) {
    for (const p of packs.filter((x) => x.el === el)) {
      const sel = p.variant
        ? `[data-theme="dark"][data-cs-element="${el}"][data-cs-variant="${p.variant}"]`
        : `[data-theme="dark"][data-cs-element="${el}"]`;
      const keys = ['--cs-accent', '--cs-accent-bright', '--cs-accent-strong', '--cs-accent-on', '--cs-accent-tint', '--cs-accent-ink'];
      css += `${sel} {\n${decls(p.dark, keys)}\n}\n`;
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

function updateTokensJson(elements) {
  const p = path.join(ROOT, 'tokens/tokens.json');
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.elements = elements;
  const tho = elements.tho;
  for (const k of ROLE_KEYS) {
    if (j.root.accent[k] != null) j.root.accent[k] = tho[k];
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}

function updateTokensJs(elements) {
  // tokens.js: `export const tokens = { ... };` + `export default tokens;`
  const p = path.join(ROOT, 'tokens/tokens.js');
  const raw = fs.readFileSync(p, 'utf8');
  const m = raw.match(/export const tokens = (\{[\s\S]*\n\});/);
  if (!m) throw new Error('tokens.js: unexpected shape');
  const j = JSON.parse(m[1]);
  j.elements = elements;
  const tho = elements.tho;
  for (const k of ROLE_KEYS) {
    if (j.root.accent[k] != null) j.root.accent[k] = tho[k];
  }
  fs.writeFileSync(
    p,
    `// CyberSkill design tokens — generated from tokens/*.css (v1.0.0). Do not edit by hand.\nexport const tokens = ${JSON.stringify(j, null, 2)};\nexport default tokens;\n`,
  );
}

function updateDtcg(elements, elementsDark) {
  const p = path.join(ROOT, 'tokens/tokens.dtcg.json');
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ext = j.$extensions['com.cyberskill'];
  if (!ext.overrides) ext.overrides = {};
  ext.overrides.elements = { ...elements };
  ext.overrides.elementsDark = { ...elementsDark };
  // Keep typed accent leaves in lockstep with :root / Thổ middle
  const tho = elements.tho;
  if (j.accent) {
    for (const k of ROLE_KEYS) {
      if (j.accent[k] && j.accent[k].$value !== undefined) j.accent[k].$value = tho[k];
    }
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}

function main() {
  const seeds = loadSeeds();
  const packs = buildAllPacks(seeds);
  fs.writeFileSync(path.join(ROOT, 'tokens/elements.css'), emitCss(packs));
  const { elements, elementsDark } = patchJsonElements(packs);
  updateTokensJson(elements);
  updateTokensJs(elements);
  updateDtcg(elements, elementsDark);
  console.log(`Generated ${packs.length} packs (${packs.length * 2} theme sets) → tokens/elements.css + mirrors`);
  for (const p of packs) {
    console.log(`  ${p.el}${p.variant ? '.' + p.variant : ''} [${p.slot}] ${p.light['--cs-accent']}`);
  }
  // Self-check geometry + APCA
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
  }
  if (fails) console.warn(`Self-check warnings: ${fails}`);
  else console.log('Self-check: intensity + hue-lock + APCA OK');
}

main();
