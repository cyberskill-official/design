// Every docs page lives under one Next route, and Next attaches every Client Component that route can reach to every
// page. With plain imports that was all demos on all pages (about 770 KB gzip: charts and tables on the Kbd page).
// This turns `import { A, B } from '@/demos/x'` in MDX into <LazyDemo file="x" name="A" />, a client component that
// loads the demo's own chunk on demand, so a page fetches only the demos it renders.
import { parse } from 'acorn';

const DEMO_IMPORT = /import\s*\{([^}]+)\}\s*from\s*['"]@\/demos\/([^'"]+)['"];?/g;

export function remarkLazyDemos() {
  return tree => {
    tree.children.forEach((node, i) => {
      if (node.type !== 'mdxjsEsm' || !node.value.includes('@/demos/')) return;
      const el = `__el${i}`, lazy = `__LazyDemo${i}`; // one name per import block: blocks compile into one module
      const code = node.value.replace(DEMO_IMPORT, (_, names, file) =>
        names.split(',').map(n => n.trim()).filter(Boolean).map(n => `const ${n} = props => ${el}(${lazy}, { ...props, file: ${JSON.stringify(file)}, name: ${JSON.stringify(n)} });`).join('\n'));
      node.value = `import { createElement as ${el} } from 'react';\nimport { LazyDemo as ${lazy} } from '@/components/lazy-demo';\n${code}`;
      node.data = { ...node.data, estree: parse(node.value, { ecmaVersion: 'latest', sourceType: 'module' }) };
    });
  };
}
