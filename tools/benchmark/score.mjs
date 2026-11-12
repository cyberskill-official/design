// Scoring for the quality benchmark: pass rates per dimension, what blocks, and the advisory ratchet.
import { DIMENSIONS } from './dimensions.mjs';

export const newResults = () => Object.fromEntries(DIMENSIONS.map(d => [d.id, { total: 0, fails: new Map() }]));

/** One measured subject. `key` must be stable between runs (story id, theme and a label, not coordinates). */
export function record(results, dim, { pass, key, detail = '' }) {
  const r = results[dim];
  if (!r) throw new Error(`unknown dimension ${dim}`);
  r.total++;
  if (!pass && !r.fails.has(key)) r.fails.set(key, detail);
}

// An advisory score may dip this much below its baseline before it blocks: fonts render a pixel apart on Linux and macOS.
export const TOLERANCE = 0.5;

/**
 * Required dimensions block on any failure. Advisory ones block when their score drops below the baseline's
 * (a ratchet); failures not in the baseline are listed as new, and baseline entries that now pass as fixed.
 */
export function score(results, baseline = { advisory: {} }, { partial = false } = {}) {
  const rows = DIMENSIONS.map(d => {
    const r = results[d.id], failed = r.fails.size;
    const known = new Set(baseline.advisory?.[d.id] ?? []);
    const newFails = d.level === 'advisory' ? [...r.fails.keys()].filter(k => !known.has(k)) : [];
    const fixed = d.level === 'advisory' ? [...known].filter(k => !r.fails.has(k)) : [];
    const pct = r.total ? Math.round((1000 * (r.total - Math.min(failed, r.total))) / r.total) / 10 : null;
    // a partial run (--stories) leaves some dimensions unmeasured; a full run with nothing measured means a broken check
    const floor = baseline.scores?.[d.id];
    const blocking = d.level === 'required' ? failed > 0 || (r.total === 0 && !partial) : !partial && pct != null && (floor == null ? failed > 0 : pct < floor - TOLERANCE);
    return { ...d, total: r.total, failed, score: pct, newFails, fixed, blocking, fails: [...r.fails].map(([key, detail]) => ({ key, detail })) };
  });
  const scored = rows.filter(r => r.score != null);
  const overall = scored.length ? Math.round((10 * scored.reduce((s, r) => s + r.score, 0)) / scored.length) / 10 : 0;
  return { rows, overall, blocking: rows.some(r => r.blocking) };
}

export const baselineOf = ({ rows, overall }) => ({
  note: 'Advisory gaps accepted today. An advisory dimension fails when its score drops below the score here. Regenerate with npm run benchmark -- --update-baseline after fixing some.',
  overall,
  scores: Object.fromEntries(rows.map(r => [r.id, r.score])),
  advisory: Object.fromEntries(rows.filter(r => r.level === 'advisory' && r.fails.length).map(r => [r.id, r.fails.map(f => f.key).sort()])),
});

const status = r => (r.total === 0 ? (r.blocking ? '✗ nothing measured' : '– not measured') : r.level === 'required' ? (r.failed ? `✗ ${r.failed} failing` : '✓') : r.blocking ? `✗ below baseline (${r.newFails.length} new)` : r.failed ? `○ ${r.failed} known${r.newFails.length ? `, ${r.newFails.length} new` : ''}` : '✓');

/** Markdown scorecard: one table, then the failures that block. */
export function scorecard({ rows, overall, blocking }, meta = {}) {
  const lines = [
    `## Quality benchmark: ${overall}/100 ${blocking ? '✗' : '✓'}`,
    '',
    meta.summary ?? '',
    '',
    '| | Dimension | Standard | Level | Score | Measured | Result |',
    '|---|---|---|---|---:|---:|---|',
    ...rows.map(r => `| ${r.id} | ${r.name} | ${r.standard} | ${r.level} | ${r.score ?? '–'} | ${r.total} | ${status(r)} |`),
  ];
  const block = rows.filter(r => r.blocking);
  if (block.length) {
    lines.push('', '### Blocking');
    for (const r of block) {
      const list = r.level === 'required' ? r.fails : r.fails.filter(f => r.newFails.includes(f.key));
      lines.push('', `**${r.id} ${r.name}**${r.total === 0 ? ': nothing was measured (the check is broken or its story is missing)' : ''}`);
      for (const f of list.slice(0, 15)) lines.push(`- \`${f.key}\`${f.detail ? `: ${f.detail}` : ''}`);
      if (list.length > 15) lines.push(`- … ${list.length - 15} more in report.json`);
    }
  }
  const fixed = rows.filter(r => r.fixed.length);
  if (fixed.length) lines.push('', `Advisory gaps now passing (run with --update-baseline to lock them in): ${fixed.map(r => `${r.id} ×${r.fixed.length}`).join(', ')}`);
  return lines.join('\n') + '\n';
}
