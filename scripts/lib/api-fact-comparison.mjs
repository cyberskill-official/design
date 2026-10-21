import assert from 'node:assert/strict';
import { parse } from '@babel/parser';
function canonicalNode(value) {
  if (Array.isArray(value)) return value.map(canonicalNode);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) if (!['start', 'end', 'loc', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(key)) result[key] = canonicalNode(item);
  if (result.type === 'TSUnionType') result.types.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return result;
}
/** Compare displayed type structure, preserving the compiler's explicit truncation marker. */
export function canonicalTypeDisplay(text) {
  // A display placeholder remains a placeholder; this does not expand anonymous types.
  const source = text.replaceAll('{ ...; }', '{ __compiler_display_truncated__: unknown; }');
  try {
    return JSON.stringify(canonicalNode(parse('type Comparison = ' + source, {
      sourceType: 'module',
      plugins: ['typescript']
    }).program.body[0].typeAnnotation));
  } catch {
    return text;
  }
}
export function compareApiFacts(before, after) {
  assert.equal(after.exports.length, before.exports.length, 'export membership');
  let props = 0,
    displayOrderChanges = 0;
  for (let i = 0; i < before.exports.length; i++) {
    const old = before.exports[i],
      next = after.exports[i];
    assert.equal(next.name, old.name, 'export order');
    for (const key of Object.keys(old)) if (!['props', 'signature'].includes(key)) assert.deepEqual(next[key], old[key], old.name + ' ' + key);
    assert.equal(canonicalTypeDisplay(next.signature), canonicalTypeDisplay(old.signature), old.name + ' signature');
    assert.equal(next.props.length, old.props.length, old.name + ' prop membership');
    for (let j = 0; j < old.props.length; j++) {
      const a = before.propDefinitions[old.props[j].definition],
        b = after.propDefinitions[next.props[j].definition];
      for (const key of Object.keys(a)) if (key !== 'type') assert.deepEqual(b[key], a[key], old.name + '.' + a.name + ' ' + key);
      assert.equal(canonicalTypeDisplay(b.type), canonicalTypeDisplay(a.type), old.name + '.' + a.name + ' type display');
      props++;
      if (a.type !== b.type) displayOrderChanges++;
    }
  }
  return {
    exports: before.exports.length,
    props,
    displayOrderChanges,
    scope: 'All export/prop facts, authored/inherited origin, optionality, documentation and displayed type/signature structure. Only union ordering is normalized; anonymous display truncation remains an explicit boundary. Full declarations and compiler diagnostics remain authoritative.'
  };
}
