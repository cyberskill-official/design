import {readFileSync,readdirSync} from 'node:fs';
import {Script} from 'node:vm';
import {parse} from 'parse5';
export function templateModelValues(root,slug){
 const folder=new URL('templates/'+slug+'/',root),file=readdirSync(folder).find(x=>x.endsWith('.dc.html')),html=readFileSync(new URL(file,folder),'utf8'),nodes=[];
 const walk=n=>{nodes.push(n);for(const child of n.childNodes||[])walk(child);if(n.content)walk(n.content)};walk(parse(html));
 const script=nodes.find(n=>n.tagName==='script'&&n.attrs?.some(a=>a.name==='data-dc-script')),attrs=Object.fromEntries(script.attrs.map(a=>[a.name,a.value])),controls=JSON.parse(attrs['data-props']);
 const code=new Script('(()=>{'+script.childNodes.map(n=>n.value||'').join('')+';return Component})()');
 return{path:'templates/'+slug+'/'+file,controls,values:(controls.language?.options||[undefined]).map(language=>{const Logic=code.runInNewContext({DCLogic:class{constructor(props){this.props=props;this.state={}}setState(){}},console});const props=Object.fromEntries(Object.entries(controls).map(([key,control])=>[key,key==='language'?language:control.default]));return{language,values:new Logic(props).renderVals()}})};
}
export function displayPayload(row,values){
 const raw=JSON.parse(JSON.stringify(values[row.id]));
 if(row.projection==='column-headers')return raw.map(({key,header})=>({key,header}));
 return raw;
}
