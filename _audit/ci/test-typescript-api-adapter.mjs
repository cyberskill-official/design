import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { assertTypeScriptApi, supportedTypeScriptVersion, supportedTypeScriptPackageVersion, supportedCliTypeScriptVersion, compilerApi, createDeclarationProject, getSymbolType, declarationFileName, documentationText } from '../../scripts/lib/typescript-api.mjs';
assert.equal(supportedTypeScriptPackageVersion, JSON.parse(readFileSync('node_modules/typescript-api/package.json', 'utf8')).version);
assert.equal(supportedTypeScriptVersion, compilerApi.version);
assert.equal(supportedCliTypeScriptVersion, JSON.parse(readFileSync('node_modules/typescript/package.json', 'utf8')).version, 'TypeScript7 remains the validation CLI');
assert.equal(assertTypeScriptApi(supportedTypeScriptVersion, compilerApi), compilerApi);
for (const version of ['5.9.3', '6.0.1', '6.0.2', '6.0.4', '7.0.2', '6.0.3-dev', undefined]) assert.throws(() => assertTypeScriptApi(version, compilerApi), /Unsupported TypeScript API compiler/);
for (const name of ['createProgram', 'readConfigFile', 'parseJsonConfigFileContent', 'displayPartsToString']) assert.throws(() => assertTypeScriptApi(supportedTypeScriptVersion, {
  ...compilerApi,
  [name]: undefined
}), /public TypeScript API/);
for (const [group, key] of [['SignatureKind', 'Call'], ['SymbolFlags', 'Alias'], ['SymbolFlags', 'Optional'], ['TypeFlags', 'Any']]) assert.throws(() => assertTypeScriptApi(supportedTypeScriptVersion, {
  ...compilerApi,
  [group]: {
    ...compilerApi[group],
    [key]: undefined
  }
}), /API enum/);
assert.throws(() => assertTypeScriptApi(supportedTypeScriptVersion, {
  ...compilerApi,
  version: '6.0.4'
}), /Unsupported TypeScript API compiler/);
const scratch = mkdtempSync(join(tmpdir(), 'cs-stable-compiler-'));
try {
  const config = join(scratch, 'tsconfig.json'),
    entry = join(scratch, 'fixture.ts');
  writeFileSync(config, JSON.stringify({
    compilerOptions: {
      strict: true,
      types: [],
      noEmit: true
    },
    files: [entry]
  }));
  writeFileSync(entry, 'interface Native {\n/** Native help. */\ninherited?: string;\n/** Native label. */\nlabel?: string\n}\nexport interface Props extends Native {\n/** Authored help. */\nown: "a" | "b"; label?: string; requiredCount: number\n}\nexport declare function Widget<T>(props: Props & {value:T}): T;');
  const {
    program,
    checker
  } = createDeclarationProject(config);
  assert.equal(program.getSemanticDiagnostics().length, 0);
  const source = program.getSourceFile(entry),
    symbol = checker.getExportsOfModule(checker.getSymbolAtLocation(source)).find(s => s.name === 'Widget');
  const call = checker.getSignaturesOfType(getSymbolType(checker, symbol), compilerApi.SignatureKind.Call)[0];
  assert.equal(call.typeParameters.length, 1, 'generic call inference retained');
  const props = checker.getPropertiesOfType(getSymbolType(checker, call.getParameters()[0]));
  const prop = name => props.find(p => p.name === name);
  assert.equal(documentationText(prop('own'), checker), 'Authored help.');
  assert.equal(documentationText(prop('label'), checker), '', 'undocumented authored override does not inherit native prose');
  assert.equal(!!(prop('inherited').flags & compilerApi.SymbolFlags.Optional), true);
  assert.equal(!!(prop('requiredCount').flags & compilerApi.SymbolFlags.Optional), false);
  assert.equal(declarationFileName(prop('own').declarations[0]), entry);
  assert(getSymbolType(checker, prop('own')).isUnion());
  writeFileSync(entry, 'export declare const invalid: MissingType;');
  assert(createDeclarationProject(config).program.getSemanticDiagnostics().some(d => d.code === 2304), 'invalid declaration diagnostics retained');
  writeFileSync(config, '{ broken');
  assert.throws(() => createDeclarationProject(config), /Cannot read declaration project/);
  writeFileSync(config, JSON.stringify({
    compilerOptions: {
      unknownOption: true
    },
    files: [entry]
  }));
  assert.throws(() => createDeclarationProject(config), /Invalid declaration project/);
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS public compiler adapter: exact official6API alongside7CLI, real generic/inherited/optional/authored-doc facts and diagnostics; version/capability/config negative controls');
