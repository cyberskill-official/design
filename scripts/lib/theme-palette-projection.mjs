import {readFileSync,lstatSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';
import {valueFromCss} from './dtcg-values.mjs';
export const themePalettePaths=Object.freeze(['tokens/colors.css','tokens/component-tokens.css','tokens/elevation.css']);
export const themePaletteSource='tokens/theme-palette-source.json';
function safeRead(root,path){
  // Exact authored targets only. Check every descendant before reading; a
  // symlink must not expand source ownership outside this bounded projection.
  let current=resolve(root);for(const part of path.split('/')){current=join(current,part);if(lstatSync(current).isSymbolicLink())throw Error('Theme palette symlink rejected: '+path);}
  if(!lstatSync(current).isFile())throw Error('Theme palette input is not a regular file: '+path);
  return readFileSync(current,'utf8');
}
export function projectThemePalettes(root,authored){
  root=root instanceof URL?fileURLToPath(root):root;
  const input=authored??JSON.parse(safeRead(root,themePaletteSource));
  if(input.schemaVersion!==1||!input.files||Object.keys(input).some(k=>!['schemaVersion','scope','files'].includes(k))||JSON.stringify(Object.keys(input.files).sort())!==JSON.stringify([...themePalettePaths].sort()))throw Error('Invalid theme palette target membership');
  const outputs={};
  for(const path of themePalettePaths){
    const css=safeRead(root,path),values=input.files[path];if(!values||Array.isArray(values))throw Error('Invalid theme palette values: '+path);
    for(const [property,value]of Object.entries(values)){
      if(typeof value!=='string'||value.trim()!==value||/[;{}\r\n!]/.test(value))throw Error('Invalid theme palette value: '+property);
      if(property==='color-scheme'){if(path!=='tokens/colors.css'||value!=='dark')throw Error('Invalid dark color-scheme');}
      else if(property.startsWith('--cs-shadow-'))valueFromCss('shadow',value);
      else if(property.startsWith('--cs-'))valueFromCss('color',value);
      else throw Error('Invalid theme palette property: '+property);
    }
    const ast=postcss.parse(css),rules=[];
    ast.walkRules(rule=>{
      if(rule.selector==='[data-theme="dark"]'&&rule.parent.type==='root')rules.push({kind:'dark',rule});
      if(rule.selector==='[data-theme="system"]'&&rule.parent.type==='atrule'&&rule.parent.name==='media'&&rule.parent.params==='(prefers-color-scheme: dark)'&&rule.parent.parent.type==='root')rules.push({kind:'system',rule});
    });
    if(rules.length!==2||new Set(rules.map(r=>r.kind)).size!==2)throw Error('Ambiguous theme palette mirror blocks: '+path);
    const edits=[];
    for(const {rule}of rules){
      if(rule.nodes.some(n=>!['decl','comment'].includes(n.type)))throw Error('Unsupported theme mirror node: '+path);
      const declarations=rule.nodes.filter(n=>n.type==='decl');if(JSON.stringify(declarations.map(d=>d.prop))!==JSON.stringify(Object.keys(values)))throw Error('Theme palette declaration membership/order drift: '+path);
      for(const d of declarations){if(d.important||d.raws.value)throw Error('Unsupported theme declaration syntax: '+path+' '+d.prop);const start=d.source.start.offset+d.prop.length+d.raws.between.length,end=start+d.value.length;if(css.slice(start,end)!==d.value)throw Error('Unverified theme declaration span: '+path);edits.push({start,end,value:values[d.prop]});}
    }
    let projected=css;for(const edit of edits.sort((a,b)=>b.start-a.start))projected=projected.slice(0,edit.start)+edit.value+projected.slice(edit.end);outputs[path]=projected;
  }
  return outputs;
}
export function assertThemePaletteFreshness(root){
  root=root instanceof URL?fileURLToPath(root):root;
  for(const [path,text]of Object.entries(projectThemePalettes(root)))if(safeRead(root,path)!==text)throw Error('Stale theme palette mirror: '+path+'; run node scripts/generate-theme-palettes.mjs');
}
