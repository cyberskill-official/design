import { LumiAvatar } from '../components/brand/LumiAvatar.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Brand/LumiAvatar',
  component: LumiAvatar,
  tags: ['autodocs'],
  argTypes: {
  "src": {
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
  "ring": {
    "control": "boolean"
  },
  "alt": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting LumiAvatar. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { size: 'md' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Ring',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <LumiAvatar {...args} />
      <LumiAvatar {...args} ring />
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <LumiAvatar {...args} size="sm" />
      <LumiAvatar {...args} size="md" />
      <LumiAvatar {...args} size="lg" />
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
          <LumiAvatar
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
