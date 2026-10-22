import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { DECLARED_DOMAINS } from '../../stories/declared-domains.mjs';
const names = ['Button', 'Badge', 'Link', 'ProgressBar', 'Skeleton'],
  selectors = {
    Button: '.cs-button',
    Badge: '.cs-badge',
    Link: '.cs-link',
    ProgressBar: '.cs-progress',
    Skeleton: '.cs-skeleton'
  },
  root = resolve('.');
async function storyBundle(mutation) {
  let applied = false;
  const code = (await build({
    stdin: {
      contents: names.map(name => `import * as ${name} from './stories/${name}.stories.jsx';`).join('\n') + '\nwindow.DomainStories={' + names.join(',') + '};',
      resolveDir: root
    },
    bundle: true,
    write: false,
    format: 'iife',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    plugins: [{
      name: 'shared-react-and-negative-source',
      setup(build) {
        build.onResolve({
          filter: /^react$/
        }, () => ({
          path: 'react',
          namespace: 'fixture-react'
        }));
        build.onLoad({
          filter: /.*/,
          namespace: 'fixture-react'
        }, () => ({
          contents: 'module.exports=window.React;',
          loader: 'js'
        }));
        if (mutation) build.onLoad({
          filter: mutation.file
        }, args => {
          const source = readFileSync(args.path, 'utf8');
          assert(source.includes(mutation.before), 'Negative source precondition');
          applied = true;
          return {
            contents: source.replace(mutation.before, mutation.after),
            loader: 'jsx'
          };
        });
      }
    }]
  })).outputFiles[0].text;
  if (mutation) assert(applied, 'Negative source was actually compiled');
  return code;
}
const positive = await storyBundle(),
  mutations = await Promise.all([{
    name: 'ignored-runtime-variant',
    file: /components\/button\/Button\.jsx$/,
    before: '`cs-button--${variant}`',
    after: '"cs-button--primary"',
    component: 'Button',
    variant: 'danger'
  }, {
    name: 'wrong-valid-runtime-default',
    file: /components\/feedback\/Badge\.jsx$/,
    before: 'variant = "neutral"',
    after: 'variant = "solid"',
    component: 'Badge'
  }, {
    name: 'story-drops-controls-args',
    file: /stories\/Button\.stories\.jsx$/,
    before: 'export const Default = {};',
    after: 'export const Default = {render: () => <Button>Ignored args</Button>};',
    component: 'Button',
    variant: 'danger'
  }].map(async m => ({
    ...m,
    code: await storyBundle(m)
  })));
