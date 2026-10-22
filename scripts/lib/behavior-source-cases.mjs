import{parse as parseHtml}from'parse5';import{parse as parseJs}from'@babel/parser';
const walk=(node,visit)=>{if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node)){if(['loc','start','end','extra'].includes(key))continue;if(Array.isArray(value)){for(const child of value)walk(child,visit);}else if(value&&typeof value==='object')walk(value,visit);}};
export function behaviorSourceCases(source,componentNames){
 const dom=parseHtml(source,{sourceCodeLocationInfo:true}),scripts=[];const htmlWalk=node=>{if(node.tagName==='script'&&!node.attrs.some(a=>a.name==='src'))scripts.push(node);for(const child of node.childNodes||[])htmlWalk(child);};htmlWalk(dom);
 const names=new Set(componentNames),cases=[];
 for(const script of scripts){const offset=script.sourceCodeLocation.startTag.endOffset,end=script.sourceCodeLocation.endTag.startOffset,code=source.slice(offset,end),ast=parseJs(code,{sourceType:'script',plugins:['jsx']});
  walk(ast,node=>{if(node.type!=='CallExpression'||node.callee.type!=='Identifier'||node.callee.name!=='test'||node.arguments[0]?.type!=='StringLiteral'||!['ArrowFunctionExpression','FunctionExpression'].includes(node.arguments[1]?.type))return;
   const callback=node.arguments[1],components=new Set(),assertions=[];
   walk(callback,child=>{if(child.type!=='CallExpression')return;if(child.callee.type==='Identifier'&&child.callee.name==='assert')assertions.push({start:offset+child.start,end:offset+child.end,source:source.slice(offset+child.start,offset+child.end)});
    const create=child.callee.type==='Identifier'&&child.callee.name==='h'||child.callee.type==='MemberExpression'&&child.callee.property.name==='createElement';if(!create)return;const target=child.arguments[0];const name=target?.type==='Identifier'?target.name:target?.type==='MemberExpression'&&['CS','NS'].includes(target.object?.name)?target.property?.name:null;if(names.has(name))components.add(name);
   });
   cases.push({name:node.arguments[0].value,components:[...components].sort(),start:offset+node.start,end:offset+node.end,assertions});
  });
 }if(new Set(cases.map(c=>c.name)).size!==cases.length)throw Error('Ambiguous named behavior test');return cases;
}
