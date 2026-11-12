// Benchmark dimensions measured on files, not in a browser: D20 Server Components, D21 docs parity, D22 token discipline.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { record } from './score.mjs';

const walk = (dir, test, acc = []) => {
  for (const e of readdirSync(dir)) { const f = join(dir, e); if (statSync(f).isDirectory()) walk(f, test, acc); else if (test(f)) acc.push(f); }
  return acc;
};
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const HOOKS = /\b(useState|useEffect|useLayoutEffect|useInsertionEffect|useRef|useContext|useReducer|useCallback|useMemo|useId|useSyncExternalStore|useTransition|useDeferredValue|useOptimistic|useActionState|useImperativeHandle|createContext)\b/;
const OPTIONAL_PEERS = /^(recharts|@tanstack\/|react-hook-form|react-day-picker|date-fns)/;
const ENTRIES = ['index', 'charts', 'table', 'forms', 'date', 'utils'];
const SERVER_SAFE = ['Kbd', 'Spinner', 'Skeleton', 'EmptyState', 'Badge', 'Stat', 'Stepper', 'Breadcrumbs', 'Prose']; // keep in step with tsdown.config.ts

/** D20: 'use client' where hooks or Base UI run, never on an entry barrel; the core entry stays free of optional peers. */
export function serverComponents(results, pkg) {
  const dist = join(pkg, 'dist');
  const mods = walk(dist, f => f.endsWith('.js'));
  const code = new Map(mods.map(f => [f, readFileSync(f, 'utf8')]));
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
