import { describe, expect, it } from 'vitest';
import { formatDate, formatTime, parseDate, parseTime } from './utils';

describe('date helpers', () => {
  it('formatDate / parseDate round-trip dd/MM/yyyy and reject impossible dates', () => {
    expect(formatDate(new Date(2026, 2, 5))).toBe('05/03/2026');
    expect(parseDate('5/3/2026')).toEqual(new Date(2026, 2, 5));
    expect(parseDate(' 05/03/2026 ')).toEqual(new Date(2026, 2, 5));
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseDate('05/03/26')).toBeNull();
    expect(parseDate('2026-03-05', 'yyyy-MM-dd')).toEqual(new Date(2026, 2, 5));
  });

  it('parseTime reads 24h, 12h, compact and Vietnamese forms', () => {
    const cases: [string, string | null][] = [
      ['9:30', '09:30'], ['09.30', '09:30'], ['930', '09:30'], ['2130', '21:30'], ['9h30', '09:30'], ['9', '09:00'],
      ['12am', '00:00'], ['12 pm', '12:00'], ['9:30 PM', '21:30'], ['9:30 CH', '21:30'], ['9:30 SA', '09:30'],
      ['24:00', null], ['9:60', null], ['13pm', null], ['abc', null], ['9:3', null],
      // Vietnamese hour forms: h or g (giờ), with or without minutes, any case, spaces allowed.
      ['21h', '21:00'], ['9h', '09:00'], ['9g30', '09:30'], ['9g', '09:00'], ['21H', '21:00'], ['9 h 30', '09:30'], ['9h30ch', '21:30'],
      ['9:', null], ['9h3', null], ['25h', null],
    ];
    for (const [text, expected] of cases) expect(parseTime(text), text).toBe(expected);
  });

  it('formatTime shows 24-hour or 12-hour times', () => {
    expect(formatTime('21:30')).toBe('21:30');
    expect(formatTime('21:30', 12)).toBe('9:30 PM');
    expect(formatTime('00:05', 12)).toBe('12:05 AM');
  });
});
