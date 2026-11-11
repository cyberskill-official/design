import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowClockwise, ArrowCounterClockwise, Copy, FilePlus, Scissors, Trash } from '@phosphor-icons/react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSubmenu, MenubarSubmenuTrigger, MenubarTrigger } from './Menubar';

const onExportPdf = fn();

const meta = {
  title: 'Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  args: { 'aria-label': 'Agent editor' },
  render: args => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<FilePlus />} shortcut="⌘N">New agent</MenubarItem>
          <MenubarItem shortcut="⌘O">Open…</MenubarItem>
          <MenubarSubmenu>
            <MenubarSubmenuTrigger>Export</MenubarSubmenuTrigger>
            <MenubarContent>
              <MenubarItem onClick={onExportPdf}>PDF</MenubarItem>
              <MenubarItem>CSV</MenubarItem>
              <MenubarItem>JSON</MenubarItem>
            </MenubarContent>
          </MenubarSubmenu>
          <MenubarSeparator />
          <MenubarItem icon={<Trash />} tone="danger">Delete agent</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<ArrowCounterClockwise />} shortcut="⌘Z">Undo</MenubarItem>
          <MenubarItem icon={<ArrowClockwise />} shortcut="⇧⌘Z">Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem icon={<Scissors />} shortcut="⌘X">Cut</MenubarItem>
          <MenubarItem icon={<Copy />} shortcut="⌘C">Copy</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘+">Zoom in</MenubarItem>
          <MenubarItem shortcut="⌘−">Zoom out</MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut="⌃⌘F">Full screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu disabled>
        <MenubarTrigger>Help</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  ),
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('menuitem', { name: 'File' }));
    await userEvent.hover(await screen.findByRole('menuitem', { name: 'Export' }));
    const pdf = await screen.findByRole('menuitem', { name: 'PDF' });
    await waitFor(() => expect(getComputedStyle(pdf.closest('[role="menu"]')!).opacity).toBe('1'));
    await userEvent.click(pdf);
    await expect(onExportPdf).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};
