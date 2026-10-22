import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const supportedTypeScriptPackageVersion = '6.0.2';
export const supportedTypeScriptVersion = '6.0.3';
export const supportedCliTypeScriptVersion = '7.0.2';
/** Official side-by-side compiler API; the source repository still checks with TypeScript 7. */
export function assertTypeScriptApi(version, compiler) {
  if (version !== supportedTypeScriptVersion || compiler?.version !== supportedTypeScriptVersion) throw Error(`Unsupported TypeScript API compiler ${version}; expected ${supportedTypeScriptVersion}. Review the adapter and regenerate/validate API contracts before changing the pin.`);
  for (const name of ['createProgram', 'readConfigFile', 'parseJsonConfigFileContent', 'displayPartsToString']) if (typeof compiler?.[name] !== 'function') throw Error('Unsupported public TypeScript API function ' + name);
  for (const [group, key] of [['SignatureKind', 'Call'], ['SymbolFlags', 'Alias'], ['SymbolFlags', 'Optional'], ['TypeFlags', 'Any']]) if (!Number.isInteger(compiler[group]?.[key])) throw Error('Unsupported TypeScript API enum ' + group + '.' + key);
  return compiler;
}
const packageVersion = require('typescript-api/package.json').version;
if (packageVersion !== supportedTypeScriptPackageVersion) throw Error(`Unsupported TypeScript API compatibility package ${packageVersion}; expected ${supportedTypeScriptPackageVersion}.`);
const compiler = require('typescript-api');
export const compilerApi = assertTypeScriptApi(compiler.version, compiler);
export const {
  SignatureKind,
  SymbolFlags,
  TypeFlags
} = compilerApi;
export function createDeclarationProject(config) {
  const loaded = compilerApi.readConfigFile(config, compilerApi.sys.readFile);
  if (loaded.error) throw Error('Cannot read declaration project: ' + compilerApi.flattenDiagnosticMessageText(loaded.error.messageText, '\n'));
  const parsed = compilerApi.parseJsonConfigFileContent(loaded.config, compilerApi.sys, require('node:path').dirname(config), undefined, config);
  if (parsed.errors.length) throw Error('Invalid declaration project: ' + parsed.errors.map(d => compilerApi.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  const program = compilerApi.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
    projectReferences: parsed.projectReferences
  });
  return {
    program,
    checker: program.getTypeChecker()
  };
}
export function getSymbolType(checker, symbol, location) {
  return checker.getTypeOfSymbolAtLocation(symbol, location || symbol.valueDeclaration || symbol.declarations?.[0]);
}
export function declarationFileName(declaration) {
  return declaration.getSourceFile().fileName;
}
export function documentationText(symbol, checker) {
  // The public checker may inherit native documentation when an authored override
  // has no prose; only authored JSDoc can establish this index's description.
  const authored = symbol.declarations?.some(d => !declarationFileName(d).includes('/node_modules/') && d.jsDoc?.some(doc => doc.comment));
  return authored ? compilerApi.displayPartsToString(symbol.getDocumentationComment(checker)) : '';
}
