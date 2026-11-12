import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';
import { rangePresets } from './utils';
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

  it('reads a plain hyphen between the dates when the format has none', async () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Stay" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Stay' }), '01/03/2026-15/03/2026{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 1), to: new Date(2026, 2, 15) });
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

  it('disables presets outside min, max or disabledDates and still checks the ones it allows', async () => {
    const onValueChange = vi.fn();
    const presets = rangePresets({}, today);
    // Last 30 days starts before min; Last 7 days starts on a disabled day.
    render(<DateRangePicker label="Report period" presets={presets} min={new Date(2026, 2, 1)} disabledDates={new Date(2026, 2, 12)} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    const group = await screen.findByRole('group', { name: 'Presets' });
    expect(within(group).getAllByRole('button').map(b => [b.textContent, (b as HTMLButtonElement).disabled])).toEqual([
      ['Today', false],
      ['Last 7 days', true],
      ['Last 30 days', true],
      ['This month', false],
    ]);
    await userEvent.click(within(group).getByRole('button', { name: 'Last 30 days' }), { force: true });
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(within(group).getByRole('button', { name: 'This month' }));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 1), to: today });
    cleanup();
    render(<DateRangePicker label="Report period" presets={presets} max={new Date(2026, 2, 17)} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    const capped = await screen.findByRole('group', { name: 'Presets' });
    expect(within(capped).getAllByRole('button').every(b => (b as HTMLButtonElement).disabled)).toBe(true);
  });

  it('submits the range as name[from] and name[to] in yyyy-MM-dd, empty when invalid', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<form><DateRangePicker label="Stay" name="stay" defaultValue={march} onValueChange={onValueChange} /></form>);
    const form = container.querySelector('form')!;
    expect([...new FormData(form).entries()]).toEqual([['stay[from]', '2026-03-03'], ['stay[to]', '2026-03-12']]);
    const input = screen.getByRole('textbox', { name: 'Stay' });
    await userEvent.clear(input);
    await userEvent.type(input, '20/03/2026');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(input).toHaveValue('20/03/2026');
    expect([...new FormData(form).entries()]).toEqual([['stay[from]', ''], ['stay[to]', '']]);
  });

  it('excludeDisabled rejects a typed range that spans a disabled day', async () => {
    const onValueChange = vi.fn();
    const closed = new Date(2026, 2, 5);
    const { rerender } = render(<DateRangePicker label="Stay" disabledDates={closed} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Stay' });
    await userEvent.type(input, '03/03/2026 – 08/03/2026{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 3), to: new Date(2026, 2, 8) }); // off: only the ends count
    rerender(<DateRangePicker label="Stay" disabledDates={closed} onValueChange={onValueChange} excludeDisabled />);
    await userEvent.clear(input);
    await userEvent.type(input, '02/03/2026 – 09/03/2026');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('excludeDisabled: a second click that would span a disabled day starts a new range there', async () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Stay" defaultValue={{ from: new Date(2026, 2, 10), to: new Date(2026, 2, 12) }} disabledDates={new Date(2026, 2, 5)} excludeDisabled onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: /, 3 March 2026/ }));
    await userEvent.click(within(dialog).getByRole('button', { name: /, 8 March 2026/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole('button', { name: /, 9 March 2026/ }));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 2, 8), to: new Date(2026, 2, 9) });
  });

  it('passes labels to the calendar', async () => {
    render(<DateRangePicker label="Stay" defaultValue={march} labels={{ labelDayButton: date => `Ngày ${date.getDate()}` }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    expect(within(await screen.findByRole('dialog')).getAllByRole('button', { name: 'Ngày 20' }).length).toBeGreaterThan(0);
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
