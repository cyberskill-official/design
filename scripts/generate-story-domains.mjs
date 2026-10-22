import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { declarationDomains } from './lib/declaration-domains.mjs';
const root = fileURLToPath(new URL('../', import.meta.url)),
  {
    domains,
    sourcePaths
  } = declarationDomains(root);
const inputs = [...sourcePaths, 'scripts/generate-story-domains.mjs', 'scripts/lib/declaration-domains.mjs', 'scripts/lib/typescript-api.mjs'];
const hashes = Object.fromEntries(inputs.sort().map(path => [path, createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex')]));
const output = '// Generated from public declarations. Do not duplicate these finite domains in CSF.\nexport const DECLARED_DOMAIN_SOURCE_HASHES = ' + JSON.stringify(hashes, null, 2) + ';\nexport const DECLARED_DOMAINS = ' + JSON.stringify(domains, null, 2) + ';\nfor (const component of Object.values(DECLARED_DOMAINS)) { for (const values of Object.values(component)) Object.freeze(values); Object.freeze(component); }\nObject.freeze(DECLARED_DOMAINS);\n';
const path = resolve(root, 'stories/declared-domains.mjs');
if (process.argv.includes('--check')) {
  if (!existsSync(path) || readFileSync(path, 'utf8') !== output) throw Error('Declared story domains stale; run node scripts/generate-story-domains.mjs');
} else writeFileSync(path, output);
console.log((process.argv.includes('--check') ? 'PASS' : 'Generated') + ' declaration-derived story domains: ' + Object.keys(domains).length + ' components, ' + Object.values(domains).reduce((n, p) => n + Object.keys(p).length, 0) + ' finite domains');
