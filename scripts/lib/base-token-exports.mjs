import postcss from 'postcss';

// These CSS values remain in the declaration companion. They do not acquire a
// guessed portable type merely because they occur on :root.
export const baseExportExclusions = Object.freeze({
  '--cs-style-pack': 'style-pack identifier, not a portable typed value',
  '--cs-glass-whisper-bg': 'CSS material expression requires a surface/cascade adapter',
  '--cs-glass-whisper-border': 'CSS material declaration retained with its style context',
  '--cs-glass-light-bg': 'CSS material expression requires a surface/cascade adapter',
  '--cs-glass-light-border': 'CSS material expression requires a surface/cascade adapter',
  '--cs-glass-standard-bg': 'CSS material expression requires a surface/cascade adapter',
  '--cs-glass-standard-border': 'CSS material expression requires a surface/cascade adapter',
  '--cs-glass-heavy-bg': 'CSS material expression requires a surface/cascade adapter',
  '--cs-glass-heavy-border': 'CSS material expression requires a surface/cascade adapter',
});

export function projectBaseTokens(graph, inventory) {
  const source = new Map();
  for (const declaration of graph.declarations) {
    const [context] = declaration.context;
    if (declaration.visibility !== 'public' || declaration.context.length !== 1 ||
        context.kind !== 'rule' || !postcss.list.comma(context.selector).includes(':root')) continue;
    if (source.has(declaration.name)) throw Error('Ambiguous root token: ' + declaration.name);
    source.set(declaration.name, declaration.value);
  }
  const result = structuredClone(inventory);
  const names = new Set();
  for (const entries of Object.values(result.root)) for (const name of Object.keys(entries)) {
    if (names.has(name)) throw Error('Duplicate base inventory token: ' + name);
    if (Object.hasOwn(baseExportExclusions, name)) throw Error('Excluded token needs an explicit type-policy change: ' + name);
    if (!source.has(name)) throw Error('Missing unconditional root source: ' + name);
    names.add(name);
    entries[name] = source.get(name);
  }
  for (const name of source.keys()) {
    if (!names.has(name) && !Object.hasOwn(baseExportExclusions, name)) throw Error('Unclassified root token: ' + name);
  }
  for (const name of Object.keys(baseExportExclusions)) {
    if (!source.has(name)) throw Error('Stale base exclusion: ' + name);
  }
  return result;
}
