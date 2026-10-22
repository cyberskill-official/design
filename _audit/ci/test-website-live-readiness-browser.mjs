import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../../', import.meta.url));
const {
  withBrowserFixture
} = await import('./lib/browser-fixture.mjs');
const rows = [];
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  let release,
    held = false;
  const gate = new Promise(resolve => release = resolve);
  await page.route('**/ui_kits/website/Website.jsx', async route => {
    held = true;
    await gate;
    await route.continue();
  });
  try {
    await page.goto(origin + '/_audit/visual-diff.html');
    await page.waitForFunction(() => window.__visualdiff);
    await page.getByRole('button', {
      name: 'website',
      exact: true
    }).click();
    for (let tries = 0; tries < 200 && !held; tries++) await new Promise(resolve => setTimeout(resolve, 10));
    if (!held) throw Error('Website script was not intercepted');
    await page.waitForFunction(() => {
      const f = document.querySelector('iframe'),
        d = f?.contentDocument;
      return d?.fonts.status === 'loaded' && f.contentWindow.getComputedStyle(d.documentElement).getPropertyValue('--cs-color-brand-umber').trim();
    });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 150)))));
    const before = await page.evaluate(() => ({
      state: window.__visualLive?.state,
      slug: window.__visualLive?.slug,
      mountedChildren: document.querySelector('iframe').contentDocument.getElementById('root').childElementCount
    }));
    release();
    const frame = page.frames().find(f => f.url().includes('/ui_kits/website/index.html'));
    await frame.waitForFunction(() => document.getElementById('root').childElementCount > 0);
    await page.waitForFunction(() => __visualLive?.state === 'ready' && __visualLive.slug === 'website');
    const pass = before.state === 'loading' && before.slug === 'website' && before.mountedChildren === 0;
    rows.push({
      browserName,
      delayedScriptSnapshot: before,
      pass,
      afterMountedReady: true
    });
  } finally {
    release();
  }
}, {
  browserName
});
const sha = p => createHash('sha256').update(readFileSync(join(root, p))).digest('hex'),
  failures = rows.filter(x => !x.pass).length,
  report = {
    recordedAt: new Date().toISOString(),
    sourceRoot: root,
    sourceFiles: Object.fromEntries(['_audit/visual-diff.html', 'ui_kits/website/index.html', 'ui_kits/website/Website.jsx', '_audit/ci/lib/browser-fixture.mjs'].map(p => [p, sha(p)])),
    cases: rows.length,
    failures,
    exitCode: failures ? 1 : 0,
    rows,
    scope: 'Deterministic held external JSX proves whether the website is reported ready before mounting. Does not prove the exact cause of the earlier intermittent WebKit Website reference error or certify all visual correctness.'
  };
console.log(JSON.stringify({
  cases: rows.length,
  failures
}));
process.exitCode = report.exitCode;
