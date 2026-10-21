/** Plain-CSS defect rules; data comes from pinned CSS specifications, no glob engine. */
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import {fork} from 'css-tree';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const patches=require('@csstools/css-syntax-patches-for-csstree');
const lexer=fork({atrules:patches.next.atrules,properties:patches.next.properties,types:patches.next.types}).lexer;
export function lintCss(code,{from='input.css'}={}) {
 const errors=[];let ast;
 try{ast=postcss.parse(code,{from})}catch(error){return [{rule:'syntax',message:error.reason,line:error.line,column:error.column}]}
 const add=(decl,rule,message)=>errors.push({rule,message,line:decl.source.start.line,column:decl.source.start.column});
 ast.walkDecls(decl=>{
  const property=decl.prop.toLowerCase();
  let descriptor=false;
  for(let parent=decl.parent;parent;parent=parent.parent)if(parent.type==='atrule'&&lexer.getAtrule(parent.name)?.descriptors){descriptor=true;break}
  if(!descriptor&&!property.startsWith('--')&&!/^-[a-z]+-/.test(property)&&!lexer.getProperty(property))add(decl,'property-no-unknown','Unknown property '+decl.prop);
  valueParser(decl.value).walk(node=>{
   if(node.type==='function'&&node.value.toLowerCase().endsWith('url'))return false;
   if(node.type!=='word')return;
   const match=/^#[a-z0-9]+/i.exec(node.value);
   if(match&&!/^#(?:[a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(match[0]))add(decl,'color-no-invalid-hex','Invalid hex color '+match[0]);
  });
 });
 return errors;
}
