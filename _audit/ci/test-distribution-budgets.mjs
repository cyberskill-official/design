import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../',import.meta.url));
const budgets = JSON.parse(readFileSync(join(root,'scripts/distribution-budgets.json'),'utf8'));
const names = new Set();
for (const entry of budgets.files) {
  assert(!names.has(entry.path),'Duplicate budget '+entry.path); names.add(entry.path);
  assert(entry.path.startsWith('assets/') || ['_ds_bundle.js','_ds_bundle.js.map','dist/styles.min.css','tokens/variables.css'].includes(entry.path));
  const bytes = statSync(join(root,entry.path)).size;
  assert(Number.isSafeInteger(entry.maxBytes) && entry.maxBytes > 0);
  assert(bytes <= entry.maxBytes,`${entry.path}: ${bytes} bytes exceeds ${entry.maxBytes}; review growth rather than silently raising the limit`);
}
function walk(directory) {
  for (const entry of readdirSync(directory,{withFileTypes:true})) {
    const path = join(directory,entry.name);
    if (entry.isDirectory()) walk(path);
    else assert(names.has(relative(root,path).replaceAll('\\','/')),'Asset missing reviewed budget '+path);
  }
}
walk(join(root,'assets'));
console.log('PASS distribution budgets:',names.size,'artifact and asset ceilings; new assets require a reviewed budget');

const trees=new Set();
for(const entry of budgets.trees){
 assert(['dist/esm','tokens/modes'].includes(entry.path),'Unreviewed distribution tree');assert(!trees.has(entry.path),'Duplicate tree budget');trees.add(entry.path);
 let files=0,bytes=0;
 const visit=directory=>{for(const item of readdirSync(directory,{withFileTypes:true})){assert(!item.isSymbolicLink(),'Distribution tree cannot contain symlinks');const path=join(directory,item.name);if(item.isDirectory())visit(path);else{assert(item.isFile(),'Unsupported distribution artifact');files++;bytes+=statSync(path).size}}};
 visit(join(root,entry.path));assert(files>0,'Missing distribution artifacts');
 assert(Number.isSafeInteger(entry.maxFiles)&&entry.maxFiles>0);assert(Number.isSafeInteger(entry.maxBytes)&&entry.maxBytes>0);
 assert(files<=entry.maxFiles,entry.path+': file-count budget exceeded');assert(bytes<=entry.maxBytes,entry.path+': byte budget exceeded; review growth rather than raising limits');
 console.log('PASS distribution tree budget:',entry.path,{files,bytes,maxFiles:entry.maxFiles,maxBytes:entry.maxBytes});
}
assert.equal(trees.size,2,'Both compiled modules and standalone modes require budgets');
