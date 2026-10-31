import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parse} from '@babel/parser';
import Ajv from 'ajv';
import {sourceInventory} from './generate-prompt-api.mjs';
import {exportedFunction} from './lib/component-export.mjs';
import {createSemanticEvidenceReader} from './lib/component-semantic-evidence.mjs';
import {behaviorSourceCases} from './lib/behavior-source-cases.mjs';
const sha=text=>createHash('sha256').update(text).digest('hex');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function walk(node,visit,parent=null){if(!node||typeof node!=='object')return;visit(node,parent);for(const[key,value]of Object.entries(node)){if(['loc','start','end','extra','comments','tokens'].includes(key))continue;if(Array.isArray(value))value.forEach(child=>walk(child,visit,node));else if(value&&typeof value==='object')walk(value,visit,node)}}
const span=node=>({start:node.start,end:node.end});
function jsxName(node){return node.type==='JSXIdentifier'?node.name:node.type==='JSXMemberExpression'?jsxName(node.object)+'.'+jsxName(node.property):node.type==='JSXNamespacedName'?jsxName(node.namespace)+':'+jsxName(node.name):'unknown'}
export function sourceFacts(source,name,props){
 const ast=parse(source,{sourceType:'module',plugins:['jsx']}),render=exportedFunction(ast,name),facts={analysis:render?render.kind:'unsupported-render-expression',renderSpan:render?span(render.node):null,jsxElements:[],slotCandidates:[],keyboardLiterals:[]};if(!render)return facts;
 walk(render.node,(node,parent)=>{
  if(node.type==='JSXOpeningElement'){
   const tag=jsxName(node.name),attributes=[],spreads=[];
   for(const attr of node.attributes){if(attr.type==='JSXSpreadAttribute'){spreads.push({...span(attr),expression:source.slice(attr.argument.start,attr.argument.end),forwarding:'unverified-target-and-precedence'});continue;}
    const value=attr.value;attributes.push({name:jsxName(attr.name),...span(attr),kind:value===null?'boolean-presence':value.type==='StringLiteral'?'string-literal':'expression',source:value===null?'true':source.slice(value.start,value.end)});
   }
   facts.jsxElements.push({tag,kind:/^[a-z]/.test(tag)?'intrinsic':tag.includes('.')?'member-expression':'component-or-dynamic',...span(node),attributes,spreads});
  }
  if(node.type==='JSXExpressionContainer'&&['JSXElement','JSXFragment'].includes(parent?.type)&&node.expression.type!=='JSXEmptyExpression'){
   const referenced=new Set();walk(node.expression,child=>{if(child.type==='Identifier'&&props.includes(child.name))referenced.add(child.name)});
   if(referenced.size)facts.slotCandidates.push({...span(node),source:source.slice(node.expression.start,node.expression.end),referencedParameterNames:[...referenced].sort(),interpretation:'Expression references parameter names; lexical shadowing, conditional rendering and semantic slot ownership require manual review.'});
  }
  if(node.type==='StringLiteral'&&/^(Arrow(Left|Right|Up|Down)|Home|End|Enter|Escape|Tab| |Space|PageUp|PageDown|Backspace|Delete)$/.test(node.value))facts.keyboardLiterals.push({value:node.value,...span(node),interpretation:'Observed literal, not a keyboard behavior guarantee.'});
 });return facts;
}
function ownedObject(value,keys,label){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!keys.includes(key)))throw Error('Unknown or invalid authored field '+label)}
export function generateComponentSpecifications(root,{check=false}={}){
 const read=path=>readFileSync(resolve(root,path),'utf8'),{api,contracts}=sourceInventory(root),components=api.exports.filter(e=>e.kind==='component'),names=components.map(c=>c.name),authored=JSON.parse(read('scripts/component-semantics-source.json'));
 ownedObject(authored,['schemaVersion','interpretation','components','unmappedNamedCases'],'root');
 if(authored.schemaVersion!==1||!authored.components||Object.keys(authored.components).some(name=>!names.includes(name)))throw Error('Unknown authored semantics membership');
 const paths=['_audit/component-behavior-test.html','_audit/a11y-gate.html'],boards=paths.map(path=>({path,sha256:sha(read(path)),cases:behaviorSourceCases(read(path),names)}));
 const evidenceReader=createSemanticEvidenceReader(root,boards);
 const records=components.map(item=>{
  const source=read(item.sourcePath),contract=contracts.components.find(c=>c.name===item.name),own=item.props.filter(p=>api.propDefinitions[p.definition].origin==='authored'),facts=sourceFacts(source,item.name,contract.runtime.props),curated=authored.components[item.name]||{},semanticCategories={};
  ownedObject(curated,['semantics','requirements'],item.name);if(curated.semantics)ownedObject(curated.semantics,['anatomy','slots','roles','states','keyboard','examples'],item.name+'.semantics');
  if(Object.keys(curated).some(key=>!['semantics','requirements'].includes(key)))throw Error('Unknown curated component field '+item.name);
  for(const category of ['anatomy','slots','roles','states','keyboard','examples']){
   const entries=curated.semantics?.[category]||[];
   semanticCategories[category]={status:entries.length?'bounded-source-reviewed':'unverified',entries:entries.map(entry=>{ownedObject(entry,['statement','sourceSnippets','sourcePath','sourceSha256'],item.name+'.'+category);if(typeof entry.statement!=='string'||!entry.statement.trim()||!Array.isArray(entry.sourceSnippets)||!entry.sourceSnippets.length)throw Error('Invalid semantic source entry '+item.name);return{statement:entry.statement,evidence:evidenceReader.evidence(item,entry)}}),scope:entries.length?'Only the listed source facts are reviewed; completeness and runtime acceptance are not inferred.':'No authored semantic review recorded. Source observations and fixture references are available separately.'};
  }
  if(curated.semantics&&Object.keys(curated.semantics).some(key=>!Object.hasOwn(semanticCategories,key)))throw Error('Unknown semantic category '+item.name);
  const fixtureReferences=boards.flatMap(board=>board.cases.filter(c=>c.components.includes(item.name)).map(c=>({testPath:board.path,testSha256:board.sha256,caseName:c.name,caseSpan:{start:c.start,end:c.end},assertions:c.assertions.map(a=>({start:a.start,end:a.end,source:a.source})),status:'fixture-reference-only',scope:'A constructor appears in this case; incidental fixture presence does not establish component behavior coverage.'})));
  const requirements=(curated.requirements||[]).map(requirement=>{
   ownedObject(requirement,['id','statement','testPath','caseName','assertions'],item.name+'.requirement');if(typeof requirement.id!=='string'||!requirement.id||typeof requirement.statement!=='string'||!requirement.statement.trim())throw Error('Invalid requirement identity '+item.name);
   const board=boards.find(b=>b.path===requirement.testPath),test=board?.cases.find(c=>c.name===requirement.caseName);if(!test||!test.components.includes(item.name))throw Error('Missing requirement case/component '+item.name);
   if(!requirement.assertions?.length)throw Error('Requirement needs exact assertions '+item.name);
   return{id:requirement.id,statement:requirement.statement,testPath:board.path,testSha256:board.sha256,caseName:test.name,contextComponents:test.components,assertions:requirement.assertions.map(source=>{const matches=test.assertions.filter(a=>a.source===source);if(matches.length!==1)throw Error('Missing or ambiguous exact assertion '+item.name+': '+source);return matches[0]}),status:'authored-assertion-mapping',execution:'Requires a separately source-matched passing runtime receipt; this generated document makes no execution claim.'};
  });
  if(new Set(requirements.map(r=>r.id)).size!==requirements.length)throw Error('Duplicate requirement ID '+item.name);
  return{name:item.name,source:{path:item.sourcePath,sha256:sha(source)},api:{index:'components/api-index.json',authoredPropDefinitions:own.map(p=>p.definition),inheritedPropCount:item.props.length-own.length,defaultExpressionNames:Object.keys(contract.runtime.defaultExpressions).sort(),analysis:contract.runtime.analysis},sourceFacts:facts,fileScopedClassHooks:contract.classHooks,authoredSemantics:semanticCategories,behavior:{fixtureReferences,requirements,uncoveredAuthoredProps:own.map(p=>p.name),scope:'No per-prop exhaustive behavioral specification is established by the bounded requirements. Every authored prop remains listed for explicit future specification.'},gaps:['Complete semantic anatomy, slots, roles, states, keyboard and examples require authored review beyond the listed bounded facts.','Passing selected runtime assertions does not establish all prop combinations, manual accessibility acceptance or assistive-technology certification.']};
 });
 const inputs=new Set(['components/api-index.json','components/contracts.json','_ds_manifest.json','scripts/generate-component-contracts.mjs','scripts/generate-prompt-api.mjs','scripts/lib/component-export.mjs','scripts/lib/behavior-source-cases.mjs','scripts/generate-component-specifications.mjs','scripts/component-semantics-source.json','scripts/lib/component-semantic-evidence.mjs','scripts/lib/behavior-evidence-inputs.mjs','scripts/build-bundle.mjs','schemas/component-specifications.schema.json',...paths,...evidenceReader.usedPaths,...evidenceReader.provenancePaths,...components.flatMap(c=>[c.sourcePath,c.declarationPath,c.promptPath])]);
 const mappedCases=new Set(records.flatMap(c=>c.behavior.requirements.map(r=>r.testPath+'#'+r.caseName)));
 const unmappedNamedCases=boards.flatMap(board=>board.cases.filter(c=>!mappedCases.has(board.path+'#'+c.name)).map(c=>({testPath:board.path,caseName:c.name,reason:authored.unmappedNamedCases?.find(r=>r.testPath===board.path&&r.caseName===c.name)?.reason||'No reviewed requirement mapping recorded; fixture references alone do not establish coverage.'})));
 for(const row of authored.unmappedNamedCases||[]){ownedObject(row,['testPath','caseName','reason'],'unmapped case');if(!unmappedNamedCases.some(c=>c.testPath===row.testPath&&c.caseName===row.caseName))throw Error('Unknown unmapped named case '+row.caseName);}
 const reviewed=(record,keys)=>keys.every(key=>record.authoredSemantics[key].entries.length>0);
 const onBoard=(record,path)=>record.behavior.requirements.some(requirement=>requirement.testPath===path);
 const completeBehaviorSpecifications=records.filter(record=>reviewed(record,['anatomy','slots','examples'])&&onBoard(record,'_audit/component-behavior-test.html')).length;
 const completeAccessibilitySpecifications=records.filter(record=>reviewed(record,['roles','states','keyboard'])&&onBoard(record,'_audit/a11y-gate.html')).length;
 const output={schemaVersion:1,unmappedNamedCases,interpretation:'Exhaustive export inventory, exact JSX/source observations, bounded authored semantic facts and exact named assertion mappings. completeBehaviorSpecifications counts exports with reviewed anatomy, slots and examples plus at least one mapped component-behavior-test assertion. completeAccessibilitySpecifications counts exports with reviewed roles, states and keyboard facts plus at least one mapped a11y-gate assertion. Neither count is a full prop matrix, manual assistive-technology acceptance or certification. Source observations and incidental fixture references are not contracts.',sourceHashes:Object.fromEntries([...inputs].sort().map(path=>[path,sha(read(path))])),coverage:{exports:records.length,supportedRenderAnalysis:records.filter(c=>c.sourceFacts.analysis!=='unsupported-render-expression').length,componentsWithFixtureReferences:records.filter(c=>c.behavior.fixtureReferences.length).length,componentsWithBoundedRequirements:records.filter(c=>c.behavior.requirements.length).length,boundedRequirements:records.reduce((n,c)=>n+c.behavior.requirements.length,0),unmappedNamedCases:unmappedNamedCases.length,completeBehaviorSpecifications,completeAccessibilitySpecifications},components:records};
 const validate=new Ajv({strict:true}).compile(JSON.parse(read('schemas/component-specifications.schema.json')));if(!validate(output))throw Error('Invalid component specification schema: '+JSON.stringify(validate.errors));
 const text=JSON.stringify(output,null,2)+'\n',path=resolve(root,'components/specifications.json');if(check){if(!existsSync(path)||readFileSync(path,'utf8')!==text)throw Error('Component specifications stale or incomplete')}else writeFileSync(path,text);return output;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const args=process.argv.slice(2),i=args.indexOf('--root'),root=i<0?resolve(dirname(fileURLToPath(import.meta.url)),'..'):resolve(args[i+1]);console.log(JSON.stringify(generateComponentSpecifications(root,{check:args.includes('--check')}).coverage));}
