import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {collectTokenDeclarations} from './lib/token-declarations.mjs';
import {projectBaseTokens} from './lib/base-token-exports.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const tokens = projectBaseTokens(collectTokenDeclarations(fileURLToPath(root)), JSON.parse(read('tokens/tokens.json')));
const version = read('VERSION').trim();
const outputs = {
  'tokens/tokens.json': JSON.stringify(tokens, null, 2) + '\n',
  'tokens/tokens.js': `// CyberSkill design tokens — generated from tokens/*.css (v${version}). Do not edit by hand.\nexport const tokens = ${JSON.stringify(tokens, null, 2)};\nexport default tokens;\n`,
};
const stale = Object.keys(outputs).filter(path => read(path) !== outputs[path]);
if (process.argv.includes('--check')) {
  if (stale.length) throw Error('Stale base token exports: ' + stale.join(', '));
} else {
  for (const [path, text] of Object.entries(outputs)) writeFileSync(new URL(path, root), text);
}
console.log('PASS base export projection: all typed base values derive from unconditional CSS roots; exclusions explicit.');
