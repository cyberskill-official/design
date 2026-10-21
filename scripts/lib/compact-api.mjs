import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

/** A bounded discovery projection; declarations and the full index remain authoritative. */
export function compactApi(sourceBytes) {
  const api = JSON.parse(sourceBytes);
  assert.equal(api.schemaVersion, 1, 'Known complete API index required');
  assert(Array.isArray(api.exports) && api.exports.length, 'Nonempty complete export inventory required');
  const names = new Set();
  const definitions = {};
  const exports = api.exports.map(item => {
    assert(typeof item.name === 'string' && item.name && !names.has(item.name), 'Unique export identity required');
    names.add(item.name);
    assert(['component', 'constant', 'hook'].includes(item.kind), 'Known export kind required');
    for (const [kind, path] of Object.entries({ source: item.sourcePath, declaration: item.declarationPath, prompt: item.promptPath }).filter(([, value]) => value !== null)) {
      assert(typeof path === 'string' && (path.startsWith('components/') || kind === 'declaration' && path === '_esm/react.d.ts') && !path.split('/').some(part => ['', '.', '..'].includes(part)) && !path.includes('\\'), 'Bounded component reference required');
    }
    assert(Array.isArray(item.props), 'Complete prop inventory required');
    const propNames = new Set();
    const authored = [];
    let inheritedPropCount = 0;
    for (const prop of item.props) {
      assert(!propNames.has(prop.name), 'Duplicate component prop');
      propNames.add(prop.name);
      const definition = api.propDefinitions[prop.definition];
      assert(definition && definition.name === prop.name, 'Exact prop definition reference required');
      assert(['authored', 'inherited'].includes(definition.origin), 'Known prop origin required');
      if (definition.origin === 'inherited') inheritedPropCount++;
      else {
        assert(typeof definition.type === 'string' && typeof definition.optional === 'boolean', 'Typed authored definition required');
        definitions[prop.definition] = definition;
        authored.push(prop);
      }
    }
    return {
      name: item.name, kind: item.kind,
      sourcePath: item.sourcePath, declarationPath: item.declarationPath, promptPath: item.promptPath,
      sourceSha256: item.sourceSha256, declarationSha256: item.declarationSha256,
      declaredLifecycle: item.declaredLifecycle,
      supportReviewState: item.support.reviewState,
      authoredProps: authored, inheritedPropCount,
    };
  });
  return {
    schemaVersion: 1,
    interpretation: 'Discovery projection: every public export and authored prop definition, with inherited prop counts. Inherited native props, full signatures, support evidence/history and compiler metadata remain in components/api-index.json. Declarations remain authoritative; this projection does not establish runtime, semantic or human acceptance.',
    completeIndex: { path: 'components/api-index.json', sha256: createHash('sha256').update(sourceBytes).digest('hex') },
    exports, propDefinitions: definitions,
  };
}
