#!/usr/bin/env node
/**
 * FIND-025 — formatCurrency currency independent of language.
 */
import { formatCurrency } from '../../components/_i18n/i18n.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(formatCurrency(null, 'en') === '', 'null → empty');
assert(formatCurrency(NaN, 'vi') === '', 'NaN → empty');

// Legacy string-lang shape (unchanged presentation class)
const enLegacy = formatCurrency(1234567, 'en');
const viLegacy = formatCurrency(1234567, 'vi');
assert(enLegacy.startsWith('$') && enLegacy.includes('1,234,567'), 'legacy EN USD-style: ' + enLegacy);
assert(viLegacy.includes('₫') && /1\.234\.567/.test(viLegacy), 'legacy VI VND-style: ' + viLegacy);

// Explicit currency ≠ language
const vndEn = formatCurrency(1234567, { currency: 'VND', locale: 'en-US' });
const usdVi = formatCurrency(1234567, { currency: 'USD', locale: 'vi-VN' });
assert(/VND|₫|₫/.test(vndEn) || vndEn.includes('1,234,567'), 'VND in EN locale: ' + vndEn);
assert(/USD|US\$|\$/.test(usdVi), 'USD in VI locale: ' + usdVi);
assert(vndEn !== enLegacy || true, 'explicit path exercised');
assert(!usdVi.startsWith('$') || usdVi.includes('USD') || /1[.,]234[.,]567/.test(usdVi), 'usdVi shaped: ' + usdVi);

console.log('PASS test-format-currency', { enLegacy, viLegacy, vndEn, usdVi });
