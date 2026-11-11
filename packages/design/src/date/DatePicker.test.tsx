import { cleanup, render, screen } from '@testing-library/react';
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

  it('shows the invalid message for impossible or out-of-range dates and keeps the value', async () => {
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

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<DateTimePicker label="Meeting starts" description="Shown in your time zone." defaultValue={new Date(2026, 2, 15, 14, 45)} required />);
  });
});
