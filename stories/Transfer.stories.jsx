import { Transfer } from '../components/forms/Transfer.jsx';

const ITEMS = [
  { key: '1', label: 'Alpha' },
  { key: '2', label: 'Beta' },
  { key: '3', label: 'Gamma' },
];

export default {
  title: 'Components/Forms/Transfer',
  component: Transfer,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    value: { control: 'object' },
    onChange: { control: false },
    titles: { control: 'object' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Transfer. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { items: ITEMS, value: ['2'], titles: ['Available', 'Selected'] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Lists',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Transfer {...args} items={ITEMS} value={[]} />
      <Transfer {...args} items={ITEMS} value={['1', '2']} />
    </div>
  ),
};
