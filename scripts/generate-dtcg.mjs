#!/usr/bin/env node
// Authored metadata supplies membership/types; CSS-facing JSON supplies values.
import {readFileSync,writeFileSync} from 'node:fs';
import {projectDtcg} from './lib/project-dtcg.mjs';
const root=new URL('../',import.meta.url),path=new URL('tokens/tokens.dtcg.json',root);
const read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const before=readFileSync(path,'utf8');
const {doc,report}=projectDtcg(JSON.parse(before),read('tokens/tokens.json'),read('tokens/base-inventory.json'));
const output=JSON.stringify(doc,null,2)+'\n';
if(process.argv.includes('--check')){
 if(output!==before){console.error('DTCG values or extension metadata are stale; run npm run tokens:dtcg');process.exitCode=1;}
 else console.log(`PASS DTCG generation freshness: ${report.leaves} typed values and exact CSS expressions`);
}else{writeFileSync(path,output);console.log(`Generated ${report.leaves} DTCG 2025.10 values`);}
