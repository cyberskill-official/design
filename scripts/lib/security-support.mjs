import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const start = '<!-- BEGIN GENERATED SECURITY SUPPORT -->';
const end = '<!-- END GENERATED SECURITY SUPPORT -->';
export function securitySupportBlock(source, read) {
  assert.equal(source.schemaVersion, 1);
  assert.equal(source.package, '@cyberskill/design');
  assert.equal(source.registry, 'https://registry.npmjs.org/');
  assert.equal(source.snapshotPath, '_audit/ci/fixtures/npm-published-release.json');
  assert.equal(source.supportWindow, 'latest-published-stable-minor');
  assert.equal(source.acknowledgementBusinessDays, 10);
  assert.equal(source.bestEffort, true);
  assert.equal(source.fixDeadline, null);
  assert.equal(source.sla, false);
  assert(Number.isFinite(Date.parse(source.observedAt)), 'Publication snapshot needs an observation timestamp');
  const bytes = read(source.snapshotPath);
  const snapshot = JSON.parse(bytes);
  assert.match(snapshot.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 'Published stable version required');
  assert.equal(snapshot['dist-tags']?.latest, snapshot.version, 'Published latest identity differs');
  const line = snapshot.version.split('.').slice(0, 2).join('.') + '.x';
  const hash = createHash('sha256').update(bytes).digest('hex');
  return `${start}
## Supported releases and response target

| Release line | Security maintenance |
|---|---|
| Latest published stable minor, currently **${line}** | Security triage and fixes target this line. |
| Earlier stable minor/major lines | Upgrade guidance; no backport commitment. |
| Unreleased working tree and prereleases | Development evidence; not a supported published release. |

The latest-published snapshot is **${snapshot.version}**, observed at
\`${source.observedAt}\` from the official npm registry. Snapshot SHA-256:
\`${hash}\`. This is a recorded publication identity, not a live registry query.
Refresh the snapshot and this generated block after a separately authorized
publication; a local VERSION change does not establish publication or support.

We aim to acknowledge private reports within **10 business days**, on a
**best-effort** basis. This is an acknowledgement target, not an SLA or a deadline
for triage, remediation, release or public disclosure. Reports can require more
investigation; we coordinate disclosure with the reporter after assessing the
issue and the available fix. The target covers reporting and coordination for
this design-system package, not consumer applications or upstream services.
${end}`;
}
export function projectSecuritySupport(text, source, read) {
  assert.equal(text.split(start).length, 2, 'Exactly one security support block required');
  assert.equal(text.split(end).length, 2, 'Exactly one security support end required');
  const before = text.indexOf(start),
    after = text.indexOf(end);
  assert(before < after, 'Security support markers out of order');
  return text.slice(0, before) + securitySupportBlock(source, read) + text.slice(after + end.length);
}
