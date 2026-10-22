import assert from 'node:assert/strict';
import {componentCssIndex} from '../../scripts/generate-css-index.mjs';
const index=componentCssIndex([['base/forms.css','.cs-button{color:red}.cs-button:hover{color:blue}'],['base/a11y.css','.cs-button,.cs-button__icon{min-height:44px}']],[['components/Button.jsx','<button className="cs-button"><i className="cs-button__icon cs-button__content" /></button>']]);
assert.deepEqual(index.components[0].stylesheets,['base/a11y.css','base/forms.css']);
assert.deepEqual(index.components[0].hooks,[{name:'cs-button',stylesheets:['base/a11y.css','base/forms.css']},{name:'cs-button__content',stylesheets:[]},{name:'cs-button__icon',stylesheets:['base/a11y.css']}]);
assert.throws(()=>componentCssIndex([['base/broken.css','.cs-button{'] ],[]),/Unclosed block/);
console.log('PASS CSS index: multi-sheet hooks, pseudo selectors, structural hooks and malformed CSS.');
