import { SearchField } from '../components/forms/SearchField.jsx';

export default {
  title: 'Components/Forms/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  argTypes: {
  "required": {"control":"boolean"},
    value: { control: 'text' },
    placeholder: { control: 'text' },
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
