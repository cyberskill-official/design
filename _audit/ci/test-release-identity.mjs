import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const record = {
  schemaVersion: 1,
  observedDate: '2026-10-21',
  package: '@cyberskill/design',
  version: '1.7.2',
  registryPublishedAt: '2026-08-13T08:50:39.579Z',
  registryGitHead: '792b503e71c115d76f26eb4721cc4b04a9b6e6c3',
  registryIntegrity: 'sha512-/j4HntlU0eS7tQ6pwJi+H8Pq7ONitMfLCP/qNykO+XtFOVOOnVDsjsAOeFpWPEvm8mZlPUS7ckT3PlAeap+v9w==',
  tagObject: 'a154c19ffdd73e6ce68ce22ef4b089b4d63b9f22',
  tagCommit: '792b503e71c115d76f26eb4721cc4b04a9b6e6c3',
  githubRelease: {
    body: '## @cyberskill/design@1.7.2\n\n- **Five-Domain Audit Closure:** Resolved all audit defects across tokens/native projections, components/types/a11y, templates/DOCX/print/email, docs/Storybook/public site, and CI/packaging/gate board.\n- **Lifecycle & Support Governance:** Reviewed and stamped all 123 component and constant support records in `components/lifecycle.json` with SHA-256 evidence verification.\n- **Custom Form Picker Accessibility (`R2-02`):** Added `"aria-labelledby"` support to `Combobox`, `DatePicker`, `TimePicker`, `ColorPicker`, `Cascader`, and `TreeSelect` across both trigger controls and open popup surfaces.\n- **Linux Visual Baselines:** Synchronized all 15 PNG visual baselines in `_audit/baselines/` with deterministic Linux Chromium rendering.\n- **3-Browser CI Acceleration:** Memoized canvas color parsing and parallelized Chromium, Firefox, and WebKit execution in `test-paper-text-contrast-browser.mjs` (~6x speedup) and across 31 multi-engine browser test scripts via `_audit/ci/lib/run-browsers.mjs`.\n- **Dependabot Grouping:** Configured grouped weekly updates in `.github/dependabot.yml`.',
    createdAt: '2026-08-13T08:50:09Z',
    publishedAt: '2026-10-19T13:32:00Z',
    tagName: 'v1.7.2',
    targetCommitish: 'main',
    url: 'https://github.com/cyberskill-official/design/releases/tag/v1.7.2',
  },
  previousBodySha256: '6c2661aab3575bd5f790742ffc1ea9c2d6daf922252e26b6311dc10892784f8e',
  verificationScope: 'Observed remote tag and registry metadata; no independent cryptographic provenance verification.',
  selectedUnpublishedCandidate: '2.0.0-alpha.0',
};
const files = ['docs/release-notes.md', 'docs/vi/release-notes.md', 'stories/ReleaseNotes/ReleaseNotes.mdx'];
const proposal = [
  '## @cyberskill/design@1.7.2',
  '',
  '### Đính chính định danh — 21 tháng 10 năm 2026',
  '',
  'npm phát hành `1.7.2` lúc `2026-08-13T08:50:39.579Z`. Tag `v1.7.2` trỏ tới commit `792b503e71c115d76f26eb4721cc4b04a9b6e6c3`, khớp với `gitHead` do registry công bố. Ngày xuất bản trang GitHub (`2026-10-19T13:32:00Z`) không thay đổi nội dung package tháng 8.',
  '',
  'Tóm tắt tháng 10 trước đây đã gán nhầm các sửa đổi repository sau đó cho package này. Các sửa đổi đó thuộc bản chưa phát hành và cần bằng chứng, review, nghiệm thu riêng. Owner đã chọn chuẩn bị `2.0.0-alpha.0`; lựa chọn này không xác nhận phát hành, gắn tag hay hoàn tất các gate.',
  '',
  '### Identity correction — 21 October 2026',
  '',
  'npm published `1.7.2` at `2026-08-13T08:50:39.579Z`. Tag `v1.7.2` resolves to commit `792b503e71c115d76f26eb4721cc4b04a9b6e6c3`, matching the registry-reported `gitHead`. The GitHub page publication date (`2026-10-19T13:32:00Z`) does not change the August package contents.',
  '',
  'The previous October summary incorrectly attributed later repository remediation to this package. That work belongs to an unreleased revision and requires its own evidence, review and acceptance. The owner selected `2.0.0-alpha.0` for preparation; this does not establish publication, tagging or completed gates. This correction records observed identity metadata, not independent cryptographic provenance verification.',
  '',
  '### Superseded October summary / Tóm tắt tháng 10 đã thay thế',
  '',
  'The original description is retained below as historical text, not a statement of this package’s contents.',
  '',
  ...record.githubRelease.body.split('\n').map(line => line ? `> ${line}` : '>'),
  '',
].join('\n');
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
