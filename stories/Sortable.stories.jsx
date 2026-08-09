import { Sortable } from '../components/data/Sortable.jsx';

export default {
  title: 'Components/Data/Sortable',
  component: Sortable,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    onChange: { control: false },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Sortable (move buttons + DnD). Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
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
