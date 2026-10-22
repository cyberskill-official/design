import { Sortable } from '../components/data/Sortable.jsx';

export default {
  title: 'Components/Data/Sortable',
  component: Sortable,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    items: { control: 'object' },
    onChange: { control: false },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  args: { items: [{ key: 'a', label: 'Alpha' }, { key: 'b', label: 'Beta' }], lang: 'en' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Sortable {...args} items={[{ key: 'a', label: 'Alpha' }]} />
      <Sortable {...args} items={[{ key: 'a', label: 'Alpha' }, { key: 'b', label: 'Beta' }, { key: 'c', label: 'Gamma' }]} />
    </div>
  ),
};
