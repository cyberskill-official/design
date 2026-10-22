import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {selectSuites, runSuites, writeReports} from './lib/run-unit-suite.mjs';

const registry = {schemaVersion:1, suites:[{id:'a',command:'first'}, {id:'b',command:'second'}, {id:'c',command:'third'}]};
assert.deepEqual(selectSuites(registry, '1/2').map(suite => suite.id), ['a','c']);
assert.deepEqual(selectSuites(registry, '2/2').map(suite => suite.id), ['b']);
for (const spec of ['0/2', '3/2', '1/0', 'nope', '4/4']) assert.throws(() => selectSuites(registry, spec));
assert.throws(() => selectSuites({...registry, suites:[registry.suites[0], registry.suites[0]]}));
const calls = [];
const results = runSuites(registry.suites, {execute: command => {calls.push(command); return command === 'first' ? {status:2} : command === 'third' ? {status:null, signal:'SIGTERM'} : {status:0};}});
assert.equal(calls.length, 3, 'A failure must not skip independent suites');
assert.deepEqual(results.map(result => result.pass), [false, true, false]);
const directory = mkdtempSync(join(tmpdir(), 'cs-runner-'));
try {
  assert.equal(writeReports(results, directory), false);
  assert.equal(JSON.parse(readFileSync(join(directory, 'unit-results.json'))).results.length, 3);
  const xml = readFileSync(join(directory, 'unit-results.xml'), 'utf8');
  assert.match(xml, /tests="3" failures="2"/);
  assert.equal(writeReports([{id:'<escaping>',command:'ok',durationMs:1,pass:true}], directory), true);
  assert.match(readFileSync(join(directory, 'unit-results.xml'),'utf8'), /&lt;escaping&gt;/);
} finally {rmSync(directory, {recursive:true, force:true});}
console.log('PASS suite runner: failure continuation, signals, shards, registry integrity, JSON and JUnit');
