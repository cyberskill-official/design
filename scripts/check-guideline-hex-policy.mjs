import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {checkGuidelineHexPolicy} from './lib/guideline-hex-policy.mjs';
const sources=readdirSync('guidelines').filter(x=>x.endsWith('.html')).sort().map(file=>['guidelines/'+file,readFileSync('guidelines/'+file,'utf8')]),result=checkGuidelineHexPolicy(sources,JSON.parse(readFileSync('scripts/guideline-hex-policy.json')));assert(result.pass,JSON.stringify(result.problems,null,2));console.log(`PASS guideline hex policy: ${result.files} authored pages,${result.contexts} exact contexts/${result.literals} literals; unknown/changed/duplicated/stale colors rejected.`);
