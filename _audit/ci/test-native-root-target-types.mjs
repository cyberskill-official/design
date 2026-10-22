import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
const inventory = JSON.parse(readFileSync('_audit/remediation/native-root-targets.json', 'utf8'));
const temp = mkdtempSync(join(tmpdir(), 'cs-native-root-types-'));
try {
  const lines = ['import type * as React from "react";'];
  for (const [i, target] of inventory.remediatedTargets.entries()) {
    const dts = resolve(target.source.replace(/\.jsx$/, ''));
    // Derive the precise target bag through the public component signature, including generic tables.
    lines.push(`import { ${target.name} } from ${JSON.stringify(dts)};`);
    lines.push(`type P${i} = NonNullable<Parameters<typeof ${target.name}>[0]["rootProps"]>;`);
    lines.push(`const valid${i}: P${i} = { id: "id", "data-consumer": "yes", style: { color: "red" }, onPointerDown: e => { const node: HTMLElement = e.currentTarget; void node; } };`);
    for (const bad of ['children', 'dangerouslySetInnerHTML', 'ref', ...(target.protected || []).filter(k => k !== 'style')]) {
      const value = bad === 'ref' ? '() => {}' : bad === 'dangerouslySetInnerHTML' ? '{ __html: "bad" }' : '"invalid"';
      lines.push(`// @ts-expect-error ${target.name} owns/excludes ${bad}\nconst bad${i}_${lines.length}: P${i} = { ${JSON.stringify(bad)}: ${value} };`);
    }
  }
  const fixture = join(temp, 'consumer.ts');
  writeFileSync(fixture, lines.join('\n'));
  for (const major of [18, 19]) {
    const folder = major === 18 ? '@types/react18' : '@types/react';
    const config = join(temp, 'tsconfig.json');
    writeFileSync(config, JSON.stringify({ compilerOptions: { strict: true, noEmit: true, skipLibCheck: false,
      target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', types: [],
      paths: { react: [resolve('node_modules/' + folder + '/index.d.ts')], 'react/*': [resolve('node_modules/' + folder + '/*')] } }, files: [fixture] }));
    const result = spawnSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), '-p', config, '--pretty', 'false'], { encoding: 'utf8' });
    assert.equal(result.status, 0, `React ${major} native root contracts:\n${result.stdout}\n${result.stderr}`);
  }
} finally { rmSync(temp, { recursive: true, force: true }); }
console.log(`PASS native root types: ${inventory.remediatedTargets.length} public component bags, React18/19, attributes accepted and owned semantics/ref/content rejected`);
