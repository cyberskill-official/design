import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateEntrypointLanguages } from './lib/entrypoint-languages.mjs';
const args = process.argv.slice(2),
  at = args.indexOf('--root');
const root = at < 0 ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : resolve(args[at + 1]);
console.log(JSON.stringify(generateEntrypointLanguages(root, {
  check: args.includes('--check')
})));
