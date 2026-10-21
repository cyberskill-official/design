import assert from 'node:assert/strict';
import { posix } from 'node:path';
import { parse } from '@babel/parser';
import { sourceSha } from './component-css-graph.mjs';

// Reviewed class-flow boundaries, not general permission to trust helper calls.
// Any byte drift makes the affected component use the full stylesheet.
const reviewedHelpers = {
  'components/_utils/field-association.js': '692c40e3e1be1c0a0357e01b94c082235f9b98007374860f8721c2f5b74ef109',
  'components/_utils/use-overlay-surface.js': '3e73a204593bbb650af05a72d8de864f2eab39cf11657191e544c4ab403f6908'
};
function reviewed(module) {
  return sourceSha(module.source) === reviewedHelpers[module.path];
}
function walk(node, visit, parent = null) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach(child => walk(child, visit, parent));
    return;
  }
  if (typeof node.type !== 'string') return;
  visit(node, parent);
  for (const [key, child] of Object.entries(node)) {
    if (!['loc', 'extra', 'start', 'end', 'comments', 'tokens'].includes(key)) walk(child, visit, node);
  }
}
function propertyName(node) {
  return node?.type === 'Identifier' ? node.name : node?.type === 'StringLiteral' ? node.value : null;
}
function constantString(node) {
  if (node?.type === 'StringLiteral') return node.value;
  if (node?.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
  if (node?.type === 'BinaryExpression' && node.operator === '+') {
    const left = constantString(node.left),
      right = constantString(node.right);
    if (left !== null && right !== null) return left + right;
  }
  return null;
}
function localPath(owner, specifier) {
  const path = posix.normalize(posix.join(posix.dirname(owner), specifier));
  assert(/^(?:components\/[A-Za-z0-9_/-]+\.(?:jsx|js|json)|tokens\/tokens\.js)$/.test(path), 'Unowned local component import: ' + specifier);
  return path;
}
function hookCandidates(text) {
  return [...text.matchAll(/(?:^|[^\w-])(cs-(?:[A-Za-z][\w-]*)?)/g)].map(match => match[1]);
}
function cxContract(module) {
  const fn = module.functions.get('cx');
  if (!fn || fn.async || fn.generator || fn.params.length !== 1 || fn.params[0].type !== 'RestElement') return false;
  const expression = fn.body?.body?.length === 1 ? fn.body.body[0].argument : null;
  const filtered = expression?.callee?.object;
  return expression?.type === 'CallExpression' && expression.arguments.length === 1 && propertyName(expression.callee?.property) === 'join' && constantString(expression.arguments[0]) === ' ' && filtered?.type === 'CallExpression' && propertyName(filtered.callee?.property) === 'filter' && filtered.arguments.length === 1 && filtered.arguments[0]?.name === 'Boolean' && filtered.callee?.object?.name === fn.params[0].argument.name;
}
export function componentSourceAnalysis(reader, graph) {
  const modules = new Map();
  function load(path) {
    if (modules.has(path)) return modules.get(path);
    const source = reader.read(path);
    const module = {
      path,
      source,
      imports: new Map(),
      dependencies: new Set(),
      hooks: new Set(),
      bindings: new Map(),
      functions: new Map(),
      callerBindings: new Set(),
      targets: [],
      importFallbacks: [],
      externalInputs: [],
      callerRestEdges: []
    };
    modules.set(path, module);
    if (path.endsWith('.json')) {
      const visit = value => {
        if (typeof value === 'string') hookCandidates(value).forEach(hook => module.hooks.add(hook));else if (Array.isArray(value)) value.forEach(visit);else if (value && typeof value === 'object') Object.values(value).forEach(visit);
      };
      visit(JSON.parse(source));
      return module;
    }
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    module.ast = ast;
    walk(ast, (node, parent) => {
      const text = constantString(node);
      if (text !== null) hookCandidates(text).forEach(hook => module.hooks.add(hook));
      if (node.type === 'TemplateElement') hookCandidates(node.value.cooked || '').forEach(hook => module.hooks.add(hook));
      if (node.type === 'ImportExpression' || node.type === 'CallExpression' && node.callee.type === 'Import') {
        module.importFallbacks.push({
          sourcePath: path,
          reason: 'Dynamic import requires explicit full stylesheet coverage',
          start: node.start,
          end: node.end
        });
      }
      if (node.type === 'VariableDeclarator' && node.id.type === 'ObjectPattern' && node.init?.type === 'Identifier') {
        for (const property of node.id.properties) if (property.type === 'RestElement' && property.argument.type === 'Identifier') module.callerRestEdges.push([node.init.name, property.argument.name]);
      }
      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.init) {
        if (!module.bindings.has(node.id.name)) module.bindings.set(node.id.name, []);
        module.bindings.get(node.id.name).push(node.init);
        if (['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init.type)) module.functions.set(node.id.name, node.init);
      }
      if (node.type === 'FunctionDeclaration' && node.id) module.functions.set(node.id.name, node);
      if (node.type === 'ObjectPattern' && ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(parent?.type) && parent.params.includes(node)) {
        for (const property of node.properties) {
          if (property.type === 'RestElement' && property.argument.type === 'Identifier') module.callerBindings.add(property.argument.name);
          if (property.type === 'ObjectProperty') {
            const binding = property.value.type === 'AssignmentPattern' ? property.value.left : property.value;
            if (binding.type === 'Identifier' && /^(?:className|.*Props)$/.test(propertyName(property.key) || '')) module.callerBindings.add(binding.name);
          }
        }
      }
      if (node.type === 'JSXAttribute' && ['className', 'class', 'dangerouslySetInnerHTML'].includes(node.name.name)) {
        module.targets.push(node.value?.type === 'JSXExpressionContainer' ? node.value.expression : node.value);
      }
      if (node.type === 'ObjectProperty' && ['className', 'class', 'dangerouslySetInnerHTML', '__html'].includes(propertyName(node.key))) module.targets.push(node.value);
      if (node.type === 'AssignmentExpression' && (['className', 'innerHTML', 'outerHTML'].includes(propertyName(node.left?.property)) || propertyName(node.left?.property) === 'value' && propertyName(node.left?.object?.property) === 'classList')) module.targets.push(node.right);
      if (['ObjectMethod', 'ClassMethod'].includes(node.type) && propertyName(node.key) === 'className') module.targets.push(node);
      if (node.type === 'JSXSpreadAttribute') module.targets.push({
        type: 'CssAttributeSpread',
        argument: node.argument,
        start: node.start,
        end: node.end
      });
      if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression') {
        const method = propertyName(node.callee.property);
        if (node.callee.object.type === 'Identifier' && node.callee.object.name === 'React' && ['createElement', 'cloneElement'].includes(method)) module.targets.push({
          type: 'CssAttributeSpread',
          argument: node.arguments[1],
          start: node.start,
          end: node.end
        });
        if (propertyName(node.callee.object?.property) === 'classList') {
          module.targets.push(...(method === 'toggle' ? node.arguments.slice(0, 1) : node.arguments));
        }
        if (method === 'setAttribute' && constantString(node.arguments[0]) === 'class') module.targets.push(node.arguments[1]);
        if (method === 'setAttributeNS' && constantString(node.arguments[1]) === 'class') module.targets.push(node.arguments[2]);
        if (method === 'insertAdjacentHTML') module.targets.push(node.arguments[1]);
      }
    });
    let addedCallerBinding = true;
    while (addedCallerBinding) {
      addedCallerBinding = false;
      for (const [origin, target] of module.callerRestEdges) {
        if (module.callerBindings.has(origin) && !module.callerBindings.has(target)) {
          module.callerBindings.add(target);
          addedCallerBinding = true;
        }
      }
    }
    for (const declaration of ast.program.body) {
      if (!['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(declaration.type) || !declaration.source) continue;
      const specifier = declaration.source.value;
      if (!specifier.startsWith('.')) {
        if (!['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'].includes(specifier)) {
          module.importFallbacks.push({
            sourcePath: path,
            reason: 'External authored import may construct repository classes',
            specifier
          });
        }
        continue;
      }
      const target = localPath(path, specifier);
      module.dependencies.add(target);
      for (const binding of declaration.specifiers || []) {
        if (binding.local) module.imports.set(binding.local.name, {
          path: target,
          name: binding.imported?.name || 'default'
        });
      }
      load(target);
    }
    return module;
  }
  function analyze(owner) {
    const root = load(owner),
      closure = new Set(),
      fallbacks = [],
      externalInputs = [];
    function include(module) {
      if (closure.has(module.path)) return;
      closure.add(module.path);
      fallbacks.push(...module.importFallbacks);
      for (const dependency of module.dependencies) include(load(dependency));
    }
    include(root);
    const hooks = new Set(),
      dynamicPrefixes = new Set();
    for (const path of closure) {
      for (const candidate of load(path).hooks) {
        if (candidate === 'cs-') {
          fallbacks.push({
            sourcePath: path,
            reason: 'Unbounded authored cs- class prefix'
          });
          continue;
        }
        const base = candidate.replace(/-+$/, '');
        hooks.add(base);
        for (const name of graph.classes.keys()) {
          if (name === base || name.startsWith(base + '-') || name.startsWith(base + '__')) hooks.add(name);
        }
        if (base !== candidate) dynamicPrefixes.add(candidate);
      }
    }
    function check(node, module, seen = new Set()) {
      if (!node) return true;
      if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral', 'NullLiteral'].includes(node.type)) return true;
      if (node.type === 'Identifier') {
        if (['undefined', 'null'].includes(node.name)) return true;
        const key = module.path + ':' + node.name;
        if (seen.has(key)) return false;
        const bindings = module.bindings.get(node.name);
        if (bindings) return bindings.every(binding => check(binding, module, new Set([...seen, key])));
        if (module.callerBindings.has(node.name)) {
          externalInputs.push({
            sourcePath: module.path,
            binding: node.name,
            boundary: 'Caller class/attribute composition requires its own entry or ordered union'
          });
          return true;
        }
        return false;
      }
      if (node.type === 'ConditionalExpression') return check(node.consequent, module, seen) && check(node.alternate, module, seen);
      if (node.type === 'LogicalExpression') return (node.operator === '&&' || check(node.left, module, seen)) && check(node.right, module, seen);
      if (node.type === 'TemplateLiteral') {
        return node.expressions.every((expression, index) => {
          const before = node.quasis[index].value.cooked || '';
          if (/(?:cs-[A-Za-z][\w-]*|is-|has-)$/.test(before) && !/\s$/.test(before)) return true;
          return check(expression, module, seen);
        });
      }
      if (node.type === 'BinaryExpression' && node.operator === '+') {
        const prefix = constantString(node.left);
        if (prefix !== null && /(?:cs-[A-Za-z][\w-]*|is-|has-)$/.test(prefix)) return true;
        return check(node.left, module, seen) && check(node.right, module, seen);
      }
      if (node.type === 'ArrayExpression') return node.elements.every(element => check(element, module, seen));
      if (node.type === 'ObjectExpression') {
        return node.properties.every(property => {
          if (property.type === 'SpreadElement') return check(property.argument, module, seen);
          if (property.type !== 'ObjectProperty' || property.computed) return false;
          return !['className', 'class', 'dangerouslySetInnerHTML', '__html'].includes(propertyName(property.key)) || check(property.value, module, seen);
        });
      }
      if (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression') {
        if (propertyName(node.property) === 'className') {
          externalInputs.push({
            sourcePath: module.path,
            expression: module.source.slice(node.start, node.end),
            boundary: 'Read/copied/composed className; caller composition remains explicit'
          });
          return true;
        }
        return check(node.object, module, seen);
      }
      if (node.type === 'CallExpression') {
        if (node.callee.type === 'Identifier') {
          const imported = module.imports.get(node.callee.name);
          if (imported?.name === 'cx' && imported.path === 'components/_utils/cx.js' && cxContract(load(imported.path))) {
            return node.arguments.every(argument => check(argument, module, seen));
          }
          if (node.callee.name === 'String') return node.arguments.length === 1 && check(node.arguments[0], module, seen);
          if (imported && reviewed(load(imported.path)) && imported.path === 'components/_utils/use-overlay-surface.js' && imported.name === 'overlaySurfaceClass') return true;
          if (imported?.name === 'useFieldAssociation' && imported.path === 'components/_utils/field-association.js' && reviewed(load(imported.path))) return check(node.arguments[0], module, seen);
          if (imported?.name === 'mergeTargetProps' && imported.path === 'components/_utils/field-association.js' && reviewed(load(imported.path))) {
            // Its owned className writes are independently checked below; the
            // arbitrary attribute keys originate in the documented caller API.
            return check(node.arguments[0], module, seen);
          }
        }
        if (node.callee.type === 'MemberExpression' && ['find', 'filter', 'join'].includes(propertyName(node.callee.property))) {
          return check(node.callee.object, module, seen);
        }
        return false;
      }
      if (node.type === 'CssAttributeSpread') {
        if (!node.argument) return true;
        if (node.argument.type === 'Identifier' && module.callerBindings.has(node.argument.name)) return true;
        if (node.argument.type === 'MemberExpression' && /Props$/.test(propertyName(node.argument.property) || '')) return true;
        return check(node.argument, module, seen);
      }
      return false;
    }
    for (const path of closure) {
      const module = load(path);
      for (const target of module.targets) {
        // This exact reviewed merger joins the authored base class and the
        // caller's extra.className. Both class-flow edges are explicit above.
        if (reviewed(module) && module.path === 'components/_utils/field-association.js' && module.source.slice(target.start, target.end) === '[base.className, value].filter(Boolean).join(" ")') continue;
        if (!check(target, module)) {
          fallbacks.push({
            sourcePath: path,
            reason: 'Unresolved owned class or attribute construction',
            nodeType: target?.type || 'unknown',
            start: target?.start ?? null,
            end: target?.end ?? null,
            expression: target ? module.source.slice(target.start, target.end).slice(0, 180) : ''
          });
        }
      }
    }
    const unique = rows => [...new Map(rows.map(row => [JSON.stringify(row), row])).values()];
    return {
      sourceImports: [...closure].sort(),
      hooks: [...hooks].sort(),
      dynamicPrefixes: [...dynamicPrefixes].sort(),
      fallbacks: unique(fallbacks),
      externalInputs: unique(externalInputs)
    };
  }
  return {
    analyze,
    modules
  };
}
