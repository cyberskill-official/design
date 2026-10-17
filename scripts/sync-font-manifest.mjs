import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import postcss from 'postcss';
const source=new URL('../tokens/fonts.css',import.meta.url);
const target=new URL('../_ds_manifest.json',import.meta.url);
const manifest=JSON.parse(readFileSync(target,'utf8'));
const fonts=[];
postcss.parse(readFileSync(source,'utf8')).walkAtRules('font-face',rule=>{
 const values={};rule.walkDecls(d=>{values[d.prop]=d.value});
 const urls=[...values.src.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]);
 assert(urls.length&&urls.every(url=>/^\.\.\/fonts\/[^/]+\.woff2$/.test(url)),'Expected local WOFF2 sources');
 fonts.push({family:values['font-family'].replace(/^["']|["']$/g,''),weight:values['font-weight'],style:values['font-style'],unicodeRange:values['unicode-range'],cssPath:'tokens/fonts.css',files:urls.map(url=>url.slice(3))});
});
assert(fonts.length,'No font faces');
if(process.argv.includes('--check'))assert.deepEqual(manifest.fonts,fonts,'Manifest font records differ from tokens/fonts.css; run npm run fonts:manifest');
else {manifest.fonts=fonts;writeFileSync(target,JSON.stringify(manifest,null,2).replace(/[^\x00-\x7f]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'))+'\n');}
console.log(`PASS font manifest: ${fonts.length} source-derived records`);
