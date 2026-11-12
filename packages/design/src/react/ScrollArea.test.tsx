import { render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';
import { expectNoA11yViolations } from '../test/a11y';

function Example() {
  return (
    <ScrollArea label="Release notes" style={{ height: 120, width: 240 }}>
      <div style={{ width: 480 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>Version 3.{i}: faster replies, fewer retries and clearer error messages in the dashboard.</p>
        ))}
      </div>
    </ScrollArea>
  );
}

describe('ScrollArea', () => {
  it('renders a named region that becomes a Tab stop once its content overflows', async () => {
    render(<Example />);
    const region = screen.getByRole('region', { name: 'Release notes' });
    await expect.poll(() => region.getAttribute('tabindex')).toBe('0');
  });

  it('is not a Tab stop when nothing overflows', async () => {
    render(<ScrollArea label="Short list" style={{ height: 200 }}><p>One line.</p></ScrollArea>);
    const region = screen.getByRole('region', { name: 'Short list' });
    await new Promise(r => setTimeout(r, 100));
    expect(region).toHaveAttribute('tabindex', '-1');
  });

  it('scrolls with the keyboard on both axes', async () => {
    render(<Example />);
    const region = screen.getByRole('region', { name: 'Release notes' });
    await expect.poll(() => region.getAttribute('tabindex')).toBe('0');
    region.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}{ArrowRight}');
    await expect.poll(() => region.scrollTop).toBeGreaterThan(0);
    await expect.poll(() => region.scrollLeft).toBeGreaterThan(0);
  });

  it('shows both scrollbars when the content overflows', async () => {
    const { container } = render(<Example />);
    await expect.poll(() => container.querySelectorAll('.cs-scroll-area-scrollbar').length).toBe(2);
  });

  it('has no accessibility violations in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      const host = document.createElement('div');
      host.setAttribute('data-theme', theme);
      document.body.appendChild(host);
      render(<Example />, { container: host });
      // Base UI measures the overflow after mount, then makes the region focusable.
      await expect.poll(() => within(host).getByRole('region').getAttribute('tabindex')).toBe('0');
      await expectNoA11yViolations(host);
    }
  });
});
