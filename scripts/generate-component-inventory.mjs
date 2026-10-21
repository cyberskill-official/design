import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {inventoryOutputs} from './lib/component-inventory.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFileSync(resolve(root,p),'utf8');
const check=process.argv.includes('--check');
for(const[path,text]of inventoryOutputs(JSON.parse(read('_ds_manifest.json')),read('README.md'),read('guidelines/atomic-view.html'))) {
  if(check){if(read(path)!==text)throw Error(`Stale catalog inventory: ${path}`)}else writeFileSync(resolve(root,path),text);
}
console.log(`PASS catalog component inventory ${check?'freshness':'generation'}: README groups/compositions and Atomic export bindings.`);
