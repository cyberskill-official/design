import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderOpen, MagnifyingGlass, Plus, Tray } from '@phosphor-icons/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <FolderOpen />,
    title: 'No projects yet',
    description: 'Projects hold your agents, their training sources and conversations. Create one to get started.',
    headingLevel: 2,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

const onCreate = fn();

export const WithAction: Story = {
  args: { action: <Button iconStart={<Plus />} onClick={onCreate}>New project</Button> },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'New project' }));
    await expect(onCreate).toHaveBeenCalled();
  },
};

export const NoResults: Story = {
  args: {
    size: 'sm',
    icon: <MagnifyingGlass />,
    title: 'No results for “invoice”',
    description: 'Check the spelling or try a broader search.',
    action: <Button variant="secondary" size="sm">Clear search</Button>,
  },
};

export const FullPage: Story = {
  args: {
    size: 'lg',
    icon: <Tray />,
    title: 'Inbox zero',
    description: 'New conversations that need a person appear here.',
    headingLevel: 1,
  },
};
