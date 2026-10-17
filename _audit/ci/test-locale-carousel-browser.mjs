import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });
await withBrowserFixture(async page => {
  await page.evaluate(() => {
    document.documentElement.lang = 'vi';
    function Fixture() {
      const [open, setOpen] = React.useState(false);
      return React.createElement('div', { lang:'en', id:'language-scope' },
        React.createElement('button', { onClick:()=>setOpen(true) }, 'Open scoped dialog'),
        React.createElement(CS.Dialog, { open, title:'Scoped', onClose:()=>setOpen(false) }, 'Body'));
    }
    renderFixture(React.createElement(React.StrictMode, null, React.createElement(Fixture)));
  });
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name:'Open scoped dialog' }).click();
    const close = page.getByRole('button', { name:'Close', exact:true });
    await close.waitFor();
    await close.click();
  }
  await page.getByRole('button', { name:'Open scoped dialog' }).click();
  await page.locator('#language-scope').evaluate(el=>el.lang='vi');
  await page.getByRole('button', { name:'Đóng', exact:true }).waitFor();
  await page.getByRole('button', { name:'Đóng', exact:true }).click();
  await page.evaluate(() => renderFixture(React.createElement(CS.CitationList, { items:[] })));
  assert.equal(await page.locator('.cs-citations__label').textContent(), 'Nguồn');
  await page.evaluate(() => renderFixture(React.createElement(CS.CitationList, { lang:'en', items:[] })));
  assert.equal(await page.locator('.cs-citations__label').textContent(), 'Sources');
  await page.evaluate(() => renderFixture(React.createElement(CS.CitationList, { lang:'vi', label:'Custom heading', items:[] })));
  assert.equal(await page.locator('.cs-citations__label').textContent(), 'Custom heading');
  await page.evaluate(() => renderFixture(React.createElement(CS.CitationList, { label:null, items:[] })));
  assert.equal(await page.locator('.cs-citations__label').count(), 0);
  await page.evaluate(() => {
    const portal = document.createElement('div'); portal.lang='en'; document.body.append(portal);
    renderFixture(ReactDOM.createPortal(React.createElement(CS.CitationList, { items:[] }), portal));
  });
  assert.equal(await page.locator('.cs-citations__label').textContent(), 'Sources', 'portal resolves nearest DOM language');

  await page.evaluate(() => {
    window.carouselChildren = count => Array.from({length:count}, (_,i)=>React.createElement('button', {key:i}, `Slide ${i+1} action`));
    renderFixture(React.createElement(CS.Carousel, { key:'carousel', label:'Test slides', lang:'en' }, carouselChildren(2)));
  });
  await page.getByRole('button', { name:'Slide 1 action', exact:true }).focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>!!document.activeElement.closest('[aria-hidden="true"]')), false, 'Tab skips inactive content');
  assert.equal(await page.getByRole('button', { name:'Slide 2 action', exact:true }).count(), 0);
  await page.locator('.cs-carousel__nav.next').click();
  await page.getByRole('button', { name:'Slide 2 action', exact:true }).focus();
  assert.equal(await page.locator('.cs-carousel__slide').nth(0).evaluate(el=>el.inert), true);
  await page.evaluate(() => renderFixture(React.createElement(CS.Carousel, { key:'carousel', label:'Test slides', lang:'en' }, carouselChildren(1))));
  assert.equal(await page.getByRole('button', { name:'Slide 1 action', exact:true }).count(), 1, 'shrink clamps index');
  assert.equal(await page.locator('.cs-carousel__nav:disabled').count(), 2);
  await page.evaluate(() => renderFixture(React.createElement(CS.Carousel, { key:'carousel', label:'Test slides', lang:'en' }, carouselChildren(2))));
  assert.equal(await page.getByRole('button', { name:'Slide 1 action', exact:true }).count(), 1, 'Regrowth does not revive a removed index');
  await page.locator('.cs-carousel__nav.next').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.getByRole('button', { name:'Slide 2 action', exact:true }).count(), 1, 'Enter activates next control');
  await page.locator('.cs-carousel__nav.prev').focus(); await page.keyboard.press('Space');
  assert.equal(await page.getByRole('button', { name:'Slide 1 action', exact:true }).count(), 1, 'Space activates previous control');
  await page.evaluate(() => renderFixture(React.createElement(CS.Carousel, { key:'carousel', label:'Test slides', lang:'en' }, [])));
  assert.equal(await page.locator('.cs-carousel__nav:disabled').count(), 2);
  assert.doesNotMatch(await page.locator('.cs-carousel__track').getAttribute('style'), /NaN/);
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log('PASS locale/carousel: delayed mount, reopen, StrictMode, language mutation, overrides, portal DOM scope, inactive focus and dynamic/empty slides');
