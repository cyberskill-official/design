import { render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { ChatCircle, Database, House, Robot } from '@phosphor-icons/react';
import { SideNav, SideNavGroup, SideNavItem } from './SideNav';
import { expectAccessibleInThemes } from '../test/a11y';

function Example() {
  return (
    <SideNav label="Main">
      <SideNavItem href="#overview" icon={<House />}>Overview</SideNavItem>
      <SideNavGroup label="Build">
        <SideNavItem href="#agents" icon={<Robot />} active>Agents</SideNavItem>
        <SideNavItem href="#sources" icon={<Database />}>Sources</SideNavItem>
        <SideNavItem href="#inbox" icon={<ChatCircle />} badge={12}>Inbox</SideNavItem>
      </SideNavGroup>
    </SideNav>
  );
}

describe('SideNav', () => {
  it('renders a labelled nav of links with the active one marked as the current page', () => {
    render(<Example />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getAllByRole('link')).toHaveLength(4);
    expect(within(nav).getByRole('link', { name: 'Agents' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
    expect(within(nav).getByRole('link', { name: 'Inbox 12' })).toHaveAttribute('href', '#inbox');
  });

  it('groups name their list after the visible heading', () => {
    render(<Example />);
    const group = screen.getByRole('list', { name: 'Build' });
    expect(within(group).getAllByRole('listitem')).toHaveLength(3);
  });

  it('styles the active item with primary text on primary-soft', () => {
    render(<Example />);
    const active = getComputedStyle(screen.getByRole('link', { name: 'Agents' }));
    const plain = getComputedStyle(screen.getByRole('link', { name: 'Sources' }));
    expect(active.backgroundColor).not.toBe(plain.backgroundColor);
    expect(active.color).not.toBe(plain.color);
  });

  it('renders through `render` for router links, keeping props and handlers', async () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    function RouterLink(props: React.ComponentProps<'a'>) {
      return <a data-router="" {...props} />;
    }
    render(
      <SideNav label="Main">
        <SideNavItem render={<RouterLink href="#agents" />} active onClick={onClick}>Agents</SideNavItem>
      </SideNav>,
    );
    const link = screen.getByRole('link', { name: 'Agents' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('cs-side-nav-item');
    await userEvent.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('draws the count badge in gold, on the current page too', () => {
    render(
      <>
        <SideNav label="Main">
          <SideNavItem href="#inbox" badge={12}>Inbox</SideNavItem>
          <SideNavItem href="#alerts" badge={3} active>Alerts</SideNavItem>
        </SideNav>
        <span data-testid="probe" style={{ background: 'var(--accent)' }} />
      </>,
    );
    const gold = getComputedStyle(screen.getByTestId('probe')).backgroundColor;
    expect(getComputedStyle(screen.getByText('12')).backgroundColor).toBe(gold);
    expect(getComputedStyle(screen.getByText('3')).backgroundColor).toBe(gold);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <>
        <Example />
        <SideNav label="Secondary">
          <SideNavItem href="#alerts" badge={3} active>Alerts</SideNavItem>
        </SideNav>
      </>,
    );
  });
});
