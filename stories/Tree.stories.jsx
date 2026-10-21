import { Tree } from '../components/data/Tree.jsx';

const NODES = [{ key: '1', label: 'Design system', children: [{ key: '1a', label: 'Tokens' }] }];

export default {
  title: 'Components/Data/Tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    nodes: { control: 'object' },
    selected: { control: 'text' },
    onSelect: { control: false },
    defaultOpen: { control: 'boolean' },
  },
  args: { nodes: NODES, defaultOpen: true, "aria-label": "Design system navigation" },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Depth',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Tree {...args} nodes={[{ key: '1', label: 'Root' }]} />
      <Tree {...args} nodes={NODES} defaultOpen />
    </div>
  ),
};
