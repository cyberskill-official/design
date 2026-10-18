// Source declarations only: this inventory does not certify rendering or exports.
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=data=>createHash('sha256').update(data).digest('hex');
export function collectTemplates(base=root) {
  const read=path=>readFileSync(resolve(base,path),'utf8');
  const walk=folder=>readdirSync(resolve(base,folder),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(folder+'/'+e.name):[folder+'/'+e.name]).sort();
  const files=walk('templates'), manifest=JSON.parse(read('_ds_manifest.json'));
  const entries=manifest.templates.map(t=>t.entryPath);
  const actual=files.filter(p=>p.endsWith('.dc.html'));
  if(new Set(entries).size!==entries.length || JSON.stringify([...entries].sort())!==JSON.stringify(actual)) throw Error('Template manifest/source coverage mismatch');
  const inspect=path=>{
    const source=read(path), nodes=[];
    const visit=node=>{nodes.push(node);for(const child of node.childNodes||[])visit(child);if(node.content)visit(node.content);};
    visit(parse(source));
    const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
    const declarations=nodes.filter(n=>attr(n,'data-props')!==undefined).map(n=>JSON.parse(attr(n,'data-props')));
    const imports=[...new Set(nodes.map(n=>attr(n,'component-from-global-scope')).filter(Boolean))].sort();
    const references=[...new Set(nodes.flatMap(n=>['src','href','from'].map(key=>attr(n,key))).filter(Boolean))].sort().map(value=>{
      const dynamic=/\{\{/.test(value), remote=/^(?:[a-z]+:|\/\/)/i.test(value), fragment=value.startsWith('#');
      const local=!dynamic&&!remote&&!fragment;
      const target=local?relative(base,resolve(value.startsWith('/')?base:resolve(base,dirname(path)),value.replace(/^\//,'').split(/[?#]/)[0])):null;
      return {value,kind:dynamic?'dynamic':remote?'external-or-data':fragment?'fragment':'local',...(local?{path:target,exists:existsSync(resolve(base,target))}:{})};
    });
    return {path,sha256:sha(source),declaredProps:declarations,componentImports:imports,references,
      runtime:path.endsWith('.dc.html')?'design-components-compiler-required':'inspect-scripts-and-imports',
      verification:{rendering:'not-established',exports:'not-established',accessibility:'not-established'},contentOwner:null};
  };
  const templates=manifest.templates.map(t=>{
    const inspected=inspect(t.entryPath),path=t.folder+'/content-schema.json';
    const props=new Set(inspected.declaredProps.flatMap(declaration=>Object.keys(declaration)));
    let contentSchema=null;
    if(existsSync(resolve(base,path))) {
      const schema=JSON.parse(read(path));
      contentSchema={path,sha256:sha(read(path)),slots:schema.slots.map(slot=>({...slot,runtimeBinding:props.has(slot.id)?'declared-prop_requires-runtime-verification':'not-a-declared-runtime-prop'}))};
    }
    return {name:t.name,...inspected,contentSchema,supportFiles:files.filter(p=>dirname(p)===t.folder&&p!==t.entryPath).map(path=>({path,sha256:sha(readFileSync(resolve(base,path)))}))};}).sort((a,b)=>a.path.localeCompare(b.path,'en'));
  const kitFiles=walk('ui_kits');
  return {schemaVersion:1,interpretation:'Observed source declarations, not approved capability contracts. Prop options do not prove functioning language/theme support. References cover HTML attributes only, not CSS/JS dependency closure. Static HTML may require scripts or compiler support. Owners and export acceptance must be supplied separately.',templates,
    staticTemplates:files.filter(p=>p.endsWith('.html')&&!p.endsWith('.dc.html')).map(inspect),
    kits:[...new Set(kitFiles.map(p=>p.split('/')[1]))].sort().map(name=>({name,files:kitFiles.filter(p=>p.startsWith('ui_kits/'+name+'/')).map(path=>({path,sha256:sha(readFileSync(resolve(base,path)))})),pages:kitFiles.filter(p=>p.startsWith('ui_kits/'+name+'/')&&p.endsWith('.html')).map(inspect),contentOwner:null,acceptance:'not-established'}))};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  collectTemplates();
  console.log('PASS template inventory: complete DC/static/kit source inventory; capabilities unverified');
}
