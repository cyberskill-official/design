import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {modeInputs,projectTokenMode} from '../../scripts/lib/token-modes.mjs';
const root=resolve('.'),inputs=modeInputs(root),read=p=>JSON.parse(readFileSync(p,'utf8'));
const pairs=read('_audit/ci/fixtures/a01-token-aliases/aliases.json').aliases,index=read('tokens/modes/index.json');
// Reconstruct exact raw values from the previous standalone export. New names
// are proven equal separately by the full256-mode browser alias matrix.
for(const mode of index.modes){const old=read('tokens/modes/'+mode.file),raw={};for(const [g,entries]of Object.entries(old))if(!g.startsWith('$'))for(const [name,d]of Object.entries(entries)){const e=d.$extensions['com.cyberskill'];raw[name]=e.resolvedSourceCss??e.css;}for(const o of mode.omissions)raw[o.name]=o.resolvedCss;for(const p of pairs)raw[p.alias]=raw[p.legacy];
 const {doc}=projectTokenMode(inputs,{id:mode.id,raw});
 for(const p of pairs){const def=doc[p.group][p.alias],e=def.$extensions['com.cyberskill'];assert.equal(def.$value,`{${p.group}.${p.legacy}}`);assert.equal(e.resolvedSourceCss,raw[p.legacy]);assert.equal(e.nativeAliasOf,p.legacy);assert.equal(e.nativeName,inputs.inventory.groups[p.group][p.alias].$extensions['com.cyberskill'].nativeName);}
 for(const [g,entries]of Object.entries(doc))if(!g.startsWith('$'))for(const [name,d]of Object.entries(entries)){const e=d.$extensions['com.cyberskill'];assert.equal(e.resolvedSourceCss??e.css,raw[name],'Lossless CSS provenance reconstruction '+name);if(e.resolvedSourceCss!==undefined&&!pairs.some(p=>p.alias===name))assert.notEqual(e.resolvedSourceCss,e.css,'Do not duplicate identical strings');}
 const bad={...raw,[pairs[0].alias]:'999px'};assert.throws(()=>projectTokenMode(inputs,{id:mode.id,raw:bad}),/alias value\/type drift/);
}
console.log('PASS all256 mode alias references/native provenance, lossless exact CSS reconstruction and mismatched alias negative');
