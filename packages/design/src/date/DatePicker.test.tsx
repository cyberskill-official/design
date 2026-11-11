import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';
import { DateTimePicker } from './DateTimePicker';
import { expectAccessibleInThemes } from '../test/a11y';
import { expectOpenAccessibleInThemes } from './test-helpers';

const march15 = new Date(2026, 2, 15);

describe('DatePicker', () => {
  it('renders a labelled text input showing the value as dd/MM/yyyy', () => {
    render(<DatePicker label="Start date" defaultValue={march15} />);
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('15/03/2026');
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeVisible();
  });

  it('parses typed dates on blur and Enter', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Start date" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.type(input, '1/4/2026');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 3, 1));
    expect(input).toHaveValue('01/04/2026');
    await userEvent.clear(input);
    await userEvent.type(input, '20/04/2026{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 3, 20));
  });

  it('shows the invalid message for impossible or out-of-range dates and never reports them as a value', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Ngày bắt đầu" min={new Date(2026, 0, 1)} invalidMessage="Ngày không hợp lệ" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Ngày bắt đầu' });
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Ngày không hợp lệ');
    await userEvent.clear(input);
    await userEvent.type(input, '31/12/2025');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('an invalid typed date reports null, keeps the text and empties the submitted value', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<form><DatePicker label="Start date" name="start" defaultValue={march15} invalidMessage="Ngày không hợp lệ" onValueChange={onValueChange} /></form>);
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('start')).toBe('2026-03-15');
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.clear(input);
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(input).toHaveValue('31/02/2026');
    expect(input).toHaveAccessibleDescription('Ngày không hợp lệ');
    expect(new FormData(form).get('start')).toBe('');
  });

  it('forwards inputRef and onBlur to the visible input, after the text is checked', async () => {
    const onBlur = vi.fn();
    const onValueChange = vi.fn();
    let el: HTMLInputElement | null = null;
    render(<DatePicker label="Start date" inputRef={node => { el = node; }} onBlur={onBlur} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    expect(el).toBe(input);
    await userEvent.type(input, '1/4/2026');
    await userEvent.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.invocationCallOrder[0]).toBeLessThan(onBlur.mock.invocationCallOrder[0]!);
  });

  it('opens the calendar from the button on the selected day, picks a day and closes', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Start date" defaultValue={march15} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    const dialog = await screen.findByRole('dialog', { name: 'Choose date' });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(document.activeElement).toHaveAccessibleName('Sunday, 15 March 2026, selected');
    await userEvent.click(screen.getByRole('button', { name: /, 20 March 2026/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 20));
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('20/03/2026');
  });

  it('Alt+ArrowDown opens the calendar; Escape closes it and returns focus to the input', async () => {
    render(<DatePicker label="Start date" defaultValue={march15} />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.click(input);
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await screen.findByRole('dialog', { name: 'Choose date' });
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(input).toHaveValue('16/03/2026');
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(input);
  });

  it('Escape returns focus to the calendar button when it opened the popup', async () => {
    render(<DatePicker label="Start date" />);
    const button = screen.getByRole('button', { name: 'Choose date' });
    await userEvent.click(button);
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('the clear button empties the field', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Start date" defaultValue={march15} clearLabel="Xoá ngày" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Xoá ngày' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Xoá ngày' })).toBeNull();
  });

  it('has no accessibility violations in light and dark, closed and open', async () => {
    await expectAccessibleInThemes(
      <div>
        <DatePicker label="Start date" defaultValue={march15} description="We start billing on this day." />
        <DatePicker label="End date" error="Pick an end date" />
        <DatePicker label="Locked" defaultValue={march15} disabled />
      </div>,
    );
    cleanup();
    await expectOpenAccessibleInThemes(<DatePicker label="Start date" defaultValue={march15} min={new Date(2026, 2, 3)} />, async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
      return screen.findByRole('dialog');
    });
  });
});

