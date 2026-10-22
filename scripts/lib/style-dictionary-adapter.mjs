// Lossless interchange adapter for the CyberSkill DTCG export. Tested against
// Style Dictionary 5.5.5. CSS stays authoritative; transformed tool values are
// never written back as authoring values. No dependency on Style Dictionary.
import {validateDtcgProfile} from '../../_audit/lib/dtcg-profile.mjs';
import {verifyDeclarationGraph} from './token-graph-reference.mjs';
import {assertCssProjection} from './dtcg-values.mjs';
const clone=value=>structuredClone(value);
const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}':JSON.stringify(value);

export function createStyleDictionaryAdapter(document,{declarationsJson,colorSpaces}={}) {
  const report=validateDtcgProfile(document,{colorSpaces});
  if(!report.pass)throw Error('Invalid DTCG export: '+JSON.stringify(report.errors));
  assertCssProjection(document);
  const reference=clone(document.$extensions?.['com.cyberskill']?.declarationGraph);
  if(declarationsJson!==undefined)verifyDeclarationGraph(reference,declarationsJson);
  const envelope=clone(document),expected=new Map();
  // Retain root/group metadata separately: Style Dictionary's token dictionary
  // intentionally omits it. Null slots cannot conceal missing tool output.
  for(const [group,entries] of Object.entries(document))if(!group.startsWith('$'))for(const [name,def] of Object.entries(entries)){
    if(name.startsWith('$'))continue;
    expected.set(`${group}.${name}`,clone(def));envelope[group][name]=null;
  }
  function exportDtcg(dictionary) {
    if(!Array.isArray(dictionary?.allTokens))throw Error('Expected a Style Dictionary allTokens array');
    const found=new Map();
    for(const token of dictionary.allTokens){
      if(!Array.isArray(token.path)||token.path.length!==2)throw Error('Unexpected token path');
      const path=token.path.join('.');
      if(!expected.has(path))throw Error('Unexpected token: '+path);
      if(found.has(path))throw Error('Duplicate token: '+path);
      const original=clone(token.original);
      // v5.5.5 annotates original with its computed key even for inline input.
      // Strip only that verified tool field; unknown fields still fail closed.
      if(original&&Object.hasOwn(original,'key')){
        if(original.key!==`{${path}}`)throw Error('Unexpected original key: '+path);
        delete original.key;
      }
      if(!original||canonical(original)!==canonical(expected.get(path)))throw Error('Original token data lost or changed: '+path);
      found.set(path,original);
    }
    const output=clone(envelope);
    for(const [path] of expected){
      if(!found.has(path))throw Error('Missing token: '+path);
      const [group,name]=path.split('.');output[group][name]=found.get(path);
    }
    return output;
  }
  function formatDtcg({dictionary}) {return JSON.stringify(exportDtcg(dictionary),null,2)+'\n';}
  function formatBaseCss({dictionary}) {
    const output=exportDtcg(dictionary),lines=[
      '/* CyberSkill base-token projection. Companion DTCG retains all scope data.',
      ' * This file alone does not implement theme/element/density composition;',
      ' * use canonical styles.css for the complete runtime contract. */',':root {'
    ];
    for(const [group,entries] of Object.entries(output))if(!group.startsWith('$'))for(const [name,def] of Object.entries(entries)){
      if(name.startsWith('$'))continue;
      // Values have been independently checked against typed data before this
      // adapter is created. This avoids the tool's duration-object string bug.
      lines.push(`  ${name}: ${def.$extensions['com.cyberskill'].css};`);
    }
    return lines.concat('}','').join('\n');
  }
  function exportFiles(dictionary) {
    if(declarationsJson===undefined)throw Error('Companion declarationsJson is required for file-bundle export');
    verifyDeclarationGraph(reference,declarationsJson);
    return {'tokens.dtcg.json':JSON.stringify(exportDtcg(dictionary),null,2)+'\n','declarations.json':declarationsJson};
  }
  return Object.freeze({exportDtcg,formatDtcg,formatBaseCss,exportFiles});
}
