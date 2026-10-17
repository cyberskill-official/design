// Compiler-derived declared API facts. This is not a support or acceptance registry.
import {API, SignatureKind, SymbolFlags} from 'typescript/unstable/sync';
import {readFileSync,writeFileSync,mkdtempSync,rmSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateSupport} from './lib/component-support.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFileSync(resolve(root,path),'utf8');
const hash=path=>createHash('sha256').update(read(path)).digest('hex');
const manifest=JSON.parse(read('_ds_manifest.json'));
const lifecycle=JSON.parse(read('components/lifecycle.json'));
const temp=mkdtempSync(join(tmpdir(),'cs-api-index-'));
const config=join(temp,'tsconfig.json'),entry=resolve(root,'_esm/react.d.ts');
writeFileSync(config,JSON.stringify({compilerOptions:{strict:true,skipLibCheck:false,types:[],target:'ES2022',module:'ESNext',moduleResolution:'Bundler',paths:{react:[resolve(root,'node_modules/@types/react/index.d.ts')],'react/*':[resolve(root,'node_modules/@types/react/*')]}},files:[entry]}));
const api=new API({cwd:root});
try {
  const snapshot=api.updateSnapshot({openProjects:[config]});
  const project=snapshot.getProject(config),{program,checker}=project;
  const diagnostics=[...program.getSyntacticDiagnostics(),...program.getSemanticDiagnostics()];
  if(diagnostics.length)throw Error('Public declarations have compiler diagnostics; run npm run test:types');
  const source=program.getSourceFile(entry);
  const symbols=new Map(checker.getExportsOfModule(checker.getSymbolAtLocation(source)).map(symbol=>[symbol.name,symbol]));
  const propDefinitions=new Map();
  const exports=manifest.components.map(item=>{
    const symbol=symbols.get(item.name);
    if(!symbol)throw Error('Public declaration export missing: '+item.name);
    const type=checker.getTypeOfSymbol(symbol);
    const calls=checker.getSignaturesOfType(type,SignatureKind.Call);
    if(item.kind==='component' && calls.length!==1)throw Error('Expected one component call signature: '+item.name);
    const declarationSymbol=symbol.flags&SymbolFlags.Alias?checker.getAliasedSymbol(symbol):symbol;
    const handle=declarationSymbol.valueDeclaration||declarationSymbol.declarations[0];
    const sourceNames=program.getSourceFileNames();
    const originalPath=sourceNames.find(path=>path===handle.path)||sourceNames.find(path=>path.toLowerCase()===handle.path.toLowerCase());
    const declarationPath=relative(root,originalPath||handle.path);
    if(declarationPath.startsWith('..'))throw Error('Public declaration outside repository: '+item.name);
    const promptPath=item.sourcePath.replace(/\.jsx?$/,'.prompt.md');
    const parameter=calls[0]?.getParameters()[0];
    const propsType=parameter?checker.getTypeOfSymbol(parameter):null;
    const props=propsType?checker.getPropertiesOfType(propsType).map(prop=>{
      const definition={
      name:prop.name,optional:!!(prop.flags&SymbolFlags.Optional),
      type:checker.typeToString(checker.getTypeOfSymbol(prop)),
      description:prop.declarations.some(declaration=>!declaration.path.includes('/node_modules/'))?prop.getDocumentationComment(checker):'',
      };
      const serialized=JSON.stringify(definition),id='p-'+createHash('sha256').update(serialized).digest('hex').slice(0,16);
      if(propDefinitions.has(id)&&JSON.stringify(propDefinitions.get(id))!==serialized)throw Error('Prop definition hash collision');
      propDefinitions.set(id,definition);
      return {name:prop.name,definition:id};
    }).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0):[];
    return {name:item.name,kind:item.kind,sourcePath:item.sourcePath,declarationPath,
      promptPath:existsSync(resolve(root,promptPath))?promptPath:null,
      sourceSha256:hash(item.sourcePath),declarationSha256:hash(declarationPath),
      declaredLifecycle:lifecycle.components[item.name].status,
      support:validateSupport(lifecycle.components[item.name].support,root),
      signature:checker.typeToString(type),props,
      supportEvidence:'not_established_by_this_index'};
  }).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);
  const output={schemaVersion:1,
    interpretation:'Compiler-derived declarations, including inherited native props. Documentation prose is included only for repository-authored prop declarations. Type display strings may use aliases or abbreviate complex types; declarations remain authoritative. Export presence, lifecycle labels and declared props do not prove runtime support, ownership, accessibility or acceptance.',
    compiler:{typescript:JSON.parse(read('node_modules/typescript/package.json')).version,reactTypes:JSON.parse(read('node_modules/@types/react/package.json')).version,api:'typescript/unstable/sync'},
    sourceHashes:Object.fromEntries(['scripts/generate-api-index.mjs','scripts/lib/component-support.mjs','_esm/react.d.ts','components/lifecycle.json'].map(path=>[path,hash(path)])),
    propDefinitions:Object.fromEntries([...propDefinitions].sort(([a],[b])=>a<b?-1:a>b?1:0)),exports};
  const text=JSON.stringify(output,null,2)+'\n',path='components/api-index.json';
  if(process.argv.includes('--check')){
    if(!existsSync(resolve(root,path))||read(path)!==text)throw Error('Declared API index stale; run npm run build:api-index');
  }else writeFileSync(resolve(root,path),text);
  console.log(`${process.argv.includes('--check')?'PASS':'Generated'} declared API index: ${exports.length} exports, ${exports.reduce((n,e)=>n+e.props.length,0)} prop declarations; support acceptance remains separate`);
} finally {api.close();rmSync(temp,{recursive:true,force:true})}
