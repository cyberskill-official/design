import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {generateSampleCopy} from '../../scripts/generate-native-sample-copy.mjs';
const data=JSON.parse(readFileSync(new URL('../../examples/native/sample-copy.json',import.meta.url),'utf8'));
const outputs=generateSampleCopy(data);
for(const [path,text]of Object.entries(outputs))assert.equal(readFileSync(new URL('../../'+path,import.meta.url),'utf8'),text);
for(const change of [d=>d.strings[0].vi='',d=>d.strings[0].en=' ',d=>delete d.strings[0].vi,d=>d.strings.push(d.strings[0]),d=>d.languages.push('ja'),d=>d.defaultLanguage='en',d=>d.strings[0].vi='Đăng nhập'.normalize('NFD'),d=>d.strings[0].key='bad key',d=>d.strings[0].en='\ud800']){
 const invalid=structuredClone(data);change(invalid);assert.throws(()=>generateSampleCopy(invalid));
}
const special=structuredClone(data);special.strings[0].en='Quote " slash \\ $cash\nnext\tline\b';
const escaped=generateSampleCopy(special);
for(const [path,text]of Object.entries(escaped)){
 assert(text.includes('\\"')&&text.includes('\\\\'));
 assert(text.includes(path.endsWith('.swift')?'$cash':'\\$cash'));
 assert(text.includes(path.endsWith('.swift')?'\\u{8}':'\\u0008'));
}
console.log('PASS native sample copy: every EN/VI value projected to three targets; nine invalid input rejections and language-specific literal escaping. Runtime/layout acceptance is separate.');
