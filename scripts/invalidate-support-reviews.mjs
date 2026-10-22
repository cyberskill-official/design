// Invalidate changed evidence without replacing any approved hash or granting review.
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root = new URL('../', import.meta.url);
export function invalidateReviews(lifecycle, read) {
  const changed = [];
  for (const [name, entry] of Object.entries(lifecycle.components)) {
    const support = entry.support;
    if (support.reviewState !== 'reviewed') continue;
    const stale = support.evidence.some(item => createHash('sha256').update(read(item.path)).digest('hex') !== item.sha256);
    if (!stale) continue;
    (support.reviewHistory ??= []).push({reviewedBy:support.reviewedBy, reviewedAt:support.reviewedAt, evidence:support.evidence, environments:support.environments, axes:support.axes, ...(support.sourceSha256 ? {sourceSha256:support.sourceSha256} : {})});
    delete support.sourceSha256;
    support.reviewState = 'unreviewed'; support.reviewedBy = null; support.reviewedAt = null; support.evidence = [];
    support.limitations.unshift('Previously approved evidence changed. Original approved hashes are retained in reviewHistory; fresh support review is required.');
    changed.push(name);
  }
  return changed;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const path = new URL('components/lifecycle.json',root);
  const lifecycle = JSON.parse(readFileSync(path,'utf8'));
  const changed = invalidateReviews(lifecycle, path => readFileSync(new URL(path,root)));
  if (process.argv.includes('--check')) {
    if(changed.length) {console.error('Changed approved evidence requires review invalidation: '+changed.join(', ')); process.exitCode=1;}
  } else writeFileSync(path,JSON.stringify(lifecycle,null,2)+'\n');
  console.log('Support reviews requiring invalidation:',changed.length);
}
