/**
 * Host Storybook contract:
 * - Live hub = Storybook only (guidelines/live-view.html must not exist)
 * - Complete CSF for every public primary
 * - Honest deep matrix: non-empty argTypes; Matrix/AllVariants render mounts primary
 * - CSF bar: AllSizes when argTypes.size exists; States (or Matrix subsection) for
 *   disabled/loading/error/busy when those argTypes exist
 * - Exhaustive enum coverage: every discrete size/variant option must appear in a
 *   matrix-family story; when ≥1 of {size enums, variant enums, state keys} exist,
 *   FullMatrix must mount the size × variant × key-state product
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coveredPrimariesFromStories, listPublicComponents, listStoryFiles } from './storybook-inventory.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function assert(c, m) {
  if (!c) throw new Error(m);
}

const mainPath = existsSync(join(root, '.storybook/main.js'))
  ? join(root, '.storybook/main.js')
  : join(root, '.storybook/main.cjs');
const main = readFileSync(mainPath, 'utf8');
assert(main.includes('../stories/'), 'stories glob');
assert(main.includes('guidelines') || main.includes('/guidelines'), 'staticDirs include guidelines for Maintainer iframes');
assert(main.includes('_audit') || main.includes('/_audit'), 'staticDirs include _audit for Status iframe');
assert(main.includes('@storybook/addon-docs') || main.includes('addon-docs'), 'SB10 addon-docs');
assert(main.includes('@storybook/addon-a11y') || main.includes('addon-a11y'), 'addon-a11y');
assert(!main.includes('addon-essentials'), 'no addon-essentials (removed in SB10)');
assert(/export\s+default/.test(main), 'main config is ESM default export');
assert(main.includes('@cs'), 'viteFinal @cs alias');
assert(main.includes('react-vite') || main.includes('@storybook/react-vite'), 'react-vite framework');

const preview = readFileSync(join(root, '.storybook/preview.jsx'), 'utf8');
assert(preview.includes('styles.css'), 'imports styles.css');
assert(preview.includes('data-theme') && preview.includes('data-cs-element') && preview.includes('lang'), 'axes globals');
assert(preview.includes('data-cs-variant'), 'decorator wires data-cs-variant');
assert(preview.includes('data-cs-style'), 'decorator wires data-cs-style');
assert(/style:\s*\{/.test(preview) && preview.includes("value: 'liquid-glass'"), 'Style toolbar includes liquid-glass');
const styleToolbarBlock = preview.match(/style:\s*\{[\s\S]*?toolbar:\s*\{[\s\S]*?items:\s*\[([\s\S]*?)\]/);
assert(styleToolbarBlock, 'Style toolbar items array present');
const styleToolbarValueCount = (styleToolbarBlock[1].match(/value:\s*['"][^'"]+['"]/g) || []).length;
assert(styleToolbarValueCount === 1, `Style toolbar has exactly 1 pack, got ${styleToolbarValueCount}`);
const themeToolbarBlock = preview.match(/theme:\s*\{[\s\S]*?toolbar:\s*\{[\s\S]*?items:\s*\[([\s\S]*?)\]/);
assert(themeToolbarBlock, 'Theme toolbar items array present');
for (const pack of ['light', 'dark', 'system']) {
  assert(
    themeToolbarBlock[1].includes(`value: '${pack}'`) || themeToolbarBlock[1].includes(`value: "${pack}"`),
    `Theme toolbar includes ${pack}`,
  );
}
const themeToolbarValueCount = (themeToolbarBlock[1].match(/value:\s*['"][^'"]+['"]/g) || []).length;
assert(themeToolbarValueCount === 3, `Theme toolbar has exactly 3 values, got ${themeToolbarValueCount}`);
assert(
  /theme === 'dark' \|\| theme === 'system'|theme === "dark" \|\| theme === "system"/.test(preview),
  'decorator sets data-theme for dark and system',
);

/** Canonical 15 packs — same order/keys as Identity Lab, atomic-view, tokens.elements, template EL maps. */
const ELEMENT_TOOLBAR_PACKS = [
  'tho|',
  'tho|clay',
  'tho|sand',
  'hoa|',
  'hoa|lava',
  'hoa|plasma',
  'thuy|',
  'thuy|ocean',
  'thuy|mist',
  'moc|',
  'moc|bamboo',
  'moc|forest',
  'kim|',
  'kim|steel',
  'kim|titanium',
];
assert(ELEMENT_TOOLBAR_PACKS.length === 15, 'canonical pack list is 15');
const elementToolbarBlock = preview.match(/element:\s*\{[\s\S]*?toolbar:\s*\{[\s\S]*?items:\s*\[([\s\S]*?)\]/);
assert(elementToolbarBlock, 'Element toolbar items array present');
const elementToolbarItems = elementToolbarBlock[1];
for (const pack of ELEMENT_TOOLBAR_PACKS) {
  assert(
    elementToolbarItems.includes(`value: '${pack}'`) || elementToolbarItems.includes(`value: "${pack}"`),
    `Element toolbar includes pack ${pack}`,
  );
}
const toolbarValueCount = (elementToolbarItems.match(/value:\s*['"][^'"]+['"]/g) || []).length;
assert(toolbarValueCount === 15, `Element toolbar has exactly 15 packs, got ${toolbarValueCount}`);

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
assert(pkg.scripts['build:storybook'], 'build:storybook script');
assert(pkg.scripts['build:site'], 'build:site script');
const sbVer = String(pkg.devDependencies?.storybook || '');
assert(/^[\^~]?10\./.test(sbVer), 'storybook package is v10, got ' + sbVer);
assert(pkg.devDependencies?.['@storybook/addon-docs'], '@storybook/addon-docs present');
assert(!pkg.devDependencies?.['@storybook/addon-essentials'], 'addon-essentials removed');

const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
assert(vercel.buildCommand.includes('build:site'), 'vercel builds site with storybook');
assert(Array.isArray(vercel.redirects), 'vercel redirects configured');
const redirectSources = vercel.redirects.map((r) => r.source).join(' ');
assert(redirectSources.includes('/dashboard'), 'redirect /dashboard');
assert(redirectSources.includes('/playground'), 'redirect /playground');
assert(vercel.redirects.every((r) => r.destination === '/'), 'legacy paths redirect to /');

const pack = readFileSync(join(root, 'scripts/vercel-static-output.mjs'), 'utf8');
assert(pack.includes('storybook-static'), 'packager reads storybook-static');
assert(/cpSync\(sb,\s*outDir/.test(pack) || pack.includes('site root'), 'packager overlays Storybook at webroot');
assert(!pack.includes("join(outDir, 'playground')") || pack.includes('redirect'), 'playground is redirect stub only');

const dash = readFileSync(join(root, 'dashboard.html'), 'utf8');
assert(/location\.replace\(['"]\/['"]\)|url=\//.test(dash), 'dashboard.html redirects to /');
assert(!dash.includes("src:'playground/index.html'"), 'dashboard is not the old hub shell');
assert(!dash.includes('live-view'), 'dashboard has no live-view references');

assert(main.includes("base: '/'") || main.includes('base: "/"'), 'storybook vite base is domain root');
assert(existsSync(join(root, '.storybook/manager-head.html')), 'manager-head OG meta present');
const managerHead = readFileSync(join(root, '.storybook/manager-head.html'), 'utf8');
assert(managerHead.includes('og:image'), 'manager-head has og:image');
assert(managerHead.includes('design.cyberskill.world'), 'manager-head canonical host');

assert(!existsSync(join(root, 'guidelines/live-view.html')), 'guidelines/live-view.html deleted');

const liveHub = readFileSync(join(root, 'docs/live-hub.md'), 'utf8');
assert(/single live|Storybook is the single|single Live hub|product surface/i.test(liveHub), 'docs: Storybook single live hub');
assert(/Maintainer\/Surfaces|Live\/Surfaces|surface map/i.test(liveHub), 'docs surface map present');
assert(!/live-view\.html|redirect only/i.test(liveHub), 'docs do not revive live-view.html');
assert(/`\/`/.test(liveHub) || liveHub.includes('Production **`/`**'), 'docs say Storybook is at /');
assert(/Release Notes|Status/i.test(liveHub), 'docs mention Release Notes / Status IA');

const previewSort = readFileSync(join(root, '.storybook/preview.jsx'), 'utf8');
assert(previewSort.includes("'Docs'") && previewSort.includes("'Release Notes'") && previewSort.includes("'Status'"), 'storySort has Docs / Release Notes / Status');
assert(previewSort.includes("'Maintainer'"), 'storySort buries Maintainer (Atomic View)');
assert(!previewSort.includes("'Guidelines'"), 'Guidelines merged into Docs');

const statusStory = readFileSync(join(root, 'stories/Status/Status.stories.jsx'), 'utf8');
assert(statusStory.includes('/_audit/run.html'), 'Status story embeds run.html');
assert(statusStory.includes('fullscreen') || statusStory.includes('fullBleed'), 'Status embed is full-bleed');

assert(existsSync(join(root, 'stories/ReleaseNotes/ReleaseNotes.mdx')), 'Release Notes MDX present');
assert(existsSync(join(root, 'docs/release-notes.md')), 'docs/release-notes.md present');
assert(existsSync(join(root, 'docs/vi/release-notes.md')), 'docs/vi/release-notes.md present');
const releaseNotes = readFileSync(join(root, 'docs/release-notes.md'), 'utf8');
assert(/CHANGELOG\.md/i.test(releaseNotes) && /never|no |not |forbid/i.test(releaseNotes), 'release-notes doctrine forbids CHANGELOG.md');
assert(!existsSync(join(root, 'CHANGELOG.md')), 'no root CHANGELOG.md');
const releaseNotesMdx = readFileSync(join(root, 'stories/ReleaseNotes/ReleaseNotes.mdx'), 'utf8');
for (const needle of ['system', 'FullMatrix', 'liquid-glass', 'Axe smoke']) {
  assert(releaseNotesMdx.includes(needle), `Release Notes MDX mentions ${needle}`);
}
assert(releaseNotes.includes('system') && releaseNotes.includes('FullMatrix') && releaseNotes.includes('liquid-glass'), 'docs/release-notes.md axes + FullMatrix + Style');

const fourAxes = readFileSync(join(root, 'stories/Docs/TheFourAxes.mdx'), 'utf8');
assert(/system/.test(fourAxes) && /prefers-color-scheme/.test(fourAxes), 'TheFourAxes Theme includes system');
assert(/liquid-glass/.test(fourAxes), 'TheFourAxes Style pack named');

assert(managerHead.includes('Theme × Element × Language × Style'), 'manager-head description names four axes');
assert(dash.includes('Theme × Element × Language × Style'), 'dashboard meta names four axes');

const conventionsMdx = readFileSync(join(root, 'stories/Docs/Conventions.mdx'), 'utf8');
assert(!/not a fourth axis/i.test(conventionsMdx), 'Conventions MDX must not deny Style as fourth axis');
assert(/data-cs-style/.test(conventionsMdx) && /liquid-glass/.test(conventionsMdx), 'Conventions MDX lists Style axis');

const designStylesMdx = readFileSync(join(root, 'stories/Docs/DesignStyles.mdx'), 'utf8');
assert(/data-cs-style/.test(designStylesMdx) && /liquid-glass/.test(designStylesMdx), 'DesignStyles MDX names Style pack');
assert(/system/.test(designStylesMdx) && /prefers-color-scheme/.test(designStylesMdx), 'DesignStyles MDX Theme includes system');
assert(!/invent a fourth product axis/i.test(designStylesMdx), 'DesignStyles MDX must not call Style a non-axis');
assert(/fifth product axis/i.test(designStylesMdx), 'DesignStyles MDX warns against a fifth axis');

const aiCluster = readFileSync(join(root, 'templates/ai-cluster-demo.html'), 'utf8');
assert(!/data-cs-theme/.test(aiCluster), 'ai-cluster-demo must not use data-cs-theme');
assert(/data-theme/.test(aiCluster) || /removeAttribute\('data-theme'\)/.test(aiCluster), 'ai-cluster-demo wires data-theme');
assert(/suggestions:/.test(aiCluster) && !/PromptSuggestions,\s*\{items:/.test(aiCluster), 'ai-cluster PromptSuggestions uses suggestions=');
assert(/Theme × Element × Language × Style/.test(aiCluster), 'ai-cluster copy names four axes');
assert(/data-cs-style/.test(aiCluster), 'ai-cluster handles Style axis');

const conventionsEn = readFileSync(join(root, 'docs/conventions.md'), 'utf8');
assert(/four orthogonal scopes/i.test(conventionsEn), 'docs/conventions.md four orthogonal scopes');
assert(!/three orthogonal scopes/i.test(conventionsEn), 'docs/conventions.md no three-orthogonal leftover');
assert(/data-cs-style/.test(conventionsEn), 'docs/conventions.md names data-cs-style');

const atomicView = readFileSync(join(root, 'guidelines/atomic-view.html'), 'utf8');
assert(/value="system"/.test(atomicView) && />System</.test(atomicView), 'Atomic View Theme includes system');
assert(/value="liquid-glass"/.test(atomicView) && /ctl">Style/.test(atomicView), 'Atomic View Style control present');

const playground = readFileSync(join(root, 'templates/playground.html'), 'utf8');
assert(/\["System","system"\]/.test(playground), 'playground Theme includes System');
assert(/style:\[\["Liquid glass","liquid-glass"\]\]/.test(playground), 'playground Style sole pack');

const decisions = readFileSync(join(root, 'docs/decisions.md'), 'utf8');
assert(/Storybook is the single live hub/i.test(decisions), 'decision §4 Storybook hub');
assert(!/live-view\.html/i.test(decisions), 'decisions do not reference live-view.html');
assert(!/Dashboard \*\*Live\*\* tab/i.test(decisions), 'decisions do not revive dashboard Live tab');

const consuming = readFileSync(join(root, 'docs/consuming.md'), 'utf8');
assert(consuming.includes('host-only') || consuming.includes('Storybook'), 'consuming documents host-only');
assert(!consuming.includes('must use Storybook') && !consuming.includes('require Storybook'), 'no required storybook for consumers');
assert(!consuming.includes('/playground/'), 'consuming does not advertise /playground/ product path');

const surfacesPath = existsSync(join(root, 'stories/Maintainer/Surfaces.stories.jsx'))
  ? join(root, 'stories/Maintainer/Surfaces.stories.jsx')
  : join(root, 'stories/Live/Surfaces.stories.jsx');
const surfaces = readFileSync(surfacesPath, 'utf8');
for (const needle of [
  'atomic-view.html',
  'motion.html',
  'identity-lab.html',
  'status-hub/index.html',
  'website/index.html',
  'deck/index.html',
  'playground.html',
  'kitchen-sink.html',
  'image-slots-demo.html',
  'ai-cluster-demo.html',
  'rtl-preview.html',
]) {
  assert(surfaces.includes(needle), 'Maintainer surface maps ' + needle);
}
assert(/Maintainer\/Surfaces|Live\/Surfaces/.test(surfaces), 'surfaces title is Maintainer/Surfaces');
assert(/Atomic View \(gates\)|AtomicView/.test(surfaces), 'Atomic View buried as gates entry');

const modules = listPublicComponents();
assert(modules.length >= 90, 'expected ~99 public component modules, got ' + modules.length);

const { covered, missing } = coveredPrimariesFromStories();
if (missing.length) {
  console.error('✗ Storybook CSF missing:\n' + missing.map((m) => '  - ' + m).join('\n'));
  process.exit(1);
}

assert(existsSync(join(root, 'stories/lib/matrix.jsx')), 'shared matrix helpers present');
const matrixLib = readFileSync(join(root, 'stories/lib/matrix.jsx'), 'utf8');
assert(/export\s+function\s+cartesian\b/.test(matrixLib), 'matrix helpers export cartesian');
assert(/export\s+function\s+stateCombos\b/.test(matrixLib), 'matrix helpers export stateCombos');

const MATRIX_CORE = /export\s+const\s+(Matrix|AllVariants)\b/;
const MATRIX_EXPORT = /export\s+const\s+(Matrix|AllVariants|AllSizes|States|Disabled|FullMatrix|Exhaustive)\b/;
const MATRIX_FAMILY = ['Matrix', 'AllVariants', 'AllSizes', 'States', 'Disabled', 'FullMatrix', 'Exhaustive'];
const THEATER = /data-matrix-cell|Secondary composition context|forces multi-story depth/;
const SPREAD_ARGS = /\{\s*\.\.\.\s*args\s*\}/;
const STATE_KEYS = ['disabled', 'loading', 'error', 'busy'];

function argTypesSection(text) {
  return (text.split('argTypes:')[1] || '').split(/parameters:|args:/)[0] || '';
}

function hasArgTypeKey(text, key) {
  const at = argTypesSection(text);
  return new RegExp('(^|\\n)\\s*"?' + key + '"?\\s*:').test(at);
}

/** Extract balanced `{...}` starting at open brace index. */
function balanced(s, start) {
  let depth = 0;
  let inStr = null;
  let esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inStr = c;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

function metaArgsObject(text) {
  const dm = text.match(/export\s+default\s*(\{)/);
  if (!dm) return null;
  const metaStart = dm.index + dm[0].length - 1;
  const meta = balanced(text, metaStart);
  if (!meta) return null;
  const am = meta.match(/\bargs\s*:\s*(\{)/);
  if (!am) return null;
  const abs = metaStart + am.index + am[0].length - 1;
  return balanced(text, abs);
}

function argsNonEmpty(argsBlock) {
  if (!argsBlock) return false;
  const inner = argsBlock.slice(1, -1).trim();
  return inner.length > 0;
}

function matrixFamilyBodies(text) {
  const bodies = [];
  for (const name of MATRIX_FAMILY) {
    const re = new RegExp('export\\s+const\\s+' + name + '\\s*=\\s*(\\{)');
    const m = text.match(re);
    if (!m) continue;
    const start = m.index + m[0].length - 1;
    const body = balanced(text, start);
    if (body) bodies.push({ name, body });
  }
  return bodies;
}

/** Resolve discrete select options from argTypes (literal array or const ref). */
function resolveOptions(text, key) {
  const at = argTypesSection(text);
  const keyRe = new RegExp('["\']?' + key + '["\']?\\s*:\\s*(\\{)');
  const m = at.match(keyRe);
  if (!m) return null;
  // Scope to this prop's object only — a fixed char slice can steal a sibling's options.
  const abs = (m.index ?? at.search(keyRe)) + m[0].length - 1;
  const slice = balanced(at, abs) || '';
  const lit = slice.match(/["']?options["']?\s*:\s*\[([^\]]*)\]/);
  if (lit) {
    return lit[1]
      .split(',')
      .map((s) => s.replace(/["'\s]/g, ''))
      .filter(Boolean);
  }
  const ref = slice.match(/["']?options["']?\s*:\s*([A-Z][A-Z0-9_]*)/);
  if (ref) {
    const name = ref[1];
    const decl = text.match(new RegExp('(?:const|let|var)\\s+' + name + '\\s*=\\s*\\[([^\\]]*)\\]'));
    if (decl) {
      return decl[1]
        .split(',')
        .map((s) => s.replace(/["'\s]/g, ''))
        .filter(Boolean);
    }
  }
  return null;
}

function isNumericOptions(opts) {
  return opts && opts.length > 0 && opts.every((o) => /^\d+(\.\d+)?$/.test(o));
}

function optionMounted(bodiesText, key, option) {
  const esc = option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(key + '\\s*=\\s*["\']' + esc + '["\']').test(bodiesText)) return true;
  // `.map((variant) => … variant={variant})` over a const that includes the option
  if (
    new RegExp('\\.map\\s*\\(\\s*\\(?\\s*' + key).test(bodiesText) &&
    new RegExp(key + '\\s*=\\s*\\{\\s*' + key + '\\s*\\}').test(bodiesText)
  ) {
    return true;
  }
  // Programmatic FullMatrix: size={combo.size} / variant={combo.variant} driven by cartesian
  if (
    /cartesian\s*\(/.test(bodiesText) &&
    new RegExp(key + '\\s*=\\s*\\{\\s*(?:combo\\.)?' + key + '\\s*\\}').test(bodiesText)
  ) {
    return true;
  }
  return false;
}

function isProgrammaticFullMatrix(body) {
  return /cartesian\s*\(/.test(body) && /stateCombos\s*\(/.test(body);
}

let fail = [];
let fullMatrixCount = 0;
for (const m of modules) {
  const own = join(root, 'stories', m.primary + '.stories.jsx');
  assert(existsSync(own), 'story file for ' + m.primary);
  const text = readFileSync(own, 'utf8');
  assert(text.includes(m.relFromRoot), 'story imports path for ' + m.primary);
  assert(/export\s+const\s+Default\b/.test(text), 'Default story for ' + m.primary);
  assert(MATRIX_CORE.test(text), 'Matrix|AllVariants export for ' + m.primary);
  assert(MATRIX_EXPORT.test(text), 'matrix-family export for ' + m.primary);
  assert(!THEATER.test(text), 'no theater placeholders in ' + m.primary);

  // argTypes must be a non-empty object (at least one documented prop key)
  assert(/argTypes:\s*\{/.test(text), 'argTypes block for ' + m.primary);
  assert(!/argTypes:\s*\{\s*\}/.test(text), 'argTypes not empty for ' + m.primary);
  const atSection = argTypesSection(text);
  const atKeys = [...atSection.matchAll(/^\s*"?([A-Za-z_][A-Za-z0-9_]*)"?\s*:/gm)].map((x) => x[1]);
  if (atKeys.length < 1) fail.push(m.primary + ' no argTypes keys');

  // CSF bar: AllSizes required when size is documented in argTypes
  if (hasArgTypeKey(text, 'size')) {
    assert(/export\s+const\s+AllSizes\b/.test(text), 'AllSizes story for ' + m.primary + ' (argTypes.size)');
  }

  const metaArgs = metaArgsObject(text);
  const metaHasFixtures = argsNonEmpty(metaArgs);

  const matrixBodies = matrixFamilyBodies(text);
  assert(matrixBodies.length >= 1, 'matrix body for ' + m.primary);
  const joinedBodies = matrixBodies.map((x) => x.body).join('\n');

  // Interactive CSF bar: each state argType must appear in States or a Matrix subsection
  for (const key of STATE_KEYS) {
    if (!hasArgTypeKey(text, key)) continue;
    const shown =
      key === 'disabled'
        ? /\bdisabled\b/.test(joinedBodies)
        : key === 'loading'
          ? /\bloading\b/.test(joinedBodies)
          : key === 'busy'
            ? /\bbusy\b/.test(joinedBodies)
            : /\berror\b/.test(joinedBodies);
    if (!shown) {
      fail.push(m.primary + ' missing ' + key + ' coverage in Matrix|AllVariants|States (argTypes.' + key + ')');
    }
  }

  // Exhaustive discrete enum coverage for size / variant
  const sizeOpts = resolveOptions(text, 'size');
  const variantOpts = resolveOptions(text, 'variant');
  for (const [key, opts] of [
    ['size', sizeOpts],
    ['variant', variantOpts],
  ]) {
    if (!opts || !opts.length || isNumericOptions(opts)) continue;
    const miss = opts.filter((o) => !optionMounted(joinedBodies, key, o));
    if (miss.length) {
      fail.push(m.primary + ' missing ' + key + ' enum mounts: ' + miss.join(', '));
    }
  }

  // Honest select enums: Default meta args + Matrix literal props ⊆ argTypes.options
  for (const key of atKeys) {
    const opts = resolveOptions(text, key);
    if (!opts || !opts.length || isNumericOptions(opts)) continue;
    if (metaArgs) {
      const am = metaArgs.match(new RegExp('\\b' + key + '\\s*:\\s*[\'"]([^\'"]+)[\'"]'));
      if (am && !opts.includes(am[1])) {
        fail.push(m.primary + ' meta args.' + key + '=' + am[1] + ' not in argTypes.options');
      }
    }
    const litRe = new RegExp('\\b' + key + '\\s*=\\s*[\'"]([^\'"]+)[\'"]', 'g');
    let lm;
    while ((lm = litRe.exec(joinedBodies))) {
      if (!opts.includes(lm[1])) {
        fail.push(m.primary + ' Matrix mounts ' + key + '=' + lm[1] + ' outside options');
      }
    }
  }

  // Meta args keys must be documented in argTypes (or an explicit fixture allowlist)
  const ARGS_KEY_ALLOW = new Set([
    'children',
    'className',
    'style',
    'id',
    'key',
    'ref',
    'defaultChecked',
    'defaultValue',
    'placeholder',
    'autoFocus',
    'name',
    'type',
    'role',
    'tabIndex',
  ]);
  if (metaArgs) {
    const argKeys = [...metaArgs.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/gm)].map((x) => x[1]);
    for (const k of argKeys) {
      if (ARGS_KEY_ALLOW.has(k) || k.startsWith('aria') || k.startsWith('data')) continue;
      if (!atKeys.includes(k)) {
        fail.push(m.primary + ' meta args.' + k + ' missing from argTypes');
      }
    }
  }

  // FullMatrix: size enums × variant enums × key-states when ≥1 axis present
  const statePresent = STATE_KEYS.filter((k) => hasArgTypeKey(text, k));
  const axisFlags = [
    sizeOpts && sizeOpts.length && !isNumericOptions(sizeOpts),
    variantOpts && variantOpts.length > 0,
    statePresent.length > 0,
  ].filter(Boolean);
  if (axisFlags.length >= 1) {
    assert(/export\s+const\s+FullMatrix\b/.test(text), 'FullMatrix story for ≥1-axis ' + m.primary);
    const full = matrixBodies.find((x) => x.name === 'FullMatrix');
    assert(full, 'FullMatrix body for ' + m.primary);
    fullMatrixCount++;
    if (sizeOpts && sizeOpts.length && !isNumericOptions(sizeOpts)) {
      for (const o of sizeOpts) {
        if (!optionMounted(full.body, 'size', o)) fail.push(m.primary + ' FullMatrix missing size=' + o);
      }
    }
    if (variantOpts && variantOpts.length) {
      for (const o of variantOpts) {
        if (!optionMounted(full.body, 'variant', o)) fail.push(m.primary + ' FullMatrix missing variant=' + o);
      }
    }
    for (const key of statePresent) {
      if (!new RegExp('\\b' + key + '\\b').test(full.body)) {
        fail.push(m.primary + ' FullMatrix missing state ' + key);
      }
    }
    // Product sanity: grids must not collapse to a spot sample
    if (isProgrammaticFullMatrix(full.body)) {
      // cartesian({ size: SIZES, variant: VARIANTS }) + stateCombos(...) is the
      // exhaustive product — require those helpers and axis consts are wired.
      if (sizeOpts && sizeOpts.length && !isNumericOptions(sizeOpts)) {
        assert(/size\s*:\s*SIZES|size\s*:\s*\[/.test(full.body) || /cartesian\s*\(\s*\{\s*size\s*:/.test(full.body), 'FullMatrix cartesian size axis for ' + m.primary);
      }
      if (variantOpts && variantOpts.length) {
        assert(/variant\s*:\s*VARIANTS|variant\s*:\s*\[/.test(full.body) || /cartesian\s*\([^)]*variant\s*:/.test(full.body), 'FullMatrix cartesian variant axis for ' + m.primary);
      }
    } else {
      const mounts = (full.body.match(new RegExp('<' + m.primary + '\\b', 'g')) || []).length;
      let expected = 1;
      if (sizeOpts && sizeOpts.length && !isNumericOptions(sizeOpts)) expected *= sizeOpts.length;
      if (variantOpts && variantOpts.length) expected *= variantOpts.length;
      if (statePresent.length) expected *= statePresent.length + 1; // default + each flag
      if (mounts < expected) {
        fail.push(m.primary + ' FullMatrix under-mounted: ' + mounts + ' < expected ' + expected);
      }
    }
  }

  for (const { name, body } of matrixBodies) {
    if (!body.includes('<' + m.primary)) {
      fail.push(m.primary + ' ' + name + ' does not mount <' + m.primary);
    }
    if (new RegExp('<' + m.primary + '\\b[^>]*\\bdisabled(?:\\s|=|/|>)').test(body)) {
      const jsx = readFileSync(join(root, m.relFromRoot), 'utf8');
      const sig = jsx.match(new RegExp('export\\s+function\\s+' + m.primary + '\\s*\\(\\s*\\{([^}]*)\\}'));
      const params = sig ? sig[1] : '';
      if (!/\bdisabled\b/.test(params)) {
        fail.push(m.primary + ' ' + name + ' uses disabled but prop not in signature');
      }
    }
    // Universal hollow-class rule (CSF3): {...args} requires non-empty meta.args
    if (SPREAD_ARGS.test(body)) {
      const matArgsM = body.match(/\bargs\s*:\s*(\{)/);
      let matFixtures = false;
      if (matArgsM) {
        matFixtures = !/\bargs\s*:\s*\{\s*\}/.test(body);
      }
      if (!metaHasFixtures && !matFixtures) {
        fail.push(m.primary + ' ' + name + ' spreads {...args} without non-empty meta/matrix args (CSF3 hollow)');
      }
    }
  }

  // Table primaries: meta fixtures must include columns+rows when Matrix spreads args
  if ((m.primary === 'DataGrid' || m.primary === 'DataTable') && metaArgs) {
    if (!/columns\s*:/.test(metaArgs) || !/rows\s*:/.test(metaArgs)) {
      fail.push(m.primary + ' meta args must include columns and rows fixtures');
    }
  }

  const requiredPath = join(root, '_audit/ci/storybook-required-tokens.json');
  if (existsSync(requiredPath)) {
    const required = JSON.parse(readFileSync(requiredPath, 'utf8'));
    const need = required[m.primary];
    if (need) {
      for (const tok of need) {
        if (!text.includes(tok)) fail.push(m.primary + ' missing required token ' + tok);
      }
    }
  }
  if (m.primary === 'Steps' && /items\s*=/.test(text) && !/steps\s*=/.test(text)) {
    fail.push('Steps uses items= instead of steps=');
  }
  if (m.primary === 'Carousel' && /slides\s*=/.test(text)) {
    fail.push('Carousel uses slides= (API is children)');
  }
  if (m.primary === 'CommandPalette' && /groups\s*=/.test(text) === false) {
    fail.push('CommandPalette missing groups=');
  }
  if (m.primary === 'Popover' && /content\s*=/.test(text)) {
    fail.push('Popover uses content= (API is trigger+children)');
  }
  if (m.primary === 'HoverCard' && /content\s*=/.test(text)) {
    fail.push('HoverCard uses content= (API is trigger+children)');
  }
  if (m.primary === 'Tabs' && /selected\s*=/.test(text)) {
    fail.push('Tabs uses selected= (companion Tab prop only)');
  }
  if (m.primary === 'Sidebar' && /<Sidebar[^>]*\bactive\s*=/.test(text)) {
    fail.push('Sidebar uses active= (NavItem prop only)');
  }
  if (m.primary === 'Menu') {
    const mat = matrixBodies.map((x) => x.body).join('\n');
    if (!mat.includes('trigger=') || !mat.includes('MenuItem')) {
      fail.push('Menu matrix missing trigger/MenuItem composition');
    }
  }
}

if (fail.length) {
  console.error('✗ Honest matrix/argTypes failures:\n' + fail.map((x) => '  - ' + x).join('\n'));
  process.exit(1);
}

assert(listStoryFiles().some((f) => f.includes('Surfaces.stories')), 'Surfaces.stories present');
assert(fullMatrixCount >= 28, 'expected ≥28 FullMatrix stories (≥1-axis qualifiers), got ' + fullMatrixCount);

console.log('PASS test-storybook-contract', {
  modules: modules.length,
  covered: covered.size,
  matrixHonest: modules.length,
  storybook: sbVer,
  csfBar: 'AllSizes+States+FullMatrix',
  fullMatrix: fullMatrixCount,
  liveSurfaces: true,
  liveShell: 'redirect',
});
