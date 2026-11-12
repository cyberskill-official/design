// The audit's touch-target rule (WCAG 2.5.8 spacing exception), run in a real browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { layoutChecks } from './audit/page-checks.js';

const levels = async (page, html) => {
  await page.setContent(`<body style="margin:40px">${html}</body>`);
  return (await page.evaluate(layoutChecks, { w: 800, h: 600 })).targets.map(t => `${t.label}:${t.level}`);
};
const btn = (label, x, size = 16) => `<button aria-label="${label}" style="position:absolute;left:${x}px;top:40px;width:${size}px;height:${size}px;padding:0;border:0">x</button>`;

test('undersized targets pass only when their 24px circles touch nothing', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // Centres 22px apart: the two circles overlap, so both fail, though each circle misses the other's box.
    assert.deepEqual(await levels(page, btn('a', 0) + btn('b', 22)), ['a:fail', 'b:fail']);
    // Centres 26px apart: circles clear each other and both boxes, so the exception applies (warn only).
    assert.deepEqual(await levels(page, btn('a', 0) + btn('b', 26)), ['a:warn', 'b:warn']);
    // Next to a full-size target, the small one's circle reaches the big one's box: fail.
    assert.deepEqual((await levels(page, btn('a', 0) + btn('big', 18, 44))).filter(l => l.startsWith('a:')), ['a:fail']);
  } finally { await browser.close(); }
});
