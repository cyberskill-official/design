import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from '@babel/parser';
const key = node => node?.name ?? node?.value;
function initializer(ast, name) {
  for (const statement of ast.program.body) {
    const declaration = statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement;
    if (declaration?.type === 'VariableDeclaration' && declaration.kind === 'const') for (const item of declaration.declarations) if (item.id.name === name) return item.init;
  }
  return null;
}
function literal(node) {
  if (!node) return null;
  if (['StringLiteral', 'NumericLiteral'].includes(node.type)) return node.value;
  if (node.type === 'ArrayExpression') return node.elements.map(literal);
  if (node.type === 'ObjectExpression') return Object.fromEntries(node.properties.map(p => {
    if (p.type !== 'ObjectProperty' || p.computed || p.shorthand) throw Error('Unsupported generated declaration-domain property');
    return [key(p.key), literal(p.value)];
  }));
  throw Error('Unsupported generated declaration-domain expression');
}
export function declaredDomainData(root) {
  const path = resolve(root, 'stories/declared-domains.mjs'),
    ast = parse(readFileSync(path, 'utf8'), {
      sourceType: 'module'
    }),
    hashes = literal(initializer(ast, 'DECLARED_DOMAIN_SOURCE_HASHES')),
    domains = literal(initializer(ast, 'DECLARED_DOMAINS'));
  if (!hashes || !domains) throw Error('Missing generated declaration-domain authority');
  for (const [path, expected] of Object.entries(hashes)) {
    if (resolve(root, path).startsWith(resolve(root) + '/') !== true) throw Error('Domain source escapes root');
    if (createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex') !== expected) throw Error('Declared story domains stale: ' + path);
  }
  return domains;
}
/** Resolve only a named import from the exact generated module; never execute CSF. */
export function resolveDeclaredOptions(node, story, root, seen = new Set()) {
  if (!node || seen.has(node)) return null;
  const next = new Set([...seen, node]);
  if (node.type === 'Identifier' && story.constants.has(node.name)) return resolveDeclaredOptions(story.constants.get(node.name), story, root, next);
  const names = [];
  let value = node;
  while (value?.type === 'MemberExpression') {
    if (value.computed && value.property.type !== 'StringLiteral') return null;
    names.unshift(key(value.property));
    value = value.object;
  }
  if (value?.type !== 'Identifier' || names.length !== 2) return null;
  const binding = story.imports.get(value.name);
  if (binding?.name !== 'DECLARED_DOMAINS' || binding.path !== './declared-domains.mjs') return null;
  const domains = declaredDomainData(root),
    values = domains[names[0]]?.[names[1]];
  if (!Array.isArray(values) || values.some(v => !['string', 'number'].includes(typeof v))) throw Error('Unknown declared story domain ' + names.join('.'));
  return values;
}
export function declaredOptionsFromSource(source, prop, root) {
  const ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx']
    }),
    constants = new Map(),
    imports = new Map();
  for (const statement of ast.program.body) {
    const declaration = statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement;
    if (declaration?.type === 'VariableDeclaration' && declaration.kind === 'const') for (const item of declaration.declarations) if (item.id.type === 'Identifier') constants.set(item.id.name, item.init);
    if (statement.type === 'ImportDeclaration') for (const item of statement.specifiers) if (item.type === 'ImportSpecifier') imports.set(item.local.name, {
      name: item.imported.name,
      path: statement.source.value
    });
  }
  const metadata = ast.program.body.find(n => n.type === 'ExportDefaultDeclaration')?.declaration;
  const argTypes = metadata?.properties?.find(p => key(p.key) === 'argTypes')?.value,
    attribute = argTypes?.properties?.find(p => key(p.key) === prop)?.value,
    node = attribute?.properties?.find(p => key(p.key) === 'options')?.value;
  return resolveDeclaredOptions(node, {
    constants,
    imports
  }, root);
}
