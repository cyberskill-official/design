import assert from 'node:assert/strict';
import {moduleResources} from './lib/module-resources.mjs';
const result=moduleResources(`
import x from './a.js'; export {y} from './b.js'; export * from './c.js';
import('./d.js'); import(unknown); require('./e.js'); require(variable);
new URL('../asset.png',import.meta.url); new URL(path,import.meta.url);
new URL('./not-module-relative.png',document.baseURI);
const node=<img src="./jsx-is-outside-this-check.png"/>;
// import('./comment.js')
const text="import('./text.js')";
`);
assert.deepEqual(result.references.map(x=>x.value),['./a.js','./b.js','./c.js','./d.js','./e.js','../asset.png']);
assert.deepEqual(result.dynamic.map(x=>x.kind),['import','require','url']);
assert.throws(()=>moduleResources('import {'),/Unexpected/,'Unsupported/invalid syntax must not silently pass');
assert.equal(moduleResources('import(`./literal.js`)').references[0].value,'./literal.js');
console.log('PASS module resource extraction: imports/reexports/require/import-meta URLs; computed edges reported, comments/text excluded and syntax errors fail');
