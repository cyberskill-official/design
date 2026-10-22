import { Spinner } from '../components/feedback/Spinner.jsx';

export default {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
  "size": {
    "control": "number"
  },
  "label": {
    "control": "text"
  }
},
  args: { size: 24 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Labels',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner {...args} label="Loading" />
      <Spinner {...args} label="Saving" />
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner {...args} size={16} />
      <Spinner {...args} size={24} />
      <Spinner {...args} size={32} />
    </div>
  ),
};
