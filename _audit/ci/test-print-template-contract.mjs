import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {listPrintTemplates} from './lib/print-template-contract.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
assert.equal(listPrintTemplates(root).length,62);
const temp=mkdtempSync(join(tmpdir(),'cs-print-contract-'));
try {
 cpSync(join(root,'templates'),join(temp,'templates'),{recursive:true});
 mkdirSync(join(temp,'_audit/fixtures'),{recursive:true});
 cpSync(join(root,'_audit/fixtures/print-template-contract.json'),join(temp,'_audit/fixtures/print-template-contract.json'));
 const path=join(temp,listPrintTemplates(temp)[0].entry),source=readFileSync(path,'utf8');
 for(const altered of [source.replace('omelette-owns-print','removed-print'),source.replace(/size:\s*(letter|A4)/i,'size: A3'),source.replace('<meta name="omelette-owns-print" content="1">','<!-- omelette-owns-print -->')]) {
   writeFileSync(path,altered);assert.throws(()=>listPrintTemplates(temp));
 }
 writeFileSync(path,source);writeFileSync(join(temp,'templates/extra.dc.html'),source);
 assert.throws(()=>listPrintTemplates(temp),/coverage/);
} finally {rmSync(temp,{recursive:true,force:true});}
console.log('PASS print coverage: 62 exact paths/page sizes; removed marker, comment-only marker, unsupported size and unlisted export rejected');
