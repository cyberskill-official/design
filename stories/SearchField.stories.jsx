import { SearchField } from '../components/forms/SearchField.jsx';

export default {
  title: 'Components/Forms/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting SearchField. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { placeholder: 'Search…' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Placeholders',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <SearchField {...args} placeholder="Components…" />
      <SearchField {...args} placeholder="Templates…" />
    </div>
  ),
};
