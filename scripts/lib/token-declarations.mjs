import postcss from 'postcss';
import {readFileSync} from 'node:fs';
import {resolve,dirname,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';

/** Source declaration inventory, not a computed cascade or cross-platform type inference. */
export function collectTokenDeclarations(root,entry='styles.css') {
  const base=resolve(root),sources=new Map(),declarations=[];
  function visit(path,stack=[]){
    const absolute=resolve(base,path);
    if(!absolute.startsWith(base+sep))throw Error('CSS import escapes repository: '+path);
    const rel=relative(base,absolute).split(sep).join('/');
    if(stack.includes(rel))throw Error('CSS import cycle: '+[...stack,rel].join(' -> '));
    const css=readFileSync(absolute,'utf8');
    sources.set(rel,{path:rel,sha256:createHash('sha256').update(css).digest('hex')});
    const ast=postcss.parse(css,{from:rel});
    function walk(nodes,context=[]){
      for(const node of nodes||[]){
        if(node.type==='atrule'&&node.name.toLowerCase()==='import'){
          if(context.length)throw Error('Nested CSS import is unsupported: '+rel);
          // Current authoring contract uses quoted local imports without qualifiers.
          // Fail on other syntax rather than silently dropping layer/media semantics.
          const match=/^(?:url\(\s*(['"])([^'"]+)\1\s*\)|(['"])([^'"]+)\3)$/.exec(node.params);
          const target=match&&(match[2]||match[4]);
          if(!target||/^(?:[a-z]+:|\/\/|\/)/i.test(target)||/[?#]/.test(target))throw Error('Unsupported CSS import: '+node.params);
          visit(relative(base,resolve(dirname(absolute),target)),[...stack,rel]);
        }else if(node.type==='rule')walk(node.nodes,[...context,{kind:'rule',selector:node.selector}]);
        else if(node.type==='atrule'&&node.nodes)walk(node.nodes,[...context,{kind:'at-rule',name:node.name,params:node.params}]);
        else if(node.type==='decl'&&node.prop.startsWith('--')){
          if(!context.some(c=>c.kind==='rule'))throw Error('Custom property without a rule: '+rel+':'+node.source.start.line);
          declarations.push({order:declarations.length,sourcePath:rel,line:node.source.start.line,column:node.source.start.column,
            name:node.prop,value:node.value,important:Boolean(node.important),visibility:node.prop.startsWith('--cs-')?'public':'private',context:structuredClone(context)});
        }
      }
    }
    walk(ast.nodes);
  }
  visit(entry);
  return {schemaVersion:1,entry,description:'Ordered CSS custom-property declarations. Visibility classifies namespaces; it does not certify lifecycle, resolved values or cross-platform support. Context is preserved and must not be flattened into defaults.',sources:[...sources.values()],declarations};
}

export function manifestTokens(graph,dtcg) {
  const types=new Map();
  for(const [group,entries] of Object.entries(dtcg))if(!group.startsWith('$'))for(const [name,def] of Object.entries(entries))if(!name.startsWith('$'))types.set(name,def.$type);
  return graph.declarations.filter(d=>d.visibility==='public').map(d=>{
    const selectors=d.context.filter(c=>c.kind==='rule').map(c=>c.selector);
    const conditions=d.context.filter(c=>c.kind==='at-rule').map(({name,params})=>({name,params}));
    const unconditionalRoot=d.context.length===1&&selectors[0]===':root';
    return {name:d.name,value:d.value,kind:types.get(d.name)||'css-expression',definedIn:d.sourcePath,
      ...(!unconditionalRoot?{scope:selectors.at(-1)}:{}),...(conditions.length?{conditions}:{}),
      ...(selectors.length>1?{selectorPath:selectors}:{}),important:d.important,declarationOrder:d.order,sourceLine:d.line};
  });
}
