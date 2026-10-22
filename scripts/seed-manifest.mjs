// Bootstrap a missing generated manifest; never erase a working derived tree.
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const root = new URL('../',import.meta.url), target = new URL('_ds_manifest.json',root);
if (!existsSync(target)) {
  const {description,...catalog}=JSON.parse(readFileSync(new URL('scripts/catalog-source.json',root),'utf8'));
  writeFileSync(target, JSON.stringify({...catalog,components:[],tokens:[],globalCssPaths:[],fonts:[]},null,2)+'\n');
  console.log('Seeded missing manifest from authored catalog; run the complete build before consumption');
}
