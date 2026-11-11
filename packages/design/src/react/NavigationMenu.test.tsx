import axe from 'axe-core';
import { render, screen } from '@testing-library/react';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { ChartBar, Robot } from '@phosphor-icons/react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuLinkCard, NavigationMenuTrigger } from './NavigationMenu';
import { expectNoA11yViolations } from '../test/a11y';

function Example() {
  return (
    <NavigationMenu aria-label="Main">
      <NavigationMenuItem>
        <NavigationMenuTrigger>Product</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLinkCard href="#agents" icon={<Robot />} title="Agents" description="Build and train support agents." active />
          <NavigationMenuLinkCard href="#analytics" icon={<ChartBar />} title="Analytics" description="See what customers ask." />
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#pricing" active>Pricing</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#docs">Docs</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}

// While a panel is open, Base UI puts invisible focus guards (tabindex=0, aria-hidden) beside the trigger and
// the portalled panel to route Tab between them. They hand focus on at once, so only they are left out of axe.
async function expectNoViolationsBesideFocusGuards(node: Element) {
  const { violations } = await axe.run({ include: [node], exclude: [['[data-base-ui-focus-guard]']] }, { resultTypes: ['violations'] });
  expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

const openPanel = async () => {
  const trigger = screen.getByRole('button', { name: 'Product' });
  await userEvent.click(trigger);
  const card = await screen.findByRole('link', { name: /Agents/ });
  const popup = card.closest<HTMLElement>('.cs-navigation-menu-popup')!;
  await expect.poll(() => getComputedStyle(popup).opacity).toBe('1'); // after the fade-in
  return { trigger, card };
};

describe('NavigationMenu', () => {
  it('opens each panel under its own trigger, starting at the trigger, not centred past the header', async () => {
    const { width, height } = { width: window.innerWidth, height: window.innerHeight };
    await page.viewport(1200, 800);
    render(<div style={{ paddingInlineStart: 240 }}><Example /></div>);
    const { trigger, card } = await openPanel();
    const panel = card.closest('.cs-navigation-menu-popup')!.getBoundingClientRect();
    const button = trigger.getBoundingClientRect();
    expect(panel.left).toBeCloseTo(button.left, 0);
    expect(panel.top).toBeCloseTo(button.bottom + 8, 0);
    await page.viewport(width, height);
  });

  it('shifts the panel back into view when there is no room toward the end', async () => {
    const { width, height } = { width: window.innerWidth, height: window.innerHeight };
    await page.viewport(1200, 800);
    render(<div style={{ display: 'flex', justifyContent: 'flex-end', paddingInlineEnd: 160 }}><Example /></div>);
    const { trigger, card } = await openPanel();
    const panel = card.closest('.cs-navigation-menu-popup')!.getBoundingClientRect();
    expect(panel.left).toBeLessThan(trigger.getBoundingClientRect().left);
    expect(panel.right).toBeCloseTo(1200 - 16, 0); // collisionPadding
    await page.viewport(width, height);
  });

  it('renders a labelled nav and marks the current page', () => {
    render(<Example />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('aria-current');
  });

  it('opens a panel of link cards from its trigger; Escape closes and restores focus', async () => {
    render(<Example />);
    const { trigger, card } = await openPanel();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(card).toHaveAccessibleName('Agents Build and train support agents.');
    expect(card).toHaveAttribute('aria-current', 'page');
    trigger.focus();
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('link', { name: /Agents/ })).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('has no accessibility violations with a panel open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      await expectNoA11yViolations(container);
      const { card } = await openPanel();
      await expectNoViolationsBesideFocusGuards(container);
      await expectNoViolationsBesideFocusGuards(card.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
