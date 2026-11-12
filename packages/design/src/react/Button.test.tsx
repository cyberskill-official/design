import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Sparkle } from '@phosphor-icons/react';
import { Button, ButtonGroup, IconButton } from './Button';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Button', () => {
  it('renders a button with its label and handles clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('loading keeps focus, announces busy and ignores clicks', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Saving</Button>);
    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    button.focus();
    expect(document.activeElement).toBe(button);
    await userEvent.click(button, { force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps a 44px touch target on small buttons', () => {
    render(<Button size="sm">Export</Button>);
    const hit = getComputedStyle(screen.getByRole('button'), '::before');
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
  });

  it('icon-only buttons are named by their label', () => {
    render(<IconButton label="Edit project" icon={<Sparkle />} />);
    expect(screen.getByRole('button', { name: 'Edit project' })).toBeVisible();
  });

  it('soft buttons carry their tone; other variants ignore it', () => {
    render(
      <>
        <Button variant="soft" tone="success">Approve</Button>
        <Button variant="soft">Details</Button>
        <Button variant="primary" tone="danger">Save</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Approve' })).toHaveAttribute('data-tone', 'success');
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('data-tone', 'primary');
    expect(screen.getByRole('button', { name: 'Save' })).not.toHaveAttribute('data-tone');
  });

  it('secondary is a soft ink fill with no outline', () => {
    render(<><Button variant="secondary">Talk to sales</Button><span data-testid="soft" style={{ background: 'var(--primary-soft)' }} /></>);
    const style = getComputedStyle(screen.getByRole('button'));
    expect(style.backgroundColor).toBe(getComputedStyle(screen.getByTestId('soft')).backgroundColor);
    expect(style.borderTopColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div>
        {(['primary', 'secondary', 'ghost', 'quiet', 'accent', 'danger', 'link'] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
        {(['primary', 'accent', 'success', 'warning', 'danger', 'info'] as const).map(t => (
          <Button key={t} variant="soft" tone={t}>{`soft ${t}`}</Button>
        ))}
        <ButtonGroup label="View">
          <Button variant="secondary" aria-pressed="true">List</Button>
          <Button variant="secondary" aria-pressed="false">Board</Button>
        </ButtonGroup>
      </div>,
    );
  });
});
