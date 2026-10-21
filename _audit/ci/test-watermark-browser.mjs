import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {
  stdio: 'pipe'
});
await withBrowserFixture(async page => {
  await page.evaluate(() => {
    renderFixture(React.createElement('section', {
      id: 'scope',
      style: {
        '--cs-color-text-primary': 'rgb(20, 30, 40)'
      }
    }, React.createElement(CS.Watermark, {
      text: 'A & <B>',
      opacity: .5
    }, React.createElement('button', null, 'Content'))));
    window.watermarkColor = () => {
      const layer = document.querySelector('.cs-watermark > [aria-hidden]');
      const style = getComputedStyle(layer);
      if (style.maskImage !== 'none') return style.backgroundColor;
      const svg = decodeURIComponent(style.backgroundImage);
      const fill = svg.match(/fill="([^"]+)"/)[1];
      const probe = document.createElement('span');
      probe.style.color = fill;
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
  });
  assert.equal(await page.evaluate(() => watermarkColor()), 'rgb(20, 30, 40)');
  await page.evaluate(() => document.getElementById('scope').style.setProperty('--cs-color-text-primary', 'rgb(210, 220, 230)'));
  assert.equal(await page.evaluate(() => watermarkColor()), 'rgb(210, 220, 230)', 'Watermark follows inherited token changes without remount');
  assert.equal(await page.locator('.cs-watermark > [aria-hidden]').evaluate(el => getComputedStyle(el).pointerEvents), 'none');
  await page.getByRole('button', {
    name: 'Content'
  }).click();
  console.log('PASS Watermark: initial and live inherited color, decorative layer and unobstructed content');
}, {
  browserName: process.env.CS_TEST_BROWSER || 'chromium'
});
