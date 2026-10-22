#!/usr/bin/env node
/** Source-derived reference facts and documentary roles; never grants acceptance. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { parse as parseJavaScript } from '@babel/parser';
import { collectTemplates } from './generate-template-inventory.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const generatorSha256 = sha(readFileSync(fileURLToPath(import.meta.url)));
export const countSurfaces = ['README.md', '_audit/README.md', '_audit/index.html', '_audit/namespace-portability.html', 'docs/figma.md', 'docs/vi/figma.md', 'docs/conventions.md', 'docs/vi/conventions.md'];
export function replaceCounts(text, counts) {
  let seen = 0;
  const output = text.replace(/<!-- cs-count:([A-Za-z]+) -->(\d+)<!-- \/cs-count -->/g, (_, key) => {
    assert(Object.hasOwn(counts, key), 'Unknown reference count: ' + key);
    assert(Number.isSafeInteger(counts[key]) && counts[key] >= 0, 'Invalid reference count');
    seen++;
    return `<!-- cs-count:${key} -->${counts[key]}<!-- /cs-count -->`;
  });
  assert.equal((text.match(/<!-- cs-count:/g) || []).length, seen, 'Malformed reference-count marker');
  assert.equal((text.match(/<!-- \/cs-count -->/g) || []).length, seen, 'Unpaired reference-count marker');
  return { text: output, markers: seen };
}
export function documentRole(path) {
  const entrances=['DESIGN.md','README.md','SKILL.md','AGENTS.md','CLAUDE.md','GEMINI.md','CONTRIBUTING.md','llms.txt','MAINTAINERS.md','SECURITY.md'];
  const mirrored=entrances.find(name=>path==='docs/vi/entrypoints/'+name);
  if(mirrored)return documentRole(mirrored);
  const english = path.replace(/^docs\/vi\//, 'docs/');
  if (['docs/doctrine.md', 'docs/products.md', 'docs/conventions.md'].includes(english)) return 'normative_repository_contract';
  if (english === 'docs/consumer-grant.md') return 'usage_grant_record';
  if (english === 'docs/decisions.md' || english.startsWith('docs/decisions/')) return 'decision_record';
  if (path === 'SKILL.md') return 'shared_agent_router';
  if (['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'].includes(path) || /^\.(?:agents|cursor)\/skills\//.test(path)) return 'host_adapter';
  if (path.startsWith('.agents/rules/')) return 'host_adapter';
  if (path.startsWith('vendor/skill-resources/')) return 'retained_vendor_resource';
  if (['base/README.md','tokens/README.md','tokens/modes.md'].includes(path)) return 'source_maintenance_guide';
  const reviewedRoles = {
    '.github/pull_request_template.md': 'contribution_template',
    '_audit/remediation/assessment-source.md': 'retained_assessment_source',
    '_audit/remediation/assessment-remediation.md': 'remediation_report',
    '_audit/remediation/decision-template.md': 'decision_template',
    '_audit/remediation/release-v1.7.2-notes-proposal.md': 'private_owner_review_release_metadata_proposal',
    'scripts/lib/compiler-and-story-domains.md': 'source_maintenance_guide',
    'scripts/template-hex-policy.md': 'source_maintenance_guide',
  };
  if (Object.hasOwn(reviewedRoles, path)) return reviewedRoles[path];
  if (path === 'SECURITY.md') return 'security_reporting_policy';
  if (path === 'llms.txt') return 'discovery_index';
  if (path === 'README.md') return 'human_orientation';
  if (path === 'DESIGN.md') return 'generated_reference';
  if (path === 'THIRD-PARTY-NOTICES.md' || path.startsWith('_vendor/') || path.startsWith('_audit/vendor/')) return 'attribution_or_distribution_record';
  if (path.endsWith('.prompt.md') && path.startsWith('components/')) return 'implementation_contract';
  if (english === 'docs/release-notes.md') return 'release_history';
  if (english === 'docs/contrast-report.md') return 'generated_measurement';
  if (path.startsWith('_audit/baselines/')) return 'visual_baseline_method';
  if (path === '_audit/README.md') return 'diagnostic_operator_guide';
  if (path.startsWith('examples/') || path.startsWith('ui_kits/') || path.startsWith('templates/')) return 'consumer_example_guide';
  if (['CONTRIBUTING.md', 'MAINTAINERS.md'].includes(path) || /^docs\/(?:vi\/)?[^/]+\.md$/.test(path)) return 'operator_guide';
  return 'unclassified_requires_review';
}
export function visualBaselineNames(html) {
  const scripts=[];
  const visit=node=>{
    if(node.tagName==='script' && !(node.attrs||[]).some(attr=>attr.name==='src')) scripts.push((node.childNodes||[]).filter(child=>child.nodeName==='#text').map(child=>child.value).join(''));
    for(const child of node.childNodes||[])visit(child);
  };
  visit(parse(html));
  const declarations=scripts.flatMap(script=>parseJavaScript(script,{sourceType:'script'}).program.body.filter(node=>node.type==='VariableDeclaration').flatMap(node=>node.declarations)).filter(node=>node.id.type==='Identifier'&&node.id.name==='BASE');
  assert.equal(declarations.length,1,'Expected one static visual baseline inventory');
  const object=declarations[0].init;
  assert.equal(object?.type,'ObjectExpression','Visual baseline inventory must be a static object');
  const names=object.properties.map(property=>{
    assert(property.type==='ObjectProperty'&&!property.computed&&property.value.type==='ObjectExpression','Visual baseline entries must be static object properties');
    assert(['StringLiteral','Identifier'].includes(property.key.type),'Unsupported visual baseline name');
    const name=property.key.value??property.key.name;
    assert(/^[a-z][a-z0-9-]*$/.test(name),'Invalid visual baseline name');
    return name;
  });
  assert.equal(new Set(names).size,names.length,'Duplicate visual baseline name');
  return names;
}
export function buildReferenceCatalog(base = root) {
  const read = path => readFileSync(resolve(base, path), 'utf8');
  const manifest = JSON.parse(read('_ds_manifest.json'));
  const templates = collectTemplates(base).templates;
  const dtcg = JSON.parse(read('tokens/tokens.dtcg.json'));
  const leaves = node => !node || typeof node !== 'object' ? 0 : Object.hasOwn(node, '$value') ? 1 : Object.entries(node).filter(([key]) => !key.startsWith('$')).reduce((sum, [,value]) => sum + leaves(value), 0);
  const counts = {
    visualBaselines: visualBaselineNames(read('_audit/visual-diff.html')).length,
    templates: templates.length,
    vietnameseInstrumentTemplates: templates.filter(item => item.path.startsWith('templates/vn-')).length,
    publicExports: manifest.components.length,
    components: manifest.components.filter(item => item.kind === 'component').length,
    constants: manifest.components.filter(item => item.kind === 'constant').length,
    hooks: manifest.components.filter(item => item.kind === 'hook').length,
    componentSourceFiles: new Set(manifest.components.map(item => item.sourcePath).filter(path => /\.(jsx|tsx)$/.test(path))).size,
    coExports: manifest.components.length - new Set(manifest.components.map(item => item.sourcePath).filter(path => /\.(jsx|tsx)$/.test(path))).size,
    cards: manifest.cards.length,
    publicTokenDeclarations: manifest.tokens.length,
    typedBaseTokens: leaves(dtcg),
    templatesWithLanguageControl: templates.filter(item => item.declaredProps.some(props => Object.hasOwn(props, 'language'))).length,
    templatesWithoutLanguageControl: templates.filter(item => !item.declaredProps.some(props => Object.hasOwn(props, 'language'))).length,
    templatesWithThemeControl: templates.filter(item => item.declaredProps.some(props => Object.hasOwn(props, 'theme'))).length,
    templatesWithoutThemeControl: templates.filter(item => !item.declaredProps.some(props => Object.hasOwn(props, 'theme'))).length,
    templatesWithBooleanControl: templates.filter(item => item.declaredProps.some(props => Object.values(props).some(prop => prop.editor === 'boolean'))).length,
    templatesWithoutBooleanControl: templates.filter(item => !item.declaredProps.some(props => Object.values(props).some(prop => prop.editor === 'boolean'))).length,
  };
  const policy = JSON.parse(read('scripts/public-site-policy.json'));
  const audiences = new Map(Object.entries(policy.audiences).flatMap(([audience, group]) => group.files.map(path => [path, audience])));
  const paths = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: base, encoding: 'utf8' }).split('\0'))].filter(path => (path.endsWith('.md') || path === 'llms.txt' || path === 'docs/vi/entrypoints/llms.txt') && existsSync(resolve(base, path))).sort();
  const updates = new Map();
  for (const path of countSurfaces) {
    const result = replaceCounts(read(path), counts);
    assert(result.markers > 0, 'Missing generated counts on declared surface: ' + path);
    if (path.endsWith('.html')) {
      let comments = 0;
      const visit = node => {
        if (node.nodeName === '#comment' && /^(?:cs-count:[A-Za-z]+|\/cs-count)$/.test(node.data.trim())) comments++;
        for (const child of node.childNodes || []) visit(child);
        if (node.content) visit(node.content);
      };
      visit(parse(result.text));
      assert.equal(comments, result.markers * 2, 'Count markers must be standalone HTML comments: ' + path);
    }

    updates.set(path, result.text);
  }
  const documents = paths.map(path => ({ path, audience: audiences.get(path) || 'repository_only', role: documentRole(path), sha256: sha(updates.get(path) ?? read(path)) }));
  for (const document of documents) if (document.audience !== 'repository_only') assert(document.role !== 'unclassified_requires_review', 'Unclassified public document: ' + document.path);
  const interpretation = 'The document inventory covers Git-listed Markdown and llms.txt; HTML count surfaces are tracked separately. Audience follows the website publication policy, not npm membership. Source paths locate repository evidence and need not all be packaged. Roles describe source routing and audience, not approval, factual freshness of every sentence, translation quality or capability certification.';
  const sourcePaths = ['_audit/visual-diff.html', '_ds_manifest.json', 'tokens/tokens.dtcg.json', 'scripts/public-site-policy.json', ...templates.map(item => item.path)];
  const catalog = { schemaVersion: 1, generator: { path: 'scripts/generate-reference-catalog.mjs', sha256: generatorSha256 }, version: read('VERSION').trim(), interpretation, countScope: 'Counts describe declared inventory only. Declared language/theme/boolean controls are inventory facts, not proof of complete content, working behavior or every supported state; token declarations and typed base values are distinct counts.', counts, sourceHashes: Object.fromEntries(sourcePaths.sort().map(path => [path, sha(read(path))])), documents: documents.filter(item => item.audience !== 'repository_only') };
  const authority = { schemaVersion: 1, interpretation, source: 'scripts/generate-reference-catalog.mjs', sourceSha256: generatorSha256, counts: { documents: documents.length, public: catalog.documents.length, unclassified: documents.filter(item => item.role === 'unclassified_requires_review').length }, documents };
  updates.set('docs/reference-catalog.json', JSON.stringify(catalog, null, 2) + '\n');
  return { counts, updates, authority };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.slice(2).every(arg => arg === '--check'), 'Usage: node scripts/generate-reference-catalog.mjs [--check]');
  const { counts, updates, authority } = buildReferenceCatalog();
  const stale = [...updates].filter(([path, text]) => !existsSync(resolve(root, path)) || readFileSync(resolve(root, path), 'utf8') !== text);
  if (process.argv.includes('--check')) assert.equal(stale.length, 0, 'Stale reference catalog/projections: ' + stale.map(([path]) => path).join(', '));
  else for (const [path, text] of stale) writeFileSync(resolve(root, path), text);
  console.log('PASS reference catalog', JSON.stringify({ counts, documents: authority.counts }));
}
