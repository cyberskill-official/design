import { Anchor } from '../components/navigation/Anchor.jsx';

export default {
  title: 'Components/Navigation/Anchor',
  component: Anchor,
  tags: ['autodocs'],
  argTypes: {
  "items": {
    "control": "object"
  },
  "title": {
    "control": "object"
  }
},
  args: { items: [{ href: '#a', label: 'Intro' }, { href: '#b', label: 'Tokens' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Anchor {...args} items={[{ href: '#a', label: 'A' }]} />
      <Anchor {...args} items={[{ href: '#a', label: 'A' }, { href: '#b', label: 'B' }, { href: '#c', label: 'C' }]} />
    </div>
  ),
};
