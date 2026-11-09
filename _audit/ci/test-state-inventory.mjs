import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { buildInventory, renderIndex, scanJavaScript, scanHTML, scanCSS } from '../../scripts/generate-state-inventory.mjs';

const facts = scanJavaScript(`import React from 'react';
export function Fixture({ value, onChange }) {
 const [open, setOpen] = React.useState(false);
 const generation = React.useRef(0);
 React.useEffect(() => { const id = setTimeout(() => setOpen(false), 1); return () => clearTimeout(id); }, []);
 async function submit() { generation.current++; await onChange(value); }
 return <button aria-expanded={open} onClick={() => setOpen(true)}>{value}</button>;
}`);
assert(facts.some(row => row.kind === 'hook' && row.binding === '[open, setOpen]' && row.line === 3 && row.owner === 'Fixture'));
for (const kind of ['mutation', 'possible-transition-call', 'async-boundary', 'lifecycle-or-dom-call', 'event-binding', 'state-output']) assert(facts.some(row => row.kind === kind), kind);
assert(!scanJavaScript('// useState(false); setOpen(true)\nconst text = "onClick setOpen(true)";').length, 'comments and strings must not fabricate JS observations');
assert.throws(() => scanJavaScript('const broken = ;'), /Unexpected token/, 'unsupported source must fail closed');
const html = scanHTML(`<template><button onclick="{{open}}" aria-expanded="{{expanded}}">Open</button></template>
<script type="application/json">{"not":"code"}</script>
<script type="text/babel" data-props='{"open":false}'>
const [open, setOpen] = React.useState(false);
</script>`);
assert(html.some(row => row.kind === 'event-binding' && row.line === 1));
assert(html.some(row => row.kind === 'hook' && row.line === 4));
assert(html.some(row => row.kind === 'template-props' && row.line === 3));
assert.equal(scanHTML('<script src="external.js"></script>').length, 0);
assert.throws(() => scanHTML('<script>const broken = ;</script>'), /Unexpected token/);
assert.equal(scanCSS('/* :hover */ .plain {color:red} .control:focus-visible, [aria-expanded=true] {color:blue}').length, 1);
const inventory = buildInventory();
assert(inventory.sources.some(source => source.path === 'components/navigation/Tabs.jsx' && source.observations.some(row => row.kind === 'state-output')), 'controlled-only components must not disappear');
assert(inventory.sources.some(source => source.path === 'scripts/template-runtime/primitives/support.js'));
assert(!inventory.sources.some(source => /templates\/(?!_vendor).*\/support.js$/.test(source.path)), 'runtime copies must not inflate census');
assert(inventory.sources.some(source => source.observations.length === 0), 'zero-observation files remain visible');
assert.equal(new Set(inventory.sources.map(source => source.path)).size, inventory.sources.length);
assert.deepEqual(buildInventory(), inventory, 'deterministic across repeated builds');
assert.equal(renderIndex(inventory), renderIndex(buildInventory()));
execFileSync(process.execPath, ['scripts/generate-state-inventory.mjs', '--check'], { stdio: 'inherit' });
console.log('PASS state census: AST/string separation, fatal parse errors, HTML locations, inert JSON, template content, CSS, controlled props, canonical runtimes, deterministic whole-set freshness');
