/** Named assurance contracts only; this does not review every diagnostic sentence. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const suite=read('_audit/index.html'),board=read('_audit/run.html'),gate=read('_audit/a11y-harness.html'),theme=read('_audit/theme-overflow.html');
const selectorCount=[...gate.match(/const selectors=\[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].length;
const nameCount=Number(gate.match(/assert\(controls.length===(\d+)/)[1]);
function validate(suite,board){
 assert(suite.includes('Published diagnostic harnesses'));
 assert(!suite.includes('Not compiled, not shipped'));
 assert(!/REVIEWED_OK|tiered lower by design|every control keeps an accessible name/.test(suite));
 assert(suite.includes('for the '+selectorCount+' reviewed selectors'));
 assert(suite.includes(nameCount+' mounted fixture controls'));
 assert(suite.includes('All failures count; displayed details are capped'));
 assert(theme.includes('All failures count; only the displayed details are capped'));
 assert(board.includes('within their declared scopes'));
 assert(board.includes('It does not certify every rendered state'));
 assert(!board.includes('Green board = the system is internally consistent'));
}
validate(suite,board);
for(const [s,b]of [
 [suite.replace('Published diagnostic harnesses','Not compiled, not shipped'),board],
 [suite.replace('for the '+selectorCount+' reviewed selectors','for every control'),board],
 [suite.replace(nameCount+' mounted fixture controls','every control keeps an accessible name'),board],
 [suite.replace('All failures count; displayed details are capped','outside REVIEWED_OK'),board],
 [suite,board.replace('within their declared scopes','certifies every state')],
])assert.throws(()=>validate(s,b));
console.log(`PASS diagnostic assurance: published audience, ${selectorCount} source selectors, ${nameCount} naming fixtures, no contrast waiver, bounded board scope; five stale/overbroad counterfactuals rejected. Other claims and human acceptance remain separate.`);
