import { readFileSync } from 'node:fs';
const publicPolicy = JSON.parse(readFileSync(new URL('./public-site-policy.json', import.meta.url), 'utf8'));
const publicSources = Object.values(publicPolicy.audiences).flatMap(group => group.files);
/** Shared by Storybook and its freshness verifier: every served/copied source. */
export const storybookRootFiles = {
  '/styles.css': 'styles.css',
  '/_ds_bundle.js': '_ds_bundle.js',
  '/_ds_manifest.json': '_ds_manifest.json',
  '/image-slot.js': 'image-slot.js',
  '/VERSION': 'VERSION',
  '/README.md': 'README.md',
  '/SKILL.md': 'SKILL.md',
  '/llms.txt': 'llms.txt',
  '/CONTRIBUTING.md': 'CONTRIBUTING.md',
};
const storybookStaticDirs = ['fonts', 'assets', 'base', 'tokens', 'guidelines', 'templates', 'ui_kits', '_audit', 'docs'];
// Exact generated trees from maintained fixture manifests and locks. Authored
// fixture sources remain hashed; arbitrary node_modules paths are not exempt.
export const storybookGeneratedDependencies = [
  '_audit/ci/fixtures/npm-cli/node_modules',
  '_audit/ci/fixtures/style-dictionary/node_modules',
];
export const storybookBuildInputs = [
  ...publicSources,
  ...Object.values(storybookRootFiles), ...storybookStaticDirs,
  'stories', '.storybook', 'components', '_vendor', '_esm',
  'package.json', 'package-lock.json', 'vercel.json',
  'scripts/vercel-static-output.mjs', 'scripts/public-site.mjs', 'scripts/public-site-policy.json',
  'scripts/storybook-inputs.mjs', 'scripts/storybook-fingerprint.mjs',
  'scripts/generate-content-schema-validator.mjs', 'scripts/generate-token-coverage.mjs',
  'scripts/generate-component-review.mjs',
  'scripts/generate-export-catalog.mjs', 'scripts/lib/card-metadata.mjs',
  'scripts/generate-api-index.mjs', 'scripts/generate-template-inventory.mjs',
  'scripts/build-storybook.mjs', 'scripts/stamp-storybook-freshness.mjs',
  '.gitignore',
];
