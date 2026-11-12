// Every docs page lives under one Next route, and Next attaches every Client Component that route can reach to every
// page. With plain imports that was all demos on all pages (about 770 KB gzip: charts and tables on the Kbd page).
// This turns `import { A, B } from '@/demos/x'` in MDX into <LazyDemo file="x" name="A" />, a client component that
// loads the demo's own chunk on demand, so a page fetches only the demos it renders.
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'acorn';

const DEMO_IMPORT = /import\s*\{([^}]+)\}\s*from\s*['"]@\/demos\/([^'"]+)['"];?/g;

export function remarkLazyDemos() {
  return (tree, vfile) => {
    tree.children.forEach((node, i) => {
      if (node.type !== 'mdxjsEsm' || !node.value.includes('@/demos/')) return;
      const el = `__el${i}`, lazy = `__LazyDemo${i}`; // one name per import block: blocks compile into one module
      const code = node.value.replace(DEMO_IMPORT, (_, names, file) => {
        // a lazy import fails in the browser, not in the build: check the file and each export here instead
        // the site root comes from the page's path, not import.meta.url: this module is compiled elsewhere
        const path = `${vfile.path.split('/content/')[0]}/demos/${file}.tsx`, src = existsSync(path) ? readFileSync(path, 'utf8') : null;
        if (src == null) throw new Error(`${vfile.path}: no demo file demos/${file}.tsx`);
        return names.split(',').map(n => n.trim()).filter(Boolean).map(n => {
          const [name, local = name] = n.split(/\s+as\s+/);
          if (!new RegExp(`export\\s+(function|const)\\s+${name}\\b`).test(src)) throw new Error(`${vfile.path}: demos/${file}.tsx has no export "${name}"`);
          return `const ${local} = props => ${el}(${lazy}, { ...props, file: ${JSON.stringify(file)}, name: ${JSON.stringify(name)} });`;
        }).join('\n');
      });
      node.value = `import { createElement as ${el} } from 'react';\nimport { LazyDemo as ${lazy} } from '@/components/lazy-demo';\n${code}`;
      node.data = { ...node.data, estree: parse(node.value, { ecmaVersion: 'latest', sourceType: 'module' }) };
    });
  };
}
