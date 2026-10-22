import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';
const root=fileURLToPath(new URL('../',import.meta.url));
export function componentCssIndex(baseFiles,components) {
 const rules=new Map();
 for(const [path,css]of baseFiles)postcss.parse(css,{from:path}).walkRules(rule=>{
  for(const match of rule.selector.matchAll(/\.((?:cs-)[\w-]+)/g)) {
   if(!rules.has(match[1]))rules.set(match[1],new Set());
   rules.get(match[1]).add(path);
  }
 });
 return {schemaVersion:1,generator:'scripts/generate-css-index.mjs',scope:'Literal cs-* hooks observed in component source; dynamic suffixes, inherited hooks, generated classes and external consumer styles require source inspection. An unmatched hook can be a structural or accessibility hook, not a missing rule.',components:components.map(([sourcePath,source])=>{
  const hooks=[...new Set([...source.matchAll(/\bcs-[a-zA-Z][\w-]*/g)].map(match=>match[0].replace(/-+$/,'')))].sort();
  return {sourcePath,hooks:hooks.map(name=>({name,stylesheets:[...(rules.get(name)||[])].sort()})),stylesheets:[...new Set(hooks.flatMap(name=>[...(rules.get(name)||[])]))].sort()};
 })};
}
function files(path,extension){return readdirSync(join(root,path),{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(path,entry.name),extension):entry.name.endsWith(extension)?[join(path,entry.name)]:[]).sort();}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const rows=paths=>paths.map(path=>[path.replaceAll('\\','/'),readFileSync(join(root,path),'utf8')]);
 const doc=componentCssIndex(rows(files('base','.css')),rows(files('components','.jsx'))),output=JSON.stringify(doc,null,2)+'\n',path=join(root,'components/css-index.json');
 if(process.argv.includes('--check')) {
  if(readFileSync(path,'utf8')!==output)throw Error('Stale component CSS index; run node scripts/generate-css-index.mjs');
 } else writeFileSync(path,output);
 console.log(`PASS component CSS index: ${doc.components.length} sources; static hooks and stylesheet membership with explicit dynamic boundaries.`);
}
