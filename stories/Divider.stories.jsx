import { Divider } from '../components/data/Divider.jsx';

export default {
  title: 'Components/Data/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    vertical: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Orientation',
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Divider />
      <Divider label="Section" />
      <div style={{ display: 'flex', height: 40, alignItems: 'center', gap: 8 }}>
        <span>A</span>
        <Divider vertical />
        <span>B</span>
      </div>
    </div>
  ),
};
