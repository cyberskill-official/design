import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, DownloadSimple, PencilSimple, Trash } from '@phosphor-icons/react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from './ContextMenu';

const onRename = fn();

const area = {
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  maxWidth: 320,
  height: 160,
  border: '1px dashed var(--input)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--panel)',
  color: 'var(--muted)',
  font: '500 14px/20px var(--font-sans)',
} as const;

const meta = {
  title: 'Overlays/ContextMenu',
  component: ContextMenuContent,
  tags: ['autodocs'],
  render: args => (
    <ContextMenu>
      <ContextMenuTrigger style={area}>Right-click or long-press here</ContextMenuTrigger>
      <ContextMenuContent {...args}>
        <ContextMenuItem icon={<PencilSimple />} shortcut="⌘R" onClick={onRename}>Rename</ContextMenuItem>
        <ContextMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</ContextMenuItem>
        <ContextMenuItem icon={<DownloadSimple />} disabled>Export transcript</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<Trash />} shortcut="⌫" tone="danger">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
} satisfies Meta<typeof ContextMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.pointer({ keys: '[MouseRight]', target: within(canvasElement).getByText('Right-click or long-press here') });
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1')); // after the fade-in
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(onRename).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};
