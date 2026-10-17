import assert from 'node:assert/strict';
import {jsxUiLiterals} from './lib/jsx-ui-literals.mjs';
assert.deepEqual(jsxUiLiterals('const x=<button>{copied ? "Copied ✓" : "Copy"}</button>').map(x=>x.text),['Copied ✓','Copy']);
assert.deepEqual(jsxUiLiterals('const x=<div>FormFieldArray must be used inside Form</div>').map(x=>x.text),['FormFieldArray must be used inside Form']);
assert.deepEqual(jsxUiLiterals('const x=<><span>{ok && "Ready"}</span><b>{`Hello ${name}`}</b><i>{["One", "Two"]}</i></>').map(x=>x.text),['Ready','Hello','One','Two']);
assert.deepEqual(jsxUiLiterals('const x=<button className="internal-style">{t("copy")}{label}✓</button>'),[]);
assert.throws(()=>jsxUiLiterals('const x=<button>'),SyntaxError);
assert.equal(jsxUiLiterals('const x=(\n<div>Visible</div>);')[0].line,2);
console.log('PASS JSX UI literals: historic text-node/conditional regressions, compound children, metadata exclusion and syntax failure');
