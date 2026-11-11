'use client';
import { Archive, CaretDown, Copy, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import { Button, IconButton, Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger } from '@cyberskill/design';

export function ActionsMenu() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" iconEnd={<CaretDown />} />}>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem icon={<PencilSimple />} shortcut="⌘R">Rename</MenuItem>
        <MenuItem icon={<Copy />} shortcut="⌘D">Duplicate</MenuItem>
        <MenuItem icon={<Archive />} disabled>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} tone="danger">Delete agent</MenuItem>
      </MenuContent>
    </Menu>
  );
}

export function ColumnsMenu() {
  return (
    <Menu>
      <MenuTrigger render={<IconButton label="View options" icon={<DotsThree />} />} />
      <MenuContent align="end">
        <MenuGroup>
          <MenuGroupLabel>Columns</MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>Owner</MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked>Last trained</MenuCheckboxItem>
          <MenuCheckboxItem>Cost this month</MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}
