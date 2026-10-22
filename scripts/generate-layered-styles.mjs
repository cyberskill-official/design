import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildLayeredCss } from './lib/layered-css.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (args.some(arg => arg !== '--check')) throw Error('Supported option: --check');
const {
  css,
  manifest
} = buildLayeredCss(root);
for (const [path, next] of [['styles.layered.css', css], ['styles.layered.provenance.json', JSON.stringify(manifest, null, 2) + '\n']]) {
  const url = new URL('../' + path, import.meta.url);
  if (args.includes('--check')) {
    if (!existsSync(url) || readFileSync(url, 'utf8') !== next) throw Error(path + ' stale; run node scripts/generate-layered-styles.mjs');
  } else writeFileSync(url, next);
}
console.log('PASS layered CSS ' + (args.includes('--check') ? 'freshness' : 'generation') + ': ' + manifest.inputs.length + ' sources, ' + manifest.importantCount + ' important declarations; ' + Buffer.byteLength(css) + ' bytes');
