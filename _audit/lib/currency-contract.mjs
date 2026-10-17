// Reference oracle is the documented Intl contract, independent of the helper.
import assert from 'node:assert/strict';
export function verifyCurrencyContract(formatCurrency, fixtures) {
  let cases = 0;
  for (const {language, numberLocale} of fixtures.languages) {
    for (const currency of fixtures.currencies) {
      for (const amount of fixtures.currencyAmounts) {
        const expected = new Intl.NumberFormat(numberLocale, {style:'currency', currency, currencyDisplay:'symbol'}).format(amount);
        const contexts = [
          {currency, locale:numberLocale},
          {currency, lang:language},
          {currency:currency.toLowerCase(), locale:numberLocale, lang:language==='vi'?'en':'vi'},
        ];
        for (const options of contexts) {
          assert.equal(formatCurrency(amount, options), expected, `Explicit currency must survive language, locale and casing: ${JSON.stringify({amount,options})}`);
          cases++;
        }
      }
    }
  }
  for (const [amount, language, expected] of [
    [1234567,'en','$1,234,567'], [1234567,'vi','1.234.567\u00a0₫'],
    [-1234.56,'en','$-1,234.56'], [-1234.56,'vi','-1.234,56\u00a0₫'],
    [0,'en','$0'], [0,'vi','0\u00a0₫'],
  ]) {assert.equal(formatCurrency(amount,language),expected,'Preserve documented legacy presentation');cases++;}
  for (const value of [null,undefined,NaN,'not-a-number']) {
    for (const context of ['vi','en',{currency:'USD',locale:'vi-VN'}]) {
      assert.equal(formatCurrency(value,context),'','Invalid/absent amount must remain empty');cases++;
    }
  }
  assert.throws(()=>formatCurrency(1,{currency:'BAD!'}), RangeError, 'Invalid currency must retain Intl rejection');cases++;
  return cases;
}
