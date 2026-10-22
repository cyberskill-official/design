import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,posix} from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from '@babel/parser';
import {collectSources} from '../build-bundle.mjs';
import {assertRelativeInputPath,readBoundedEvidenceInput} from './behavior-evidence-inputs.mjs';
const sha=source=>createHash('sha256').update(source).digest('hex');
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node)){if(['loc','start','end','extra','comments'].includes(key))continue;if(Array.isArray(value))value.forEach(child=>walk(child,visit));else if(value&&typeof value==='object')walk(value,visit)}}
export function createSemanticEvidenceReader(root,boards){
 const sourcePaths=new Set(collectSources(root)),cache=new Map(),usedPaths=new Set(),provenancePaths=new Set();
 const read=path=>{assertRelativeInputPath(path);if(!cache.has(path))cache.set(path,readBoundedEvidenceInput(root,path).toString('utf8'));provenancePaths.add(path);return cache.get(path)};
 const ast=path=>parse(read(path),{sourceType:'module',plugins:['jsx']});
 const stories=readdirSync(resolve(root,'stories'),{withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.stories.jsx')).map(e=>'stories/'+e.name);
 const tests=readdirSync(resolve(root,'_audit/ci'),{withFileTypes:true}).filter(e=>e.isFile()&&/^test-.*browser\.mjs$/.test(e.name)).map(e=>'_audit/ci/'+e.name);
 const parsed=new Map(),syntax=path=>{if(!parsed.has(path))parsed.set(path,ast(path));return parsed.get(path)};
 const relativeImport=(path,spec)=>spec.startsWith('.')?posix.normalize(posix.join(posix.dirname(path),spec)):null;
 const graph=new Map();function dependencies(path){if(!graph.has(path))graph.set(path,syntax(path).program.body.filter(n=>n.type==='ImportDeclaration').map(n=>relativeImport(path,n.source.value)).filter(p=>sourcePaths.has(p)));return graph.get(path)}
 function namedImport(path,item){return syntax(path).program.body.some(n=>n.type==='ImportDeclaration'&&relativeImport(path,n.source.value)===item.sourcePath&&n.specifiers.some(s=>s.type==='ImportSpecifier'&&s.imported.name===item.name))}
 function constructs(path,item){let found=false;const aliases=new Set();for(const statement of syntax(path).program.body)if(statement.type==='ImportDeclaration'&&relativeImport(path,statement.source.value)===item.sourcePath)for(const spec of statement.specifiers)if(spec.type==='ImportSpecifier'&&spec.imported.name===item.name)aliases.add(spec.local.name);
  walk(syntax(path),node=>{if(node.type==='JSXOpeningElement'&&node.name.type==='JSXIdentifier'&&aliases.has(node.name.name))found=true;if(node.type!=='CallExpression')return;const create=node.callee.type==='MemberExpression'&&node.callee.property.name==='createElement'||node.callee.type==='Identifier'&&node.callee.name==='h';if(!create)return;const target=node.arguments[0];if(target?.type==='Identifier'&&aliases.has(target.name))found=true;if(target?.type==='MemberExpression'&&!target.computed&&['CS','NS'].includes(target.object?.name)&&target.property?.name===item.name)found=true;});return found;
 }
 const closures=new Map();function closure(item){if(closures.has(item.name))return closures.get(item.name);const pending=[item.sourcePath],seen=new Set();while(pending.length){const path=pending.pop();if(seen.has(path))continue;seen.add(path);pending.push(...dependencies(path))}closures.set(item.name,seen);return seen;}
 function owner(item,path){
  if(path===item.sourcePath)return{kind:'component-source'};
  if(path===item.declarationPath)return{kind:'component-declaration'};
  if(path===item.promptPath)return{kind:'canonical-prompt'};
  if(sourcePaths.has(path)&&closure(item).has(path))return{kind:'imported-source'};
  if(stories.includes(path)&&namedImport(path,item))return{kind:'component-story'};
  if(tests.includes(path)&&constructs(path,item))return{kind:'constructor-fixture'};
  const board=boards.find(b=>b.path===path);if(board){const scopes=board.cases.filter(c=>c.components.includes(item.name)).map(c=>({start:c.start,end:c.end}));if(scopes.length)return{kind:'named-case-fixture',scopes}}
  return null;
 }
 return{usedPaths,provenancePaths,evidence(item,entry){
  const path=entry.sourcePath??item.sourcePath;assertRelativeInputPath(path);const ownership=owner(item,path);assert(ownership,'Unowned semantic evidence path for '+item.name+': '+path);
  if(entry.sourcePath!==undefined)assert.match(entry.sourceSha256??'',/^[a-f0-9]{64}$/,'Explicit evidence paths require a reviewed SHA-256');else assert(entry.sourceSha256===undefined,'Semantic evidence hash requires sourcePath');
  const source=read(path),sourceSha256=sha(source);if(entry.sourcePath!==undefined)assert.equal(entry.sourceSha256,sourceSha256,'Semantic evidence source hash drift: '+path);
  usedPaths.add(path);return entry.sourceSnippets.map(snippet=>{assert.equal(typeof snippet,'string');assert(snippet.length,'Empty semantic evidence snippet');const start=source.indexOf(snippet);assert(start>=0&&source.indexOf(snippet,start+1)<0,'Missing or ambiguous semantic snippet '+item.name+': '+snippet);const end=start+snippet.length;if(ownership.scopes)assert(ownership.scopes.some(scope=>start>=scope.start&&end<=scope.end),'Semantic snippet is outside the component\'s named case scope');return{sourcePath:path,sourceSha256,ownership:ownership.kind,start,end,source:snippet}});
 }};
}
