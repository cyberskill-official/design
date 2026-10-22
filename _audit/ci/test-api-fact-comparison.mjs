import assert from 'node:assert/strict';
import { canonicalTypeDisplay, compareApiFacts } from '../../scripts/lib/api-fact-comparison.mjs';
assert.equal(canonicalTypeDisplay('"b" | "a" | undefined'), canonicalTypeDisplay('undefined | "a" | "b"'));
assert.notEqual(canonicalTypeDisplay('(A & B) | undefined'), canonicalTypeDisplay('(B & A) | undefined'), 'Intersection/overload order is retained');
for (const [a, b] of [['"a" | "b"', '"a" | "c"'], ['(first: A, second: B) => C', '(first: B, second: A) => C'], ['[A,B]', '[B,A]'], ['Array<A | B>', 'Array<A>'], ['{ ...; }', '{ actual: string }']]) assert.notEqual(canonicalTypeDisplay(a), canonicalTypeDisplay(b));
const before = {
  exports: [{
    name: 'Widget',
    kind: 'component',
    sourcePath: 'Widget.jsx',
    signature: '(props: Props) => unknown',
    props: [{
      name: 'variant',
      definition: 'p1'
    }]
  }],
  propDefinitions: {
    p1: {
      name: 'variant',
      optional: true,
      origin: 'authored',
      description: 'Authored description.',
      type: '"a" | "b" | undefined'
    }
  }
};
const after = structuredClone(before);
after.propDefinitions.p1.type = 'undefined | "b" | "a"';
assert.deepEqual(compareApiFacts(before, after), {
  exports: 1,
  props: 1,
  displayOrderChanges: 1,
  scope: compareApiFacts(before, after).scope
});
for (const mutate of [x => x.exports.pop(), x => x.exports[0].sourcePath = 'Other.jsx', x => x.exports[0].signature = '(props: Other) => unknown', x => x.exports[0].props.pop(), x => x.propDefinitions.p1.optional = false, x => x.propDefinitions.p1.origin = 'inherited', x => x.propDefinitions.p1.description = '', x => x.propDefinitions.p1.type = '"c"']) {
  const changed = structuredClone(after);
  mutate(changed);
  assert.throws(() => compareApiFacts(before, changed));
}
console.log('PASS API fact migration comparator: union order only, exact member/optional/origin/docs/signature guards and structural negative controls');
