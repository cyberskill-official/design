#!/usr/bin/env node
/**
 * FIND-021 / FIND-022 — .jsx destructured props vs .d.ts contracts.
 * - Every component that calls useLang(lang) must declare lang?: in its .d.ts
 *   (or inherit via extends React.*HTMLAttributes / Omit<…HTMLAttributes…>).
 * - IconName union must equal CS_ICONS keys in Icon.jsx.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const problems = [];

function walkComponents() {
  const out = [];
  for (const dir of readdirSync(join(root, 'components'), { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith('_')) continue;
    for (const f of readdirSync(join(root, 'components', dir.name))) {
      if (!f.endsWith('.jsx')) continue;
      const base = f.replace(/\.jsx$/, '');
      out.push({
        name: base,
        jsx: join(root, 'components', dir.name, f),
        dts: join(root, 'components', dir.name, `${base}.d.ts`),
      });
    }
  }
  return out;
}

function dtsDeclaresLang(dtsSrc) {
  if (/\blang\??\s*:/.test(dtsSrc)) return true;
  // Inherited from React HTML / SVG attributes (incl. Omit wrappers)
  if (/HTMLAttributes|SVGAttributes/.test(dtsSrc) && /extends\b/.test(dtsSrc)) return true;
  return false;
}

function parseCsIconKeys(src) {
  const start = src.indexOf('export const CS_ICONS');
  if (start < 0) return [];
  const brace = src.indexOf('{', start);
  let depth = 0;
  let end = brace;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = src.slice(brace + 1, end);
  const keys = [];
  for (const m of body.matchAll(/^\s*(?:["']([a-z0-9-]+)["']|([a-zA-Z_][a-zA-Z0-9_]*))\s*:/gm)) {
    keys.push(m[1] || m[2]);
  }
  return keys;
}

function parseIconNameUnion(dtsSrc) {
  const m = dtsSrc.match(/export type IconName\s*=([\s\S]*?);/);
  if (!m) return [];
  return [...m[1].matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]);
}

for (const { name, jsx, dts } of walkComponents()) {
  const jsxSrc = readFileSync(jsx, 'utf8');
  if (!/\buseLang\s*\(\s*lang\s*\)/.test(jsxSrc)) continue;
  if (!existsSync(dts)) {
    problems.push(`${name}: has lang in jsx but missing .d.ts`);
    continue;
  }
  const dtsSrc = readFileSync(dts, 'utf8');
  if (!dtsDeclaresLang(dtsSrc)) {
    problems.push(`${name}: lang used in .jsx but not declared in .d.ts`);
  }
}

const iconJsx = readFileSync(join(root, 'components/icon/Icon.jsx'), 'utf8');
const iconDts = readFileSync(join(root, 'components/icon/Icon.d.ts'), 'utf8');
const runtimeKeys = parseCsIconKeys(iconJsx);
const typeKeys = parseIconNameUnion(iconDts);
const runtimeSet = new Set(runtimeKeys);
const typeSet = new Set(typeKeys);
for (const k of runtimeSet) {
  if (!typeSet.has(k)) problems.push(`IconName missing runtime icon "${k}"`);
}
for (const k of typeSet) {
  if (!runtimeSet.has(k)) problems.push(`IconName has "${k}" not in CS_ICONS`);
}

// DataTable (and any other useLang without HTMLAttributes extends) needs an explicit lang?
const dataTableDts = join(root, 'components/datatable/DataTable.d.ts');
if (existsSync(dataTableDts)) {
  const src = readFileSync(dataTableDts, 'utf8');
  const jsx = readFileSync(join(root, 'components/datatable/DataTable.jsx'), 'utf8');
  if (/\buseLang\s*\(\s*lang\s*\)/.test(jsx) && !dtsDeclaresLang(src)) {
    problems.push('DataTable: lang used in .jsx but not declared in .d.ts');
  }
}

if (problems.length) {
  console.error('FAIL test-prop-parity');
  for (const p of problems.slice(0, 40)) console.error('  ·', p);
  process.exit(1);
}
console.log('PASS test-prop-parity', {
  components: walkComponents().length,
  iconRuntime: runtimeSet.size,
  iconTypes: typeSet.size,
});
