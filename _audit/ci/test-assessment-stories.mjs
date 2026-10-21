import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import { listStoryFiles } from './storybook-inventory.mjs';
let checked = 0;
for (const file of listStoryFiles()) {
  const text = readFileSync(file, 'utf8');
  if (!text.includes("../components/")) continue;
  assert(!/Host Live CSF/.test(text), `${file}: hosting boilerplate must not replace component documentation`);
  assert(!/["']?on[A-Z]\w*["']?\s*:\s*\{\s*["']?control["']?\s*:\s*["']text["']/.test(text), `${file}: callback must not be an editable string`);
  const ast = parse(text, { sourceType: 'module', plugins: ['jsx'] });
  const declaration = ast.program.body.find(n => n.type === 'ExportNamedDeclaration' && n.declaration?.declarations?.some(d => d.id.name === 'Default'))?.declaration.declarations.find(d => d.id.name === 'Default');
  const render = declaration?.init?.properties?.find(p => p.key?.name === 'render')?.value;
  if (render) {
    assert.equal((render.params?.[0]?.name ?? render.params?.[0]?.left?.name), 'args', `${file}: Default renderer must accept args`);
    assert(text.slice(render.start, render.end).includes('{...args}'), `${file}: Default renderer must pass args to the component`);
  }
  checked++;
}
for (const [file, name] of [['Form', 'FormWizard'], ['Form', 'FormFieldArray'], ['Tabs', 'Tab']]) {
  assert(new RegExp('<' + name + '\\b').test(readFileSync(`stories/${file}.stories.jsx`, 'utf8')), `${name} must mount in a story`);
}
console.log(`PASS assessment story regressions: ${checked} component story files`);
