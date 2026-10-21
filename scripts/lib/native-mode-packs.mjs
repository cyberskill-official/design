import {readFileSync,readdirSync,lstatSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {validateDtcgProfile} from '../../_audit/lib/dtcg-profile.mjs';
import {assertCssProjection,nativeTokenName,assertUniqueNativeNames} from './dtcg-values.mjs';
import {modeInputs} from './token-modes.mjs';
export const nativeModeTargets=Object.freeze(['tokens/native/CSModes.swift','tokens/native/CSModes.kt','tokens/native/cs_modes.dart','tokens/native/mode-provenance.json']);
const sha=s=>createHash('sha256').update(s).digest('hex');
const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a<b?-1:a>b?1:0)):x);
export function readNativeModeModel(root){
 root=resolve(root);const directory=join(root,'tokens/modes');const read=path=>{let p=root;for(const part of path.split('/')){p=join(p,part);if(lstatSync(p).isSymbolicLink())throw Error('Native mode source symlink: '+path);}if(lstatSync(p).isSymbolicLink()||!lstatSync(p).isFile())throw Error('Invalid native mode source: '+path);return readFileSync(p,'utf8');};
 const indexText=read('tokens/modes/index.json'),index=JSON.parse(indexText),inputs=modeInputs(root);
 if(index.schemaVersion!==1||index.sourceHash!==inputs.sourceHash||!Array.isArray(index.modes)||index.modes.length!==256)throw Error('Stale or unsupported native mode index');
 const expected=new Map(inputs.modes.map(m=>[m.id,m.mode]));if(new Set(index.modes.map(m=>m.id)).size!==256)throw Error('Duplicate native mode id');
 const membership=index.modes.map(m=>{if(typeof m.file!=='string'||m.file!==m.id+'.dtcg.json'||!/^[a-z0-9_-]+\.dtcg\.json$/.test(m.file))throw Error('Invalid native mode path');return m.file;}).concat('index.json').sort();
 if(canonical(readdirSync(directory).sort())!==canonical(membership))throw Error('Native mode source membership drift');
 const values=[],valueIDs=new Map(),rows=[],rowIDs=new Map(),omissions=[],omissionIDs=new Map(),omissionRows=[],omissionRowIDs=new Map(),modes=[],documents={};let tokens;
 const intern=(v,pool,ids)=>{const key=canonical(v);if(!ids.has(key)){ids.set(key,pool.length);pool.push(v);}return ids.get(key);};
 for(const mode of index.modes){
  if(canonical(expected.get(mode.id))!==canonical(mode.axes))throw Error('Invalid native mode axes: '+mode.id);
  const text=read('tokens/modes/'+mode.file);if(sha(text)!==mode.sha256)throw Error('Native mode document hash drift: '+mode.file);documents[mode.file]=mode.sha256;
  const doc=JSON.parse(text),report=validateDtcgProfile(doc,{colorSpaces:['srgb','oklab']});if(!report.pass)throw Error('Invalid typed native mode: '+JSON.stringify(report.errors));assertCssProjection(doc);
  if(doc.$extensions?.['com.cyberskill']?.sourceHash!==index.sourceHash||doc.$extensions?.['com.cyberskill']?.modeId!==mode.id)throw Error('Native document provenance mismatch');
  const definitions=new Map(Object.entries(doc).filter(([g])=>!g.startsWith('$')).flatMap(([group,entries])=>Object.entries(entries).map(([name,def])=>[group+'.'+name,{group,name,def}])));
  const current=[...definitions.values()].map(({group,name,def})=>{
   if(!/^--cs-[\w-]+$/.test(name)||inputs.inventory.groups[group]?.[name]?.$type!==def.$type)throw Error('Unowned native mode token/type: '+name);
   const identifier=nativeTokenName(name,def);if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)||['class','struct','enum','case','extension','func','var','let','const','final','val','when','is','as','in','object','interface','return','throw','void','new','this','super'].includes(identifier))throw Error('Unsupported native identifier: '+identifier);
   return {css:name,name:identifier,type:def.$type};
  });assertUniqueNativeNames(current);
  if(tokens===undefined)tokens=current;else if(canonical(tokens)!==canonical(current))throw Error('Native mode token membership/type drift');
  function resolved(path,seen=new Set()){
   if(seen.has(path))throw Error('Native mode alias cycle');const entry=definitions.get(path);if(!entry)throw Error('Missing native mode alias');const value=entry.def.$value;
   if(typeof value==='string'&&/^\{[^{}]+\}$/.test(value)){const target=value.slice(1,-1);if(definitions.get(target)?.def.$type!==entry.def.$type)throw Error('Native mode alias type mismatch');return resolved(target,new Set([...seen,path]));}
   if(!['color','dimension','number','shadow','duration','cubicBezier','fontFamily'].includes(entry.def.$type))throw Error('Unsupported native mode type: '+entry.def.$type);
   // Every shadow getter exposes an ordered layer list, including a single layer.
   return entry.def.$type==='shadow'&&!Array.isArray(value)||entry.def.$type==='fontFamily'&&typeof value==='string'?[value]:value;
  }
  const row=[...definitions].map(([path,{def}])=>intern({type:def.$type,value:resolved(path)},values,valueIDs));
  const expectedOmitted=inputs.names.filter(name=>!current.some(token=>token.css===name)).sort();
  if(!Array.isArray(mode.omissions)||canonical(mode.omissions.map(o=>o.name).sort())!==canonical(expectedOmitted)||mode.omissions.length!==12||new Set(mode.omissions.map(o=>o.name)).size!==12||mode.omissions.some(o=>typeof o.name!=='string'||typeof o.reason!=='string'||typeof o.resolvedCss!=='string'))throw Error('Invalid native mode omissions');
  if(current.length!==inputs.names.length-mode.omissions.length)throw Error('Native typed/omitted token coverage mismatch');
  const omissionRow=mode.omissions.map(o=>intern(o,omissions,omissionIDs));
  modes.push({id:mode.id,axes:mode.axes,row:intern(row,rows,rowIDs),omissions:intern(omissionRow,omissionRows,omissionRowIDs)});
 }
 return {tokens,values,rows,omissions,omissionRows,modes,provenance:{schemaVersion:1,modeSourceHash:index.sourceHash,modeIndexSha256:sha(indexText),modeDocumentsSha256:sha(canonical(documents)),modeCount:modes.length,typedTokensPerMode:tokens.length,uniqueTypedValues:values.length,uniqueValueRows:rows.length,omittedTokensPerMode:12,uniqueOmissions:omissions.length,uniqueOmissionRows:omissionRows.length,normalization:'Shadow tokens expose ordered layer lists; a scalar font family exposes a one-item font list. Other DTCG values and units are preserved exactly; no gamut or UI-unit conversion.',interpretation:'Explicit typed native data resolution only. No OS inference, platform color/unit/shadow rendering adapter, arbitrary nested CSS scope, device acceptance or manual accessibility certification.',producerHashes:Object.fromEntries(['scripts/generate-native-mode-packs.mjs','scripts/lib/native-mode-packs.mjs','scripts/lib/native-mode-renderers.mjs','scripts/lib/dtcg-values.mjs','_audit/lib/dtcg-profile.mjs'].map(p=>[p,sha(read(p))]))}};
}
