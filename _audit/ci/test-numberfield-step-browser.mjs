import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const cases=[
 {value:0.2,step:0.1,direction:1,expected:0.3},
 {value:0.3,step:0.1,direction:-1,expected:0.2},
 {value:0.25,min:0,step:0.1,direction:1,expected:0.3},
 {value:0.25,min:0,step:0.1,direction:-1,expected:0.2},
 {value:-0.2,step:0.1,direction:1,expected:-0.1},
 {value:0.15,min:0.05,max:0.45,step:0.1,direction:1,expected:0.25},
 {value:0.4,min:0.05,max:0.45,step:0.1,direction:1,expected:0.45},
 {value:1000000000000.2,step:0.1,direction:1,expected:1000000000000.3},
];
const failures=[];
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 for(const [index,scenario] of cases.entries())for(const mode of ['internal','echo','fixed']){
  await page.evaluate(({scenario,mode,index})=>{
   const {direction,expected,...props}=scenario;
   const CS=window[Object.keys(window).find(key=>/^CyberSkillDesignSystem_/.test(key))];
   window.events=[];
   function App(){const [value,setValue]=React.useState(props.value);return React.createElement(CS.NumberField,{...props,value:mode==='internal'?undefined:value,lang:'en',label:'Quantity',onChange:n=>{window.events.push(n);if(mode==='echo')setValue(n);}});}
   window.__numberRoot??=ReactDOM.createRoot(document.getElementById('fixture'));
   ReactDOM.flushSync(()=>window.__numberRoot.render(React.createElement(App,{key:index+'-'+mode})));
  },{scenario,mode,index});
  if(mode==='internal')await page.getByRole('spinbutton').fill(String(scenario.value));
  const expected=await page.evaluate(direction=>{
   window.events=[];const input=document.querySelector('input');const oracle=input.cloneNode(false);oracle.value=input.value;oracle.stepUp(direction);return oracle.valueAsNumber;
  },scenario.direction);
  assert.equal(expected,scenario.expected,'Native input must agree with the explicit decimal/step-grid contract');
  await page.getByRole('button',{name:scenario.direction>0?'Increase':'Decrease',exact:true}).click();
  const actual=await page.evaluate(()=>({events:window.events,value:document.querySelector('input').valueAsNumber}));
  if(actual.events.length!==1||actual.events[0]!==expected||actual.value!==(mode==='fixed'?scenario.value:expected))failures.push({browserName,scenario,mode,expected,actual});
 }
},{browserName});
assert.deepEqual(failures,[],'Custom step buttons must match native number stepping and preserve controlled ownership');
console.log('PASS NumberField: fractional/negative/off-grid/bounded/large values follow native stepping across three engines; controlled ownership retained');
