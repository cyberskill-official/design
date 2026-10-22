/** Strict source grammar shared by source contracts, rendered references and story coverage.
 * Only directly exported functions and an imported React.forwardRef(named function) are unwrapped.
 * Arbitrary higher-order calls are never executed or inferred as component implementations. */
export function exportedFunction(ast, name) {
  const exports = ast.program.body.filter(node => node.type === 'ExportNamedDeclaration');
  const direct = exports.find(node => node.declaration?.type === 'FunctionDeclaration' && node.declaration.id?.name === name)?.declaration;
  if (direct) return {node: direct, kind: 'direct'};
  const variables = exports.flatMap(node => node.declaration?.type === 'VariableDeclaration' ? node.declaration.declarations : []);
  const variable = variables.find(node => node.id.type === 'Identifier' && node.id.name === name);
  const call = variable?.init;
  if (call?.type !== 'CallExpression' || call.callee.type !== 'MemberExpression' || call.callee.computed || call.callee.property.name !== 'forwardRef') return null;
  const binding = call.callee.object;
  if (binding.type !== 'Identifier' || binding.name !== 'React') throw new Error(name + ': unsupported forwardRef namespace');
  const importedReact = ast.program.body.some(node => node.type === 'ImportDeclaration' && node.source.value === 'react' && node.specifiers.some(specifier => specifier.type === 'ImportDefaultSpecifier' && specifier.local.name === binding.name));
  if (!importedReact) throw new Error(name + ': forwardRef must resolve to the imported React namespace');
  const fn = call.arguments[0];
  if (call.arguments.length !== 1 || fn?.type !== 'FunctionExpression' || fn.id?.name !== name || fn.async || fn.generator || fn.params.length !== 2 || fn.params[1].type !== 'Identifier') throw new Error(name + ': unsupported forwardRef render declaration');
  return {node: fn, kind: 'forward-ref'};
}

/** Independent uppercase source census; explicit constant/hook membership remains elsewhere. */
export function sourceComponentFunctions(ast) {
  const names = ast.program.body.filter(node => node.type === 'ExportNamedDeclaration').flatMap(node => {
    if (node.declaration?.type === 'FunctionDeclaration') return [node.declaration.id.name];
    if (node.declaration?.type === 'VariableDeclaration') return node.declaration.declarations.filter(declaration => declaration.id.type === 'Identifier').map(declaration => declaration.id.name);
    return [];
  }).filter(name => /^[A-Z][A-Za-z0-9]*$/.test(name));
  return names.filter(name => exportedFunction(ast, name));
}
