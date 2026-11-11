'use client';
import { FolderOpen, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { Button, EmptyState } from '@cyberskill/design';

export function EmptyStateDefault() {
  return (
    <EmptyState
      icon={<FolderOpen />}
      title="No projects yet"
      description="Projects hold your agents, their training sources and conversations. Create one to get started."
      action={<Button iconStart={<Plus />}>New project</Button>}
    />
  );
}

export function EmptyStateSearch() {
  return (
    <div style={{ width: 420, maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <EmptyState
        size="sm"
        icon={<MagnifyingGlass />}
        title="No results for “invoice”"
        description="Check the spelling or try a broader search."
        action={<Button variant="secondary" size="sm">Clear search</Button>}
      />
    </div>
  );
}