async function render(page, component, props = {}, mode = 'Default', raw = false) {
  await page.evaluate(({
    component,
    props,
    mode,
    raw
  }) => {
    const ns = DomainStories[component],
      args = {
        ...ns.default.args,
        ...props
      };
    const element = raw ? React.createElement(ns.default.component, props) : ns[mode]?.render ? React.createElement(ns[mode].render, args) : React.createElement(ns.default.component, args);
    renderFixture(React.createElement('div', {
      'data-theme': 'light'
    }, element));
  }, {
    component,
    props,
    mode,
    raw
  });
}
async function assertVariant(page, name, variant) {
  const el = page.locator(selectors[name]).first(),
    classes = (await el.getAttribute('class')).split(/\s+/);
  if (name === 'Button') assert(classes.includes('cs-button--' + variant));
  if (name === 'Badge') assert.equal(classes.includes('cs-badge--' + variant), variant !== 'neutral');
  if (name === 'Link') {
    assert.equal(classes.includes('cs-link--' + variant), variant !== 'default');
    assert.equal(await el.locator('span[aria-hidden="true"]').count(), variant === 'standalone' ? 1 : 0);
    assert.equal(await el.getAttribute('href'), '#');
  }
  if (name === 'Skeleton') assert.equal(classes.includes('cs-skeleton--circle'), variant === 'circle');
  if (name === 'ProgressBar') {
    assert(classes.includes('cs-progress--' + variant));
    const token = {
      ochre: '--cs-color-brand-ochre',
      umber: '--cs-color-brand-umber',
      success: '--cs-color-semantic-success'
    }[variant];
    const paint = await el.evaluate((el, token) => {
      const probe = document.createElement('span');
      probe.style.backgroundColor = 'var(' + token + ')';
      el.append(probe);
      const expected = getComputedStyle(probe).backgroundColor,
        actual = getComputedStyle(el.querySelector('.cs-progress__fill')).backgroundColor;
      probe.remove();
      return {
        expected,
        actual
      };
    }, token);
    assert.equal(paint.actual, paint.expected, 'Declared progress variant paints its independent semantic token');
  }
}
async function assertDefault(page, name) {
  await render(page, name, {
    children: 'Default sample',
    width: 80,
    height: 24
  }, 'Default', true);
  const el = page.locator(selectors[name]).first(),
    classes = (await el.getAttribute('class')).split(/\s+/);
  if (name === 'Button') {
    assert(classes.includes('cs-button--primary'));
    assert(classes.includes('cs-button--md'));
    assert.equal(await el.getAttribute('type'), 'button');
    assert.equal(await el.isDisabled(), false);
  }
  if (name === 'Badge') assert.equal(classes.some(c => c.startsWith('cs-badge--')), false, 'Omitted Badge defaults to neutral');
  if (name === 'Link') {
    assert.equal(classes.some(c => c.startsWith('cs-link--')), false);
    assert.equal(await el.getAttribute('href'), '#');
  }
  if (name === 'Skeleton') {
    assert.equal(classes.includes('cs-skeleton--circle'), false);
    assert.equal(await el.getAttribute('aria-hidden'), 'true');
  }
  if (name === 'ProgressBar') {
    assert.equal(await el.getAttribute('aria-valuenow'), '0');
    assert.equal(await el.getAttribute('aria-valuemax'), '100');
    const omitted = await el.locator('.cs-progress__fill').evaluate(el => getComputedStyle(el).backgroundColor);
    await render(page, name, {
      variant: 'ochre'
    }, 'Default', true);
    assert.equal(await page.locator('.cs-progress__fill').evaluate(el => getComputedStyle(el).backgroundColor), omitted, 'Omitted CSS-backed variant equals explicit ochre');
  }
}
const receipts = [];
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  await page.addScriptTag({
    content: positive
  });
  const domains = [];
  for (const name of names) {
    await assertDefault(page, name);
    for (const variant of DECLARED_DOMAINS[name].variant) {
      await render(page, name, {
        variant
      });
      await assertVariant(page, name, variant);
      domains.push(name + '.variant=' + variant);
    }
    await render(page, name, {}, 'FullMatrix');
    const roots = page.locator(selectors[name]),
      expected = DECLARED_DOMAINS[name].variant.length * (name === 'Button' ? DECLARED_DOMAINS.Button.size.length * 3 : 1);
    assert.equal(await roots.count(), expected, 'Actual FullMatrix mounts every shared domain/state combination');
  }
  const heights = [];
  for (const size of DECLARED_DOMAINS.Button.size) {
    await render(page, 'Button', {
      size
    });
    const button = page.locator('.cs-button');
    assert((await button.getAttribute('class')).split(/\s+/).includes('cs-button--' + size));
    heights.push(await button.evaluate(el => el.getBoundingClientRect().height));
  }
  assert(heights.every((height, i) => !i || height > heights[i - 1]), 'Every Button size changes actual fine-pointer geometry');
  for (const props of [{
    loading: true
  }, {
    disabled: true
  }]) {
    await render(page, 'Button', props);
    assert.equal(await page.locator('.cs-button').isDisabled(), true, 'Actual story state args reach native control');
  }
  const rejected = [];
  for (const mutation of mutations) {
    await page.addScriptTag({
      content: mutation.code
    });
    await assert.rejects(async () => {
      if (mutation.variant) {
        await render(page, mutation.component, {
          variant: mutation.variant
        });
        await assertVariant(page, mutation.component, mutation.variant);
      } else await assertDefault(page, mutation.component);
    }, undefined, mutation.name + ' must fail actual browser assertion');
    rejected.push(mutation.name);
    await page.addScriptTag({
      content: positive
    });
  }
  receipts.push({
    browserName,
    status: 'PASS',
    domains,
    omittedDefaults: names,
    matrixCells: 87,
    buttonSizeHeights: heights,
    rejectedMutations: rejected
  });
  console.log('PASS ' + browserName + ': actual5story defaults,21variant+4size values,87matrix cells, native states and3compiled-source negatives');
}, {
  browserName,
  contextOptions: {
    reducedMotion: 'reduce'
  }
});
const inputs = ['_audit/ci/test-story-domains-browser.mjs', 'stories/declared-domains.mjs', ...names.flatMap(name => ['stories/' + name + '.stories.jsx', Object.keys(selectors).includes(name) ? {
  Button: 'components/button/Button.jsx',
  Badge: 'components/feedback/Badge.jsx',
  Link: 'components/navigation/Link.jsx',
  ProgressBar: 'components/feedback/ProgressBar.jsx',
  Skeleton: 'components/feedback/Skeleton.jsx'
}[name] : null])];
mkdirSync('test-results', {
  recursive: true
});
writeFileSync('test-results/story-domains-browser.json', JSON.stringify({
  schemaVersion: 1,
  status: 'PASS',
  inputs: Object.fromEntries(inputs.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')])),
  receipts,
  scope: 'Actual Default and FullMatrix rendering of five migrated stories; all their variant/size domains, omitted runtime defaults, progress semantic paint and native Button states. This is bounded runtime evidence, not exhaustive component semantics or accessibility acceptance.'
}, null, 2) + '\n');
