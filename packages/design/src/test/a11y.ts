import axe from 'axe-core';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { expect } from 'vitest';

/** Fails with a readable list when axe finds violations inside `node`. */
export async function expectNoA11yViolations(node: Element = document.body): Promise<void> {
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
