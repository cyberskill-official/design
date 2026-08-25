#!/usr/bin/env node
/**
 * TASK-IMP-026 — third-locale (ja) spike + BCP-47 primary-subtag resolveLang contract.
 * See docs/decisions/locale-architecture.md.
 */
import { makeT, primaryLang, resolveLang, tr, KNOWN_LOCALES } from '../../components/_i18n/i18n.js';
import { strings } from '../../components/_i18n/strings.js';

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL test-locale-ja-spike —', msg);
    process.exit(1);
  }
}

assert(KNOWN_LOCALES.includes('ja'), 'KNOWN_LOCALES must include ja spike');
assert(KNOWN_LOCALES.includes('vi') && KNOWN_LOCALES.includes('en'), 'KNOWN_LOCALES must include vi+en');

assert(primaryLang(null) === null, 'primaryLang(null) → null');
assert(primaryLang('') === null, 'primaryLang("") → null');
assert(primaryLang('vi') === 'vi', 'primaryLang vi');
assert(primaryLang('vi-VN') === 'vi', 'primaryLang vi-VN');
assert(primaryLang('Tiếng Việt') === 'vi', 'primaryLang display VI');
assert(primaryLang('en') === 'en', 'primaryLang en');
assert(primaryLang('en-US') === 'en', 'primaryLang en-US');
assert(primaryLang('English') === 'en', 'primaryLang display EN');
assert(primaryLang('ja') === 'ja', 'primaryLang ja');
assert(primaryLang('ja-JP') === 'ja', 'primaryLang ja-JP');
assert(primaryLang('日本語') === 'ja', 'primaryLang display JA');

assert(resolveLang(undefined, null) === 'vi', 'unset → vi (Vietnamese-first)');
assert(resolveLang(null, null) === 'vi', 'null → vi');
assert(resolveLang('ja-JP', null) === 'ja', 'resolveLang ja-JP');
assert(resolveLang('en', null) === 'en', 'resolveLang en');

const pag = strings.Pagination;
assert(pag && pag.ja && pag.en && pag.vi, 'Pagination must carry en+vi+ja spike tables');
assert(
  Object.keys(pag.en).sort().join() === Object.keys(pag.ja).sort().join(),
  'Pagination ja keys must match en',
);

const tJa = makeT('Pagination', 'ja');
assert(tJa('next') === pag.ja.next, 'makeT(Pagination, ja) next');
assert(tJa('prev') === pag.ja.prev, 'makeT(Pagination, ja) prev');
assert(tr('Pagination', 'label', 'ja-JP') === pag.ja.label, 'tr accepts ja-JP');

const tVi = makeT('Pagination', undefined);
assert(tVi('next') === pag.vi.next, 'makeT default path still VI via resolve callers');

// Missing spike locale falls back to en, then vi — CommandPalette has no ja.
assert(!strings.CommandPalette.ja, 'CommandPalette intentionally has no ja (fallback proof)');
assert(
  tr('CommandPalette', 'empty', 'ja') === strings.CommandPalette.en.empty,
  'missing ja table falls back to en',
);

console.log('PASS test-locale-ja-spike', {
  known: KNOWN_LOCALES,
  paginationJaKeys: Object.keys(pag.ja).length,
});
