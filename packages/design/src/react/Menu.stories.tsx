import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, CaretDown, Copy, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button, IconButton } from './Button';
import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger } from './Menu';

const onRename = fn();

const meta = {
  title: 'Overlays/Menu',
  component: MenuContent,
  tags: ['autodocs'],
  render: args => (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" iconEnd={<CaretDown />} />}>Actions</MenuTrigger>
      <MenuContent {...args}>
        <MenuItem icon={<PencilSimple />} shortcut="⌘R" onClick={onRename}>Rename</MenuItem>
        <MenuItem icon={<Copy />} shortcut="⌘D">Duplicate</MenuItem>
        <MenuItem icon={<Archive />} disabled>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} tone="danger">Delete agent</MenuItem>
      </MenuContent>
    </Menu>
  ),
} satisfies Meta<typeof MenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1')); // after the fade-in
    await expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: /Duplicate/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{Enter}');
    await expect(onRename).toHaveBeenCalled();
  },
};

export const CheckboxItems: Story = {
  render: args => (
    <Menu>
      <MenuTrigger render={<IconButton label="View options" icon={<DotsThree />} />} />
      <MenuContent {...args} align="end">
        <MenuGroup>
          <MenuGroupLabel>Columns</MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>Owner</MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked>Last trained</MenuCheckboxItem>
          <MenuCheckboxItem>Cost this month</MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'View options' }));
    const item = await screen.findByRole('menuitemcheckbox', { name: 'Cost this month' });
    await expect(item).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(item);
    await expect(item).toHaveAttribute('aria-checked', 'true');
    await waitFor(() => expect(getComputedStyle(screen.getByRole('menu')).opacity).toBe('1'));
  },
};
