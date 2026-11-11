// Bundles tokens + base + every component stylesheet into dist/styles.css.
// Component CSS lives in the base and components cascade layers, so app CSS and Tailwind utilities win without !important.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform, browserslistToTargets } from 'lightningcss';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = join(root, 'src', 'css');
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });
if (!existsSync(join(dist, 'tokens.css'))) { console.error('Run scripts/build-tokens.mjs first'); process.exit(1); }

const components = readdirSync(join(css, 'components')).filter(f => f.endsWith('.css')).sort();
// Layers named like Tailwind's (base, components), so in a Tailwind app the order is
// theme < base (preflight, then ours) < components (ours) < utilities: `className="px-10"` wins, preflight never resets us.
// Without Tailwind the same layers sit below every unlayered app rule. Reduced motion is unlayered so it beats component transitions.
const source = [
  '@layer base, components;',
  `@layer base {\n${readFileSync(join(css, 'base.css'), 'utf8')}\n}`,
  ...components.map(f => `/* ${f} */\n@layer components {\n${readFileSync(join(css, 'components', f), 'utf8')}\n}`),
  readFileSync(join(css, 'motion.css'), 'utf8'),
].join('\n');

// Baseline browsers: last 2 years of evergreen browsers (Chrome/Edge/Firefox 120+, Safari 17+).
const targets = { chrome: 120 << 16, edge: 120 << 16, firefox: 120 << 16, safari: 17 << 16, ios_saf: 17 << 16 };
const { code, warnings } = transform({ filename: 'styles.css', code: Buffer.from(source), minify: false, targets, drafts: { customMedia: true } });
for (const w of warnings) console.warn('css warning:', w.message);
const tokens = readFileSync(join(dist, 'tokens.css'), 'utf8');
writeFileSync(join(dist, 'styles.css'), tokens + '\n' + code.toString());
const min = transform({ filename: 'styles.min.css', code: Buffer.from(tokens + code.toString()), minify: true, targets });
writeFileSync(join(dist, 'styles.min.css'), min.code);
console.log(`✓ styles.css: base + ${components.length} component stylesheets`);
void browserslistToTargets;
