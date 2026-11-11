import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker, rangePresets } from './DateRangePicker';
import { expectAccessibleInThemes } from '../test/a11y';
import { expectOpenAccessibleInThemes } from './test-helpers';

const today = new Date(2026, 2, 18);
const march = { from: new Date(2026, 2, 3), to: new Date(2026, 2, 12) };

describe('DateRangePicker', () => {
  it('renders a labelled input showing both dates', () => {
    render(<DateRangePicker label="Stay" defaultValue={march} />);
    expect(screen.getByRole('textbox', { name: 'Stay' })).toHaveValue('03/03/2026 – 12/03/2026');
  });

  it('parses a typed range and puts the dates in order', async () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Stay" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Stay' });
    await userEvent.type(input, '20/03/2026 - 1/3/2026{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 1), to: new Date(2026, 2, 20) });
    expect(input).toHaveValue('01/03/2026 – 20/03/2026');
  });

  it('flags a half-typed range', async () => {
    render(<DateRangePicker label="Stay" invalidMessage="Nhập hai ngày" />);
    const input = screen.getByRole('textbox', { name: 'Stay' });
    await userEvent.type(input, '20/03/2026');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription('Nhập hai ngày');
  });

  it('picks a range with two clicks on a two-month calendar', async () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Stay" defaultValue={march} numberOfMonths={2} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    const dialog = await screen.findByRole('dialog', { name: 'Choose dates' });
    expect(within(dialog).getAllByRole('grid').map(g => g.getAttribute('aria-label'))).toEqual(['March 2026', 'April 2026']);
    await userEvent.click(within(dialog).getByRole('button', { name: /, 30 March 2026/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole('button', { name: /, 2 April 2026/ }));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 30), to: new Date(2026, 3, 2) });
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('presets fill the range in one click and take translated labels', async () => {
    const onValueChange = vi.fn();
    const presets = rangePresets({ last7Days: '7 ngày qua' }, today);
    render(<DateRangePicker label="Report period" presets={presets} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    const group = await screen.findByRole('group', { name: 'Presets' });
    expect(within(group).getAllByRole('button').map(b => b.textContent)).toEqual(['Today', '7 ngày qua', 'Last 30 days', 'This month']);
    await userEvent.click(within(group).getByRole('button', { name: '7 ngày qua' }));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 12), to: today });
  });

  it('rangePresets computes Today, Last 7 days, Last 30 days and This month from today', () => {
    expect(rangePresets({}, today).map(p => p.value)).toEqual([
      { from: today, to: today },
      { from: new Date(2026, 2, 12), to: today },
      { from: new Date(2026, 1, 17), to: today },
      { from: new Date(2026, 2, 1), to: today },
    ]);
  });

  it('has no accessibility violations in light and dark, closed and open', async () => {
    await expectAccessibleInThemes(<DateRangePicker label="Stay" defaultValue={march} description="Check-in after 14:00." />);
    cleanup();
    await expectOpenAccessibleInThemes(<DateRangePicker label="Stay" defaultValue={march} numberOfMonths={2} presets={rangePresets({}, today)} />, async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
      return screen.findByRole('dialog');
    });
  });
});
