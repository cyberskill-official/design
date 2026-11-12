import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { expect } from 'vitest';
import { expectNoA11yViolations } from '../test/a11y';

/**
 * Test-only. Renders `ui` with the page in light then dark, opens its popup and runs axe on the field and on the popup.
 * Same split as Popover.test: Base UI's focus-guard spans sit beside the portal and are meant to be hidden and focusable.
 * `open` returns the popup element that fades in.
 */
export async function expectOpenAccessibleInThemes(ui: ReactElement, open: () => Promise<HTMLElement>): Promise<void> {
  for (const theme of ['light', 'dark']) {
    document.documentElement.setAttribute('data-theme', theme);
    const { container, unmount } = render(ui);
    const popup = await open();
    await expect.poll(() => getComputedStyle(popup).opacity).toBe('1'); // contrast after the fade-in
    await expectNoA11yViolations(container);
    await expectNoA11yViolations(popup.closest('[data-base-ui-portal]') ?? popup);
    unmount();
  }
  document.documentElement.removeAttribute('data-theme');
}
