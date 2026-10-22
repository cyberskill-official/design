import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';
const root=new URL('../',import.meta.url);
export function sourcePaths(read=path=>readFileSync(new URL(path,root),'utf8')) {
 const ast=postcss.parse(read('styles.css'));const paths=[];
 ast.walkAtRules('import',rule=>{
  const match=/^url\("((?:tokens|base)\/[a-z0-9-]+\.css)"\)$/.exec(rule.params);
  assert(match,'Unsupported CSS entry import: '+rule.params);
  if(match[1]!=='tokens/fonts.css')paths.push(match[1]);
 });
 assert(paths.length>0,'Missing canonical styles entry imports');assert.equal(new Set(paths).size,paths.length,'Duplicate CSS entry imports');return paths;
}
export function variableStyles(read=path=>readFileSync(new URL(path,root),'utf8')) {
 const output=postcss.root();
 for(const path of sourcePaths(read)){
  const ast=postcss.parse(read(path),{from:path});
  ast.walkDecls(decl=>{if(!decl.prop.startsWith('--'))decl.remove()});
  ast.walkComments(comment=>comment.remove());
  let removed;do{removed=false;ast.walk(node=>{if(node.nodes&&!node.nodes.length){node.remove();removed=true}})}while(removed);
  ast.walkAtRules(rule=>assert(['media','supports','layer','container'].includes(rule.name),'Unsupported token rule: '+rule.name));
  output.append(postcss.comment({text:'Source: '+path}),ast.nodes);
 }
 return '/* Generated variables-only CSS; npm run build:token-css. No fonts, resets or component styles. */\n'+output.toString()+'\n';
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const next=variableStyles(),path=new URL('tokens/variables.css',root);
 if(process.argv.includes('--check'))assert.equal(readFileSync(path,'utf8'),next,'Stale variables-only CSS');else writeFileSync(path,next);
 console.log('PASS variables-only CSS: scoped declarations retained; ordinary styles, font faces and asset rules excluded');
}
