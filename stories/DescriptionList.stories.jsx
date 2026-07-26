import { DescriptionList } from '../components/data/DescriptionList.jsx';

export default {
  title: 'Components/Data/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting DescriptionList. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { items: [{ term: 'Element', value: 'Thổ · studio' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DescriptionList {...args} items={[{ term: 'A', value: '1' }]} />
      <DescriptionList {...args} items={[{ term: 'A', value: '1' }, { term: 'B', value: '2' }]} />
    </div>
  ),
};
