// Compile the entire public declaration surface and consumer JSX against both
// supported React type majors. Syntax/regex presence checks cannot replace this.
import { readdirSync, mkdtempSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
function declarations(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = join(dir, entry.name);
    return entry.isDirectory() ? declarations(p) : p.endsWith('.d.ts') ? [p] : [];
  });
}
const packed = mkdtempSync(join(tmpdir(), 'cs-packed-types-'));
try {
const pack = JSON.parse(execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packed], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
const packageDir = join(packed, 'node_modules/@cyberskill/design');
mkdirSync(packageDir, { recursive: true });
execFileSync('tar', ['-xzf', join(packed, pack[0].filename), '-C', packageDir, '--strip-components=1']);
const consumer = join(packed, 'consumer.tsx');
copyFileSync(resolve(root, '_audit/ci/fixtures/types-consumer.tsx'), consumer);
const files = [...declarations(resolve(packageDir, 'components')), resolve(packageDir, '_esm/react.d.ts'), consumer];
for (const [major, folder] of [[18,'@types/react18'],[19,'@types/react']]) {
  const options = {
    noEmit: true, strict: true, skipLibCheck: false,
    target: 'ES2022', module: 'ESNext',
    moduleResolution: 'Bundler', jsx: 'react-jsx',
    types: [], lib: ['ES2022','DOM','DOM.Iterable'],
    paths: {
      react: [resolve(root, `node_modules/${folder}/index.d.ts`)],
      'react/*': [resolve(root, `node_modules/${folder}/*`)],
    },
  };
  const dir = mkdtempSync(join(tmpdir(), 'cs-types-'));
  try {
    const config = join(dir, 'tsconfig.json');
    writeFileSync(config, JSON.stringify({ compilerOptions: options, files }));
    const result = spawnSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', config, '--pretty', 'false'], { encoding: 'utf8' });
    if (result.status !== 0) {
      console.error(result.stdout, result.stderr);
      throw new Error(`React ${major}: declaration/consumer compilation failed`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`PASS packed public types: React ${major}, ${files.length} declaration/consumer roots, strict and skipLibCheck=false`);
}
} finally {
  rmSync(packed, { recursive: true, force: true });
}
