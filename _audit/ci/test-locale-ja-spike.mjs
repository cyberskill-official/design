#!/usr/bin/env node
/**
 * TASK-IMP-026 — third-locale (ja) spike + BCP-47 primary-subtag resolveLang contract.
 * See docs/decisions/locale-architecture.md.
 */
import { makeT, primaryLang, resolveLang, tr, knownLocales, formatDate, formatNumber, formatCurrency, monthName } from '../../components/_i18n/i18n.js';
import { strings } from '../../components/_i18n/strings.js';

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL test-locale-ja-spike —', msg);
    process.exit(1);
  }
}

assert(knownLocales.includes('ja'), 'knownLocales must include ja spike');
assert(knownLocales.includes('vi') && knownLocales.includes('en'), 'knownLocales must include vi+en');

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
  known: knownLocales,
  paginationJaKeys: Object.keys(pag.ja).length,
});

// Distinct primary subtags must not become a supported locale just because their
// spelling shares a prefix. Intl.Locale independently parses these BCP-47 tags.
for (const tag of ['jam','vif','ena','jam-JM','vif-CM','ena-PG']) {
  const primary = new Intl.Locale(tag).language;
  assert(primaryLang(tag) === primary, `${tag}: preserve primary ${primary}`);
  assert(resolveLang(tag,null) === primary, `${tag}: preserve explicit unknown locale`);
  assert(tr('Pagination','next',tag) === pag.en.next, `${tag}: English fallback`);
  assert(formatNumber(1234.5,tag) === formatNumber(1234.5,'en'), `${tag}: number fallback`);
  assert(formatDate(new Date(2026,6,2),tag) === formatDate(new Date(2026,6,2),'en'), `${tag}: date fallback`);
  assert(monthName(6,tag) === monthName(6,'en'), `${tag}: month fallback`);
  assert(formatCurrency(1234.5,{currency:'VND',lang:tag}) === formatCurrency(1234.5,{currency:'VND',lang:'en'}), `${tag}: explicit currency fallback`);
}
for (const [tag,primary] of [[' EN_us ','en'],['JA_jp','ja'],['vi_VN','vi'],['Tieng Viet','vi'],['Japanese','ja']]) {
  assert(primaryLang(tag) === primary, `${tag}: supported alias/region preserved`);
}
console.log('PASS distinct primary subtags: 6 BCP-47 tags; translation, number, date, month and currency fallbacks; 5 alias/region cases');
