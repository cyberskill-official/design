import axe from 'axe-core';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { expect } from 'vitest';

/** Waits until popups finish entering/leaving and finite animations are done, so axe measures the settled UI. */
export async function waitForSettledUI(timeout = 2000): Promise<void> {
  const start = performance.now();
  for (;;) {
    const moving = document.querySelector('[data-starting-style],[data-ending-style]');
    const running = document.getAnimations().filter(a => a.playState === 'running' && a.effect?.getComputedTiming().iterations !== Infinity);
    if (!moving && running.length === 0) break;
    if (performance.now() - start > timeout) break;
    await new Promise(r => requestAnimationFrame(r));
  }
  await new Promise(r => requestAnimationFrame(r));
}

/** Fails with a readable list when axe finds violations inside `node`. */
export async function expectNoA11yViolations(node: Element = document.body): Promise<void> {
  await waitForSettledUI();
  const result = await axe.run(node, { resultTypes: ['violations'] });
  const lines = result.violations.map(v => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map(n => n.target.join(' ')).join('\n    ')}`);
  expect(lines, lines.join('\n')).toEqual([]);
}

/** Renders `ui` inside a light and a dark theme container and runs axe on both. */
export async function expectAccessibleInThemes(ui: ReactElement): Promise<RenderResult[]> {
  const results: RenderResult[] = [];
  for (const theme of ['light', 'dark'] as const) {
    const host = document.createElement('div');
    host.setAttribute('data-theme', theme);
    host.style.padding = '16px';
    document.body.appendChild(host);
    const r = render(ui, { container: host });
    await expectNoA11yViolations(host);
    results.push(r);
  }
  return results;
}
