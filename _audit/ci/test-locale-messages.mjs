import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {snapshotLocaleMessages,tr,formatNumber,formatDate} from '../../components/_i18n/i18n.js';
import {strings} from '../../components/_i18n/strings.js';
const input={Pagination:{'fr-FR':{next:'Suivant'},en:{previous:'Earlier'}},Checkout:{en:{pay:'Pay',empty:''},vi:{pay:'Trả'}}};
const snapshot=snapshotLocaleMessages(input);
assert.notEqual(snapshot,input);assert(Object.isFrozen(snapshot));assert(Object.isFrozen(snapshot.Pagination.fr));assert(!Object.isFrozen(input));
input.Pagination['fr-FR'].next='Mutated';assert.equal(snapshot.Pagination.fr.next,'Suivant');
assert.throws(()=>{snapshot.Pagination.fr.next='No'},TypeError);
const parent={messages:snapshot,parent:null};
const child={messages:snapshotLocaleMessages({Pagination:{en:{next:'Child next'}},Checkout:{en:{pay:'Child pay'}}}),parent};
assert.equal(tr('Pagination','next','fr-CA',child),'Suivant','parent exact locale wins over nearer fallback locale');
assert.equal(tr('Pagination','next','en',child),'Child next');
assert.equal(tr('Pagination','previous','fr',child),'Earlier','per-key fallback can inherit parent English');
assert.equal(tr('Pagination','next','vi',child),strings.Pagination.vi.next,'built-in exact locale precedes scoped fallback');
assert.equal(tr('Checkout','pay','de',child),'Child pay');assert.equal(tr('Checkout','missing','de',child),'missing');assert.equal(tr('Checkout','empty','en',child),'');
assert.equal(tr('constructor','prototype','en',child),'prototype');
for(const value of [null,[],42,()=>{},new Date(),Object.create({x:{en:{a:'a'}}})])assert.throws(()=>snapshotLocaleMessages(value),TypeError);
for(const value of [3,false,null,()=>{},{}])assert.throws(()=>snapshotLocaleMessages({X:{en:{a:value}}}),TypeError);
for(const key of ['__proto__','constructor','prototype','',Symbol('key')]){
 const record=Object.create(null);record[key]={en:{a:'a'}};assert.throws(()=>snapshotLocaleMessages(record),TypeError);
 const leaf=Object.create(null);leaf[key]='value';assert.throws(()=>snapshotLocaleMessages({X:{en:leaf}}),TypeError);
}
for(const pair of [['en','en-US'],['vi-VN','Tiếng Việt'],['ja','日本語']])assert.throws(()=>snapshotLocaleMessages({X:{[pair[0]]:{x:'a'},[pair[1]]:{x:'b'}}}),/aliases collide/);
let getterCalls=0;
for(const depth of [0,1,2]){
 const accessor={};Object.defineProperty(accessor,'x',{enumerable:true,get(){getterCalls++;throw Error('must not execute')}});
 const record=depth===0?accessor:depth===1?{X:accessor}:{X:{en:accessor}};
 assert.throws(()=>snapshotLocaleMessages(record),/accessors/);
}assert.equal(getterCalls,0);
assert(Object.isFrozen(strings));for(const namespace of Object.values(strings)){assert(Object.isFrozen(namespace));for(const table of Object.values(namespace))assert(Object.isFrozen(table))}
const nullRecord=Object.create(null);nullRecord.X={en:{x:'safe'}};assert.equal(snapshotLocaleMessages(nullRecord).X.en.x,'safe');
assert.equal(formatNumber(1234.5,'fr'),formatNumber(1234.5,'en'),'additional UI locale does not add number formatting');
assert.equal(formatDate(new Date('2026-01-02T00:00:00Z'),'fr'),formatDate(new Date('2026-01-02T00:00:00Z'),'en'));
const inventory=JSON.parse(readFileSync(new URL('../../scripts/catalog-source.json',import.meta.url)));
assert.deepEqual(inventory.publicHooks,[{name:'useMessages',sourcePath:'components/i18n/LocaleProvider.jsx'}]);
console.log('PASS locale messages: immutable snapshots, scope/locale/key precedence, prototype/accessor/type/alias rejection and formatter boundary');
