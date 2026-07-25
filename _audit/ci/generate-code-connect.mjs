#!/usr/bin/env node
/**
 * Generate Code Connect mapping files for every public primary.
 *
 * Reads `_ds_manifest.json` + `code-connect/node-map.json`.
 * Writes components/<group>/<Name>.figma.tsx (committed; re-run after adding a primary).
 *
 * High-traffic primaries (Button, TextField, Dialog, Card, Alert) get prop maps;
 * others get a minimal example so the publish path is complete for all primaries.
 *
 * URLs use placeholder file key `CS_FIGMA_FILE_KEY` — CI / local publish rewrites
 * via `documentUrlSubstitutions` in figma.config.json (see code-connect-publish.mjs).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PLACEHOLDER_KEY = 'CS_FIGMA_FILE_KEY';

/** @type {Record<string, (name: string) => string>} */
const DETAILED = {
  Button: (name) => `import figma from '@figma/code-connect'
import { ${name} } from './${name}.jsx'

/**
 * Code Connect — ${name}
 * Replace node-id in code-connect/node-map.json after publishing the Figma library component.
 */
figma.connect(${name}, 'https://www.figma.com/design/${PLACEHOLDER_KEY}/CyberSkill?node-id=__NODE__', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Tertiary: 'tertiary',
      Ghost: 'ghost',
      Danger: 'danger',
      'Danger Ghost': 'danger-ghost',
    }),
    size: figma.enum('Size', {
      XS: 'xs',
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
    }),
    loading: figma.boolean('Loading'),
    disabled: figma.boolean('Disabled'),
    fullWidth: figma.boolean('Full Width'),
    children: figma.string('Label'),
  },
  example: (props) => <${name} {...props} />,
  imports: ["import { ${name} } from '@cyberskill/design'"],
})
`,
  TextField: (name) => `import figma from '@figma/code-connect'
import { ${name} } from './${name}.jsx'

figma.connect(${name}, 'https://www.figma.com/design/${PLACEHOLDER_KEY}/CyberSkill?node-id=__NODE__', {
  props: {
    label: figma.string('Label'),
    description: figma.string('Description'),
    error: figma.string('Error'),
    disabled: figma.boolean('Disabled'),
    placeholder: figma.string('Placeholder'),
  },
  example: (props) => <${name} {...props} />,
  imports: ["import { ${name} } from '@cyberskill/design'"],
})
`,
  Dialog: (name) => `import figma from '@figma/code-connect'
import { ${name} } from './${name}.jsx'

figma.connect(${name}, 'https://www.figma.com/design/${PLACEHOLDER_KEY}/CyberSkill?node-id=__NODE__', {
  props: {
    open: figma.boolean('Open'),
    title: figma.string('Title'),
    children: figma.string('Body'),
  },
  example: (props) => <${name} {...props} />,
  imports: ["import { ${name} } from '@cyberskill/design'"],
})
`,
  Card: (name) => `import figma from '@figma/code-connect'
import { ${name} } from './${name}.jsx'

figma.connect(${name}, 'https://www.figma.com/design/${PLACEHOLDER_KEY}/CyberSkill?node-id=__NODE__', {
  props: {
    interactive: figma.boolean('Interactive'),
    flat: figma.boolean('Flat'),
    children: figma.string('Content'),
  },
  example: (props) => <${name} {...props} />,
  imports: ["import { ${name} } from '@cyberskill/design'"],
})
`,
  Alert: (name) => `import figma from '@figma/code-connect'
import { ${name} } from './${name}.jsx'

figma.connect(${name}, 'https://www.figma.com/design/${PLACEHOLDER_KEY}/CyberSkill?node-id=__NODE__', {
  props: {
    variant: figma.enum('Variant', {
      Info: 'info',
      Success: 'success',
      Warning: 'warning',
      Danger: 'danger',
    }),
    title: figma.string('Title'),
    children: figma.string('Body'),
  },
  example: (props) => <${name} {...props} />,
  imports: ["import { ${name} } from '@cyberskill/design'"],
})
`,
};

function stub(name) {
  return `import figma from '@figma/code-connect'
import { ${name} } from './${name}.jsx'

/**
 * Code Connect stub — ${name}
 * Prop maps stay minimal until the matching Figma library component is published;
 * then set nodeId in code-connect/node-map.json and re-run generate-code-connect.
 */
figma.connect(${name}, 'https://www.figma.com/design/${PLACEHOLDER_KEY}/CyberSkill?node-id=__NODE__', {
  example: () => <${name} />,
  imports: ["import { ${name} } from '@cyberskill/design'"],
})
`;
}

export function listPrimaries(manifest) {
  const out = [];
  for (const c of manifest.components || []) {
    if (String(c.name || '').startsWith('CS_')) continue;
    const sourcePath = c.sourcePath;
    if (!sourcePath || !sourcePath.endsWith('.jsx')) continue;
    const fileBase = sourcePath.split('/').pop().replace(/\.jsx$/, '');
    if (c.name !== fileBase) continue;
    const dts = join(root, sourcePath.replace(/\.jsx$/, '.d.ts'));
    if (!existsSync(dts)) continue;
    out.push({
      name: c.name,
      sourcePath,
      dir: dirname(sourcePath),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function figmaUrl(fileKey, nodeId) {
  const nid = String(nodeId || '0-1').replace(/:/g, '-');
  return `https://www.figma.com/design/${fileKey}/CyberSkill?node-id=${nid}`;
}

export function buildNodeMap(primaries, existing = {}) {
  const nodes = { ...(existing.nodes || {}) };
  let i = 1;
  for (const p of primaries) {
    if (!nodes[p.name]) {
      // Synthetic unique stubs — publish soft-skips 404 until real library nodeIds are set.
      nodes[p.name] = { nodeId: `9999:${i}`, published: false };
    }
    i += 1;
  }
  return {
    fileKeyPlaceholder: PLACEHOLDER_KEY,
    note: 'Set nodes.<Name>.nodeId to the Figma component node-id (colon or hyphen form) after publishing that component to the team library. Set published:true when live. CI substitutes FIGMA_FILE_KEY for CS_FIGMA_FILE_KEY.',
    nodes,
  };
}

export function renderConnectFile(name, nodeId) {
  const nid = String(nodeId || '0:1').replace(/:/g, '-');
  const tpl = DETAILED[name] ? DETAILED[name](name) : stub(name);
  return tpl.replace('__NODE__', nid);
}

function main() {
  const manifest = JSON.parse(readFileSync(join(root, '_ds_manifest.json'), 'utf8'));
  const primaries = listPrimaries(manifest);
  const mapPath = join(root, 'code-connect/node-map.json');
  let existing = {};
  if (existsSync(mapPath)) {
    existing = JSON.parse(readFileSync(mapPath, 'utf8'));
  }
  const map = buildNodeMap(primaries, existing);
  mkdirSync(dirname(mapPath), { recursive: true });
  writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n');

  let written = 0;
  for (const p of primaries) {
    const nodeId = map.nodes[p.name]?.nodeId || `9999:${written + 1}`;
    const body = renderConnectFile(p.name, nodeId);
    const out = join(root, p.dir, `${p.name}.figma.tsx`);
    writeFileSync(out, body);
    written += 1;
  }

  console.log(`generate-code-connect: ${written} mappings · node-map ${mapPath}`);
  return { written, primaries: primaries.length };
}

const invoked = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invoked) {
  main();
}
