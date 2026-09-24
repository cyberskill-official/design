import React from 'react';
import contracts from '../../docs/stable-contracts.json';

const BY_NAME = Object.fromEntries(contracts.components.map((row) => [row.name, row]));

function ContractPage({ name }) {
  const row = BY_NAME[name];
  if (!row) return <article><h1>{name}</h1><p>Missing docs/stable-contracts.json row.</p></article>;
  const sections = [
    ['Anatomy', row.anatomy],
    ['Usage', row.usage],
    ['States', (row.states || []).join(', ') || 'Default host states.'],
    ['Content', row.i18n ? 'Localized via useLang / makeT. Pass lang to override.' : 'Caller-supplied children or label. No baked EN-only chrome besides native host text.'],
    ['Keyboard / AT', [row.keyboard, (row.aria || []).join(', ')].filter(Boolean).join(' ')],
    ['Tokens', (row.tokens || []).join(', ') || 'Semantic roles from @cyberskill/tokens/css.'],
    ['Responsive / RTL / dark / high-contrast', row.responsive || `${row.name} reflows at 320px and 400% zoom.`],
    ['Code', `import { ${row.name} } from "${row.package}";`],
    ['SSR', row.ssr],
    ['Migration', row.deprecation
      ? `Deprecated. Replace with ${row.deprecation.replacement}. Remove after ${row.deprecation.removeAfter}.`
      : 'No breaking change without an RFC and a registry deprecation row.'],
    ['Design status', `${row.maturity} · owner ${row.owner} · backup ${row.backup} · ${row.support} · ${row.package}${row.highRisk ? ' · Phase 2 high-risk AT surface' : ''}`],
  ];
  return (
    <article>
      <h1>{row.name}</h1>
      {sections.map(([title, body]) => (
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
export const Carousel = make('Carousel');
export const Checkbox = make('Checkbox');
export const Combobox = make('Combobox');
export const DataGrid = make('DataGrid');
export const DatePicker = make('DatePicker');
export const Dialog = make('Dialog');
export const Divider = make('Divider');
export const Drawer = make('Drawer');
export const Editor = make('Editor');
export const EmptyState = make('EmptyState');
export const Icon = make('Icon');
export const Image = make('Image');
export const Link = make('Link');
export const Logo = make('Logo');
export const Menu = make('Menu');
export const OverlayProvider = make('OverlayProvider');
export const ProgressBar = make('ProgressBar');
export const RadioGroup = make('RadioGroup');
export const Select = make('Select');
export const Sortable = make('Sortable');
export const Spinner = make('Spinner');
export const Switch = make('Switch');
export const Tabs = make('Tabs');
export const Tag = make('Tag');
export const TextField = make('TextField');
export const Textarea = make('Textarea');
export const TimePicker = make('TimePicker');
export const Toast = make('Toast');
export const Tooltip = make('Tooltip');
