import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Avatar, AvatarGroup } from '../components/data/Avatar.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Data/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
  "src": {
    "control": "text"
  },
  "name": {
    "control": "text"
  },
  "size": {
    "control": "select",
    "options": DECLARED_DOMAINS.Avatar["size"]
  },
  "square": {
    "control": "boolean"
  }
},
  args: { name: 'Stephen Cheng', size: 'md' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Shape',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Avatar {...args} name="A" />
      <Avatar {...args} name="B" square />
      <AvatarGroup>
        <Avatar name="One" />
        <Avatar name="Two" />
      </AvatarGroup>
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar {...args} name="A" size="sm" />
      <Avatar {...args} name="B" size="md" />
      <Avatar {...args} name="C" size="lg" />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / size',
  render: (args) => {
    const cells = cartesian({ size: DECLARED_DOMAINS.Avatar["size"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['size']);
        return (
          <Avatar
            key={label}
            {...args}
            size={combo.size}
          />
        );
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={140}>
        {cells}
      </MatrixGrid>
    );
  },
};
