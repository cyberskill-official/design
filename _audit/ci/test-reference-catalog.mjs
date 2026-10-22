import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildReferenceCatalog, countSurfaces, documentRole, replaceCounts, visualBaselineNames } from '../../scripts/generate-reference-catalog.mjs';

assert.equal(replaceCounts('<!-- cs-count:templates -->999<!-- /cs-count -->', { templates: 2 }).text, '<!-- cs-count:templates -->2<!-- /cs-count -->');
for (const text of ['<!-- cs-count:unknown -->3<!-- /cs-count -->', '<!-- cs-count:templates -->oops<!-- /cs-count -->', '<!-- cs-count:templates -->3', '<!-- /cs-count -->']) assert.throws(() => replaceCounts(text, { templates: 2 }));
assert.equal(documentRole('docs/doctrine.md'), 'normative_repository_contract');
assert.equal(documentRole('MAINTAINERS.md'), 'operator_guide');
for (const name of ['README.md','SKILL.md','AGENTS.md','CLAUDE.md','GEMINI.md','CONTRIBUTING.md','llms.txt','DESIGN.md','MAINTAINERS.md','SECURITY.md']) {
  assert.equal(documentRole('docs/vi/entrypoints/'+name),documentRole(name));
  assert.equal(documentRole('unknown/docs/vi/entrypoints/'+name),'unclassified_requires_review');
}
assert.equal(documentRole('docs/vi/entrypoints/unreviewed.md'),'unclassified_requires_review');
const reviewedDocumentRoles = {
  '.github/pull_request_template.md': 'contribution_template',
  '_audit/remediation/assessment-source.md': 'retained_assessment_source',
  '_audit/remediation/assessment-remediation.md': 'remediation_report',
  '_audit/remediation/decision-template.md': 'decision_template',
    '_audit/remediation/release-v1.7.2-notes-proposal.md': 'private_owner_review_release_metadata_proposal',
  'scripts/lib/compiler-and-story-domains.md': 'source_maintenance_guide',
  'scripts/template-hex-policy.md': 'source_maintenance_guide',
};
for (const [path, role] of Object.entries(reviewedDocumentRoles)) {
  assert.equal(documentRole(path), role);
  assert.equal(documentRole('unknown/' + path), 'unclassified_requires_review', 'Exact reviewed path never blesses an unreviewed prefix');
}

assert.equal(documentRole('MAINTAINERS-unknown.md'), 'unclassified_requires_review');
assert.equal(documentRole('docs/vi/doctrine.md'), 'normative_repository_contract');
assert.equal(documentRole('docs/decisions.md'), 'decision_record');
assert.equal(documentRole('tokens/modes.md'), 'source_maintenance_guide');
assert.equal(documentRole('tokens/unreviewed-guide.md'), 'unclassified_requires_review');
assert.equal(documentRole('components/actions/Button.prompt.md'), 'implementation_contract');
assert.deepEqual(visualBaselineNames('<script>const BASE={first:{w:909},"second-dark":{w:1280}};</script>'),['first','second-dark']);
for(const source of ['const OTHER={a:{}};', 'const BASE=window.dynamic;', 'const BASE={...others};', 'const BASE={[dynamic]:{}};', 'const BASE={first:{},first:{}};', 'const BASE={first:()=>({})};']) assert.throws(()=>visualBaselineNames('<script>'+source+'</script>'));

