// Bounded readers for generated Kotlin/Dart literal data and getter slots.
// They do not execute either language or establish compiler/SDK compatibility.
import assert from 'node:assert/strict';
function expression(text){
 let at=0;const skip=()=>{while(/\s/.test(text[at]||'')&&at<text.length)at++;};
 function string(){at++;let value='';while(at<text.length){let c=text[at++];if(c==='"')return value;if(c==='$'||c==='\n'||c==='\r')throw Error('Unescaped native interpolation/control character');if(c==='\\'){c=text[at++];if(c==='u'){const hex=text.slice(at,at+4);assert.match(hex,/^[a-f0-9]{4}$/i);value+=String.fromCharCode(parseInt(hex,16));at+=4;}else{const escaped={'"':'"','\\':'\\','$':'$','n':'\n','r':'\r','t':'\t'};assert(Object.hasOwn(escaped,c),'Unsupported native string escape');value+=escaped[c];}}else value+=c;}throw Error('Unclosed native string');}
 function sequence(close){const items=[];skip();if(text[at]===close){at++;return items;}for(;;){items.push(parse());skip();if(text[at]===close){at++;return items;}assert.equal(text[at++],',','Invalid native literal separator');}}
 function call(name,args){
  if(name==='listOf')return args;
  const wrappers={Color:'color',Dimension:'dimension',Number:'number',Shadow:'shadow',Duration:'duration',CubicBezier:'cubicBezier',FontFamily:'fontFamily'},wrapper=/^(?:CSNativeValue\.|_CS)(\w+)$/.exec(name);
  if(wrapper&&Object.hasOwn(wrappers,wrapper[1])){assert.equal(args.length,1);return {type:wrappers[wrapper[1]],value:args[0]};}
  const shapes={CSColorValue:['colorSpace','components','alpha'],CSDimension:['value','unit'],CSDuration:['value','unit'],CSShadow:['color','offsetX','offsetY','blur','spread'],CSOmittedToken:['name','reason','resolvedCss']};
  if(name==='CSCubicBezier'){assert.equal(args.length,4);return args;}
  assert(Object.hasOwn(shapes,name),'Unknown native constructor '+name);assert.equal(args.length,shapes[name].length);return Object.fromEntries(shapes[name].map((key,i)=>[key,args[i]]));
 }
 function parse(){skip();if(text[at]==='"')return string();if(text[at]==='['){at++;return sequence(']');}const number=/^-?(?:\d+(?:\.\d+)?)(?:e[+-]?\d+)?/i.exec(text.slice(at));if(number){at+=number[0].length;return Number(number[0]);}const name=/^[a-z_][\w.]*/i.exec(text.slice(at));assert(name,'Invalid native literal expression');at+=name[0].length;skip();if(text[at]==='('){at++;return call(name[0],sequence(')'));}const enumeration=/^CS(ColorSpace|LengthUnit|DurationUnit)\.([a-z]+)$/i.exec(name[0]);assert(enumeration,'Unknown native enum literal');const value=enumeration[2].toLowerCase(),allowed={ColorSpace:['srgb','oklab'],LengthUnit:['px','rem'],DurationUnit:['ms','s']};assert(allowed[enumeration[1]].includes(value),'Unknown native enum case');return value;}
 const result=parse();skip();assert.equal(at,text.length,'Trailing native literal code');return result;
}
function body(source,start,end){assert.equal(source.split(start).length,2,'Missing/ambiguous native data region');const from=source.indexOf(start)+start.length,to=source.indexOf(end,from);assert(to>=from,'Missing native data boundary');return source.slice(from,to);}
function entries(source,start,end){return body(source,start,end).split('\n').filter(line=>line.trim()).map(line=>{assert(line.trim().endsWith(','));return expression(line.trim().slice(0,-1));});}
const publicTypes={color:'CSColorValue',dimension:'CSDimension',number:'Double',shadow:'List<CSShadow>',duration:'CSDuration',cubicBezier:'CSCubicBezier',fontFamily:'List<String>'};
export function readNativeLiteralSource(source,language,tokens){
 assert(['kt','dart'].includes(language));const k=language==='kt';
 const values=k?entries(source,'private val csModeValues: List<CSNativeValue> = listOf(\n','\n)\nprivate val csModeRows'):entries(source,'const _csModeValues = <_CSNativeValue>[\n','\n];\nconst _csModeRows');
 const csv=rows=>rows.map(row=>{assert.equal(typeof row,'string');assert.match(row,/^\d+(,\d+)*$/);return row.split(',').map(Number);});
 const rows=k?csv(entries(source,'private val csModeRows: List<List<Int>> = listOf(\n',"\n).map { row -> row.split(',').map { it.toInt() } }\nprivate val csModeOmissions")):entries(source,'const _csModeRows = <List<int>>[\n','\n];\nconst _csModeOmissions');
 const omissions=k?entries(source,'private val csModeOmissions: List<CSOmittedToken> = listOf(\n','\n)\nprivate val csModeOmissionRows'):entries(source,'const _csModeOmissions = <CSOmittedToken>[\n','\n];\nconst _csModeOmissionRows');
 const omissionRows=k?csv(entries(source,'private val csModeOmissionRows: List<List<Int>> = listOf(\n',"\n).map { row -> row.split(',').map { it.toInt() } }\nprivate val csModeMap")):entries(source,'const _csModeOmissionRows = <List<int>>[\n','\n];\nconst _csModeMap');
 const mapBody=k?body(source,'private val csModeMap: Map<String, Pair<Int, Int>> = mapOf(\n','\n)\nclass CSTokenModePack'):body(source,'const _csModeMap = <String, List<int>>{\n','\n};\nclass CSTokenModePack');
 const modes=mapBody.split('\n').filter(l=>l.trim()).map(line=>{const match=k?/^\s*"([a-z0-9_-]+)" to Pair\((\d+), (\d+)\),$/.exec(line):/^\s*"([a-z0-9_-]+)": \[(\d+), (\d+)\],$/.exec(line);assert(match,'Invalid native mode map entry');return {id:match[1],row:Number(match[2]),omissions:Number(match[3])};});assert.equal(new Set(modes.map(m=>m.id)).size,modes.length);
 const getter=k?/  val (\w+): ([\w<>]+) get\(\) = \(csModeValues\[csModeRows\[row\]\[(\d+)\]\] as CSNativeValue\.(\w+)\)\.value/g:/  ([\w<>]+) get (\w+) => \(_csModeValues\[_csModeRows\[_row\]\[(\d+)\]\] as _CS(\w+)\)\.value;/g;
 const getters=[...source.matchAll(getter)].map(m=>({name:m[k?1:2],publicType:m[k?2:1],index:Number(m[3]),type:m[4][0].toLowerCase()+m[4].slice(1)}));assert.equal(getters.length,tokens.length);assert.equal(new Set(getters.map(g=>g.name)).size,tokens.length);
 for(const t of tokens){const g=getters.find(g=>g.name===t.name);assert(g,'Missing native getter '+t.name);assert.equal(g.type,t.type);assert.equal(g.publicType,!k&&t.type==='number'?'double':publicTypes[t.type]);}
 const get=(array,index)=>{assert(Number.isInteger(index)&&index>=0&&index<array.length,'Native data index outside pool');return array[index];};
 const packs=modes.map(mode=>{const row=get(rows,mode.row);assert.equal(row.length,tokens.length);return {id:mode.id,values:Object.fromEntries(tokens.map(t=>{const g=getters.find(g=>g.name===t.name),value=get(values,get(row,g.index));assert.equal(value.type,g.type,'Native getter/pool type mismatch');return [t.css,value.value];})),omissions:get(omissionRows,mode.omissions).map(i=>get(omissions,i))};});
 return {packs,values,rows,omissions,omissionRows,modes,getters};
}
