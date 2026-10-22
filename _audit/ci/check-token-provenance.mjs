import {parseReleaseVersion} from '../../scripts/lib/release-version.mjs';
// Fast, browser-free CI pre-check: proves tokens/native/ + tokens/provenance.json
// are in lockstep with tokens/tokens.dtcg.json WITHOUT spinning up a browser —
// same drift authority (source sha-256) as _audit/token-pipeline-test.html, just
// runnable as a plain Node script for a quick CI job. The full gate (verbatim
// per-constant re-derivation across all 3 native targets) still runs in the
// browser-based fast-gates job; this is a cheap fail-fast companion.
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

function sha256(s) { return createHash('sha256').update(s, 'utf8').digest('hex'); }

const dtcgText = readFileSync(new URL('../../tokens/tokens.dtcg.json', import.meta.url), 'utf8');
const prov = JSON.parse(readFileSync(new URL('../../tokens/provenance.json', import.meta.url), 'utf8'));
const version = readFileSync(new URL('../../VERSION', import.meta.url), 'utf8').trim();

const srcSha = sha256(dtcgText);
let bad = [];
if (srcSha !== prov.sourceSha256) bad.push('provenance.sourceSha256 stale — regenerate tokens/native/ (source changed since last generation)');
try { parseReleaseVersion(prov.release); } catch { bad.push('provenance.release is not a canonical stable/prerelease string'); }

for (const t of prov.targets || []) {
  let text;
  try { text = readFileSync(new URL('../../' + t.file, import.meta.url), 'utf8'); }
  catch (e) { bad.push(t.file + ' missing on disk'); continue; }
  const h = sha256(text);
  if (h !== t.sha256) bad.push(t.file + ' sha-256 drifted from provenance — regenerate');
}

if (bad.length) {
  console.error('✗ token provenance check FAILED:\n' + bad.map((b) => '  - ' + b).join('\n'));
  process.exit(1);
}
console.log('✓ token provenance in lockstep · release v' + version + ' · source ' + srcSha.slice(0, 16) + '… · ' + (prov.targets || []).length + ' targets pinned');
