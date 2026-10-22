import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
export function assertOwnerRouting(owners, registry, snapshot) {
  const rules = owners.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  assert.equal(rules.length, 1, 'Only the existing all-path owner is appointed');
  assert.match(snapshot.observedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(snapshot.repository.full_name, 'cyberskill-official/design');
  const identity = snapshot.identity;
  assert.match(identity.login, /^[A-Za-z0-9][A-Za-z0-9-]*$/);
  const owner = registry.maintainers.find(item => item.name === identity.name && item.roles.includes('owner'));
  assert(owner, 'Routing must reference an appointed owner');
  assert.equal(owner.githubLogin, identity.login);
  assert.equal(owner.eligibilitySnapshot, '_audit/ci/fixtures/github-ownership.json');
  assert(snapshot.repository.permissions.push === true, 'Code Owner eligibility needs recorded write access');
  assert.equal(rules[0], '* @' + identity.login, 'All paths route to the verified existing owner');
}
const read = path => readFileSync(path, 'utf8');
const owners = read('.github/CODEOWNERS');
const registry = JSON.parse(read('components/maintainers.json'));
const snapshot = JSON.parse(read('_audit/ci/fixtures/github-ownership.json'));
assertOwnerRouting(owners, registry, snapshot);
for (const mutate of [
  value => value.repository.permissions.push = false,
  value => value.identity.name = 'Unappointed person',
  value => value.identity.login = 'different',
  value => value.repository.full_name = 'other/repository',
]) {
  const bad = structuredClone(snapshot); mutate(bad);
  assert.throws(() => assertOwnerRouting(owners, registry, bad));
}
for (const bad of ['* @fictional', owners + '\n/docs/ @other\n', '# comments only']) {
  assert.throws(() => assertOwnerRouting(bad, registry, snapshot));
}
console.log('PASS owner routing: appointed identity, dated write-access snapshot, all-path coverage and unknown/ineligible/extra-owner rejection; live review enforcement is separate');
