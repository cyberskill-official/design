'use client';
import { Archive, ArrowsDownUp, CaretDown, Copy, DotsThree, Gear, PencilSimple, Question, Trash } from '@phosphor-icons/react';
import {
  Button, IconButton, Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuLinkItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger, MenuTrigger,
} from '@cyberskill/design';
import Link from 'next/link';
import { useState } from 'react';

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

export function SubmenuMenu() {
  const [sort, setSort] = useState('updated');
  return (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" iconEnd={<CaretDown />} />}>View</MenuTrigger>
      <MenuContent>
        <MenuSubmenu>
          <MenuSubmenuTrigger icon={<ArrowsDownUp />}>Sort by</MenuSubmenuTrigger>
          <MenuContent>
            <MenuRadioGroup value={sort} onValueChange={setSort}>
              <MenuRadioItem value="name">Name</MenuRadioItem>
              <MenuRadioItem value="updated">Last updated</MenuRadioItem>
              <MenuRadioItem value="cost">Cost this month</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </MenuSubmenu>
        <MenuSeparator />
        <MenuLinkItem icon={<Gear />} render={<Link href="/docs/components/menu" />}>Settings</MenuLinkItem>
        <MenuLinkItem icon={<Question />} href="/docs/components/menu">Help center</MenuLinkItem>
      </MenuContent>
    </Menu>
  );
}
