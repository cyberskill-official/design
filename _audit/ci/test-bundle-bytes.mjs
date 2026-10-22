import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,mkdirSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildBundle,REPO_ROOT} from '../../scripts/build-bundle.mjs';
import {assertBundleBytes} from './lib/bundle-bytes.mjs';
const expected=buildBundle().text;
assertBundleBytes(expected,expected);
assert.throws(()=>assertBundleBytes(expected+'\n// changed body',expected),/Bundle bytes differ/);
assert.throws(()=>assertBundleBytes(expected.split('\n')[0]+'\n',expected),/Bundle bytes differ/);
const temp=mkdtempSync(join(tmpdir(),'cs-bundle-bytes-'));
try {
  cpSync(join(REPO_ROOT,'components'),join(temp,'components'),{recursive:true});
  mkdirSync(join(temp,'tokens'));cpSync(join(REPO_ROOT,'tokens/tokens.js'),join(temp,'tokens/tokens.js'));
  mkdirSync(join(temp,'scripts'));
  const catalog=JSON.parse(readFileSync(join(REPO_ROOT,'scripts/catalog-source.json'),'utf8'));
  catalog.namespace=catalog.namespace.endsWith('000000')?'CyberSkillDesignSystem_111111':'CyberSkillDesignSystem_000000';
  writeFileSync(join(temp,'scripts/catalog-source.json'),JSON.stringify(catalog));
  const changed=buildBundle(temp).text;
  assert.throws(()=>assertBundleBytes(expected,changed),/Bundle bytes differ/,'Authored namespace changes must invalidate old bundle');
} finally {rmSync(temp,{recursive:true,force:true});}
console.log('PASS bundle bytes: body edits, header-preserving truncation and authored namespace drift rejected');
