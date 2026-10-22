import assert from 'node:assert/strict';
import {apcaLc,parseColorToRgb} from '../lib/apca.mjs';
import {apca} from '../../scripts/lib/oklch.mjs';
for(const [foreground,background,expected] of [['#000000','#ffffff',106],['#ffffff','#000000',107.9],['#45210E','#FFFDF8',99.5],['#f5ead9','#221710',93.7]]) {
 assert.equal(apcaLc(foreground,background),expected);
 assert.equal(apca(foreground,background),expected);
 assert.equal(apcaLc(parseColorToRgb(foreground),parseColorToRgb(background)),expected);
}
assert.equal(apcaLc('#ffffff','#ffffff'),0);
assert.equal(apcaLc('transparent','#ffffff'),null);
assert.equal(apca('invalid','#ffffff'),0,'Generator retains fail-closed invalid hex behavior');
assert.deepEqual(parseColorToRgb('#abc'),[170,187,204]);
console.log('PASS shared APCA: fixed polarity/brand vectors, array/string parity, no-contrast and invalid-input contracts.');
