import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator } from './Toolbar';
import { expectAccessibleInThemes } from '../test/a11y';

function Example({ onBold }: { onBold?: () => void }) {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup aria-label="Style">
        <ToolbarButton icon={<TextB />} label="Bold" aria-pressed="true" onClick={onBold} />
        <ToolbarButton icon={<TextItalic />} label="Italic" aria-pressed="false" />
        <ToolbarButton icon={<TextUnderline />} label="Underline" disabled />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton>Insert link</ToolbarButton>
      <ToolbarLink href="#help">Help</ToolbarLink>
    </Toolbar>
  );
}

describe('Toolbar', () => {
  it('renders a named toolbar with labelled icon buttons and a link', () => {
    render(<Example />);
    expect(screen.getByRole('toolbar', { name: 'Text formatting' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Insert link' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Help' })).toBeVisible();
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('is one Tab stop and arrow keys move focus, including onto disabled buttons', async () => {
    const onBold = vi.fn();
    render(
      <>
        <button type="button">Before</button>
        <Example onBold={onBold} />
      </>,
    );
    screen.getByRole('button', { name: 'Before' }).focus();
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Bold' }));
    await userEvent.keyboard('{Enter}');
    expect(onBold).toHaveBeenCalledOnce();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    const underline = screen.getByRole('button', { name: 'Underline' });
    expect(document.activeElement).toBe(underline);
    expect(underline).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Help' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Bold' }));
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Example />);
  });
});
