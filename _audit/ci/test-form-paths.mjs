/**
 * Unit tests for Form path helpers — drives the shipped Form.jsx module via dynamic import.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

// Execute the actual transpiled module, including private helper dependencies.
const compiled = buildSync({entryPoints:[join(root,'components/forms/Form.jsx')],
  bundle:true,write:false,platform:'node',format:'cjs',packages:'external'});
const loaded = {exports:{}};
new Function('require','module','exports',compiled.outputFiles[0].text)(require,loaded,loaded.exports);
const {getPath,setPath} = loaded.exports;

assert(getPath({ a: { b: 1 } }, 'a.b') === 1, 'nested get');
assert(getPath({ teammates: [{ name: 'An' }] }, 'teammates.0.name') === 'An', 'array get');
assert(getPath({}, 'x.y') === undefined, 'missing path');

const next = setPath({ teammates: [{ name: '' }] }, 'teammates.0.name', 'Bao');
assert(next.teammates[0].name === 'Bao', 'array set');
assert(getPath(next, 'teammates.0.name') === 'Bao', 'set then get');

const grown = setPath({}, 'teammates.0.name', 'Chi');
assert(Array.isArray(grown.teammates), 'creates array for numeric segment');
assert(grown.teammates[0].name === 'Chi', 'deep create');

// Bundle and public surface include new exports
const bundle = readFileSync(join(root, '_ds_bundle.js'), 'utf8');
assert(bundle.includes('FormFieldArray') && bundle.includes('FormWizard'), 'bundle exports new form APIs');
const esm = readFileSync(join(root, '_esm/cs.mjs'), 'utf8');
assert(esm.includes('FormFieldArray') && esm.includes('FormWizard'), 'esm re-exports');
const reactEsm = readFileSync(join(root, '_esm/react.mjs'), 'utf8');
assert(reactEsm.includes('FormFieldArray') && reactEsm.includes('FormWizard'), 'react.mjs re-exports');
const atomic = readFileSync(join(root, 'guidelines/atomic-view.html'), 'utf8');
assert(/\bFormFieldArray\b/.test(atomic) && /\bFormWizard\b/.test(atomic), 'atomic stories mention new exports');
const prompt = readFileSync(join(root, 'components/forms/Form.prompt.md'), 'utf8');
assert(prompt.includes('FormFieldArray') && prompt.includes('FormWizard'), 'Form.prompt.md documents new exports');


console.log('PASS test-form-paths', {
  getPath: true,
  setPath: true,
  bundle: true,
  esm: true,
  atomic: true,
});
