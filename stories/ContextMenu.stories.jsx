import { ContextMenu } from '../components/overlays/ContextMenu.jsx';

export default {
  title: 'Components/Overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },
    tabIndex: { control: 'number', description: 'Zone tab stop; use -1 only with an alternate keyboard route.' },

  "items": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting ContextMenu. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: (args = {}) => (<ContextMenu lang={args.lang} tabIndex={args.tabIndex} items={args.items ?? [{ label: 'Copy', onSelect: () => {} }]}><div style={{ padding: 24, border: '1px dashed var(--cs-color-border-default)' }}>Right-click or press Shift+F10</div></ContextMenu>) };

export const Matrix = {
  name: 'Matrix / Items',
  render: (args = {}) => (
    <ContextMenu lang={args.lang} tabIndex={args.tabIndex} items={args.items ?? [{ label: 'Copy', onSelect: () => {} }, { label: 'Paste', onSelect: () => {} }]}>
      <div style={{ padding: 24, border: '1px dashed var(--cs-color-border-default)' }}>Right-click or press Shift+F10</div>
    </ContextMenu>
  ),
};
