import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { ContextMenu } from '../components/overlays/ContextMenu.jsx';

export default {
  args: { portal: true, className: '' },
  title: 'Components/Overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.ContextMenu["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },
    tabIndex: { control: 'number', description: 'Zone tab stop; use -1 only with an alternate keyboard route.' },

  "items": {
    "control": "object"
  }
},
};

export const Default = { render: (args = {}) => (<ContextMenu lang={args.lang} tabIndex={args.tabIndex} items={args.items ?? [{ label: 'Copy', onSelect: () => {} }]} {...args} portal={args.portal} placement={args.placement} ><div style={{ padding: 24, border: '1px dashed var(--cs-color-border-default)' }}>Right-click or press Shift+F10</div></ContextMenu>) };

export const Matrix = {
  name: 'Matrix / Items',
  render: (args = {}) => (
    <ContextMenu lang={args.lang} tabIndex={args.tabIndex} items={args.items ?? [{ label: 'Copy', onSelect: () => {} }, { label: 'Paste', onSelect: () => {} }]}>
      <div style={{ padding: 24, border: '1px dashed var(--cs-color-border-default)' }}>Right-click or press Shift+F10</div>
    </ContextMenu>
  ),
};
