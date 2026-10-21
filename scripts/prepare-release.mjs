#!/usr/bin/env node
/** Prepare reviewable release files. Never commits, tags, pushes or publishes. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { validateSupport } from './lib/component-support.mjs';
import {compatibilityBlockers} from './lib/release-compatibility.mjs';
import {parseReleaseVersion, compareReleaseVersions} from './lib/release-version.mjs';
import {runPinnedNpm} from './npm.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
const digest = value => createHash('sha256').update(value).digest('hex');
const read = (root, path) => readFileSync(join(root, path), 'utf8');
const json = (root, path) => JSON.parse(read(root, path));
const write = (root, path, data) => writeFileSync(join(root, path), data);

export function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.error || result.signal || result.status !== 0) throw Error(`git ${args[0]} failed: ${result.error?.message || result.stderr || result.signal}`);
  return args[0] === 'diff' ? result.stdout : result.stdout.trim();
}
function versionParts(version) {
  return parseReleaseVersion(version).core;
}
function newer(next, current) {
  return compareReleaseVersions(next, current) > 0;
}
export function readVersion(root) {
  const version = read(root, 'VERSION').trim(), pkg = json(root, 'package.json'), lock = json(root, 'package-lock.json');
  versionParts(version);
  assert.equal(pkg.version, version, 'package.json differs from VERSION');
  assert.equal(lock.version, version, 'package-lock.json differs from VERSION');
  assert.equal(lock.packages?.['']?.version, version, 'package-lock root package differs from VERSION');
  return version;
}
export function supportBlockers(root) {
  const lifecycle = json(root, 'components/lifecycle.json');
  const manifest = json(root, '_ds_manifest.json');
  const maintainers = json(root, 'components/maintainers.json');
  const hasRole = (name, role) => maintainers.maintainers.some(item => item.name === name && item.roles.includes(role));
  const blockers = [];
  assert.equal(lifecycle.supportContractVersion, 1, 'Unsupported lifecycle review contract');
  assert.equal(maintainers.schemaVersion, 1, 'Unsupported maintainers registry');
  for (const { name, kind, sourcePath } of manifest.components) {
    const entry = lifecycle.components[name];
    if (!entry || entry.kind !== kind || entry.sourcePath !== sourcePath) { blockers.push(`${name}: lifecycle kind/source is missing or mismatched`); continue; }
    if (!['stable', 'preview', 'deprecated'].includes(entry.status) || !entry.support?.limitations?.length) blockers.push(`${name}: lifecycle status or explicit limitations are missing`);
    try { validateSupport(entry.support, root); } catch (error) { blockers.push(`${name}: ${error.message}`); }
    if (entry.support?.reviewState !== 'reviewed' || !hasRole(entry.support?.owner, 'owner') || !hasRole(entry.support?.reviewedBy, 'reviewer')) blockers.push(`${name}: fresh authorized support review required`);
  }
  const names = new Set(manifest.components.map(entry => entry.name));
  for (const name of Object.keys(lifecycle.components)) if (!names.has(name)) blockers.push(`${name}: orphan support record`);
  return blockers;
}
function sourceIdentity(root, sourceSha, runGit) {
  assert.match(sourceSha || '', /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/, 'An exact lowercase source commit SHA is required');
  const head = runGit(root, ['rev-parse', '--verify', 'HEAD^{commit}']);
  assert.equal(head, sourceSha, 'Source SHA must equal the checked-out HEAD commit');
  return head;
}
function tagExists(root, tag, runGit) {
  return runGit(root, ['tag', '--list', tag]).split('\n').includes(tag);
}

export function planRelease(root, { version, sourceSha }, { runGit = git } = {}) {
  versionParts(version);
  const currentVersion = readVersion(root);
  assert(newer(version, currentVersion), 'Proposed version must be greater than current VERSION');
  const sourceCommit = sourceIdentity(root, sourceSha, runGit);
  const tag = `v${version}`;
  const blockers = supportBlockers(root);
  blockers.push(...compatibilityBlockers(root,currentVersion,version));
  if (runGit(root, ['status', '--porcelain', '--untracked-files=normal'])) blockers.push('Source checkout is not clean; commit/review the intended source before preparing a candidate');
  if (tagExists(root, tag, runGit)) blockers.push(`Tag ${tag} already exists; preparation never moves or replaces tags`);
  return {
    schemaVersion: 1, mode: 'plan', currentVersion, proposedVersion: version,
    sourceCommit, proposedTag: tag, readyToPrepare: blockers.length === 0, blockers,
    authoredStamps: ['VERSION', 'package.json', 'package-lock.json', 'README.md', 'docs/consuming.md', 'docs/vi/consuming.md', 'docs/conventions.md', 'docs/vi/conventions.md', 'docs/release-notes.md', 'docs/vi/release-notes.md', 'stories/ReleaseNotes/ReleaseNotes.mdx'],
    regeneration: ['npm run tokens:generate'],
    requiredValidation: ['node _audit/ci/test-component-lifecycle.mjs', 'npm run verify', 'npm run verify:browser (Linux pixel baselines)'],
    acceptance: 'Preparation only. No release, package publication, tag, commit, push, merge, deployment or support approval is performed.',
  };
}

export function verifyTagIdentity(root, { version, sourceSha }, { runGit = git } = {}) {
  assert.equal(readVersion(root), version, 'Tag version must equal all current version files');
  sourceIdentity(root, sourceSha, runGit);
  assert.equal(runGit(root, ['status', '--porcelain', '--untracked-files=normal']), '', 'Tagged release identity requires a clean checkout');
  const tag = `v${version}`;
  assert(tagExists(root, tag, runGit), `Tag ${tag} is missing`);
  assert.equal(runGit(root, ['rev-parse', '--verify', `refs/tags/${tag}^{commit}`]), sourceSha, 'Version tag points to a different source commit');
  const blockers = supportBlockers(root);
  assert.equal(blockers.length, 0, blockers.join('\n'));
  const compatibility = json(root,'components/release-compatibility.json');
  assert.deepEqual(compatibilityBlockers(root,compatibility.baselineVersion,version),[],'Release compatibility notice/version requirements are not satisfied');
  return { schemaVersion: 1, mode: 'verify-tag', version, tag, sourceCommit: sourceSha, identityVerified: true, publicationAuthorized: false };
}

/** Explicit local writes only; use a disposable clean checkout, never an active worktree. */
export function prepareRelease(root, options, { runGit = git, regenerate } = {}) {
  const plan = planRelease(root, options, { runGit });
  assert(plan.readyToPrepare, 'Preparation blocked:\n' + plan.blockers.join('\n'));
  const evidenceBefore = read(root, 'components/lifecycle.json');
  const compatibilityBefore = read(root,'components/release-compatibility.json');
  const pkg = json(root, 'package.json'), lock = json(root, 'package-lock.json');
  pkg.version = options.version;
  lock.version = options.version;
  lock.packages[''].version = options.version;
  write(root, 'VERSION', options.version + '\n');
  write(root, 'package.json', JSON.stringify(pkg, null, 2) + '\n');
  write(root, 'package-lock.json', JSON.stringify(lock, null, 2) + '\n');
  for (const path of plan.authoredStamps.slice(3)) {
    // These are current consumer instructions; published historical release notes
    // and earlier evidence remain unchanged and are never relabelled as accepted.
    const text = read(root, path);
    const introductionEnd = path.includes('release-notes') || path.includes('ReleaseNotes') ? text.indexOf('\n## ') : -1;
    const boundary = introductionEnd < 0 ? text.length : introductionEnd;
    write(root, path, text.slice(0, boundary).replace(new RegExp('(?<![0-9.])' + plan.currentVersion.replaceAll('.', '\\.') + '(?![0-9.])', 'g'), options.version) + text.slice(boundary));
  }
  const generate = regenerate || (() => {
    const result = runPinnedNpm(root, ['run', 'tokens:generate'], { stdio: ['ignore', 2, 2] });
    assert(!result.error && !result.signal && result.status === 0, 'Candidate regeneration failed; inspect the disposable checkout; no release was performed');
  });
  generate(root);
  assert.equal(read(root, 'components/lifecycle.json'), evidenceBefore, 'Preparation must not rewrite support approvals or evidence');
  assert.equal(read(root,'components/release-compatibility.json'),compatibilityBefore,'Preparation must not rewrite release classifications or notice/publication evidence');
  assert.equal(readVersion(root), options.version);
  const blockers = supportBlockers(root);
  assert.equal(blockers.length, 0, 'Candidate regeneration invalidated support evidence; fresh review required:\n' + blockers.join('\n'));
  assert.deepEqual(compatibilityBlockers(root,plan.currentVersion,options.version),[],'Candidate regeneration invalidated release compatibility');
  assert.equal(runGit(root, ['ls-files', '--others', '--exclude-standard']), '', 'Generated untracked files would be omitted from the release patch');
  assert.equal(runGit(root, ['rev-parse', '--verify', 'HEAD^{commit}']), options.sourceSha, 'Source commit changed during preparation');
  assert(!tagExists(root, plan.proposedTag, runGit), 'Proposed tag appeared during preparation; refuse ambiguous identity');
  const patch = runGit(root, ['diff', '--binary', 'HEAD']);
  assert(patch, 'Prepared candidate has no version patch');
  return { ...plan, mode: 'prepared-files', readyToPrepare: false, filesPrepared: true, candidateValidated: false, patchSha256: digest(patch),
    versionFileHashes: Object.fromEntries(['VERSION', 'package.json', 'package-lock.json'].map(path => [path, digest(read(root, path))])),
    nextAction: 'Run every required validation on these exact candidate files, retain the patch/evidence, and obtain separate authorization before creating a candidate commit or release identity.' };
}

