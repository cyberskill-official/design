// Both language entries come from one model and the same token/inventory inputs.
// The generation stamp is source-derived, never the wall clock.
import {readFileSync, writeFileSync, lstatSync, mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDesignMd} from './design-md-lib.mjs';

function safePath(root, path, {missing = false} = {}) {
  let current = root;
  for (const part of path.split('/')) {
    current = join(current, part);
    try {
      if (lstatSync(current).isSymbolicLink()) throw Error('DESIGN language path must not be a symlink: ' + path);
    } catch (error) {
      if (!(missing && error.code === 'ENOENT')) throw error;
    }
  }
  return current;
}
export function generateDesignMd(root, {check = false} = {}) {
  const read = path => readFileSync(safePath(root, path), 'utf8');
  const dtcg = JSON.parse(read('tokens/tokens.dtcg.json'));
  const manifest = JSON.parse(read('_ds_manifest.json'));
  const version = read('VERSION').trim();
  const outputs = [
    {path: 'DESIGN.md', language: 'en'},
    {path: 'docs/vi/entrypoints/DESIGN.md', language: 'vi'},
  ].map(row => {
    const path = safePath(root, row.path, {missing: true});
    const output = buildDesignMd({dtcg, manifest, version, language: row.language});
    let current;
    try {current = readFileSync(path, 'utf8');} catch (error) {if (error.code !== 'ENOENT') throw error;}
    return {...row, path, output, current};
  });
  const changed = outputs.filter(row => row.output !== row.current);
  if (check && changed.length) throw Error('DESIGN language entries are stale or hand-edited: ' + changed.map(row => row.language).join(', ') + '; run npm run build:design-md');
  // All inputs, both complete projections and every output path are validated first.
  if (!check) for (const row of changed) {
    mkdirSync(dirname(row.path), {recursive: true});
    writeFileSync(row.path, row.output);
  }
  return {entries: outputs.length, changed: changed.length, version, templates: manifest.templates.length, exports: manifest.components.length};
}
const cli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (cli) {
  const args = process.argv.slice(2), rootAt = args.indexOf('--root');
  const root = rootAt === -1 ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : resolve(args[rootAt + 1]);
  console.log(JSON.stringify(generateDesignMd(root, {check: args.includes('--check')})));
}
