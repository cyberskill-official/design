import {readFile} from 'node:fs/promises';
import {validateDtcgProfile} from '../lib/dtcg-profile.mjs';
const doc=JSON.parse(await readFile(new URL('../../tokens/tokens.dtcg.json',import.meta.url),'utf8'));
const report=validateDtcgProfile(doc);
console.log(JSON.stringify(report,null,2));
if(!report.pass)process.exitCode=1;
