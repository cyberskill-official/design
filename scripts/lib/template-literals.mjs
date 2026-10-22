import {parse as htmlParse} from 'parse5';
import {parse as jsParse} from '@babel/parser';
export function staticValue(node){
 if(!node)throw Error('Missing static node');
 if(['StringLiteral','NumericLiteral','BooleanLiteral'].includes(node.type))return node.value;
 if(node.type==='NullLiteral')return null;
 if(node.type==='ArrayExpression')return node.elements.map(staticValue);
 if(node.type==='ObjectExpression'){
  const value={};for(const property of node.properties){if(property.type!=='ObjectProperty'||property.computed||property.method||property.shorthand)throw Error('Nonliteral object');const key=property.key.type==='Identifier'?property.key.name:property.key.type==='StringLiteral'?property.key.value:null;if(key===null||Object.hasOwn(value,key)||['__proto__','constructor','prototype'].includes(key))throw Error('Unsupported/duplicate key');value[key]=staticValue(property.value);}return value;
 }throw Error('Nonliteral value '+node.type);
}
function dcAst(source){
 const dom=htmlParse(source,{sourceCodeLocationInfo:true}),scripts=[];
 const walkHtml=node=>{if(node.tagName==='script'&&node.attrs.some(a=>a.name==='type'&&a.value==='text/x-dc'))scripts.push(node);for(const child of node.childNodes||[])walkHtml(child);};walkHtml(dom);
 if(scripts.length!==1)throw Error('Expected exactly one DC script');
 const node=scripts[0],offset=node.sourceCodeLocation.startTag.endOffset,end=node.sourceCodeLocation.endTag.startOffset;
 const ast=jsParse(source.slice(offset,end),{sourceType:'script',plugins:['jsx']});return {ast,offset,attrs:Object.fromEntries(node.attrs.map(a=>[a.name,a.value]))};
}
export function literalDeclarations(source){
 const {ast,offset}=dcAst(source);const rows=[];
 const walkJs=node=>{if(!node||typeof node!=='object')return;if(node.type==='VariableDeclarator'&&node.id.type==='Identifier'&&node.init?.type==='ObjectExpression'){try{const value=staticValue(node.init);rows.push({name:node.id.name,value,start:offset+node.init.start,end:offset+node.init.end,literal:source.slice(offset+node.init.start,offset+node.init.end)});}catch{}}
 for(const[key,value]of Object.entries(node)){
  if(['loc','start','end','extra'].includes(key))continue;
  if(Array.isArray(value)){for(const child of value)walkJs(child);}
  else if(value&&typeof value==='object')walkJs(value);
 }
 };walkJs(ast);return rows;
}

export function localeDictionaries(source){
 const{ast,offset}=dcAst(source),rows=[];
 const walk=node=>{if(!node||typeof node!=='object')return;if(node.type==='VariableDeclarator'&&['en','vi'].includes(node.id?.name)&&node.init?.type==='ObjectExpression'){
  const strings={};for(const p of node.init.properties)if(p.type==='ObjectProperty'&&!p.computed&&p.value.type==='StringLiteral'){const key=p.key.type==='Identifier'?p.key.name:p.key.type==='StringLiteral'?p.key.value:null;if(key!==null){if(Object.hasOwn(strings,key))throw Error('Duplicate literal dictionary key '+node.id.name+'.'+key);strings[key]={value:p.value.value,start:offset+p.value.start,end:offset+p.value.end,literal:source.slice(offset+p.value.start,offset+p.value.end)};}}rows.push({locale:node.id.name,strings});}
  for(const[key,value]of Object.entries(node)){if(['loc','start','end','extra'].includes(key))continue;if(Array.isArray(value)){for(const child of value)walk(child);}else if(value&&typeof value==='object')walk(value);}
 };walk(ast);return rows;
}

export function declaredProps(source){return JSON.parse(dcAst(source).attrs["data-props"]||"{}");}
