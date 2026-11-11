import { render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker';
import { expectAccessibleInThemes } from '../test/a11y';
import { expectOpenAccessibleInThemes } from './test-helpers';

describe('TimePicker', () => {
  it('renders a labelled combobox showing the 24-hour value', () => {
    render(<TimePicker label="Start time" defaultValue="09:30" />);
    expect(screen.getByRole('combobox', { name: 'Start time' })).toHaveValue('09:30');
  });

  it.each([
    ['9:30', '09:30'],
    ['21:30', '21:30'],
    ['930', '09:30'],
    ['9h30', '09:30'],
    ['9:30 pm', '21:30'],
  ])('parses "%s" on blur as %s', async (typed, expected) => {
    const onValueChange = vi.fn();
    render(<TimePicker label="Start time" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Start time' }), typed);
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(expected);
  });

  it('lists times every step minutes between min and max and picks one with the keyboard', async () => {
    const onValueChange = vi.fn();
    render(<TimePicker label="Start time" step={30} min="09:00" max="11:00" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Start time' });
    await userEvent.click(input);
    const list = await screen.findByRole('listbox');
    expect(within(list).getAllByRole('option').map(o => o.textContent)).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00']);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('09:30');
    expect(input).toHaveValue('09:30');
  });

  it('opens on the current time, in view, and arrows from there', async () => {
    render(<TimePicker label="Start time" defaultValue="13:30" />);
    const input = screen.getByRole('combobox', { name: 'Start time' });
    await userEvent.click(input);
    const option = await screen.findByRole('option', { name: '13:30' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => {
      const [o, l] = [option.getBoundingClientRect(), option.parentElement!.getBoundingClientRect()];
      return o.top >= l.top && o.bottom <= l.bottom;
    }).toBe(true);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(input).toHaveValue('13:45');
  });

  it('narrows the list while typing', async () => {
    render(<TimePicker label="Start time" step={30} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Start time' }), '14');
    const options = within(await screen.findByRole('listbox')).getAllByRole('option');
    expect(options.map(o => o.textContent)).toEqual(['14:00', '14:30']);
  });

  it('shows 12-hour times and still emits 24-hour values', async () => {
    const onValueChange = vi.fn();
    render(<TimePicker label="Start time" hourCycle={12} defaultValue="21:30" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Start time' });
    expect(input).toHaveValue('9:30 PM');
    await userEvent.clear(input);
    await userEvent.type(input, '8:15 am{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('08:15');
    expect(input).toHaveValue('8:15 AM');
  });

  it('flags text that is not a time, or is outside min/max, without changing the value', async () => {
    const onValueChange = vi.fn();
    render(<TimePicker label="Giờ bắt đầu" min="08:00" max="18:00" invalidMessage="Giờ không hợp lệ" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Giờ bắt đầu' });
    await userEvent.type(input, '25:00');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Giờ không hợp lệ');
    await userEvent.clear(input);
    await userEvent.type(input, '19:00');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations in light and dark, closed and open', async () => {
    await expectAccessibleInThemes(
      <div>
        <TimePicker label="Start time" defaultValue="09:30" description="Office hours are 8:00 to 18:00." />
        <TimePicker label="End time" error="Pick an end time" />
        <TimePicker label="Locked" defaultValue="09:30" disabled />
      </div>,
    );
    document.body.innerHTML = '';
    await expectOpenAccessibleInThemes(<TimePicker label="Start time" defaultValue="09:30" />, async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Start time' }));
      return (await screen.findByRole('listbox')).closest<HTMLElement>('.cs-time-picker-popup')!;
    });
  });
});
