import React from 'react';

const STABLE = [
  'Alert', 'AlertDialog', 'Avatar', 'AvatarGroup', 'Badge', 'Breadcrumb', 'Button',
  'ButtonGroup', 'Card', 'Checkbox', 'Dialog', 'Divider', 'Drawer', 'EmptyState',
  'Icon', 'Link', 'Logo', 'OverlayProvider', 'ProgressBar', 'RadioGroup', 'Select',
  'Spinner', 'Switch', 'Tabs', 'Tag', 'TextField', 'Textarea', 'Toast', 'Tooltip',
];

const SECTIONS = [
  ['Anatomy', 'Semantic root plus documented slots.'],
  ['Usage', 'Prefer the default variant. See docs/component-contract.md.'],
  ['States', 'Interactive, disabled, and invalid states are in CSF Matrices.'],
  ['Keyboard / AT', 'Focus restoration and live announcements are required for overlays and lists.'],
  ['Tokens', 'Consume semantic roles from tokens/layers.json.'],
  ['Code', 'import { Name } from "@cyberskill/design"'],
  ['SSR', 'Safe on React 18/19. Wrap the tree in ThemeProvider.'],
  ['Migration', 'No breaking change without an RFC and registry deprecation row.'],
  ['Design status', 'Stable · design-system-council · current-and-previous-minor'],
];

function ContractPage({ name }) {
  return (
    <article>
      <h1>{name}</h1>
      {SECTIONS.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
    </article>
  );
}

function make(name) {
  return {
    name,
    render: () => <ContractPage name={name} />,
  };
}

export default {
  title: 'Docs/Stable contracts',
  parameters: { layout: 'padded' },
};

export const Alert = make('Alert');
export const AlertDialog = make('AlertDialog');
export const Avatar = make('Avatar');
export const AvatarGroup = make('AvatarGroup');
export const Badge = make('Badge');
export const Breadcrumb = make('Breadcrumb');
export const Button = make('Button');
export const ButtonGroup = make('ButtonGroup');
export const Card = make('Card');
export const Checkbox = make('Checkbox');
export const Dialog = make('Dialog');
export const Divider = make('Divider');
export const Drawer = make('Drawer');
export const EmptyState = make('EmptyState');
export const Icon = make('Icon');
export const Link = make('Link');
export const Logo = make('Logo');
export const OverlayProvider = make('OverlayProvider');
export const ProgressBar = make('ProgressBar');
export const RadioGroup = make('RadioGroup');
export const Select = make('Select');
export const Spinner = make('Spinner');
export const Switch = make('Switch');
export const Tabs = make('Tabs');
export const Tag = make('Tag');
export const TextField = make('TextField');
export const Textarea = make('Textarea');
export const Toast = make('Toast');
export const Tooltip = make('Tooltip');

void STABLE;
