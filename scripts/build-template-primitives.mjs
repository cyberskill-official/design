#!/usr/bin/env node
/** Reproducible local runtime artifacts. This records origin, not rights approval. */
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, existsSync, lstatSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';
import {syncTemplateRuntimes} from './sync-support-runtime.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
assert(process.argv.slice(2).every(x => x === '--check'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sources = {'support.js':'templates/_vendor/support.js','deck-stage.js':'templates/_vendor/deck-stage.js','image-slot.js':'image-slot.js'};
const entries = Object.entries(sources).map(([name, output]) => {
  const input = 'scripts/template-runtime/primitives/' + name;
  assert(!lstatSync(join(root,input)).isSymbolicLink());
  const source = readFileSync(join(root,input));
  new Script(source.toString(), {filename:input});
  const bytes = Buffer.from('// Generated from ' + input + ' by scripts/build-template-primitives.mjs.\n' + source.toString());
  return {input, output, inputSha256:hash(source), outputSha256:hash(bytes), bytes};
});
for (const row of entries) {
  if (check) assert(existsSync(join(root,row.output)) && readFileSync(join(root,row.output)).equals(row.bytes), 'Stale authored runtime artifact: '+row.output);
  else {
    assert(!lstatSync(join(root,row.output)).isSymbolicLink());
    writeFileSync(join(root,row.output),row.bytes);
  }
}
console.log(JSON.stringify({entries:entries.length,...syncTemplateRuntimes(root,{check})}));
