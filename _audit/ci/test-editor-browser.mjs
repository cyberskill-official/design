import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { sanitizeHtml } from '../../components/forms/editor-schema.js';
import { editorHtmlFixtures } from './fixtures/editor-html.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });
await withBrowserFixture(async page => {
  const expected = editorHtmlFixtures.map(f => sanitizeHtml(f.input));
  const actual = await page.evaluate(async fixtures => {
    const { sanitizeHtml, EDITOR_SCHEMA } = await import('/components/forms/editor-schema.js');
    return fixtures.map(f => {
      const clean = sanitizeHtml(f.input);
      const node = document.createElement('div'); node.innerHTML = clean;
      document.body.append(node);
      for (const el of node.querySelectorAll('*')) {
        if (!EDITOR_SCHEMA.tags.includes(el.localName) || el.attributes.length || el.namespaceURI !== 'http://www.w3.org/1999/xhtml') throw new Error(`Unsafe output: ${f.name}`);
      }
      node.remove();
      return clean;
    });
  }, editorHtmlFixtures);
  assert.deepEqual(actual, expected, 'Node/browser policy parity');
  assert.equal(await page.evaluate(() => globalThis.__editorAttack || 0), 0);

  const payload = editorHtmlFixtures.find(f => f.name === 'nested unknown wrapper regression').input;
  await page.evaluate(input => {
    window.editorChanges = [];
    renderFixture(React.createElement(CS.Editor, { defaultValue: input, lang: 'en', onChange: html => editorChanges.push(html) }));
  }, payload);
  const area = page.getByRole('textbox');
  await area.waitFor();
  assert.equal(await area.innerHTML(), '<b>safe</b>', 'defaultValue sanitized before insertion');
  for (const type of ['paste', 'drop']) {
    await area.focus();
    const prevented = await area.evaluate((el, { type, payload }) => {
      const dt = new DataTransfer(); dt.setData('text/html', payload);
      const event = type === 'paste'
        ? new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })
        : new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true });
      // Firefox does not retain constructor-provided synthetic clipboard data.
      // Supply the fixture payload explicitly; this is handler coverage, not OS clipboard certification.
      Object.defineProperty(event, type === 'paste' ? 'clipboardData' : 'dataTransfer', { value: dt });
      if (event[type === 'paste' ? 'clipboardData' : 'dataTransfer'].getData('text/html') !== payload) throw Error('Missing transfer fixture payload');
      el.dispatchEvent(event); return event.defaultPrevented;
    }, { type, payload });
    assert.equal(prevented, true, `${type}: native unsafe insertion cancelled`);
    assert.equal(await area.locator('img,section,[onerror]').count(), 0, `${type}: no unsafe nodes in live editor`);
    assert.equal(await page.evaluate(() => globalThis.__editorAttack || 0), 0);
  }
  // Plain text is escaped, not reinterpreted as markup, and retains line breaks.
  await area.evaluate(el => {
    const dt = new DataTransfer(); dt.setData('text/plain', '<img src=x>\nTiếng Việt');
    const event = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: dt });
    if (event.clipboardData.getData('text/plain') !== '<img src=x>\nTiếng Việt') throw Error('Missing plain-text fixture payload');
    el.dispatchEvent(event);
  });
  assert.equal(await area.locator('img').count(), 0);
  assert.ok((await area.textContent()).includes('<img src=x>'));

  // Exercise every toolbar command through both keyboard activation keys and
  // pointer clicks, checking selection, one emission and exposed toggle state.
  for (const [label, selector] of [['Bold','b,strong'],['Italic','i,em'],['Bullet list','ul']]) {
    for (const activation of ['Enter','Space','mouse']) {
      await page.evaluate(key => renderFixture(React.createElement(CS.Editor, { key, defaultValue: '<p>Format me</p>', lang: 'en', onChange: html => editorChanges.push(html) })), label + activation);
      await area.getByText('Format me', { exact: true }).waitFor();
      await area.evaluate(el => {
        el.focus(); const r = document.createRange(); r.selectNodeContents(el);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        document.dispatchEvent(new Event('selectionchange'));
      });
      const button = page.getByRole('button', { name: label, exact: true });
      assert.equal(await button.getAttribute('aria-pressed'), 'false', label + ': initial state');
      const before = await page.evaluate(() => editorChanges.length);
      if (activation === 'mouse') await button.click();
      else { await button.focus(); await page.keyboard.press(activation); }
      assert.ok(await area.locator(selector).count(), label + ': ' + activation + ' command applied');
      assert.equal(await area.textContent(), 'Format me', 'Formatting preserves selected text');
      assert.equal(await page.evaluate(() => editorChanges.length), before + 1, label + ': emits once');
      await page.waitForFunction(label => [...document.querySelectorAll('.cs-toolbar__btn')].find(el => el.getAttribute('aria-label') === label)?.getAttribute('aria-pressed') === 'true', label);
      if (activation === 'mouse') await button.click();
      else { await button.focus(); await page.keyboard.press(activation); }
      await page.waitForFunction(label => [...document.querySelectorAll('.cs-toolbar__btn')].find(el => el.getAttribute('aria-label') === label)?.getAttribute('aria-pressed') === 'false', label);
      assert.equal(await area.locator(selector).count(), 0, label + ': second activation clears formatting');
      assert.equal(await page.evaluate(() => editorChanges.length), before + 2, label + ': second activation emits once');
    }
  }
  await page.evaluate(() => renderFixture(React.createElement(CS.Editor, { key: 'selection-state', defaultValue: '<p><b>Bold</b> plain</p>', lang: 'en' })));
  await area.evaluate(el => {
    el.focus(); const range = document.createRange(); range.selectNodeContents(el.querySelector('b'));
    const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await page.waitForFunction(() => document.querySelector('[aria-label=Bold]').getAttribute('aria-pressed') === 'true');
  await area.evaluate(el => {
    const range = document.createRange(); range.selectNodeContents(el);
    const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await page.waitForFunction(() => document.querySelector('[aria-label=Bold]').getAttribute('aria-pressed') === 'mixed');
  await page.evaluate(()=>{
    window.redrawEditor=height=>renderFixture(React.createElement(CS.Editor,{key:'rerender',defaultValue:'<p>Keep me</p>',lang:'en',minHeight:height}));
    redrawEditor(120);
  });
  await page.getByRole('button',{name:'Bold',exact:true}).focus();
  await page.evaluate(()=>{window.focusedEditorButton=document.activeElement;redrawEditor(160)});
  assert.equal(await page.evaluate(()=>document.activeElement===focusedEditorButton && focusedEditorButton.isConnected),true,'Parent updates must retain toolbar DOM and keyboard focus');
  assert.equal(await area.textContent(),'Keep me','Rerender preserves editable content');
  const baseline = process.argv.find(a => a.startsWith('--baseline-ref='))?.split('=')[1];
  if (baseline) {
    const source = execFileSync('git', ['show', `${baseline}:components/forms/editor-schema.js`], { encoding: 'utf8' });
    const oldOutput = await page.evaluate(async ({ source, payload }) => {
      const mod = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(source));
      return mod.sanitizeHtml(payload);
    }, { source, payload });
    assert.match(oldOutput, /onerror=/, 'baseline must reproduce the finding this test guards');
    console.log('Confirmed baseline regression: executable descendant retained before repair');
  }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS test-editor-browser: browser/Node parity, inert output, seed, paste, drop, plain text, keyboard and single emission');
