import {parse} from 'parse5';
import postcss from 'postcss';
const HEX=/#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/gi;
const clean=value=>String(value).replace(/\s+/g,' ').trim();
/** Inventory literal contexts, not arbitrary regex matches in numeric HTML entities. */
export function templateHexLiterals(source) {
 const rows=new Map(),covered=[];
 const cover=location=>{if(location&&Number.isInteger(location.startOffset)&&Number.isInteger(location.endOffset))covered.push([location.startOffset,location.endOffset]);};
 function add(kind,context,value){for(const match of String(value).matchAll(HEX)){const row={kind,context:clean(context),hex:match[0].toUpperCase()},key=JSON.stringify(row);if(!rows.has(key))rows.set(key,{...row,count:0});rows.get(key).count++;}}
 function css(text,kind,owner){
  const sheet=postcss.parse(kind==='inline-style'?'x{'+text+'}':text);
  sheet.walkDecls(declaration=>{
   const parents=[];for(let node=declaration.parent;node&&node.type!=='root';node=node.parent)parents.unshift(node.type==='atrule'?'@'+node.name+' '+node.params:node.selector);
   const context=(owner?'('+owner+') ':'')+(kind==='inline-style'?'':parents.join(' > ')+' | ')+declaration.prop+':'+declaration.value+(declaration.important?'!important':'');
   add(kind,context,declaration.value);
  });
 }
 function walk(node,parent){
  if(node.tagName==='style'){cover(node.sourceCodeLocation);css(node.childNodes.map(child=>child.value||'').join(''),'stylesheet','');return;}
  for(const attr of node.attrs||[]){cover(node.sourceCodeLocation?.attrs?.[attr.name]);if(attr.name==='style')css(attr.value,'inline-style',node.tagName+(node.attrs.find(a=>a.name==='class')?.value?' class='+node.attrs.find(a=>a.name==='class').value:''));
  else add('attribute',node.tagName+'@'+attr.name+'='+attr.value,attr.value);}
  if(node.nodeName==='#text'){cover(node.sourceCodeLocation);add(parent?.tagName==='script'?'script':'text',node.value,node.value);}
  for(const child of node.childNodes||[])walk(child,node);
  if(node.content)walk(node.content,node);
 }
 walk(parse(source,{sourceCodeLocationInfo:true}),null);
 // Native HTML parsing may discard malformed table-control markup. Retain any
 // unparsed source literals rather than letting those source contexts evade review.
 for(const match of source.matchAll(HEX))if(source[match.index-1]!=='&'&&!covered.some(([start,end])=>match.index>=start&&match.index<end)){
  const start=source.lastIndexOf('\n',match.index)+1,end=source.indexOf('\n',match.index);
  add('raw-source',source.slice(start,end<0?source.length:end),match[0]);
 }
 return [...rows.values()].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
export function checkTemplateHexPolicy(sources,policy) {
 if(policy.schemaVersion!==1||!Array.isArray(policy.exceptions))throw Error('Invalid template hex policy');
 const key=row=>JSON.stringify([row.path,row.kind,row.context,row.hex]);
 const expected=new Map();
 for(const row of policy.exceptions){if(!row.reason?.trim()||!Number.isSafeInteger(row.count)||row.count<1||expected.has(key(row)))throw Error('Invalid template hex exception');expected.set(key(row),row);}
 const actual=new Map(sources.flatMap(([path,source])=>templateHexLiterals(source).map(row=>[key({path,...row}),{path,...row}])));
 const problems=[];
 for(const [id,row]of actual){const approved=expected.get(id);if(!approved)problems.push({type:'unreviewed',...row});else if(row.count!==approved.count)problems.push({type:'count-changed',...row,approvedCount:approved.count});}
 for(const [id,row]of expected)if(!actual.has(id))problems.push({type:'stale-exception',...row});
 return {pass:problems.length===0,files:sources.length,contexts:actual.size,literals:[...actual.values()].reduce((total,row)=>total+row.count,0),problems};
}
