import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowClockwise, ArrowCounterClockwise, Code, Link as LinkIcon, ListBullets, ListNumbers, TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator } from './Toolbar';

function Formatting() {
  const [marks, setMarks] = useState<string[]>(['Bold']);
  const toggle = (m: string) => setMarks(prev => (prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]));
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup aria-label="History">
        <ToolbarButton icon={<ArrowCounterClockwise />} label="Undo" />
        <ToolbarButton icon={<ArrowClockwise />} label="Redo" disabled />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Text style">
        {([['Bold', <TextB key="b" />], ['Italic', <TextItalic key="i" />], ['Underline', <TextUnderline key="u" />], ['Code', <Code key="c" />]] as const).map(([name, icon]) => (
          <ToolbarButton key={name} icon={icon} label={name} aria-pressed={marks.includes(name)} onClick={() => toggle(name)} />
        ))}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Lists">
        <ToolbarButton icon={<ListBullets />} label="Bulleted list" />
        <ToolbarButton icon={<ListNumbers />} label="Numbered list" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton icon={<LinkIcon />}>Insert link</ToolbarButton>
      <ToolbarLink href="#formatting-help">Help</ToolbarLink>
    </Toolbar>
  );
}

const meta = {
  title: 'Structure/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  render: () => <Formatting />,
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const italic = canvas.getByRole('button', { name: 'Italic' });
    await userEvent.click(italic);
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Underline' })).toHaveFocus();
  },
};

export const Vertical: Story = {
  render: () => (
    <Toolbar aria-label="Canvas tools" orientation="vertical">
      <ToolbarButton icon={<TextB />} label="Bold" />
      <ToolbarButton icon={<TextItalic />} label="Italic" />
      <ToolbarSeparator />
      <ToolbarButton icon={<ListBullets />} label="Bulleted list" />
    </Toolbar>
  ),
};
