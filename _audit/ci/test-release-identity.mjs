import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const record = JSON.parse(read('_audit/remediation/release-v1.7.2-identity.json'));
const files = ['docs/release-notes.md', 'docs/vi/release-notes.md', 'stories/ReleaseNotes/ReleaseNotes.mdx'];
const proposal = read('_audit/remediation/release-v1.7.2-notes-proposal.md');
function validate(snapshot, documents, body) {
  assert.equal(snapshot.registryGitHead, snapshot.tagCommit);
  assert.match(snapshot.tagCommit, /^[a-f0-9]{40}$/);
  assert.equal(snapshot.githubRelease.tagName, `v${snapshot.version}`);
  assert.equal(createHash('sha256').update(snapshot.githubRelease.body).digest('hex'), snapshot.previousBodySha256);
  for (const text of [...documents, body]) {
    for (const value of [snapshot.registryPublishedAt, snapshot.tagCommit, snapshot.githubRelease.publishedAt, snapshot.selectedUnpublishedCandidate]) assert.ok(text.includes(value), `Missing identity: ${value}`);
    // The old release summary must remain visibly quoted, never restored as current scope.
    const section = text.includes('## Release — `@cyberskill/design@1.7.2`') ? text.split('## Release — `@cyberskill/design@1.7.2`')[1].split('## Release —')[0] : text;
    assert.ok(section.includes('\n> '), 'Historical summary must remain quoted');
    assert.ok(!/^Independent five-domain audit closure/m.test(section));
    assert.ok(!/; all 123 per-export support records.*are reviewed/.test(text));
  }
  for (const line of snapshot.githubRelease.body.split('\n')) assert.ok(body.includes(line ? `> ${line}` : `\n>\n`), 'Preserve original body verbatim as quotation');
}
const documents = files.map(read);
validate(record, documents, proposal);
for (const mutation of [
  value => { value.tagCommit = '0'.repeat(40); },
  value => { value.githubRelease.body += '\nChanged history'; },
  value => { value.registryPublishedAt = '2026-10-19T13:32:00Z!'; },
]) { const value = structuredClone(record); mutation(value); assert.throws(() => validate(value, documents, proposal)); }
assert.throws(() => validate(record, documents.map(text => text.replaceAll(record.tagCommit, 'missing')), proposal));
assert.throws(() => validate(record, documents, proposal.replace('> ## @cyberskill/design@1.7.2', '## changed')));
assert.throws(() => validate(record, documents.map(text => text.replaceAll('\n> ', '\n')), proposal));
console.log('PASS release identity mapping, historical retention and six negative cases');
