'use client';
import { Copy, DotsThree, DownloadSimple, PencilSimple, Trash } from '@phosphor-icons/react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@cyberskill/design';

const area = {
  display: 'grid',
  placeItems: 'center',
  gap: 4,
  width: 'min(100%, 360px)',
  height: 160,
  border: '1px dashed var(--input)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--panel)',
  color: 'var(--muted)',
  font: '500 14px/20px var(--font-sans)',
  textAlign: 'center',
} as const;

export function AreaContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger style={area}>
        <DotsThree size={20} aria-hidden="true" />
        Right-click or long-press here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<PencilSimple />} shortcut="⌘R">Rename</ContextMenuItem>
        <ContextMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</ContextMenuItem>
        <ContextMenuItem icon={<DownloadSimple />} disabled>Export transcript</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<Trash />} shortcut="⌫" tone="danger">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
