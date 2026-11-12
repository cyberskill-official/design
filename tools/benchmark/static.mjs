// Benchmark dimensions measured on files, not in a browser: D20 Server Components, D21 docs parity, D22 token discipline,
// D24 motion discipline, D25 color roles.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { record } from './score.mjs';

const walk = (dir, test, acc = []) => {
  for (const e of readdirSync(dir)) { const f = join(dir, e); if (statSync(f).isDirectory()) walk(f, test, acc); else if (test(f)) acc.push(f); }
  return acc;
};
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const HOOKS = /\b(useState|useEffect|useLayoutEffect|useInsertionEffect|useRef|useContext|useReducer|useCallback|useMemo|useId|useSyncExternalStore|useTransition|useDeferredValue|useOptimistic|useActionState|useImperativeHandle|createContext)\b/;
const OPTIONAL_PEERS = /^(recharts|@tanstack\/|react-hook-form|react-day-picker|date-fns|motion($|\/))/;
const ENTRIES = ['index', 'charts', 'table', 'forms', 'date', 'motion', 'utils'];
// one list, kept in the build config that acts on it
const serverSafe = pkg => readFileSync(join(pkg, 'tsdown.config.ts'), 'utf8').match(/SERVER_SAFE = \[([^\]]+)\]/)[1].match(/\w+/g);

