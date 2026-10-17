import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from 'playwright';
import { readLiveDocExport } from './lib/doc-export-readiness.mjs';

const english = 'CyberSkill case study: the checkout and support console preserve every authored English sentence.';
const vietnamese = 'Nghiên cứu tình huống CyberSkill: thanh toán và hỗ trợ giữ nguyên nội dung tiếng Việt.';
const chrome = `<div data-omelette-chrome="export"><button data-cs-export="trigger">Tải / Download ▾</button><div data-cs-export="menu"><button data-cs-export="pdf">PDF</button><button data-cs-export="docx">DOCX</button></div></div><script>window.__csDocExport={buildDocxBlob(){}};window.__dcRootName=()=>"Component";</script>`;
for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch();
  const page = await browser.newPage();
  try {
    // Reproduce the observed missing-sheet window: old fallback reads Vietnamese
    // toolbar chrome while the actual English sheet is being remounted.
    await page.setContent(chrome);
    assert.equal(await page.evaluate(() => /Tải/.test((document.querySelector('.cs-sheet') || document.body).innerText)), true);
    await page.evaluate(text => setTimeout(() => {
      const sheet = document.createElement('article'); sheet.className = 'cs-sheet';
      sheet.textContent = text; const root=document.createElement('div');
      root.dataset.scName='Component'; root.append(sheet); document.body.append(root);
    }, 500), english);
    const remounted = await readLiveDocExport(page);
    assert.equal(remounted.hasVn, false);
    assert.equal(remounted.hasEn, true);
    assert.equal(remounted.sample, english);
    assert.equal(remounted.trigger && remounted.menuPdf && remounted.menuDocx, true);

    await page.setContent(chrome + '<div data-sc-name="Component"><article class="cs-sheet"></article></div>');
    await page.locator('.cs-sheet').evaluate((sheet, text) => { sheet.textContent = text; }, vietnamese);
    assert.equal((await readLiveDocExport(page)).hasVn, true, 'Real Vietnamese content must retain its diacritic assertion');

    await page.setContent(chrome);
    await assert.rejects(readLiveDocExport(page, { timeout: 150 }), /Timeout/, 'Toolbar alone must never satisfy document readiness');

    await page.setContent(chrome + '<div data-sc-name="Component"><article class="cs-sheet">{{ unresolvedLongAuthoredContentMustNotCountAsRendered }}</article></div>');
    await assert.rejects(readLiveDocExport(page, { timeout: 150 }), /Timeout/, 'Unresolved source holes must not count as document content');
    await page.locator('.cs-sheet').evaluate((sheet, text) => { sheet.textContent = text; }, english);
    assert.equal((await readLiveDocExport(page)).sample, english);
    await page.setContent(chrome + '<article class="cs-sheet"></article>');
    await page.locator('.cs-sheet').evaluate((sheet, text) => { sheet.textContent = text; }, english);
    await assert.rejects(readLiveDocExport(page, { timeout: 150 }), /Timeout/, 'Authored markup without the committed DC root must not pass');
    await page.locator('.cs-sheet').evaluate(sheet => {
      const root = document.createElement('div'); root.dataset.scName = 'Component';
      sheet.replaceWith(root); root.append(sheet);
    });
    assert.equal((await readLiveDocExport(page)).sample, english);
    console.log(`PASS ${name} document-export readiness: delayed English remount with Vietnamese toolbar; real Vietnamese content; missing sheet, unresolved source holes and raw uncommitted markup rejected; committed content accepted.`);
  } finally { await page.close(); await browser.close(); }
}
