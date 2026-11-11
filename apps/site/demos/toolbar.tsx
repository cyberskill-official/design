'use client';
import { ArrowClockwise, ArrowCounterClockwise, Code, Link as LinkIcon, ListBullets, ListNumbers, TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator } from '@cyberskill/design';
import { useState } from 'react';

const marks = [
  ['Bold', <TextB key="b" />],
  ['Italic', <TextItalic key="i" />],
  ['Underline', <TextUnderline key="u" />],
  ['Code', <Code key="c" />],
] as const;

export function ToolbarDemo() {
  const [active, setActive] = useState<string[]>(['Bold']);
  const toggle = (m: string) => setActive((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup aria-label="History">
        <ToolbarButton icon={<ArrowCounterClockwise />} label="Undo" />
        <ToolbarButton icon={<ArrowClockwise />} label="Redo" disabled />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Text style">
        {marks.map(([name, icon]) => (
          <ToolbarButton key={name} icon={icon} label={name} aria-pressed={active.includes(name)} onClick={() => toggle(name)} />
        ))}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Lists">
        <ToolbarButton icon={<ListBullets />} label="Bulleted list" />
        <ToolbarButton icon={<ListNumbers />} label="Numbered list" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton icon={<LinkIcon />}>Insert link</ToolbarButton>
      <ToolbarLink href="#accessibility">Help</ToolbarLink>
    </Toolbar>
  );
}

export function ToolbarVertical() {
  return (
    <Toolbar aria-label="Canvas tools" orientation="vertical">
      <ToolbarButton icon={<TextB />} label="Bold" />
      <ToolbarButton icon={<TextItalic />} label="Italic" />
      <ToolbarSeparator />
      <ToolbarButton icon={<ListBullets />} label="Bulleted list" />
    </Toolbar>
  );
}
