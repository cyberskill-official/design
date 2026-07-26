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
    items: { control: 'object' },
    overflowAfter: { control: 'number' },
    label: { control: 'text' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Toolbar. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { label: 'Editor tools', items: ITEMS },
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
