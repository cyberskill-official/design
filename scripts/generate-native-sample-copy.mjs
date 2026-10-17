import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
export function generateSampleCopy(data) {
  assert.equal(data.schemaVersion,1);assert.equal(data.defaultLanguage,'vi');assert.deepEqual(data.languages,['vi','en']);
  assert(Array.isArray(data.strings)&&data.strings.length,'Empty sample copy');
  const keys=new Set();
  for(const row of data.strings){
    assert.deepEqual(Object.keys(row).sort(),['key','vi','en'].sort());
    assert(/^[a-z][A-Za-z0-9]*$/.test(row.key)&&!keys.has(row.key),'Invalid/duplicate sample key');keys.add(row.key);
    for(const language of data.languages)assert(typeof row[language]==='string'&&row[language].trim()&&row[language].isWellFormed()&&row[language]===row[language].normalize('NFC'),'Missing/non-NFC copy');
  }
  const quote=(text,language)=>'"'+[...text].map(char=>{
    if(char==='\\')return '\\\\';
    if(char==='"')return '\\"';
    if(char==='$'&&language!=='swift')return '\\$';
    const cp=char.codePointAt(0);
    if(cp<32)return language==='swift'?'\\u{'+cp.toString(16)+'}':'\\u'+cp.toString(16).padStart(4,'0');
    return char;
  }).join('')+'"';
  const swift='// Generated from examples/native/sample-copy.json; run npm run native:copy.\nimport Foundation\n\nenum SampleLanguage: String, CaseIterable {\n  case vi\n  case en\n  var locale: Locale { Locale(identifier: rawValue) }\n}\n\nenum SampleText: CaseIterable {\n'+data.strings.map(row=>'  case '+row.key+'\n').join('')+'\n  func value(in language: SampleLanguage) -> String {\n    switch self {\n'+data.strings.map(row=>`    case .${row.key}: return language == .vi ? ${quote(row.vi,'swift')} : ${quote(row.en,'swift')}\n`).join('')+'    }\n  }\n}\n';
  const kotlin='// Generated from examples/native/sample-copy.json; run npm run native:copy.\npackage world.cyberskill.sample.ui\n\nenum class SampleLanguage(val tag: String) { Vi("vi"), En("en") }\n\nenum class SampleText(val vi: String, val en: String) {\n'+data.strings.map(row=>`  ${row.key[0].toUpperCase()+row.key.slice(1)}(${quote(row.vi,'kotlin')}, ${quote(row.en,'kotlin')})`).join(',\n')+';\n  fun value(language: SampleLanguage): String = if (language == SampleLanguage.Vi) vi else en\n}\n';
  const dart='// Generated from examples/native/sample-copy.json; run npm run native:copy.\nenum SampleLanguage { vi, en }\n\nenum SampleText {\n'+data.strings.map(row=>`  ${row.key}(${quote(row.vi,'dart')}, ${quote(row.en,'dart')})`).join(',\n')+';\n  const SampleText(this.vi, this.en);\n  final String vi;\n  final String en;\n  String value(SampleLanguage language) => language == SampleLanguage.vi ? vi : en;\n}\n';
  return {'examples/native/swiftui/Sources/CyberSkillSample/SampleLanguage.swift':swift,'examples/native/compose/app/src/main/java/world/cyberskill/sample/ui/SampleLanguage.kt':kotlin,'examples/native/flutter/lib/sample_language.dart':dart};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const data=JSON.parse(readFileSync(new URL('examples/native/sample-copy.json',root),'utf8'));
 const outputs=generateSampleCopy(data);
 for(const [path,text]of Object.entries(outputs)){
  if(process.argv.includes('--check'))assert.equal(readFileSync(new URL(path,root),'utf8'),text,'Stale native sample copy: '+path);
  else writeFileSync(new URL(path,root),text);
 }
 console.log(`PASS native sample copy: ${data.strings.length} EN/VI pairs; three deterministic projections. This does not certify translated layout or platform runtime.`);
}
