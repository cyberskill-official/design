import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd } from './Kbd';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Kbd', () => {
  it('renders keys as kbd elements in the mono font with a heavier bottom edge', () => {
    render(<p>Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to search</p>);
    const key = screen.getByText('K');
    expect(key.tagName).toBe('KBD');
    const style = getComputedStyle(key);
    expect(style.fontFamily).toContain('JetBrains Mono');
    expect(style.borderBottomWidth).toBe('2px');
    expect(style.borderTopWidth).toBe('1px');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<p>Press <Kbd>⌘</Kbd><Kbd>K</Kbd> or <Kbd>Ctrl</Kbd><Kbd>K</Kbd> to search</p>);
  });
});
