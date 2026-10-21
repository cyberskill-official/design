import { Logo } from '../components/logo/Logo.jsx';

export default {
  title: 'Components/Brand/Logo',
  component: Logo,
  tags: ['autodocs'],
  argTypes: {
  "size": {
    "control": "number"
  },
  "title": {
    "control": "text"
  },
  "decorative": {
    "control": "boolean"
  }
},
  args: { size: 40 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Decorative',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Logo {...args} />
      <Logo {...args} decorative />
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Logo {...args} size={24} />
      <Logo {...args} size={40} />
      <Logo {...args} size={56} />
    </div>
  ),
};
