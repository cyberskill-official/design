import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { compilerApi as ts, createDeclarationProject, getSymbolType, SymbolFlags, SignatureKind } from './typescript-api.mjs';
/** Only finite authored literal unions and named aliases are presentation domains. */
export function literalDomain(node, checker, seen = new Set()) {
  if (!node || seen.has(node)) return null;
  const next = new Set([...seen, node]);
  if (ts.isParenthesizedTypeNode(node)) return literalDomain(node.type, checker, next);
  if (ts.isLiteralTypeNode(node) && (ts.isStringLiteral(node.literal) || ts.isNumericLiteral(node.literal))) return [ts.isNumericLiteral(node.literal) ? Number(node.literal.text) : node.literal.text];
  if (ts.isUnionTypeNode(node)) {
    const result = [];
    for (const part of node.types) {
      if (part.kind === ts.SyntaxKind.UndefinedKeyword) continue;
      const values = literalDomain(part, checker, next);
      if (!values) return null;
      result.push(...values);
    }
    return result;
  }
  if (ts.isTypeReferenceNode(node)) {
    let symbol = checker.getSymbolAtLocation(node.typeName);
    if (symbol?.flags & SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declarations = symbol?.declarations?.filter(d => ts.isTypeAliasDeclaration(d));
    if (declarations?.length === 1) return literalDomain(declarations[0].type, checker, next);
  }
  return null;
}
export function declarationDomains(root) {
  const index = JSON.parse(readFileSync(resolve(root, 'components/api-index.json'), 'utf8')),
    scratch = mkdtempSync(join(tmpdir(), 'cs-declared-domains-')),
    config = join(scratch, 'tsconfig.json');
  try {
    writeFileSync(config, JSON.stringify({
      compilerOptions: {
        strict: true,
        skipLibCheck: false,
        types: [],
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        paths: {
          react: [resolve(root, 'node_modules/@types/react/index.d.ts')],
          'react/*': [resolve(root, 'node_modules/@types/react/*')]
        }
      },
      files: [resolve(root, '_esm/react.d.ts')]
    }));
    const {
      program,
      checker
    } = createDeclarationProject(config);
    if ([...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()].length) throw Error('Invalid public declarations; domains cannot be derived');
    const source = program.getSourceFile(resolve(root, '_esm/react.d.ts')),
      symbols = new Map(checker.getExportsOfModule(checker.getSymbolAtLocation(source)).map(s => [s.name, s])),
      domains = {},
      paths = new Set(['_esm/react.d.ts']);
    for (const item of index.exports.filter(e => e.kind === 'component')) {
      const signature = checker.getSignaturesOfType(getSymbolType(checker, symbols.get(item.name)), SignatureKind.Call)[0],
        parameter = signature?.getParameters()[0];
      if (!parameter) continue;
      for (const prop of checker.getPropertiesOfType(getSymbolType(checker, parameter))) {
        const ref = item.props.find(p => p.name === prop.name);
        if (!ref || index.propDefinitions[ref.definition].origin !== 'authored') continue;
        const declaration = prop.declarations?.find(d => !d.getSourceFile().fileName.includes('/node_modules/'));
        const values = literalDomain(declaration?.type, checker);
        if (!values || values.length < 2) continue;
        if (new Set(values).size !== values.length) throw Error('Duplicate declared domain ' + item.name + '.' + prop.name);
        (domains[item.name] ??= {})[prop.name] = values;
      }
    }
    // Named alias declarations, including shared placement, are source authority too.
    for (const file of program.getSourceFiles()) {
      const path = relative(root, file.fileName);
      if (!path.startsWith('..') && !path.includes('node_modules/')) paths.add(path);
    }
    return {
      domains,
      sourcePaths: [...paths].sort()
    };
  } finally {
    rmSync(scratch, {
      recursive: true,
      force: true
    });
  }
}
