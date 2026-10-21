import{readFileSync,writeFileSync,readdirSync,statSync,lstatSync}from'node:fs';
import{resolve,dirname,relative,sep}from'node:path';
import{fileURLToPath}from'node:url';
import{literalDeclarations,localeDictionaries,declaredProps,staticValue}from'./lib/template-literals.mjs';
import{parseExpression}from'@babel/parser';
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const literal=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
export function projectTemplateLiterals(source,binding,data,{adopt=false}={}){
 const props=declaredProps(source);if(!equal(props.element?.options,Object.keys(data.elementMap))||!Object.hasOwn(data.elementMap,props.element?.default))throw Error(binding.file+': authored axis metadata drift');
 const declarations=literalDeclarations(source).filter(row=>row.name===binding.axisDeclaration);
 if(declarations.length!==1)throw Error(binding.file+': expected one authored axis declaration');
 const dictionaries=localeDictionaries(source),edits=[];
 const add=(row,value,id,lexicalException)=>{
  const open=`/* @generated template-literal:${id} */`,close=`/* @endgenerated template-literal:${id} */`;
  const before=source.slice(0,row.start).endsWith(open+' '),after=source.slice(row.end).startsWith(' '+close);
  if(before!==after)throw Error(binding.file+': incomplete literal fence '+id);
  if(!before&&!adopt)throw Error(binding.file+': missing generated fence '+id);
  if(!before&&!equal(row.value,value))throw Error(binding.file+': refusing to adopt changed literal '+id);
  let text=literal(value);
  if(lexicalException!==undefined){if(typeof lexicalException!=='string'||/<\/script[\s>]/i.test(lexicalException))throw Error('Unsafe literal spelling metadata');const parsed=parseExpression(lexicalException);if(parsed.type!=='StringLiteral')throw Error('Non-string literal spelling metadata');if(equal(parsed.value,value))text=lexicalException;}
  // Initial adoption adds comments only; lexical spelling and every other byte
  // must already match the canonical data. No silent quote/escape rewrites.
  if(!before&&row.literal!==text)throw Error(binding.file+': noncanonical literal spelling '+id);
  edits.push({start:row.start-(before?open.length+1:0),end:row.end+(after?close.length+1:0),text:open+' '+text+' '+close,id});
 };
 add(declarations[0],data.elementMap,'axis.element-map');
 for(const entry of binding.copy){const phrase=data.commonCopy[entry.id];if(!phrase)throw Error('Unknown canonical copy '+entry.id);for(const locale of['en','vi']){const candidates=dictionaries.filter(row=>row.locale===locale);if(candidates.length!==1||!candidates[0].strings[entry.key])throw Error(binding.file+': expected literal dictionary property '+locale+'.'+entry.key);const row=candidates[0].strings[entry.key];add(row,phrase[locale],'copy.'+entry.id+'.'+locale);}}
 const dictionaryKeys=new Set();
 for(const[locale,values]of Object.entries(binding.dictionaries||{})){
  if(!['en','vi'].includes(locale)||!values||typeof values!=='object'||Array.isArray(values))throw Error('Invalid authored dictionary');
  const candidates=dictionaries.filter(row=>row.locale===locale);if(candidates.length!==1)throw Error(binding.file+': expected literal dictionary property '+locale);
  for(const[key,value]of Object.entries(values)){
   if(typeof value!=='string'||['__proto__','constructor','prototype'].includes(key)||binding.copy.some(x=>x.key===key))throw Error('Overlapping or invalid dictionary ownership');
   const row=candidates[0].strings[key];if(!row)throw Error(binding.file+': expected literal dictionary property '+locale+'.'+key);
   dictionaryKeys.add(locale+'.'+key);add(row,value,'dictionary.'+locale+'.'+Buffer.from(key).toString('hex'),binding.lexicalExceptions?.[locale]?.[key]);
  }
 }
 for(const dictionary of dictionaries)for(const key of Object.keys(dictionary.strings))if(!binding.copy.some(x=>x.key===key)&&!dictionaryKeys.has(dictionary.locale+'.'+key))throw Error(binding.file+': unowned dictionary property '+dictionary.locale+'.'+key);
 for(const[locale,entries]of Object.entries(binding.lexicalExceptions||{}))for(const key of Object.keys(entries))if(!Object.hasOwn(binding.dictionaries?.[locale]||{},key))throw Error('Unowned literal spelling metadata');
 const expected=edits.map(e=>e.id).sort(),actual=[...source.matchAll(/\/\* @generated template-literal:([a-z0-9.-]+) \*\//g)].map(m=>m[1]).sort();
 const remaining=[...expected];for(const id of actual){const position=remaining.indexOf(id);if(position<0)throw Error(binding.file+': unowned or ambiguous literal fence '+id);remaining.splice(position,1);}
 if(!adopt&&remaining.length)throw Error(binding.file+': missing owned literal region');
 edits.sort((a,b)=>b.start-a.start);for(let i=1;i<edits.length;i++)if(edits[i].end>edits[i-1].start)throw Error('Overlapping literal projections');
 let output=source;for(const edit of edits)output=output.slice(0,edit.start)+edit.text+output.slice(edit.end);
 const locales=localeDictionaries(output);if(locales.length===2){const en=locales.find(r=>r.locale==='en'),vi=locales.find(r=>r.locale==='vi');if(en&&vi)for(const[key,row]of Object.entries(en.strings)){const other=vi.strings[key];if(!other)continue;const matches=Object.entries(data.commonCopy).filter(([,phrase])=>phrase.en===row.value&&phrase.vi===other.value);if(matches.length>1)throw Error('Ambiguous canonical phrase');if(matches.length===1&&!binding.copy.some(b=>b.key===key&&b.id===matches[0][0]))throw Error(binding.file+': unowned common copy '+key);}}
 return{output,regions:edits.length};
}
export function generateTemplateLiterals(root,{check=false,adopt=false,data}={}){
 data??=JSON.parse(readFileSync(resolve(root,'scripts/template-literals-source.json'),'utf8'));if(data.schemaVersion!==1)throw Error('Unsupported authored template literal schema');
 if(Object.keys(data.elementMap).length!==15||!Object.values(data.elementMap).every(v=>Array.isArray(v)&&v.length===2&&v.every(s=>typeof s==='string')))throw Error('Expected existing15entryelementmap');
 for(const[id,phrase]of Object.entries(data.commonCopy))if(!/^[a-z0-9-]+$/.test(id)||!equal(Object.keys(phrase),['en','vi'])||!Object.values(phrase).every(v=>typeof v==='string'))throw Error('Unsupported common-copy entry');
 const actual=[];const walk=dir=>{for(const n of readdirSync(dir)){const p=resolve(dir,n);if(lstatSync(p).isSymbolicLink())throw Error('Symbolic template input');if(statSync(p).isDirectory()){if(!n.startsWith('_'))walk(p);}else if(p.endsWith('.dc.html'))actual.push(relative(root,p).split(sep).join('/'));}};walk(resolve(root,'templates'));
 const expected=data.templates.map(t=>t.file);if(new Set(expected).size!==expected.length||!equal([...expected].sort(),actual.sort()))throw Error('Authored template inventory drift');
 const projections=data.templates.map(binding=>{if(!binding.file.startsWith('templates/')||binding.file.includes('..')||!binding.file.endsWith('.dc.html'))throw Error('Invalid template path');const file=resolve(root,binding.file),source=readFileSync(file,'utf8');return{file,source,...projectTemplateLiterals(source,binding,data,{adopt})};});
 const changed=projections.filter(p=>p.output!==p.source);if(check&&changed.length)throw Error('Generated template literals drift: '+changed.map(p=>relative(root,p.file)).join(', '));
 // Validate every projection before writing the first output.
 if(!check)for(const p of changed)writeFileSync(p.file,p.output);
 return{templates:projections.length,regions:projections.reduce((n,p)=>n+p.regions,0),changed:changed.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),index=args.indexOf('--root'),root=index<0?resolve(dirname(fileURLToPath(import.meta.url)),'..'):resolve(args[index+1]);
 console.log(JSON.stringify(generateTemplateLiterals(root,{check:args.includes('--check'),adopt:args.includes('--adopt')})));
}