export function verifyPreparedCandidate(root, { version, sourceSha }, receipt, { runGit = git } = {}) {
  assert.equal(receipt.mode, 'prepared-files', 'Expected a prepared-file receipt');
  assert.equal(receipt.proposedVersion, version, 'Candidate receipt version differs');
  assert.equal(receipt.sourceCommit, sourceSha, 'Candidate receipt source SHA differs');
  assert.equal(readVersion(root), version, 'Candidate version files changed during validation');
  sourceIdentity(root, sourceSha, runGit);
  assert(!tagExists(root, `v${version}`, runGit), 'Proposed tag already exists in fetched refs');
  assert.equal(runGit(root, ['ls-files', '--others', '--exclude-standard']), '', 'Untracked candidate files would be omitted');
  assert.equal(digest(runGit(root, ['diff', '--binary', 'HEAD'])), receipt.patchSha256, 'Candidate patch changed during validation; rerun preparation and every check');
  const blockers = supportBlockers(root);
  assert.equal(blockers.length, 0, blockers.join('\n'));
  assert.deepEqual(compatibilityBlockers(root,receipt.currentVersion,version),[],'Candidate release compatibility requirements are not satisfied');
  return { schemaVersion: 1, mode: 'candidate-identity', version, sourceCommit: sourceSha, proposedTag: `v${version}`, patchSha256: receipt.patchSha256, identityVerified: true, publicationAuthorized: false };
}

