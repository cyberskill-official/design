import { act, render, screen, within } from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi as mock } from 'vitest';
import { vi } from 'react-day-picker/locale';
import { Calendar } from './Calendar';
import { expectAccessibleInThemes } from '../test/a11y';

const march = new Date(2026, 2, 1);
const today = new Date(2026, 2, 10);

describe('Calendar', () => {
  it('renders a month grid with Monday first and labelled month navigation', () => {
    render(<Calendar mode="single" defaultMonth={march} today={today} />);
    const grid = screen.getByRole('grid', { name: 'March 2026' });
    expect(within(grid).getAllByRole('columnheader', { hidden: true })[0]).toHaveAttribute('aria-label', 'Monday');
    expect(screen.getByRole('button', { name: 'Go to the Previous Month' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Today, Tuesday, 10 March 2026' })).toBeVisible();
  });

  it('selects a day by click and by keyboard', async () => {
    const onSelect = mock.fn();
    render(<Calendar mode="single" defaultMonth={march} today={today} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /20 March 2026/ }));
    expect(onSelect.mock.lastCall?.[0]).toEqual(new Date(2026, 2, 20));
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(onSelect.mock.lastCall?.[0]).toEqual(new Date(2026, 2, 21));
  });

  it('moves between months with the next and previous buttons', async () => {
    render(<Calendar mode="single" defaultMonth={march} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to the Next Month' }));
    expect(screen.getByRole('grid', { name: 'April 2026' })).toBeVisible();
  });

  it('minDate and maxDate disable days outside and stop navigation', () => {
    render(<Calendar mode="single" defaultMonth={march} minDate={new Date(2026, 2, 10)} maxDate={new Date(2026, 2, 25)} />);
    expect(screen.getByRole('button', { name: /, 9 March 2026/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /10 March 2026/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /26 March 2026/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to the Previous Month' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('marks a range with start, middle and end', () => {
    const { container } = render(<Calendar mode="range" defaultMonth={march} selected={{ from: new Date(2026, 2, 3), to: new Date(2026, 2, 6) }} />);
    expect(container.querySelector('[data-day="2026-03-03"]')).toHaveClass('cs-calendar-range-start');
    expect(container.querySelector('[data-day="2026-03-04"]')).toHaveClass('cs-calendar-range-middle');
    expect(container.querySelector('[data-day="2026-03-06"]')).toHaveClass('cs-calendar-range-end');
  });

  it('translates labels with the Vietnamese locale', () => {
    render(<Calendar mode="single" defaultMonth={march} locale={vi} />);
    expect(screen.getByRole('button', { name: 'Đến tháng tiếp theo' })).toBeVisible();
    expect(screen.getByRole('grid')).not.toHaveAccessibleName('March 2026');
  });

  it('shows two months side by side', () => {
    render(<Calendar mode="range" defaultMonth={march} numberOfMonths={2} />);
    expect(screen.getAllByRole('grid').map(g => g.getAttribute('aria-label'))).toEqual(['March 2026', 'April 2026']);
  });

  it('server HTML and the first client render match on another day, then the visitor\'s today is marked', async () => {
    mock.useFakeTimers({ toFake: ['Date'] });
    const errors = mock.spyOn(console, 'error').mockImplementation(() => {});
    const container = document.createElement('div');
    let root: Root | undefined;
    try {
      const ui = <Calendar mode="single" defaultMonth={march} />;
      mock.setSystemTime(new Date(2026, 2, 10, 12)); // the day the page was built
      container.innerHTML = renderToString(ui);
      document.body.append(container);
      expect(container.querySelector('[data-today]')).toBeNull();
      mock.setSystemTime(new Date(2026, 2, 11, 12)); // the visitor opens it a day later
      await act(async () => {
        root = hydrateRoot(container, ui, { onRecoverableError: error => console.error(error) });
      });
      expect(errors.mock.calls.map(c => String(c[0]).slice(0, 400))).toEqual([]);
      expect(container.querySelector('[data-today]')).toHaveAttribute('data-day', '2026-03-11');
    } finally {
      act(() => root?.unmount());
      container.remove();
      errors.mockRestore();
      mock.useRealTimers();
    }
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div>
        <Calendar mode="single" defaultMonth={march} today={today} selected={new Date(2026, 2, 15)} minDate={new Date(2026, 2, 2)} />
        <Calendar mode="range" defaultMonth={march} today={today} selected={{ from: new Date(2026, 2, 3), to: new Date(2026, 2, 12) }} captionLayout="dropdown" />
      </div>,
    );
  });
});
