/**
 * Unit tests for pure helpers in push-figma-variables.mjs (no network, no secrets).
 */
import {
  hexToFigmaColor,
  flattenDtcg,
  toFigmaName,
  pickColorLeaves,
  isEnterpriseVariablesBlock,
} from './push-figma-variables.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function assert(c, m) {
  if (!c) throw new Error(m || 'assert failed');
}

const umber = hexToFigmaColor('#45210E');
assert(Math.abs(umber.r - 0x45 / 255) < 1e-9, 'umber r');
assert(Math.abs(umber.g - 0x21 / 255) < 1e-9, 'umber g');
assert(Math.abs(umber.b - 0x0e / 255) < 1e-9, 'umber b');
assert(umber.a === 1, 'umber a');

const short = hexToFigmaColor('#f4b');
assert(short.r > 0.9 && short.g > 0.2, 'short hex expands');

assert(toFigmaName('color.--cs-color-brand-umber') === 'color/brand/umber'
  || toFigmaName('color.--cs-color-brand-umber').includes('brand'),
  'name maps: ' + toFigmaName('color.--cs-color-brand-umber'));

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dtcg = JSON.parse(readFileSync(join(root, 'tokens/tokens.dtcg.json'), 'utf8'));
const leaves = flattenDtcg(dtcg);
assert(leaves.length >= 100, 'flatten leaves ' + leaves.length);
const colors = pickColorLeaves(leaves);
assert(colors.length === leaves.filter(c=>c.type==='color').length, 'Every color must be included');
assert(colors.length === 42, 'All current base color roles, including alpha');
for(const role of ['success','danger','warning','info']) assert(colors.some(c=>c.path===`color.--cs-color-semantic-${role}-text`), 'Explicit semantic text role in42colorinventory');
assert(colors.every(c=>Object.values(c.color).every(Number.isFinite)), 'All colors are numeric RGBA');
const glow=colors.find(c=>c.path==='accent.--cs-accent-glow');
assert(glow.color.a===0.48, 'Preserve translucent accent alpha');
const aliasColors=pickColorLeaves([{path:'a',type:'color',value:{colorSpace:'srgb',components:[0,0.5,1],alpha:0.2}},{path:'b',type:'color',value:'{a}'}]);
assert(JSON.stringify(aliasColors[0].color)===JSON.stringify(aliasColors[1].color),'Typed color alias resolves');
for(const value of ['#GGGGGG','rgba(0,0,0,1)',{colorSpace:'lab',components:[1,2,3]},'{missing}']){
 let failed=false;try{pickColorLeaves([{path:'a',type:'color',value}]);}catch{failed=true;}
 assert(failed,'Invalid or unsupported color must fail: '+JSON.stringify(value));
}
for(const leaves of [[{path:'a',type:'color',value:'{b}'},{path:'b',type:'color',value:'{a}'}],[{path:'a',type:'color',value:'{b}'},{path:'b',type:'number',value:1}]]){
 let failed=false;try{pickColorLeaves(leaves);}catch{failed=true;}assert(failed,'Alias cycle/type mismatch must fail');
}

// names unique
const names = colors.map((c) => toFigmaName(c.path));
assert(new Set(names).size === names.length, 'unique figma names');

assert(isEnterpriseVariablesBlock(new Error('Figma GET /files/x/variables/local → 403: Invalid scope(s): file_content:read. This endpoint requires the file_variables:read scope')), 'enterprise block: scopes');
assert(isEnterpriseVariablesBlock('Enterprise plan only'), 'enterprise block: plan note');
assert(!isEnterpriseVariablesBlock(new Error('Figma GET /files/x → 404: Not found')), 'not enterprise: 404');
assert(!isEnterpriseVariablesBlock('Invalid scope(s): file_content:read'), 'Generic content scope is not a Variables plan block');
assert(!isEnterpriseVariablesBlock('Figma GET /files/x?depth=1 → 403: Invalid scope(s): file_content:read. file_variables:read'), 'File preflight fails rather than blaming Variables access');
assert(!isEnterpriseVariablesBlock('Figma POST /files/x/variables → 403: File cannot be edited'), 'Ordinary write permission remains a hard failure');
assert(isEnterpriseVariablesBlock('Figma POST /files/x/variables → 403: Invalid scope(s): file_variables:write'), 'Variables write scope preserves existing optional-integration policy');
assert(!isEnterpriseVariablesBlock('Figma GET /files/x/variables/local → 401: file_variables:read'), 'Unauthorized status remains a hard failure');
assert(!isEnterpriseVariablesBlock('Figma GET /files/x/variables/local → 400: Enterprise plan only'), 'Malformed request remains a hard failure');
assert(!isEnterpriseVariablesBlock('Figma POST /files/x/variables/local → 403: file_variables:write'), 'Wrong Variables method/path is not an access skip');
assert(!isEnterpriseVariablesBlock('Figma GET /files/x/variables/unknown → 403: file_variables:read'), 'Unknown Variables endpoint is not an access skip');

console.log('PASS test-figma-push-helpers', {
  leaves: leaves.length,
  colors: colors.length,
  sample: names.slice(0, 5),
  umber,
});
