#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const path = resolve(process.argv[2] || 'docs/manual-at-matrix.json');
const matrix = JSON.parse(readFileSync(path, 'utf8'));
if (!matrix || matrix.schemaVersion !== 1 || !Array.isArray(matrix.rows) || matrix.rows.length !== 16) {
  console.error('Publication refused: manual AT matrix is missing or not the 16-row record');
  process.exit(1);
}
const blocked = [];
for (const row of matrix.rows) {
  const ready = row.status === 'passed'
    && typeof row.reviewer === 'string' && row.reviewer.trim()
    && typeof row.reviewedAt === 'string' && Number.isFinite(Date.parse(row.reviewedAt))
    && typeof row.sourceCommit === 'string' && /^[a-f0-9]{40}$/.test(row.sourceCommit)
    && typeof row.environment === 'string' && row.environment.trim()
    && typeof row.observations === 'string' && row.observations.trim()
    && Array.isArray(row.evidence) && row.evidence.length > 0;
  if (!ready) blocked.push(`${row.id}=${row.status}`);
}
if (blocked.length) {
  console.error('Publication refused: manual AT rows are not passed with evidence: ' + blocked.join(', '));
  process.exit(1);
}
console.log('PASS manual AT publication gate: 16 rows passed with evidence');
