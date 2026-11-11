import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock, CopyButton } from './CodeBlock';
import { expectAccessibleInThemes } from '../test/a11y';

const install = 'npm install @cyberskill/design';
const long = `export const config = { apiKey: process.env.CYBERSKILL_API_KEY, region: 'ap-southeast-1', retries: 3, timeoutMs: 15000 };`;

describe('CodeBlock', () => {
  let writeText: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  });
  afterEach(() => writeText.mockRestore());

  it('shows the code with its title and language', () => {
    render(<CodeBlock code={install} title="Install" language="bash" />);
    expect(screen.getByText(install).tagName).toBe('CODE');
    expect(screen.getByText('Install')).toBeVisible();
    expect(screen.getByText('bash')).toBeVisible();
  });

  it('copies the code and announces it politely', async () => {
    render(<CodeBlock code={install} language="bash" />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith(install);
    await expect.poll(() => screen.getByRole('status').textContent).toBe('Copied');
  });

  it('takes translated labels', async () => {
    render(<CodeBlock code={install} copyLabel="Sao chép" copiedLabel="Đã sao chép" />);
    await userEvent.click(screen.getByRole('button', { name: 'Sao chép' }));
    await expect.poll(() => screen.getByRole('status').textContent).toBe('Đã sao chép');
  });

  it('long lines scroll sideways and the block is keyboard focusable, unless wrapped', () => {
    const { rerender, container } = render(<div style={{ width: 300 }}><CodeBlock code={long} /></div>);
    const pre = container.querySelector('pre')!;
    expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
    expect(pre).toHaveAttribute('tabindex', '0');
    rerender(<div style={{ width: 300 }}><CodeBlock code={long} wrap /></div>);
    expect(pre.scrollWidth).toBeLessThanOrEqual(pre.clientWidth);
    expect(pre).not.toHaveAttribute('tabindex');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16, width: 360 }}>
        <CodeBlock code={install} title="Install" language="bash" />
        <CodeBlock code={long} language="ts" variant="inverted" />
        <CodeBlock code={long} wrap />
      </div>,
    );
  });
});

describe('CopyButton', () => {
  it('copies any value, calls onCopy and shows a check mark', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const onCopy = vi.fn();
    render(<CopyButton value="acme-prod-01" label="Copy workspace ID" onCopy={onCopy} />);
    const button = screen.getByRole('button', { name: 'Copy workspace ID' });
    await userEvent.click(button);
    expect(writeText).toHaveBeenCalledWith('acme-prod-01');
    await expect.poll(() => onCopy.mock.calls.length).toBe(1);
    expect(button).toHaveAttribute('data-copied');
    writeText.mockRestore();
  });

  it('announces nothing when the clipboard refuses', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    render(<CopyButton value="x" />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await new Promise(r => setTimeout(r, 50));
    expect(screen.getByRole('status').textContent).toBe('');
    writeText.mockRestore();
  });
});
