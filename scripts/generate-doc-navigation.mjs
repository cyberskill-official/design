import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),read=path=>readFileSync(new URL(path,root),'utf8');
function ordered(entries) {
 const explicit = entries.filter(entry => entry.sortOrder !== undefined).map(entry => entry.sortOrder);
 if (explicit.some(order => !Number.isSafeInteger(order) || order < 0) || new Set(explicit).size !== explicit.length) throw Error('Invalid or duplicate documentation sort order');
 return entries.map((entry,index) => ({entry,index})).sort((a,b) => (a.entry.sortOrder ?? 1000+a.index) - (b.entry.sortOrder ?? 1000+b.index)).map(row => row.entry);
}
export function navigation(catalog,language) {
 const labels=language==='vi'?['Bắt đầu','Hướng dẫn','Bảo trì']:['Start','Guides','Maintainers'];
 const groups=[ordered([...catalog.entrance,...catalog.pages.filter(item=>item.story.startsWith('Docs/Start/'))]),catalog.pages.filter(item=>!item.story.startsWith('Docs/Maintainers/')&&!item.story.startsWith('Docs/Start/')),catalog.pages.filter(item=>item.story.startsWith('Docs/Maintainers/'))];
 const paths=groups.flat().map(item=>item.path);if(new Set(paths).size!==paths.length)throw Error('Duplicate documentation route');
 return groups.map((items,index)=>[labels[index],items.map(item=>[item.path,item[language==='vi'?'labelVi':'labelEn']])]);
}
export function storyOrder(catalog) {
 const entries=[...catalog.curated,...catalog.entrance,...catalog.pages],result=[];
 for(const group of ['Start','Guides','Maintainers']) {
  const titles=ordered(entries.filter(item=>item.story.startsWith('Docs/'+group+'/'))).map(item=>item.story.slice(('Docs/'+group+'/').length));
  if(new Set(titles).size!==titles.length)throw Error('Duplicate documentation story');
  const tree=new Map();
  for(const title of titles){let node=tree;for(const part of title.split('/')){if(!node.has(part))node.set(part,new Map());node=node.get(part);}}
  const inline=node=>[...node].flatMap(([name,children])=>children.size?[name,inline(children)]:[name]);
  result.push(group,inline(tree));
 }
 return result;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const catalog=JSON.parse(read('_audit/docs-catalog.json'));
 const viewer=read('docs/viewer.html');
 const start=viewer.indexOf('const DOCS_EN='),end=viewer.indexOf('const UI=',start);
 if(start<0||end<0)throw Error('Missing documentation navigation boundaries');
 const block='// Generated from _audit/docs-catalog.json; run npm run build:doc-navigation.\nconst DOCS_EN='+JSON.stringify(navigation(catalog,'en'))+';\nconst DOCS_VI='+JSON.stringify(navigation(catalog,'vi'))+';\nconst ENTRANCE_VI='+JSON.stringify(Object.fromEntries(catalog.entrance.map(entry=>{if(entry.pathVi!=='docs/vi/entrypoints/'+entry.path)throw Error('Missing exact entrance translation route');return[entry.path,entry.pathVi];})))+';\n';
 const prefix=viewer.slice(0,start).replace(/\/\/ Generated from _audit\/docs-catalog.json; run npm run build:doc-navigation\.\n$/,'');
 const preview=read('.storybook/preview.jsx');
 const marker=/\/\/ cs-doc-sort:start[\s\S]*?\/\/ cs-doc-sort:end/;
 if(!marker.test(preview))throw Error('Missing inline Storybook doc sort markers');
 const sort='// cs-doc-sort:start\n          '+JSON.stringify(storyOrder(catalog),null,2)+',\n          // cs-doc-sort:end';
 const outputs={'docs/viewer.html':prefix+block+viewer.slice(end),'.storybook/preview.jsx':preview.replace(marker,sort)};
 for(const [path,text] of Object.entries(outputs)){
  if(process.argv.includes('--check')){if(read(path)!==text)throw Error('Stale documentation navigation: '+path);}
  else writeFileSync(new URL(path,root),text);
 }
 console.log('PASS catalog-derived documentation navigation and Storybook order');
}
