import assert from 'node:assert/strict';
import {waitForNativeTemplate} from './native-template-ready.mjs';

/** Exact authored strategy; native assets never substitute for component readiness. */
export async function waitForSiteTemplate(page, entry) {
  assert(['static-logo', 'components'].includes(entry?.strategy), 'Unknown template readiness strategy');
  if (entry.strategy === 'static-logo') {
    assert(entry.logos.length > 0, 'Static templates must declare their official logos');
    await waitForNativeTemplate(page);
    assert.equal(await page.locator('img[data-cs-official-logo]').count(), entry.logos.length);
    assert.equal(await page.locator('meta[name="cs-template-library"]').getAttribute('content'), 'static-logo');
  } else {
    await page.waitForFunction(() => window.__dcRootName?.() && window.CyberSkillDS &&
      document.querySelector('[data-sc-name]') &&
      !document.querySelector('.sc-placeholder,.sc-logic-error,.sc-placeholder-error'));
    assert.equal(await page.locator('meta[name="cs-template-library"][content="static-logo"]').count(), 0,
      'Component templates cannot claim the bundle-free strategy');
  }
  assert.equal(await page.locator('.sc-placeholder,.sc-logic-error,.sc-placeholder-error').count(), 0);
}
