import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import postcss from 'postcss';
import { buildLayeredCss, LAYERS, SOURCES } from '../../scripts/lib/layered-css.mjs';
const root = resolve(new URL('../../', import.meta.url).pathname),
  read = p => readFileSync(resolve(root, p), 'utf8'),
  {
    css,
    manifest
  } = buildLayeredCss(root);
assert.equal(css, buildLayeredCss(root).css, 'Deterministic byte output');
assert.equal(read('styles.layered.css'), css);
assert.deepEqual(JSON.parse(read('styles.layered.provenance.json')), manifest);
assert.deepEqual(manifest.inputs.map(x => x.path), ['styles.css', ...SOURCES]);
for (const input of manifest.inputs) assert.equal(input.sha256, createHash('sha256').update(read(input.path)).digest('hex'));
const output = postcss.parse(css),
  allLayers = output.nodes.filter(n => n.type === 'atrule' && n.name === 'layer');
assert.deepEqual(allLayers[0].params.split(', '), LAYERS);
assert.deepEqual(allLayers.slice(1).map(n => n.params), LAYERS);
assert.equal(output.nodes.filter(n => n.type !== 'comment' && !(n.type === 'atrule' && n.name === 'layer')).length, 0, 'No normal rule escapes explicit layers');
const records = tree => {
  const out = [];
  tree.walkDecls(d => {
    if (!d.important) return;
    const ancestry = [];
    for (let p = d.parent; p && p.type !== 'root'; p = p.parent) if (p.type === 'rule') ancestry.unshift({
      selector: p.selector
    });else if (p.type === 'atrule' && p.name !== 'layer') ancestry.unshift({
      name: p.name,
      params: p.params
    });
    out.push({
      ancestry,
      prop: d.prop,
      value: d.value
    });
  });
  return out;
};
const original = SOURCES.flatMap(p => records(postcss.parse(read(p))));
assert.equal(original.length, 46, 'Reviewed current important census; changes need review');
assert.deepEqual(records(output), original, 'Every important declaration retains conditions, specificity, value and global source order');
assert.equal(manifest.importantCount, original.length);
for (const layer of allLayers.slice(1)) layer.walkDecls(d => assert.equal(Boolean(d.important), layer.params === 'cs-safety', 'Important precedence cannot be split across category layers'));
const virtual = (changes = {}, realpath = p => p) => () => buildLayeredCss(root, {
  read: p => changes[relative(root, p)] ?? read(relative(root, p)),
  realpath
});
assert.throws(virtual({
  'styles.css': read('styles.css').replace('tokens/colors.css', 'tokens/unknown.css')
}), /Unknown/);
assert.throws(virtual({
  'styles.css': read('styles.css').replace('tokens/fonts.css', '../tokens/fonts.css')
}), /Unknown/);
assert.throws(virtual({
  'styles.css': read('styles.css') + '\nbody {color:red}'
}), /non-import/);
assert.throws(virtual({
  'styles.css': read('styles.css').replace('url("tokens/fonts.css")', 'url("https://attacker.test/a.css")')
}), /Unknown/);
assert.throws(virtual({
  'base/controls.css': read('base/controls.css') + '\n@import "unknown.css";'
}), /Unsupported nested/);
assert.throws(virtual({
  'base/controls.css': read('base/controls.css') + '\n@layer other {p{color:red}}'
}), /Unsupported nested/);
assert.throws(virtual({
  'base/controls.css': read('base/controls.css') + '\np{background:url(https://attacker.test/x)}'
}), /Unsafe or external/);
assert.throws(virtual({
  'base/controls.css': read('base/controls.css') + '\np{background:url(../../escape.svg)}'
}), /escapes asset/);
assert.throws(virtual({}, p => p.endsWith('/base/controls.css') ? '/outside/source.css' : p), /escapes root/);
assert.throws(virtual({}, p => p.includes('/fonts/') ? '/outside/font.woff2' : p), /asset escapes root/);
const normal = css.replace('@layer cs-safety {', '@layer cs-safety-broken {');
assert.notEqual(normal, css);
assert.throws(() => assert.deepEqual(records(postcss.parse(css.replace('position: absolute !important', 'position: relative !important'))), original), 'Safety-value corruption must be rejected');
console.log('PASS layered CSS deterministic 26source provenance,46important exact-order/context/specificity invariants, URL rebasing and10 unsafe graph/asset negatives');
