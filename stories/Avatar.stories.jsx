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
    "options": [
      "sm",
      "md",
      "lg"
    ]
  },
  "square": {
    "control": "boolean"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Avatar. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
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
    const cells = cartesian({ size: ["sm","md","lg"] }).flatMap((combo) =>
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
