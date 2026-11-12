import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from './PreviewCard';
import { expectNoA11yViolations } from '../test/a11y';

function Example() {
  return (
    <p>
      Reviewed by{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#lan" delay={0} closeDelay={0}>Nguyễn Thị Lan</PreviewCardTrigger>
        <PreviewCardContent>
          <strong>Nguyễn Thị Lan</strong>
          <span>Support lead · 42 agents reviewed</span>
        </PreviewCardContent>
      </PreviewCard>
      <button type="button">After</button>
    </p>
  );
}

const card = () => screen.queryByText('Support lead · 42 agents reviewed');

describe('PreviewCard', () => {
  it('renders the trigger as a link', () => {
    render(<Example />);
    expect(screen.getByRole('link', { name: 'Nguyễn Thị Lan' })).toHaveAttribute('href', '#lan');
  });

  it('shows the card on hover and hides it when the pointer leaves', async () => {
    render(<Example />);
    await userEvent.hover(screen.getByRole('link', { name: 'Nguyễn Thị Lan' }));
    await expect.poll(card).not.toBeNull();
    await userEvent.hover(screen.getByRole('button', { name: 'After' }));
    await expect.poll(card).toBeNull();
  });

  it('shows the card on keyboard focus; Escape hides it and focus stays on the link', async () => {
    render(<Example />);
    const link = screen.getByRole('link', { name: 'Nguyễn Thị Lan' });
    await userEvent.tab();
    expect(document.activeElement).toBe(link);
    await expect.poll(card).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await expect.poll(card).toBeNull();
    expect(document.activeElement).toBe(link);
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      await userEvent.hover(screen.getByRole('link', { name: 'Nguyễn Thị Lan' }));
      await expect.poll(card).not.toBeNull();
      const popup = card()!.closest<HTMLElement>('.cs-preview-card')!;
      await expect.poll(() => getComputedStyle(popup).opacity).toBe('1');
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(popup);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
