'use client';
import { ArrowClockwise, ArrowCounterClockwise, Copy, FilePlus, Scissors, Trash } from '@phosphor-icons/react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSubmenu, MenubarSubmenuTrigger, MenubarTrigger } from '@cyberskill/design';

export function EditorMenubar() {
  return (
    <Menubar aria-label="Agent editor">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<FilePlus />} shortcut="⌘N">New agent</MenubarItem>
          <MenubarItem shortcut="⌘O">Open…</MenubarItem>
          <MenubarSubmenu>
            <MenubarSubmenuTrigger>Export</MenubarSubmenuTrigger>
            <MenubarContent>
              <MenubarItem>PDF</MenubarItem>
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
    </Menubar>
  );
}
