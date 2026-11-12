import { act, cleanup, render, screen, within } from '@testing-library/react';
import { useState, type ReactElement } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';
import { DateTimePicker } from './DateTimePicker';
import { expectAccessibleInThemes } from '../test/a11y';
import { expectOpenAccessibleInThemes } from './test-helpers';

const march15 = new Date(2026, 2, 15);

/** Server-renders `ui` into the page, checks it, hydrates it and checks again; fails on any hydration error. */
async function serverThenHydrate(ui: ReactElement, onServer: (container: HTMLElement) => void, onClient: (container: HTMLElement) => void) {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  let root: Root | undefined;
  try {
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    onServer(container);
    await act(async () => {
      root = hydrateRoot(container, ui, { onRecoverableError: error => console.error(error) });
    });
    expect(errors.mock.calls.map(c => String(c[0]).slice(0, 400))).toEqual([]);
    onClient(container);
  } finally {
    act(() => root?.unmount());
    container.remove();
    errors.mockRestore();
  }
}

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

  it('an outside value change replaces invalid typed text and clears the error', async () => {
    const { rerender } = render(<DatePicker label="Start date" value={null} />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.type(input, '32/13/2026');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    rerender(<DatePicker label="Start date" value={new Date(2026, 0, 1)} />);
    expect(input).toHaveValue('01/01/2026');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('a controlled value reset to undefined (React Hook Form reset()) empties the field and the submitted value', async () => {
    const ui = (value?: Date | null) => <form><DatePicker label="Start date" name="start" value={value} /></form>;
    const { container, rerender } = render(ui(march15));
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.clear(input);
    await userEvent.type(input, '20/03/2026');
    await userEvent.tab(); // picked, but the parent never stored it
    rerender(ui(undefined));
    expect(input).toHaveValue('');
    expect(new FormData(container.querySelector('form')!).get('start')).toBe('');
  });

  it('a controlled reset to undefined after invalid text (React Hook Form reset()) drops the text and the error', async () => {
    function Form() {
      const [value, setValue] = useState<Date | null | undefined>(march15);
      return (
        <>
          <DatePicker label="Start date" value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue(undefined)}>Reset</button>
        </>
      );
    }
    render(<Form />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.clear(input);
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    expect(input).toHaveValue('31/02/2026'); // its own invalid commit (null) keeps the text
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('a form reset drops invalid typed text and its error', async () => {
    render(<form><DatePicker label="Start date" /><button type="reset">Reset</button></form>);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await expect.poll(() => (input as HTMLInputElement).value).toBe('');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('server HTML carries no date text (the server may be in another time zone); it shows once hydrated', async () => {
    const form = (c: HTMLElement) => new FormData(c.querySelector('form')!);
    await serverThenHydrate(
      <form><DatePicker label="Start date" name="start" defaultValue={march15} /></form>,
      c => {
        expect(c.querySelector('input:not([type="hidden"])')).toHaveValue('');
        expect(form(c).get('start')).toBe('');
      },
      c => {
        expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('15/03/2026');
        expect(form(c).get('start')).toBe('2026-03-15');
      },
    );
  });

  it('passes labels to the calendar', async () => {
    render(<DatePicker label="Start date" defaultValue={march15} labels={{ labelDayButton: (date, m) => `Ngày ${date.getDate()}${m.selected ? ', đã chọn' : ''}` }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    await screen.findByRole('dialog');
    expect(document.activeElement).toHaveAccessibleName('Ngày 15, đã chọn');
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

  it('a form reset drops a half-filled date', async () => {
    render(<form><DateTimePicker label="Meeting starts" /><button type="reset">Reset</button></form>);
    const date = screen.getByRole('textbox', { name: 'Date' });
    await userEvent.type(date, '15/03/2026');
    await userEvent.tab();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await expect.poll(() => (date as HTMLInputElement).value).toBe('');
  });

  it('a controlled reset to undefined (React Hook Form reset()) drops a half-filled date and invalid time text', async () => {
    function Form() {
      const [value, setValue] = useState<Date | null | undefined>(null);
      return (
        <>
          <DateTimePicker label="Meeting starts" value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue(undefined)}>Reset</button>
        </>
      );
    }
    render(<Form />);
    const date = screen.getByRole('textbox', { name: 'Date' });
    const time = screen.getByRole('combobox', { name: 'Time' });
    await userEvent.type(date, '15/03/2026');
    await userEvent.tab();
    await userEvent.type(time, '25:00');
    await userEvent.tab();
    expect(time).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: 'Time' })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: 'Time' })).not.toHaveAttribute('aria-invalid');
  });

  it('server HTML carries no time text (the server may be in another time zone); it shows once hydrated', async () => {
    await serverThenHydrate(
      <form><DateTimePicker label="Meeting starts" name="start" defaultValue={new Date(2026, 2, 15, 14, 45)} /></form>,
      c => {
        expect([...c.querySelectorAll<HTMLInputElement>('input.cs-input')].map(i => i.value)).toEqual(['', '']); // date, time
        expect(new FormData(c.querySelector('form')!).get('start')).toBe('');
      },
      c => {
        expect(screen.getByRole('combobox', { name: 'Time' })).toHaveValue('14:45');
        expect(new FormData(c.querySelector('form')!).get('start')).toBe('2026-03-15T14:45');
      },
    );
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
