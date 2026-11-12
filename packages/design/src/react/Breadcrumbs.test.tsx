import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';
import { expectAccessibleInThemes } from '../test/a11y';

const items = [
  { label: 'Workspace', href: '/' },
  { label: 'Agents', href: '/agents' },
  { label: 'Support Copilot' },
];

describe('Breadcrumbs', () => {
  it('renders a labelled nav with an ordered list and marks the last crumb as the current page', () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = within(nav).getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(within(nav).getByRole('link', { name: 'Agents' })).toHaveAttribute('href', '/agents');
    expect(within(nav).getByText('Support Copilot')).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('link').every(a => !a.hasAttribute('aria-current'))).toBe(true);
  });

  it('hides the separators from assistive tech and takes a translated label', () => {
    const { container } = render(<Breadcrumbs items={items} label="Đường dẫn" />);
    expect(screen.getByRole('navigation', { name: 'Đường dẫn' })).toBeVisible();
    const separators = container.querySelectorAll('.cs-breadcrumbs-separator');
    expect(separators).toHaveLength(2);
    separators.forEach(s => expect(s).toHaveAttribute('aria-hidden', 'true'));
  });

  it('accepts your own links as children', () => {
    render(
      <Breadcrumbs>
        <a href="/">Workspace</a>
        <a href="/agents/support" aria-current="page">Support Copilot</a>
      </Breadcrumbs>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Support Copilot' })).toHaveAttribute('aria-current', 'page');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Breadcrumbs items={items} />);
  });
});
