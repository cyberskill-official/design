import { Breadcrumb } from '../components/navigation/Breadcrumb.jsx';

export default {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
  "items": {
    "control": "object"
  }
},
  args: { items: [{ href: '#', label: 'Home' }, { label: 'Button' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Depth',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Breadcrumb {...args} items={[{ href: '#', label: 'Home' }, { label: 'Here' }]} />
      <Breadcrumb {...args} items={[{ href: '#', label: 'Home' }, { href: '#', label: 'Components' }, { label: 'Breadcrumb' }]} />
    </div>
  ),
};
