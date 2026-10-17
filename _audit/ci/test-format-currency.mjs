// Explicit currency is independent of display language (TASK-IMP-015/F21).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {formatCurrency} from '../../components/_i18n/i18n.js';
import {verifyCurrencyContract} from '../lib/currency-contract.mjs';
const fixtures = JSON.parse(readFileSync(new URL('../../examples/native/verification/locale-formatting.json',import.meta.url)));
const cases = verifyCurrencyContract(formatCurrency,fixtures);
// Prove the same assertion set detects ignored currency and language/locale
// conflation. The old test accepted the always-USD implementation.
const mutants = [
  (amount,options)=>formatCurrency(amount,typeof options==='object' && options?.currency?{...options,currency:'USD'}:options),
  (amount,options)=>formatCurrency(amount,typeof options==='object' && options?.currency?{...options,currency:'VND'}:options),
  (amount,options)=>formatCurrency(amount,typeof options==='object' && options?.currency?{...options,locale:'en-US'}:options),
  (amount,options)=>formatCurrency(amount,typeof options==='object' && options?.currency?{...options,locale:'vi-VN'}:options),
  (amount,options)=>formatCurrency(amount,typeof options==='object' && options?.currency?{...options,currency:options.lang==='vi'?'VND':'USD'}:options),
];
for (const mutant of mutants) assert.throws(()=>verifyCurrencyContract(mutant,fixtures),assert.AssertionError);
console.log(`PASS currency contract: ${cases} explicit/legacy/invalid cases; ${mutants.length} ignored-currency/locale-conflation mutants rejected.`);
