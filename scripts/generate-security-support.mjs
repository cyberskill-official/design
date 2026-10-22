import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { projectSecuritySupport } from './lib/security-support.mjs';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const source = JSON.parse(read('scripts/security-support-source.json'));
const output = projectSecuritySupport(read('SECURITY.md'), source, read);
const args = process.argv.slice(2);
if (args.length && (args.length !== 1 || args[0] !== '--check')) throw Error('Usage: generate-security-support.mjs [--check]');
if (args.length) {
  if (output !== read('SECURITY.md')) throw Error('Stale security support policy; refresh the reviewed source snapshot and regenerate');
} else writeFileSync(new URL('SECURITY.md', root), output);
console.log('PASS security support ' + (args.length ? 'freshness' : 'generation') + ': latest published stable minor,10business-day best-effort acknowledgement; no fix SLA or publication authorization');
