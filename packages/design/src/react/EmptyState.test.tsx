import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { FolderOpen, MagnifyingGlass } from '@phosphor-icons/react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { expectAccessibleInThemes } from '../test/a11y';

describe('EmptyState', () => {
  it('renders a heading at the chosen level, description and action', async () => {
    const onCreate = vi.fn();
    render(
      <EmptyState
        icon={<FolderOpen />}
        title="No projects yet"
        description="Create a project to start training an agent."
        action={<Button onClick={onCreate}>New project</Button>}
        headingLevel={2}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'No projects yet' })).toBeVisible();
    expect(screen.getByText('Create a project to start training an agent.')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'New project' }));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div>
        <EmptyState icon={<FolderOpen />} title="No projects yet" description="Create a project to start." action={<Button>New project</Button>} headingLevel={2} />
        <EmptyState size="sm" icon={<MagnifyingGlass />} title="No results for “invoice”" description="Try a different search." headingLevel={3} />
      </div>,
    );
  });
});
