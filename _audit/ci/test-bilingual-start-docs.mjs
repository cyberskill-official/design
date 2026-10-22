import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import mdxLoader from '@storybook/addon-docs/mdx-loader';
const compile=content=>new Promise((resolve,reject)=>mdxLoader.call({async:()=>((error,code)=>error?reject(error):resolve(code)),getOptions:()=>({}),resourcePath:'start-document.mdx'},content));
const rows=[['Introduction','introduction','Docs/Start/Introduction'],['TheFourAxes','four-axes','Docs/Start/The Four Axes'],['VoiceAndLanguage','voice-and-language','Docs/Start/Voice & Language']];
export function checkStartDocumentPair(en,vi,mdx,slug,story){
 assert(en.startsWith('# ')&&vi.startsWith('# '));assert.notEqual(en,vi,'Actual translated source required');
 const fences=s=>[...s.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(m=>m[0]);assert.deepEqual(fences(en),fences(vi),'API/HTML examples preserved exactly');
 assert.equal((en.match(/^#{1,3} /gm)||[]).length,(vi.match(/^#{1,3} /gm)||[]).length,'All source sections mirrored');
 assert(mdx.includes('title="'+story+'"'));assert(mdx.includes('src="/docs/viewer.html?embed=1#docs/'+slug+'.md"'));assert.equal((mdx.match(/<IframeSurface /g)||[]).length,1);assert(!/^# /m.test(mdx),'No independently maintained prose twin');assert(!/reference\.counts|versionText|\{\d+\}/.test(en+vi),'No stale JSX interpolation in markdown');
}
let negatives=0;
for(const[stem,slug,story]of rows){const read=p=>readFileSync(p,'utf8'),en=read('docs/'+slug+'.md'),vi=read('docs/vi/'+slug+'.md'),mdx=read('stories/Docs/'+stem+'.mdx');checkStartDocumentPair(en,vi,mdx,slug,story);await compile(mdx);for(const bad of [()=>checkStartDocumentPair(en,en,mdx,slug,story),()=>checkStartDocumentPair(en,vi,mdx+'\n# Copied prose',slug,story),()=>checkStartDocumentPair(en,vi,mdx.replace(slug+'.md','missing.md'),slug,story)]){assert.throws(bad);negatives++}if(en.includes('```')){assert.throws(()=>checkStartDocumentPair(en,vi.replace('data-theme="dark"','data-theme="light"'),mdx,slug,story));negatives++}}
console.log('PASS bilingual Start docs:3 unchanged Storybook routes use canonical6 ENVI sources, exact code examples, actual MDX compilation and'+negatives+' negative guards');
