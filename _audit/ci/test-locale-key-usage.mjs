import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
import {strings} from '../../components/_i18n/strings.js';
import {localeKeyUsage} from './lib/locale-key-usage.mjs';

const dynamicDomains = {
  'ai/ConfidenceMeter.jsx:tone':['low','medium','high'],
  'feedback/Result.jsx:status':['success','error','warning','info'],
};
export function validateCalls(calls,tables,domains,path) {
  const used=[];
  for(const call of calls) {
    const keys=call.keys || domains[path+':'+call.expression];
    assert.ok(keys,`${path}:${call.line}: unreviewed dynamic key ${call.expression}`);
    for(const key of keys) {
      for(const lang of ['en','vi']) assert.ok(typeof tables[call.namespace]?.[lang]?.[key] === 'string' && tables[call.namespace][lang][key].trim(),`${path}:${call.line}: missing ${call.namespace}.${lang}.${key}`);
      used.push(`${call.namespace}.${key}`);
    }
  }
  return used;
}
const fixture=`const t=makeT('Demo', lang); t('one'); t(open ? 'two' : 'three'); makeT('Other', lang)('four'); t(mode);`;
assert.deepEqual(localeKeyUsage(fixture).map(({namespace,keys,expression})=>({namespace,keys,expression})),[
  {namespace:'Demo',keys:['one'],expression:"'one'"},
  {namespace:'Demo',keys:['two','three'],expression:"open ? 'two' : 'three'"},
  {namespace:'Other',keys:['four'],expression:"'four'"},
  {namespace:'Demo',keys:null,expression:'mode'},
]);
assert.throws(()=>validateCalls([{namespace:'Demo',keys:['missing'],line:1}],{Demo:{en:{},vi:{}}},{},'fixture'),/missing Demo.en.missing/);
assert.throws(()=>validateCalls([{namespace:'Demo',keys:null,expression:'mode',line:1}],{}, {},'fixture'),/unreviewed dynamic key/);
const used=new Set();let files=0;
for(const file of readdirSync('components',{recursive:true}).filter(p=>p.endsWith('.jsx')).sort()) {
  files++;
  const source=readFileSync('components/'+file,'utf8');
  const calls=localeKeyUsage(source);
  for(const key of validateCalls(calls,strings,dynamicDomains,file)) used.add(key);
}
const unused=Object.entries(strings).flatMap(([ns,tables])=>Object.keys(tables.en).map(key=>`${ns}.${key}`)).filter(key=>!used.has(key));
assert.deepEqual(unused.sort(),['Dialog.cancel','Dialog.confirm','EmptyState.action']);
console.log(`PASS locale key usage: ${files} JSX modules, ${used.size} referenced keys; three explicitly unused registry entries; missing keys and unreviewed dynamic domains rejected. Static usage is not rendered coverage.`);
