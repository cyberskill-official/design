import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function projectSampleFonts(manifest,read) {
 assert.equal(manifest.schemaVersion,1);assert.equal(manifest.family,'BeVietnamPro');
 assert.equal(manifest.tokenFamily,'Be Vietnam Pro');assert.equal(manifest.sourceToken,'fontFamilyUi');
 assert(/^[a-f0-9]{40}$/.test(manifest.upstreamCommit));
 assert.deepEqual(manifest.fonts.map(font=>font.weight).sort((a,b)=>a-b),[400,500,600,800]);
 const result={};
 const folders=['examples/native/flutter/assets/fonts','examples/native/compose/app/src/main/res/font','examples/native/swiftui/Sources/CyberSkillSample/Fonts'];
 const license=read('examples/native/fonts/OFL.txt');assert.equal(sha(license),manifest.licenseSha256,'Native font license changed');
 for(const font of manifest.fonts){
  assert(/^BeVietnamPro-[A-Za-z]+\.ttf$/.test(font.file));assert.equal(font.postscriptName,font.file.slice(0,-4));
  assert.equal(font.upstreamPath,'ofl/bevietnampro/'+font.file);
  const bytes=read('examples/native/fonts/'+font.file);assert.equal(sha(bytes),font.sha256,'Native font source changed');
  for(const folder of folders){
   const name=folder.includes('/res/')?'be_vietnam_pro_'+font.weight+'.ttf':font.file;
   result[folder+'/'+name]=bytes;
  }
 }
 // Android raw resources carry the full notice alongside font resources.
 for(const folder of folders){result[folder.includes('/res/')?'examples/native/compose/app/src/main/res/raw/be_vietnam_pro_ofl.txt':folder+'/OFL.txt']=license;}
 return result;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const manifest=JSON.parse(readFileSync(new URL('examples/native/fonts/manifest.json',root),'utf8'));
 const outputs=projectSampleFonts(manifest,path=>readFileSync(new URL(path,root)));
 for(const [path,bytes]of Object.entries(outputs)){
  if(process.argv.includes('--check'))assert.deepEqual(readFileSync(new URL(path,root)),bytes,'Stale native font resource: '+path);
  else {mkdirSync(dirname(fileURLToPath(new URL(path,root))),{recursive:true});writeFileSync(new URL(path,root),bytes);}
 }
 console.log('PASS native sample fonts: four pinned TTF weights and complete OFL notices projected to three platforms; no runtime fallback or human acceptance inferred.');
}
