import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const tokens = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'));
const native = Object.fromEntries(['swift', 'kt', 'dart'].map(language => [language,
  readFileSync('tokens/native/' + (language === 'dart' ? 'cs_tokens.dart' : 'CSTokens.' + language), 'utf8')]));
const camel = name => name.replace(/^--cs-/, '').split(/[-_]/).map((part, index) => index ? part[0].toUpperCase() + part.slice(1) : part).join('');
const suffix = scope => scope.split('.').map(part => part[0].toUpperCase() + part.slice(1)).join('');
const browserName = process.env.CS_BROWSER || 'chromium';
let checked = 0;
await withBrowserFixture(async page => {
  await page.emulateMedia({colorScheme: 'light', contrast: 'no-preference'});
  const rows = await page.evaluate(packs => {
    const host = document.getElementById('fixture');
    const rows = [];
    for (const [pack, declarations] of Object.entries(packs)) for (const theme of ['light', 'dark']) {
      const [element, variant = ''] = pack.split('.');
      host.innerHTML = `<div data-theme="${theme}" data-cs-element="${element}" data-cs-variant="${variant}" data-cs-contrast="standard"><span></span></div>`;
      const scope = host.firstElementChild, probe = scope.firstElementChild;
      const style = getComputedStyle(scope);
      for (const key of Object.keys(declarations)) {
        const value = style.getPropertyValue(key).trim();
        probe.style.color = ''; probe.style.color = value;
        if (!probe.style.color) throw Error('Not a CSS color: ' + key + '=' + value);
        rows.push({pack, theme, key, color: getComputedStyle(probe).color});
      }
    }
    return rows;
  }, tokens.elements);
  for (const {pack, theme, key, color} of rows) {
    const match = /^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/.exec(color);
    assert.ok(match, 'Unsupported computed color serialization: ' + color);
    const [, r, g, b, alpha = '1'] = match;
    const hex = [r, g, b].map(value => Number(value).toString(16).toUpperCase().padStart(2, '0')).join('');
    const argb = Math.round(Number(alpha) * 255).toString(16).toUpperCase().padStart(2, '0') + hex;
    const name = camel(key) + suffix(pack) + (theme === 'light' ? 'Light' : 'Dark');
    assert.ok(native.swift.includes(`let ${name} = color(0x${hex}${alpha === '1' ? '' : ', alpha: ' + alpha})`), 'Swift computed CSS parity: ' + name);
    assert.ok(native.kt.includes(`val ${name} = Color(0x${argb})`), 'Kotlin computed CSS parity: ' + name);
    assert.ok(native.dart.includes(`const Color ${name} = Color(0x${argb});`), 'Dart computed CSS parity: ' + name);
    checked++;
  }
}, {browserName});
assert.equal(checked, 360);
assert(Object.hasOwn(tokens.elements.tho,'--cs-color-text-accent'),'The default Tho pack must retain its explicit body-safe scoped text-accent role');
assert(Object.hasOwn(tokens.elements.tho,'--cs-color-link'),'The default Tho pack must retain its explicit scoped body-link role');
console.log(`PASS native elemental values: ${checked} computed light/dark CSS colors across all 15 packs agree with all three generated targets; no native rendering claim.`);
