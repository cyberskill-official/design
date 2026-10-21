import { Dock } from '../components/navigation/Dock.jsx';

export default {
  title: 'Components/Navigation/Dock',
  component: Dock,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "items": {
    "control": "object"
  },
  "label": {
    "control": "text"
  }
},
  args: { items: [{ id: 'home', label: 'Home' }, { id: 'search', label: 'Search' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Dock {...args} items={[{ id: 'home', label: 'Home' }]} />
      <Dock {...args} items={[{ id: 'home', label: 'Home' }, { id: 'search', label: 'Search' }]} />
    </div>
  ),
};
