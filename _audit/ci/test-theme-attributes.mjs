#!/usr/bin/env node
/**
 * TASK-IMP-027 — Theme attributes density + contrast contract (not a fifth axis).
 * See docs/decisions/theme-density-contrast.md.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL test-theme-attributes —', msg);
    process.exit(1);
  }
}

const styles = read('styles.css');
assert(/theme-attributes\.css/.test(styles), 'styles.css must import theme-attributes.css');

const ta = read('tokens/theme-attributes.css');
assert(/data-cs-density\s*=\s*["']compact["']/.test(ta), 'compact density selector');
assert(/data-cs-contrast\s*=\s*["']high["']/.test(ta), 'high contrast selector');
assert(/--cs-component-button-md-minHeight/.test(ta) === false, 'compact must not override md minHeight (44px floor)');
assert(/44px/.test(ta) || /immutable touch/.test(ta), 'documents 44px touch floor');

const axis = read('_audit/axis-guard.html');
assert(!/\/data-cs-density\/i/.test(axis), 'axis-guard must not forbid data-cs-density via BAD regex');
assert(/data-cs-expression/i.test(axis), 'axis-guard still forbids Expression');
assert(/theme-attributes\.css/.test(axis), 'axis-guard references theme-attributes allowlist');

const preview = read('.storybook/preview.jsx');
assert(/density:/.test(preview) && /contrast:/.test(preview), 'Storybook toolbar exposes density+contrast');
assert(/data-cs-density/.test(preview) && /data-cs-contrast/.test(preview), 'Storybook decorator sets Theme attrs');

const atomic = read('guidelines/atomic-view.html');
assert(/DENSITIES/.test(atomic) && /CONTRASTS/.test(atomic), 'Atomic View exposes density+contrast');
assert(/data-cs-density/.test(atomic) && /data-cs-contrast/.test(atomic), 'Atomic View applies Theme attrs');

console.log('PASS test-theme-attributes');
