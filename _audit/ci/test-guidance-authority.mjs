import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {outputs} from '../../scripts/generate-guidance.mjs';
const root=new URL('../../',import.meta.url),read=path=>readFileSync(new URL(path,root),'utf8');
const gates=parse(read('.github/workflows/design-system-gates.yml'));
const runs=job=>job.steps.filter(step=>typeof step.run==='string').map(step=>step.run).join('\n');
const node=job=>String(job.steps.find(step=>step.uses?.startsWith('actions/setup-node@')).with['node-version']);
const pkg=JSON.parse(read('package.json'));
assert(runs(gates.jobs['storybook-build']).includes('npm run build:site'));
assert(runs(gates.jobs['storybook-build']).includes('npm run test:public-site'));
for(const name of ['regenerate-tokens','regenerate-tokens-push'])assert(runs(gates.jobs[name]).includes('npm run tokens:generate'));
assert(pkg.scripts['tokens:generate'].includes('npm run native:sync-tokens'));
assert(read('scripts/generate-react-entry.mjs').includes('writeFileSync(OUT_MJS, mjs)'));
assert(read('scripts/generate-export-catalog.mjs').includes("legacy.indexOf('export const VERSION =')"));
assert(read('.gitignore').includes('COMMITS its compiled artifacts'));
for(const [path, expected] of outputs(read)) assert.equal(read(path), expected, `Generated guidance authority: ${path}`);
const portable=JSON.parse(read('guidance/agent-contract.json'));
assert.equal(portable.retirement.state,'retired');
assert.equal(portable.retirement.installationRequired,false);

function retrieval(text){
 assert(text.includes('guidance/agent-contract.json'),'Discovery index must route to the generated portable contract');
 assert(!text.includes('CyberOS, the DC compiler'));
}
function sync(text){
 for(const item of ['_esm/react.mjs','_esm/react.d.ts','scripts/generate-react-entry.mjs','_esm/cs.mjs','export const VERSION','scripts/generate-export-catalog.mjs','scripts/generate-token-declarations.mjs','npm run tokens:generate','npm run test:unit'])assert(text.includes(item),item);
 assert(!/round-trips losslessly|round-trip lossless|_esm\/.*is source|_esm\/.*là source|it is source, not a build artifact|nó là source, không phải build artifact|hoặc ignore và để mỗi session regenerate/.test(text));
}
function ci(text){
 const story=text.split('\n').find(line=>line.startsWith('4b.'));
 assert(story.includes('npm run build:site')&&story.includes('npm run test:public-site'));
 const regeneration=text.split('\n').find(line=>line.startsWith('9.'));
 assert(regeneration.includes('npm run tokens:generate'));
 assert(!regeneration.includes('npm run tokens:elements'));
 assert(text.includes(`Node **${node(gates.jobs['unit-tests'])}**`));
 const pixel=text.indexOf('node _audit/ci/pixel-diff.mjs'),board=text.indexOf('node _audit/ci/run-gates.mjs');
 assert(pixel>=0&&board>=0&&pixel<board,'Pixel receipt must be generated before running the board');
}
function quality(text){
 assert(text.includes('npx playwright install --with-deps chromium firefox webkit'));
 const story=text.split('\n').find(line=>line.startsWith('| Storybook build'));
 assert(story.includes('npm run build:site')&&story.includes('npm run test:public-site'));
}
for(const lang of ['', 'vi/']){
 const path='docs/'+lang+'quality-gates.md',current=read(path);
 quality(current);
 assert.throws(()=>quality(current.replaceAll('chromium firefox webkit','chromium')));
 assert.throws(()=>quality(current.replaceAll('npm run build:site','npm run build:storybook')));
 assert.throws(()=>quality(current.replaceAll('npm run test:public-site','removed-public-check')));
}
retrieval(read('llms.txt'));
for(const lang of ['', 'vi/']){sync(read('docs/'+lang+'sync.md'));ci(read('docs/'+lang+'ci-cd.md'))}
const currentCi=read('docs/ci-cd.md'),currentSync=read('docs/sync.md'),currentIndex=read('llms.txt');
for(const broken of [
 currentCi.replaceAll('Node **22**','Node **20**'),
 currentCi.replaceAll('npm run build:site','npm run build:storybook'),
 currentCi.replaceAll('npm run tokens:generate','npm run tokens:elements'),
 currentCi.replace('node _audit/ci/pixel-diff.mjs','removed-pixel-command'),
 currentCi.replace('node _audit/ci/run-gates.mjs','removed-board-command'),
 currentCi.replace('node _audit/ci/pixel-diff.mjs','swap-placeholder').replace('node _audit/ci/run-gates.mjs','node _audit/ci/pixel-diff.mjs').replace('swap-placeholder','node _audit/ci/run-gates.mjs'),
])assert.throws(()=>ci(broken));
for(const broken of [currentSync.replaceAll('scripts/generate-react-entry.mjs','missing-generator'),currentSync.replaceAll('_esm/react.d.ts','missing-type-output')])assert.throws(()=>sync(broken));
assert.throws(()=>retrieval(currentIndex.replaceAll('guidance/agent-contract.json','missing-contract')));
console.log('PASS guidance authority: actual owning workflow/generator/retirement facts and current-guide mutations; EN/VI quality build/browser prerequisites. Named text assertions are not complete prose semantics, host behavior, compiler restoration, upstream runtime rights or human acceptance.');