describe('DateTimePicker', () => {
  it('combines the date and the time into one Date once both are set', async () => {
    const onValueChange = vi.fn();
    render(<DateTimePicker label="Meeting starts" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Meeting starts' })).toBeVisible();
    await userEvent.type(screen.getByRole('textbox', { name: 'Date' }), '15/03/2026');
    await userEvent.tab();
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.type(screen.getByRole('combobox', { name: 'Time' }), '9:30');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 9, 30));
  });

  it('shows a controlled value and keeps the time when the date changes', async () => {
    const onValueChange = vi.fn();
    render(<DateTimePicker label="Meeting starts" defaultValue={new Date(2026, 2, 15, 14, 45)} onValueChange={onValueChange} />);
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('15/03/2026');
    expect(screen.getByRole('combobox', { name: 'Time' })).toHaveValue('14:45');
    const date = screen.getByRole('textbox', { name: 'Date' });
    await userEvent.clear(date);
    await userEvent.type(date, '16/03/2026{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 16, 14, 45));
  });

  it('on the min and max days the time is limited too; other days have no time limit', async () => {
    const onValueChange = vi.fn();
    render(<DateTimePicker label="Meeting starts" min={new Date(2026, 2, 15, 9, 0)} max={new Date(2026, 2, 20, 17, 0)} step={30} invalidTimeMessage="Giờ không hợp lệ" onValueChange={onValueChange} />);
    const date = screen.getByRole('textbox', { name: 'Date' });
    const time = screen.getByRole('combobox', { name: 'Time' });
    await userEvent.type(date, '15/03/2026');
    await userEvent.tab();
    await userEvent.click(time);
    expect(within(await screen.findByRole('listbox')).getAllByRole('option')[0]).toHaveTextContent('09:00');
    await userEvent.type(time, '8:30');
    await userEvent.tab();
    expect(time).toHaveAttribute('aria-invalid', 'true');
    expect(time).toHaveAccessibleDescription('Giờ không hợp lệ');
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.clear(time);
    await userEvent.type(time, '9:30');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 9, 30));
    // A day in between: any time.
    await userEvent.clear(date);
    await userEvent.type(date, '16/03/2026');
    await userEvent.tab();
    await userEvent.clear(time);
    await userEvent.type(time, '7:00');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 16, 7, 0));
    // The max day: nothing after 17:00.
    await userEvent.clear(date);
    await userEvent.type(date, '20/03/2026');
    await userEvent.tab();
    await userEvent.clear(time);
    await userEvent.type(time, '17:30');
    await userEvent.tab();
    expect(time).toHaveAttribute('aria-invalid', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('a time typed first becomes invalid when the min day is chosen, and reports nothing', async () => {
    const onValueChange = vi.fn();
    render(<DateTimePicker label="Meeting starts" min={new Date(2026, 2, 15, 9, 0)} onValueChange={onValueChange} />);
    const date = screen.getByRole('textbox', { name: 'Date' });
    const time = screen.getByRole('combobox', { name: 'Time' });
    await userEvent.type(time, '8:00');
    await userEvent.tab();
    await userEvent.type(date, '15/03/2026');
    await userEvent.tab();
    expect(time).toHaveAttribute('aria-invalid', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.clear(date);
    await userEvent.type(date, '16/03/2026');
    await userEvent.tab();
    expect(time).not.toHaveAttribute('aria-invalid');
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 16, 8, 0));
  });

  it('submits one yyyy-MM-ddTHH:mm value under name and forwards inputRef to the date input', () => {
    let el: HTMLInputElement | null = null;
    const { container } = render(<form><DateTimePicker label="Meeting starts" name="start" defaultValue={new Date(2026, 2, 15, 14, 45)} inputRef={node => { el = node; }} /></form>);
    const data = new FormData(container.querySelector('form')!);
    expect([...data.entries()]).toEqual([['start', '2026-03-15T14:45']]);
    expect(el).toBe(screen.getByRole('textbox', { name: 'Date' }));
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<DateTimePicker label="Meeting starts" description="Shown in your time zone." defaultValue={new Date(2026, 2, 15, 14, 45)} required />);
  });
});
