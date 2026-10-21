import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Ajv from 'ajv';
const root = new URL('../../',import.meta.url);
const read = path => JSON.parse(readFileSync(new URL(path,root),'utf8'));
const ajv = new Ajv({strict:false,allErrors:true});
for (const entry of read('schemas/exports.json').exports) {
  const schema = read(entry.schema), data = read(entry.path), validate = ajv.compile(schema);
  assert(validate(data), `${entry.path}: ${JSON.stringify(validate.errors)}`);
  for (const key of schema.required) {
    const missing = structuredClone(data); delete missing[key];
    assert.equal(validate(missing),false, `${entry.path} missing ${key} must fail`);
  }
}
console.log('PASS structural export schemas and missing-required-field mutations; semantic/freshness gates remain separate');
