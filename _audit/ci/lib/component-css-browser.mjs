import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
export function proofInputs(root) {
  const freshness = spawnSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(freshness.status, 0, freshness.stdout + freshness.stderr);
  const paths = ['_ds_bundle.js', '_vendor/react/react.production.min.js', '_vendor/react/react-dom.production.min.js', 'scripts/fixtures/static-html-reference.json', '_audit/ci/lib/browser-fixture.mjs', '_audit/ci/lib/component-css-browser.mjs', '_audit/ci/test-component-css-entries-browser.mjs', '_audit/ci/test-component-css-interactions-browser.mjs'];
  return Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(new URL(path, 'file://' + root))).digest('hex')]));
}
export async function mount(page, fixture) {
  await page.evaluate(async fixture => {
    const decode = value => {
      if (Array.isArray(value)) return value.map(decode);
      if (!value || typeof value !== 'object') return value;
      if (value.$render !== undefined) return () => decode(value.$render);
      if (value.$element) {
        const e = value.$element;
        return React.createElement(e.component ? CS[e.component] : e.tag, decode(e.props || {}), decode(e.children));
      }
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decode(v)]));
    };
    renderFixture(null);
    let node = React.createElement(CS[fixture.name], decode(fixture.props));
    if (fixture.wrapper) {
      const w = fixture.wrapper;
      node = React.createElement(w.component ? CS[w.component] : w.tag, decode(w.props), node);
    }
    renderFixture(React.createElement(React.Fragment, null, React.createElement('button', {
      id: 'reference-anchor',
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 64,
        height: 24
      }
    }, 'Anchor'), React.createElement('div', {
      'data-component-fixture': fixture.name
    }, node)));
    // Resolve the newly mounted font faces before waiting: fonts.ready may
    // otherwise describe the previous fixture while a bold/italic face starts
    // loading only at the next layout. Both stylesheet snapshots require the
    // same actual loaded-font state; exact geometry comparisons stay intact.
    document.querySelector('[data-component-fixture]').getBoundingClientRect();
    // Explicitly load each used face: WebKit's native controls and freshly
    // mounted portal text can defer selecting a face beyond fonts.ready.
    await Promise.all([...document.body.querySelectorAll('*')].map(node => {
      const style = getComputedStyle(node);
      return document.fonts.load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, node.textContent || ' ');
    }));
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, fixture);
}
export async function sheet(page, target) {
  await page.evaluate(async target => {
    const previous = document.querySelector('link[rel="stylesheet"]');
    if (new URL(previous.href).pathname === target) return;
    const next = document.createElement('link');
    next.rel = 'stylesheet';
    next.href = target;
    await new Promise((resolve, reject) => {
      next.onload = resolve;
      next.onerror = reject;
      previous.after(next);
    });
    await document.fonts.ready;
    previous.remove();
    await settleInPage();
  }, target);
}

// Installed into each browser context; both sides use the same animation phase.
export async function installSettlement(page) {
  await page.evaluate(() => {
    window.settleInPage = async () => {
      const flushPseudoAndTransitions = () => {
        const flushStyle = document.createElement('style');
        flushStyle.textContent = ':root {}';
        document.head.appendChild(flushStyle);
        getComputedStyle(document.documentElement).color;
        flushStyle.remove();
        for (const node of document.body.querySelectorAll('*')) {
          getComputedStyle(node).color;
          getComputedStyle(node, '::before').color;
          getComputedStyle(node, '::after').color;
        }
        for (const animation of document.getAnimations()) {
          if (animation instanceof CSSTransition) animation.finish();else {
            animation.pause();
            animation.currentTime = 0;
          }
        }
      };
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      // Stylesheet replacement creates new FontFace objects even when URLs match.
      await Promise.all([...document.body.querySelectorAll('*')].map(node => {
        const style = getComputedStyle(node);
        return document.fonts.load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, node.textContent || ' ');
      }));
      await document.fonts.ready;
      flushPseudoAndTransitions();
      window.dispatchEvent(new Event('resize'));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      flushPseudoAndTransitions();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSTransition) animation.finish();else {
          animation.pause();
          animation.currentTime = 0;
        }
      }
    };
  });
}
export function fixtureComponents(fixture) {
  const names = new Set([fixture.name]);
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value.component) names.add(value.component);
    Object.values(value).forEach(visit);
  }
  visit(fixture.props);
  visit(fixture.wrapper);
  return [...names];
}
export async function snapshot(page) {
  return page.evaluate(() => {
    const roots = [document.querySelector('[data-component-fixture]'), ...[...document.body.children].filter(el => el.hasAttribute('data-cs-floating-root') || el.hasAttribute('data-cs-floating-host'))].filter(Boolean);
    const els = [...new Set(roots.flatMap(el => [el, ...el.querySelectorAll('*')]))];
    return els.map(el => ({
      tag: el.localName,
      class: el.getAttribute('class'),
      styles: Object.fromEntries([...getComputedStyle(el)].filter(p => !p.startsWith('--')).map(p => [p, getComputedStyle(el).getPropertyValue(p)])),
      before: Object.fromEntries([...getComputedStyle(el, '::before')].filter(p => !p.startsWith('--')).map(p => [p, getComputedStyle(el, '::before').getPropertyValue(p)])),
      after: Object.fromEntries([...getComputedStyle(el, '::after')].filter(p => !p.startsWith('--')).map(p => [p, getComputedStyle(el, '::after').getPropertyValue(p)]))
    }));
  });
}
