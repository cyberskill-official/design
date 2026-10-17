import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

/** Validate recorded support claims; this cannot establish who approved them. */
export function validateSupport(support, root) {
  assert(support && ['unreviewed', 'reviewed'].includes(support.reviewState), 'Missing support review state');
  for (const key of ['owner', 'reviewedBy']) assert(support[key] === null || (typeof support[key] === 'string' && support[key].trim()), `Invalid support ${key}`);
  for (const key of ['environments', 'axes', 'limitations']) assert(Array.isArray(support[key]) && support[key].every(value => typeof value === 'string' && value.trim()), `Invalid support ${key}`);
  assert(Array.isArray(support.evidence), 'Missing support evidence array');
  assert(support.deprecation === null || (typeof support.deprecation?.reason === 'string' && support.deprecation.reason.trim() && typeof support.deprecation?.migration === 'string' && support.deprecation.migration.trim()), 'Deprecation needs reason and migration guidance');
  for (const item of support.evidence) {
    assert(item && typeof item.path === 'string' && !item.path.startsWith('/') && !item.path.includes('\\') && item.path.split('/').every(part => part && part !== '.' && part !== '..'), 'Unsafe support evidence path');
    assert(typeof item.scope === 'string' && item.scope.trim(), 'Support evidence needs a scope');
    assert(typeof item.checkedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(item.checkedAt) && Number.isFinite(Date.parse(item.checkedAt)), 'Support evidence needs a date');
    assert.match(item.sha256 || '', /^[a-f0-9]{64}$/);
    const base = realpathSync(root), file = realpathSync(resolve(root, item.path));
    assert(file.startsWith(base + sep), 'Support evidence escapes repository');
    assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), item.sha256, 'Support evidence changed');
  }
  if (support.reviewState === 'reviewed') {
    assert(support.owner && support.reviewedBy, 'Reviewed support requires owner and reviewer');
    assert(typeof support.reviewedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(support.reviewedAt) && Number.isFinite(Date.parse(support.reviewedAt)), 'Reviewed support requires a date');
    assert(support.environments.length && support.axes.length && support.evidence.length, 'Reviewed support requires explicit environment/axis scope and evidence');
  } else {
    assert.equal(support.reviewedAt, null, 'Unreviewed support cannot carry a review date');
    assert.equal(support.reviewedBy, null, 'Unreviewed support cannot carry a reviewer');
    assert(support.limitations.length, 'Unreviewed support needs an explicit limitation');
  }
  return support;
}