const root = mkdtempSync(join(tmpdir(), 'cs-reference-catalog-'));
const write = (path, value) => { const target = join(root, path); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value)); };
try {
  execFileSync('git', ['init', '-q', root]);
  mkdirSync(join(root, 'ui_kits'));
  const manifest = { components: [{ name: 'Example', kind: 'component', sourcePath: 'components/Example.jsx' }, { name: 'VALUE', kind: 'constant', sourcePath: 'components/constants.js' }, { name: 'useExample', kind: 'hook', sourcePath: 'components/Example.jsx' }], cards: [], tokens: [{}], templates: [{ name: 'First', folder: 'templates/first', entryPath: 'templates/first/First.dc.html' }] };
  write('_ds_manifest.json', manifest);
  write('templates/first/First.dc.html', '<div data-props=\'{"language":{"options":["English","Tiếng Việt"]}}\'>First</div>');
  write('tokens/tokens.dtcg.json', { example: { $type: 'number', $value: 1 } });
  write('VERSION', '1.0.0\n');
  write('_audit/visual-diff.html', '<script>const BASE={first:{w:909}};</script>');
  const policy = { audiences: { documentation: { files: ['README.md'] } } };
  write('scripts/public-site-policy.json', policy);
  for (const path of countSurfaces) write(path, '<!-- cs-count:templates -->999<!-- /cs-count -->\n');
  write('AGENTS.md', '# Host adapter\n');
  let output = buildReferenceCatalog(root);
  assert.equal(output.counts.visualBaselines,1);
  write('_audit/visual-diff.html','<script>const BASE={first:{w:909},second:{w:1280}};</script>');
  output=buildReferenceCatalog(root);assert.equal(output.counts.visualBaselines,2);
  assert.equal(output.counts.templates, 1); assert.equal(output.counts.components, 1); assert.equal(output.counts.constants, 1); assert.equal(output.counts.hooks, 1); assert.equal(output.counts.publicExports, 3);
  assert.equal(output.counts.templatesWithThemeControl, 0); assert.equal(output.counts.templatesWithBooleanControl, 0);
  assert.equal(output.counts.templatesWithLanguageControl, 1);
  assert.equal(JSON.parse(output.updates.get('docs/reference-catalog.json')).documents.length, 1, 'Repository-only files must not leak into public catalog');
  assert(output.authority.documents.some(item => item.path === 'AGENTS.md' && item.audience === 'repository_only'));
  assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), '<!-- cs-count:templates -->999<!-- /cs-count -->\n', 'Planning projections must not write');
  manifest.templates.push({ name: 'Second', folder: 'templates/second', entryPath: 'templates/second/Second.dc.html' });
  write('_ds_manifest.json', manifest); write('templates/second/Second.dc.html', '<div>Static</div>');
  output = buildReferenceCatalog(root);
  assert.equal(output.counts.templates, 2); assert.equal(output.counts.templatesWithoutLanguageControl, 1);
  assert.equal(output.updates.get('README.md'), '<!-- cs-count:templates -->2<!-- /cs-count -->\n');
  // Editor metadata, not TypeScript display strings, declares a boolean control.
  write('templates/second/Second.dc.html', '<div data-props=\'{"theme":{"options":["light","dark"]},"flag":{"tsType":"boolean"}}\'>Static</div>');
  output = buildReferenceCatalog(root); assert.equal(output.counts.templatesWithThemeControl, 1); assert.equal(output.counts.templatesWithBooleanControl, 0);
  write('templates/second/Second.dc.html', '<div data-props=\'{"flag":{"editor":"boolean"}}\'>Static</div>');
  output = buildReferenceCatalog(root); assert.equal(output.counts.templatesWithThemeControl, 0); assert.equal(output.counts.templatesWithoutThemeControl, 2); assert.equal(output.counts.templatesWithBooleanControl, 1); assert.equal(output.counts.templatesWithoutBooleanControl, 1);
  write('unknown.md', '# Unknown\n'); policy.audiences.documentation.files.push('unknown.md'); write('scripts/public-site-policy.json', policy);
  assert.throws(() => buildReferenceCatalog(root), /Unclassified public document/);
  policy.audiences.documentation.files.pop(); write('scripts/public-site-policy.json', policy);
  write('README.md', 'Marker was accidentally removed');
  assert.throws(() => buildReferenceCatalog(root), /Missing generated counts/);
  write('README.md', '<!-- cs-count:templates -->999<!-- /cs-count -->');
  write('_audit/namespace-portability.html', '<!-- outer <!-- cs-count:templates -->999<!-- /cs-count --> -->');
  assert.throws(() => buildReferenceCatalog(root), /standalone HTML comments/);
} finally { rmSync(root, { recursive: true, force: true }); }
const actual = buildReferenceCatalog();
for (const [path, text] of actual.updates) assert.equal(readFileSync(path, 'utf8'), text, 'Stale projection: ' + path);
const current = JSON.parse(readFileSync('docs/reference-catalog.json', 'utf8'));
assert(current.documents.every(item => item.audience !== 'repository_only' && item.role !== 'unclassified_requires_review'));
assert.equal(current.counts.components + current.counts.constants + current.counts.hooks, current.counts.publicExports);
for (const control of ['Language','Theme','Boolean']) assert.equal(current.counts['templatesWith'+control+'Control'] + current.counts['templatesWithout'+control+'Control'], current.counts.templates);
console.log('PASS reference catalog: source-derived counts, document roles, projection freshness, repository-only exclusion and mutation failures');
