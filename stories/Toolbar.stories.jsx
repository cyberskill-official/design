import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Toolbar } from '../components/navigation/Toolbar.jsx';

const ITEMS = [
  { label: 'Bold', onSelect: () => {} },
  { label: 'Italic', onSelect: () => {} },
];

export default {
  title: 'Components/Navigation/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Toolbar["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    items: { control: 'object' },
    overflowAfter: { control: 'number' },
    label: { control: 'text' },
    lang: { control: 'text' },
  },
  args: { portal: true, label: 'Editor tools', items: ITEMS },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Tools',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toolbar {...args} items={ITEMS} />
      <Toolbar
        {...args}
        label="Publish bar"
        items={[
          { label: 'Save', onSelect: () => {} },
          { label: 'Publish', onSelect: () => {} },
        ]}
      />
    </div>
  ),
};
