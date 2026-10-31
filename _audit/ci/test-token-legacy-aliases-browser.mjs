import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const aliases=JSON.parse(readFileSync('_audit/ci/fixtures/a01-token-aliases/aliases.json')).aliases;
const modes=JSON.parse(readFileSync('tokens/modes/index.json')).modes,browserName=process.env.CS_TEST_BROWSER||'chromium';let checked=0;
await withBrowserFixture(async page=>{
 for(const colorScheme of ['light','dark']){
  await page.emulateMedia({colorScheme});
  const selected=modes.filter(row=>row.axes.colorScheme===colorScheme);
  const result=await page.evaluate(({aliases,modes})=>{
   const errors=[];let checked=0;const target=document.getElementById('fixture');target.replaceChildren();
   for(const {id,axes}of modes){
    const scope=document.createElement('section');for(const[name,value]of Object.entries({'data-theme':axes.theme,'data-cs-element':axes.element,'data-cs-variant':axes.variant,'data-cs-density':axes.density,'data-cs-contrast':axes.contrast}))if(value!=null)scope.setAttribute(name,value);
    const compact=document.createElement('div');compact.dataset.csDensity='compact';const comfortable=document.createElement('div');comfortable.dataset.csDensity='comfortable';compact.appendChild(comfortable);scope.appendChild(compact);target.appendChild(scope);
    for(const node of [scope,compact,comfortable]){const style=getComputedStyle(node);for(const row of aliases){checked++;const legacy=style.getPropertyValue(row.legacy).trim(),alias=style.getPropertyValue(row.alias).trim();if(!legacy||legacy!==alias)errors.push({id,density:node.dataset.csDensity,legacy:row.legacy,alias:row.alias,expected:legacy,actual:alias});}}
   }
   return{errors,checked};
  },{aliases,modes:selected});assert.deepEqual(result.errors,[],browserName+' aliases match actual legacy values across modes and nested density resets');checked+=result.checked;
 }
 const changed=aliases.find(row=>row.alias==='--cs-component-button-md-padding-x');
 const mutation=await page.addStyleTag({content:`[data-cs-density="compact"] { ${changed.alias}: 999px; }`});
 const observed=await page.locator('#fixture [data-cs-density="compact"]').first().evaluate((node,row)=>{const style=getComputedStyle(node);return{legacy:style.getPropertyValue(row.legacy).trim(),alias:style.getPropertyValue(row.alias).trim()};},changed);
 assert.equal(observed.alias,'999px');assert.equal(observed.legacy,'999px');
 await mutation.evaluate(node=>node.remove());
 const legacyOnly=await page.addStyleTag({content:`[data-cs-density="compact"] { ${changed.legacy}: 1px; }`});
 const shadowed=await page.locator('#fixture [data-cs-density="compact"]').first().evaluate((node,row)=>{const style=getComputedStyle(node);return{legacy:style.getPropertyValue(row.legacy).trim(),alias:style.getPropertyValue(row.alias).trim()};},changed);
 assert.equal(shadowed.legacy,'1px');assert.notEqual(shadowed.alias,'1px');
 await legacyOnly.evaluate(node=>node.remove());
},{browserName});
mkdirSync('test-results/token-legacy-aliases',{recursive:true});writeFileSync(`test-results/token-legacy-aliases/${browserName}.json`,JSON.stringify({status:'PASS',browserName,modes:modes.length,aliases:aliases.length,nestedDensityScopes:3,checked,wrongScopedAliasRejected:true,inputHashes:Object.fromEntries(['tokens/typography.css','tokens/component-tokens.css','tokens/theme-attributes.css'].map(path=>[path,createHash('sha256').update(readFileSync(path)).digest('hex')]))},null,2)+'\n');
console.log(`PASS22 legacy/kebab aliases ×256 actualCSSmodes ×3nested density scopes: ${checked} comparisons; ${browserName}`);