export function parseArguments(args) {
  const options = { write: false, verifyTag: false };
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--write') { assert(!options.write, 'Duplicate --write'); options.write = true; }
    else if (argument === '--verify-tag') { assert(!options.verifyTag, 'Duplicate --verify-tag'); options.verifyTag = true; }
    else if (argument === '--version' || argument === '--source-sha' || argument === '--check-candidate') {
      const key = argument === '--version' ? 'version' : argument === '--source-sha' ? 'sourceSha' : 'candidateReceipt';
      assert(options[key] === undefined, `Duplicate ${argument}`);
      const value = args[++index];
      assert(value && !value.startsWith('--'), `Missing value for ${argument}`);
      options[key] = value;
    } else throw Error(`Unknown argument: ${argument}`);
  }
  assert(options.version && options.sourceSha, 'Usage: node scripts/prepare-release.mjs --version X.Y.Z --source-sha EXACT_SHA [--write | --verify-tag]');
  assert([options.write, options.verifyTag, !!options.candidateReceipt].filter(Boolean).length <= 1, '--write, --verify-tag and --check-candidate are mutually exclusive');
  return options;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = options.candidateReceipt ? verifyPreparedCandidate(repository, options, JSON.parse(readFileSync(options.candidateReceipt, 'utf8'))) : options.verifyTag ? verifyTagIdentity(repository, options) : options.write ? prepareRelease(repository, options) : planRelease(repository, options);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