/** D20: 'use client' where hooks or Base UI run, never on an entry barrel; the core entry stays free of optional peers. */
export function serverComponents(results, pkg) {
  const dist = join(pkg, 'dist');
  const mods = walk(dist, f => f.endsWith('.js'));
  const code = new Map(mods.map(f => [f, readFileSync(f, 'utf8')]));
  const SERVER_SAFE = serverSafe(pkg);
  const isClient = src => /^\s*(\/\/[^\n]*\n\s*)*['"]use client['"]/.test(src);
  for (const [f, src] of code) {
    const rel = relative(dist, f), entry = ENTRIES.some(e => rel === `${e}.js`);
    if (entry) record(results, 'D20', { pass: !isClient(src), key: `entry ${rel} has no 'use client'`, detail: "an entry barrel marked 'use client' ships every export to the browser" });
    else if (HOOKS.test(src) || /from\s*['"]@base-ui\/react/.test(src)) record(results, 'D20', { pass: isClient(src), key: `${rel} is a client module`, detail: "uses hooks or Base UI without 'use client'" });
    // the purely visual components (SERVER_SAFE in tsdown.config.ts) must stay server-renderable
    if (SERVER_SAFE.some(n => rel === `react/${n}.js`)) record(results, 'D20', { pass: !isClient(src) && !HOOKS.test(src) && !/from\s*['"]@phosphor-icons\/react['"]/.test(src) && !/\bon[A-Z]\w+:/.test(src), key: `${rel} renders in a Server Component`, detail: "has 'use client', a hook, an event handler or the client icon build" });
  }
  // the import graph of each entry: the core entry must not reach an optional peer, utils must stay server-safe
  const graph = start => {
    const seen = new Set(), bare = new Set(), client = new Set(), todo = [start];
    while (todo.length) {
      const f = todo.pop(); if (seen.has(f) || !code.has(f)) continue; seen.add(f);
      const src = code.get(f); if (isClient(src)) client.add(relative(dist, f));
      for (const m of src.matchAll(/(?:import|export)\s*(?:[^'"]*?from\s*)?['"]([^'"]+)['"]/g)) {
        const spec = m[1];
        if (spec.startsWith('.')) todo.push(join(dirname(f), spec)); else bare.add(spec);
      }
    }
    return { bare, client };
  };
  for (const e of ['index', 'utils']) {
    const file = join(dist, `${e}.js`);
    record(results, 'D20', { pass: existsSync(file), key: `entry ${e}.js exists`, detail: 'not built' });
    if (!existsSync(file)) continue;
    const { bare, client } = graph(file);
    if (e === 'index') {
      const peers = [...bare].filter(s => OPTIONAL_PEERS.test(s));
      record(results, 'D20', { pass: peers.length === 0, key: 'core entry imports no optional peer', detail: peers.join(', ') });
    } else {
      record(results, 'D20', { pass: client.size === 0 && ![...bare].some(s => /^react($|\/)|^@base-ui/.test(s)), key: 'utils entry is server-safe (no React, no client modules)', detail: [...client, ...[...bare].filter(s => /^react|^@base-ui/.test(s))].join(', ') });
    }
  }
}

/** D21: each component page on the site has a story, a test file, a demo and a generated AI doc. */
export function docsParity(results, { root, pkg, stories }) {
  const pages = readdirSync(join(root, 'apps/site/content/docs/components')).filter(f => f.endsWith('.mdx') && f !== 'index.mdx').map(f => f.replace(/\.mdx$/, ''));
  const src = join(pkg, 'src');
  const testNames = new Set(walk(src, f => /\.test\.tsx?$/.test(f)).map(f => kebab(basename(f).replace(/\.test\.tsx?$/, ''))));
  const storyNames = new Set(stories.flatMap(s => [kebab(s.title.split('/').pop().replace(/\s+/g, '')), kebab(basename(s.importPath).replace(/\.stories\.tsx?$/, ''))]));
  // Pages whose component file has another name: TextField lives in Field.tsx.
  const alias = { 'text-field': 'field', forms: 'form-field' };
  for (const p of pages) {
    const name = alias[p] ?? p;
    const checks = {
      story: storyNames.has(name) || storyNames.has(p),
      test: testNames.has(name) || testNames.has(p),
      demo: existsSync(join(root, 'apps/site/demos', `${p}.tsx`)),
      'AI doc': existsSync(join(pkg, 'ai/components', `${p}.md`)),
    };
    for (const [what, ok] of Object.entries(checks)) record(results, 'D21', { pass: ok, key: `${p} has a ${what}`, detail: `no ${what} for the ${p} page` });
  }
}

const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(|(?<![-\w])(white|black|red|green|blue|gray|grey|silver|orange|yellow|purple)(?![-\w])/i;

/** D22: component CSS uses only tokens for color; every DTCG token has a $value and a $type. */
export function tokenDiscipline(results, pkg) {
  for (const f of walk(join(pkg, 'src/css'), f => f.endsWith('.css'))) {
    const lines = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').split('\n');
    // only declaration values (after the first colon), skipping custom properties, imports and urls
    const bad = lines.map((l, i) => [i + 1, l]).filter(([, l]) => /:/.test(l) && !/^\s*--/.test(l) && !/@import|url\(/.test(l) && l.split(';').some(d => d.includes(':') && RAW_COLOR.test(d.split(':').slice(1).join(':'))));
    record(results, 'D22', { pass: bad.length === 0, key: `${relative(pkg, f)} uses token colors only`, detail: bad.slice(0, 3).map(([n, l]) => `line ${n}: ${l.trim()}`).join('; ') });
  }
  for (const f of walk(join(pkg, 'tokens'), f => f.endsWith('.json'))) {
    const visit = (node, type, at) => {
      if (node && typeof node === 'object' && '$value' in node) { record(results, 'D22', { pass: !!(node.$type ?? type), key: `${basename(f)} ${at} has a $type`, detail: 'no $type on the token or its groups' }); return; }
      for (const [k, v] of Object.entries(node ?? {})) if (!k.startsWith('$') && v && typeof v === 'object') visit(v, node.$type ?? type, at ? `${at}.${k}` : k);
    };
    visit(JSON.parse(readFileSync(f, 'utf8')), undefined, '');
  }
}

/** Every rule of a stylesheet, nested ones and those inside @media included: its selector chain, its own selector and declarations. */
export function cssRules(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const lineOf = i => text.slice(0, i).split('\n').length;
  const rules = [], stack = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== '{' && ch !== '}' && ch !== ';') continue;
    const seg = text.slice(start, i), own = seg.trim(), line = lineOf(start + seg.search(/\S|$/));
    if (ch === '{') { const r = { selector: [...stack.map(s => s.own), own].join(' '), own, line, decls: [] }; rules.push(r); stack.push(r); }
    else {
      const k = own.indexOf(':');
      if (k > 0 && stack.length) stack.at(-1).decls.push({ prop: own.slice(0, k).trim(), value: own.slice(k + 1).trim(), line });
      if (ch === '}') stack.pop();
    }
    start = i + 1;
  }
  return rules;
}

const splitTop = v => { const out = []; let depth = 0, cur = ''; for (const ch of v) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && !depth) { out.push(cur.trim()); cur = ''; } else cur += ch; } return [...out, cur.trim()].filter(Boolean); };
// what travels on screen: reduced motion keeps --motion-state and --motion-fade, so these must never ride them
const MOVES = /^(transform|translate|scale|rotate|top|right|bottom|left|inset(-[\w-]+)?|(min-|max-)?(width|height|inline-size|block-size)|margin(-[\w-]+)?|padding(-[\w-]+)?)$/;
// the one exception check-css.mjs also allows: a gesture scaling a duration by a runtime value (a hard flick closes a drawer faster)
const GESTURE = /^calc\(\s*var\(--(?!duration-|ease-|spring-|motion-)[\w-]+(\s*,[^()]*)?\)\s*\*\s*var\(--duration-[\w-]+\)\s*\)$/;

/** Why one transition declaration is off the recipes, or '' when it is fine. */
function transitionProblem({ prop, value }) {
  if (prop === 'transition-property') return /(^|,)\s*all\s*(,|$)/.test(value) ? 'transition-property: all' : '';
  if (prop === 'transition-duration' && GESTURE.test(value)) return '';
  if (prop !== 'transition') return /^0m?s$/.test(value) || value.includes('var(--motion-') ? '' : `${prop}: ${value} is not a recipe`; // longhands may only switch motion off
  if (value === 'none') return '';
  for (const item of splitTop(value)) {
    const m = /^([a-z-]+)\s+var\(--motion-([\w-]+)\)$/.exec(item);
    if (/^all\b/.test(item)) return 'transition: all';
    if (!m) return `"${item}" is not one property on a --motion-* recipe`;
    if (MOVES.test(m[1]) && /^(state|fade)$/.test(m[2])) return `${m[1]} on --motion-${m[2]}, which reduced motion keeps`;
  }
  return '';
}

/**
 * D24: component CSS animates only through the --motion-* recipes, so reduced motion (redefined once in motion.css) reaches
 * every component. motion.css must bring each recipe that springs or runs past D12's 200ms down to 200ms or less, and set
 * every start value (scales to 1, distances and stagger to 0).
 */
export function motionDiscipline(results, pkg) {
  const css = join(pkg, 'src/css');
  for (const f of walk(join(css, 'components'), f => f.endsWith('.css'))) {
    const bad = cssRules(readFileSync(f, 'utf8')).flatMap(r => r.decls.filter(d => /^transition(-property|-duration|-timing-function|-delay)?$/.test(d.prop)).map(d => [d.line, transitionProblem(d)])).filter(([, why]) => why);
    record(results, 'D24', { pass: bad.length === 0, key: `${relative(pkg, f)} transitions run on recipes`, detail: bad.slice(0, 3).map(([n, why]) => `line ${n}: ${why}`).join('; ') });
  }
  const F = JSON.parse(readFileSync(join(pkg, 'tokens/foundations.json'), 'utf8'));
  const ms = v => { const m = /^(\d*\.?\d+)(ms|s)$/.exec(v ?? ''); return m ? +m[1] * (m[2] === 's' ? 1000 : 1) : null; };
  const reduced = new Map(cssRules(readFileSync(join(css, 'motion.css'), 'utf8')).filter(r => /prefers-reduced-motion:\s*reduce/.test(r.selector)).flatMap(r => r.decls.map(d => [d.prop, d.value])));
  const quick = v => { const [d, curve = ''] = v.split(/\s+/); const t = ms(d) ?? ms(F.duration[/^var\(--duration-([\w-]+)\)$/.exec(d)?.[1]]); return t != null && t <= 200 && !/spring|linear\(/.test(curve); };
  for (const [name, r] of Object.entries(F.motion)) {
    if (name.startsWith('$') || (typeof r !== 'string' && ms(F.duration[r[0]]) <= 200)) continue; // a spring, or longer than 200ms
    const v = reduced.get(`--motion-${name}`);
    record(results, 'D24', { pass: v != null && quick(v), key: `reduced motion shortens --motion-${name}`, detail: v == null ? 'motion.css does not redefine it under prefers-reduced-motion: reduce' : `redefined as ${v}, which springs or runs past 200ms` });
  }
  for (const name of Object.keys(F['motion-value']).filter(k => !k.startsWith('$'))) {
    const v = reduced.get(`--motion-${name}`), still = name.endsWith('-scale') ? v === '1' : /^0(px|ms|s|rem)?$/.test(v ?? '');
    record(results, 'D24', { pass: still, key: `reduced motion neutralizes --motion-${name}`, detail: v == null ? 'motion.css does not redefine it under prefers-reduced-motion: reduce' : `redefined as ${v}, needs ${name.endsWith('-scale') ? '1' : '0'}` });
  }
}

// gold (--accent) fills what is on, done or key in these stylesheets; gold on white is 1.8:1, so each fill needs an --accent-text edge
const GOLD_FILLED = ['switch', 'checkbox', 'radio', 'slider', 'progress', 'meter', 'side-nav'];

/**
 * D25: every tone in the tone map resolves its roles to tokens defined in both themes; no stylesheet puts text on a solid
 * category color; every gold fill in GOLD_FILLED carries an --accent-text edge in the same rule.
 */
export function colorRoles(results, pkg) {
  const comp = join(pkg, 'src/css/components');
  const lits = (src, type) => [...(new RegExp(`type ${type} = ([^;]+);`).exec(src)?.[1] ?? '').matchAll(/'([\w-]+)'/g)].map(m => m[1]);
  const toneTs = readFileSync(join(pkg, 'src/react/tone.ts'), 'utf8');
  const cats = lits(toneTs, 'CategoryTone'), all = [...lits(toneTs, 'Tone'), ...lits(toneTs, 'StatusTone'), ...cats];
  record(results, 'D25', { pass: cats.length > 0 && all.length > cats.length, key: 'src/react/tone.ts lists the tones', detail: 'no CategoryTone, StatusTone or Tone union found' });
  // a token counts when tokens.css defines it outside the themes, or in both the light and the dark block
  const themes = { root: new Set(), light: new Set(), dark: new Set() };
  for (const r of cssRules(readFileSync(join(pkg, 'dist/tokens.css'), 'utf8'))) {
    const which = /@media/.test(r.selector) ? null : /data-theme=["']?dark/.test(r.own) ? 'dark' : /data-theme=["']?light/.test(r.own) ? 'light' : r.own === ':root' ? 'root' : null;
    if (which) for (const d of r.decls) themes[which].add(d.prop);
  }
  const defined = t => themes.root.has(t) || (themes.light.has(t) && themes.dark.has(t));
  const toneFile = join(comp, 'tone.css');
  record(results, 'D25', { pass: existsSync(toneFile), key: 'the tone map exists (components/tone.css)', detail: 'no tone.css' });
  if (existsSync(toneFile)) {
    const tones = new Map(), base = new Set();
    for (const r of cssRules(readFileSync(toneFile, 'utf8'))) {
      const names = [...r.own.matchAll(/\[data-tone=['"]?([\w-]+)['"]?\]/g)].map(m => m[1]), roles = r.decls.filter(d => d.prop.startsWith('--tone'));
      if (!names.length) { if (/\[data-tone\]|\.cs-tone/.test(r.own)) roles.forEach(d => base.add(d.prop)); continue; }
      for (const n of names) { const t = tones.get(n) ?? new Map(); roles.forEach(d => t.set(d.prop, d.value)); tones.set(n, t); }
    }
    const roles = new Set([...base, ...[...tones.values()].flatMap(t => [...t.keys()])]);
    // no data-tone (or the base rule) is primary
    for (const n of all) record(results, 'D25', { pass: tones.has(n) || (n === 'primary' && base.size > 0), key: `tone map has ${n}`, detail: `no [data-tone='${n}'] rule in tone.css` });
    for (const [n, t] of tones) {
      const missing = [...roles].filter(p => !t.has(p) && !base.has(p) && !(cats.includes(n) && p === '--tone-on'));
      const undef = [...new Set([...t.values()].flatMap(v => [...v.matchAll(/var\((--[\w-]+)/g)].map(m => m[1])))].filter(v => !/^--(tone|_)/.test(v) && !defined(v));
      record(results, 'D25', { pass: !missing.length && !undef.length, key: `tone ${n} has every role in both themes`, detail: [missing.length ? `sets no ${missing.join(', ')}` : '', undef.length ? `${undef.join(', ')} not in both themes of tokens.css` : ''].filter(Boolean).join('; ') });
    }
  }
  // shortcut: catches a category color painted directly or named by the rule's selector, not one passed through a --_ variable
  const solidCat = new RegExp(`var\\(--(chart-[1-5]|(${cats.join('|')})-(icon|text))\\)`), catSel = new RegExp(`\\[data-tone=['"]?(${cats.join('|')})['"]?\\]`);
  for (const f of walk(comp, f => f.endsWith('.css') && basename(f) !== 'chart.css')) {
    const bad = [];
    for (const r of cssRules(readFileSync(f, 'utf8'))) {
      const named = cats.length > 0 && catSel.test(r.selector);
      const solid = r.decls.find(d => /^background(-color)?$/.test(d.prop) && (solidCat.test(d.value) || (named && /var\(--tone(-icon|-text)?\)/.test(d.value))));
      if (solid && r.decls.some(d => d.prop === 'color')) bad.push(`line ${solid.line}: text on ${solid.value}`);
      const on = named && r.decls.find(d => d.prop === '--tone-on');
      if (on) bad.push(`line ${on.line}: a category tone sets --tone-on`);
    }
    record(results, 'D25', { pass: bad.length === 0, key: `${relative(pkg, f)} puts no text on a solid category color`, detail: bad.slice(0, 3).join('; ') });
  }
  // a fill is a background, or a --_ variable a later rule paints with; its edge sits in the same rule
  const edge = d => /^(border|outline|box-shadow|--_)/.test(d.prop) && d.value.includes('var(--accent-text)');
  for (const name of GOLD_FILLED) {
    const f = join(comp, `${name}.css`), rules = existsSync(f) ? cssRules(readFileSync(f, 'utf8')) : [];
    const fills = rules.filter(r => r.decls.some(d => /^(background(-color)?|--_[\w-]+)$/.test(d.prop) && /^var\(--(accent|gradient-gold)\)$/.test(d.value)));
    record(results, 'D25', { pass: fills.length > 0, key: `${name}.css fills with gold`, detail: existsSync(f) ? 'no rule fills with var(--accent)' : 'no such stylesheet' });
    for (const r of fills) record(results, 'D25', { pass: r.decls.some(edge), key: `${name}.css "${r.selector}" gold fill has an --accent-text edge`, detail: `line ${r.line}: no border, outline or box-shadow on var(--accent-text) next to the gold fill` });
  }
}
