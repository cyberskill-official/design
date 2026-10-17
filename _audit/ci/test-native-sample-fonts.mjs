import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {projectSampleFonts} from '../../scripts/generate-native-sample-fonts.mjs';
const root=new URL('../../',import.meta.url),read=path=>readFileSync(new URL(path,root));
const manifest=JSON.parse(read('examples/native/fonts/manifest.json'));
const recipe=JSON.parse(read('fonts/subset-recipe.json'));
assert.equal(manifest.upstreamCommit,recipe.upstream.commit);
for(const path of ['tokens/native/CSTokens.swift','tokens/native/CSTokens.kt','tokens/native/cs_tokens.dart']){
 const declaration=read(path).toString().match(/fontFamilyUi[^\n]*[=]\s*["']([^"']+)["']/);
 assert(declaration&&declaration[1].split(',')[0].trim()===manifest.tokenFamily,'Native font binding differs from generated UI family: '+path);
}
for(const font of manifest.fonts){
 const source=recipe.upstream.files.find(file=>file.path===font.upstreamPath);
 assert(source&&source.sha256===font.sha256,'Native source must match pinned font recipe');
}
assert.equal(manifest.licenseSha256,recipe.upstream.files.find(file=>file.path==='ofl/bevietnampro/OFL.txt').sha256);
const outputs=projectSampleFonts(manifest,read);assert.equal(Object.keys(outputs).length,15);
for(const [path,bytes]of Object.entries(outputs))assert.deepEqual(read(path),bytes,path);
for(const mutate of [m=>m.fonts.pop(),m=>m.fonts[0].weight=500,m=>m.fonts[0].file='../outside.ttf',m=>m.fonts[0].postscriptName='wrong',m=>m.fonts[0].upstreamPath='wrong',m=>m.fonts[0].sha256='0'.repeat(64),m=>m.licenseSha256='0'.repeat(64),m=>m.upstreamCommit='invalid']){
 const invalid=structuredClone(manifest);mutate(invalid);assert.throws(()=>projectSampleFonts(invalid,read));
}
for(const damaged of ['examples/native/fonts/OFL.txt','examples/native/fonts/BeVietnamPro-SemiBold.ttf'])assert.throws(()=>projectSampleFonts(manifest,path=>path===damaged?Buffer.from('altered'):read(path)));
console.log('PASS native fonts: four pinned upstream files; 12 whole-byte copies and three notices; ten invalid source/manifest rejections. Native typography/fallback remains a separate runtime check.');
