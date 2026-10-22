import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, join, posix, sep } from 'node:path';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import * as cssTree from 'css-tree';
export const componentCssFoundation = Object.freeze(['base/reset.css', 'base/typography.css', 'base/glass.css', 'base/interaction.css', 'base/a11y.css', 'base/responsive.css']);
export const sourceSha = text => createHash('sha256').update(text).digest('hex');
export function componentCssReader(root) {
  const absoluteRoot = realpathSync(resolve(root));
  const inputs = new Map();
  function read(path) {
    assert(typeof path === 'string' && /^[A-Za-z0-9_.\/-]+$/.test(path) && path === posix.normalize(path) && !posix.isAbsolute(path) && !path.split('/').some(part => part === '..' || part === '.'), 'Unsafe component CSS input path');
    let absolute = absoluteRoot;
    for (const part of path.split('/')) {
      absolute = join(absolute, part);
      assert(!lstatSync(absolute).isSymbolicLink(), 'Component CSS source symlink: ' + path);
    }
    assert(lstatSync(absolute).isFile(), 'Component CSS input is not a file: ' + path);
    assert(realpathSync(absolute).startsWith(absoluteRoot + sep), 'Component CSS source escapes root');
    const bytes = readFileSync(absolute);
    inputs.set(path, sourceSha(bytes));
    return bytes.toString('utf8');
  }
  return {
    root: absoluteRoot,
    read,
    inputs
  };
}
function classNames(selector) {
  const names = new Set();
  const ast = cssTree.parse(selector, {
    context: 'selectorList'
  });
  cssTree.walk(ast, node => {
    if (node.type === 'ClassSelector' && node.name.startsWith('cs-')) names.add(node.name);
    if (node.type === 'Raw' && /\.cs-/.test(node.value)) {
      throw Error('Unclassified CSS class inside selector syntax: ' + selector);
    }
  });
  const lexical = [...selector.matchAll(/\.(cs-[\w-]+)/g)].map(match => match[1]);
  assert(lexical.every(name => names.has(name)), 'Selector class AST coverage drift: ' + selector);
  return names;
}
function hasUnscopedBranch(selector) {
  const list = cssTree.parse(selector, {
    context: 'selectorList'
  });
  // A positive cs-class anywhere in the selector chain bounds its applicability.
  // :not/:has alone do not: body:has(.cs-x) still styles the global body.
  function scoped(node) {
    let bounded = false;
    node.children?.forEach(child => {
      if (child.type === 'ClassSelector' && child.name.startsWith('cs-')) bounded = true;
      if (child.type === 'PseudoClassSelector' && ['is', 'where'].includes(child.name)) {
        const selectors = [];
        child.children?.forEach(list => list.children?.forEach(selector => selectors.push(selector)));
        if (selectors.length && selectors.every(scoped)) bounded = true;
      }
    });
    return bounded;
  }
  const branches = [];
  list.children.forEach(branch => branches.push(branch));
  return branches.some(branch => !scoped(branch));
}
function insideKeyframes(rule) {
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /^(?:-webkit-)?keyframes$/i.test(parent.name)) return true;
  }
  return false;
}
export function readComponentCssGraph(reader) {
  const entry = postcss.parse(reader.read('styles.css'));
  const order = [];
  entry.each(node => {
    if (node.type === 'comment') return;
    assert(node.type === 'atrule' && node.name === 'import', 'Root stylesheet must remain an import manifest');
    const parsed = valueParser(node.params).nodes;
    assert(parsed.length === 1 && parsed[0].type === 'function' && parsed[0].value === 'url', 'Unsupported stylesheet import');
    assert(parsed[0].nodes.length === 1 && parsed[0].nodes[0].type === 'string', 'Ambiguous stylesheet import');
    const path = parsed[0].nodes[0].value;
    assert(/^(?:tokens|base)\/[a-z0-9-]+\.css$/.test(path), 'Unowned stylesheet import');
    assert(!order.includes(path), 'Duplicate stylesheet import');
    order.push(path);
  });
  for (const path of componentCssFoundation) assert(order.includes(path), 'Missing shared CSS dependency: ' + path);
  const sheets = new Map();
  const assets = new Set();
  for (const path of order) {
    const text = reader.read(path);
    const tree = postcss.parse(text, {
      from: path
    });
    const sheet = {
      path,
      bytes: Buffer.byteLength(text),
      classes: new Set(),
      definitions: new Set(),
      references: new Set(),
      words: new Set(),
      keyframes: new Set(),
      globalSelectors: [],
      globalAtRules: []
    };
    tree.walkAtRules(rule => {
      assert(!['import', 'layer', 'charset', 'namespace'].includes(rule.name.toLowerCase()), 'Unmodeled nested stylesheet dependency in ' + path);
      if (!['media', 'supports', 'container', 'starting-style', 'scope', 'keyframes', '-webkit-keyframes'].includes(rule.name.toLowerCase())) sheet.globalAtRules.push('@' + rule.name);
      if (/^(?:-webkit-)?keyframes$/i.test(rule.name)) {
        assert(/^[A-Za-z_][\w-]*$/.test(rule.params), 'Unsupported keyframe identifier');
        sheet.keyframes.add(rule.params);
      }
    });
    tree.walkRules(rule => {
      if (insideKeyframes(rule)) return;
      const names = classNames(rule.selector);
      names.forEach(name => sheet.classes.add(name));
      if (hasUnscopedBranch(rule.selector)) sheet.globalSelectors.push(rule.selector);
    });
    tree.walkDecls(declaration => {
      if (declaration.prop.startsWith('--')) sheet.definitions.add(declaration.prop);
      valueParser(declaration.value).walk(node => {
        if (node.type === 'word' || node.type === 'string') sheet.words.add(node.value);
        if (node.type !== 'function') return;
        if (node.value.toLowerCase() === 'var') {
          const first = node.nodes.find(child => child.type !== 'space' && child.type !== 'comment');
          assert(first?.type === 'word' && /^--[\w-]+$/.test(first.value), 'Unsupported custom-property reference');
          sheet.references.add(first.value);
        }
        if (node.value.toLowerCase() !== 'url') return;
        assert(node.nodes.length === 1 && ['word', 'string'].includes(node.nodes[0].type), 'Ambiguous CSS asset reference');
        const url = node.nodes[0].value;
        if (url.startsWith('data:') || url.startsWith('#')) return;
        assert(!/^[a-z]+:|^\/|[?#\\\0]/i.test(url), 'External or unsafe stylesheet asset URL');
        const target = posix.normalize(posix.join(posix.dirname(path), url));
        assert(/^(?:fonts|assets)\/[A-Za-z0-9_./-]+$/.test(target) && !target.split('/').includes('..'), 'Stylesheet asset escapes source roots');
        reader.read(target);
        assets.add(target);
      });
    });
    sheets.set(path, sheet);
  }
  const shared = new Set(order.filter(path => path.startsWith('tokens/') || componentCssFoundation.includes(path)));
  const sharedReasons = [];
  for (const sheet of sheets.values()) {
    if (!shared.has(sheet.path) && (sheet.globalSelectors.length || sheet.globalAtRules.length)) {
      shared.add(sheet.path);
      sharedReasons.push({
        path: sheet.path,
        reason: 'Unscoped selector or global at-rule applies outside a component class',
        selectors: sheet.globalSelectors,
        atRules: sheet.globalAtRules
      });
    }
  }
  const definitions = new Map();
  const keyframes = new Map();
  const classes = new Map();
  for (const sheet of sheets.values()) {
    for (const [names, index] of [[sheet.definitions, definitions], [sheet.keyframes, keyframes], [sheet.classes, classes]]) {
      for (const name of names) {
        if (!index.has(name)) index.set(name, new Set());
        index.get(name).add(sheet.path);
      }
    }
  }
  function close(initial) {
    const selected = new Set([...shared, ...initial]);
    let changed = true;
    while (changed) {
      changed = false;
      const add = path => {
        if (!selected.has(path)) {
          selected.add(path);
          changed = true;
        }
      };
      for (const path of [...selected]) {
        const sheet = sheets.get(path);
        assert(sheet, 'Unknown CSS closure member');
        for (const name of sheet.references) for (const dependency of definitions.get(name) || []) add(dependency);
        for (const name of sheet.words) for (const dependency of keyframes.get(name) || []) add(dependency);
        // Whole optional sheets sharing classes stay together. Otherwise a
        // second component entry can reorder an earlier entry's override.
        if (!shared.has(path)) {
          for (const name of sheet.classes) {
            for (const dependency of classes.get(name) || []) if (!shared.has(dependency)) add(dependency);
          }
        }
      }
    }
    return order.filter(path => selected.has(path));
  }
  return {
    order,
    sheets,
    classes,
    shared,
    sharedReasons,
    assets: [...assets].sort(),
    close
  };
}
