import { Icon } from '../components/icon/Icon.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Brand/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
  "size": {
    "control": "select",
    "options": [
      "sm",
      "md",
      "lg"
    ]
  },
  "label": {
    "control": "text"
  },
  "strokeWidth": {
    "control": "number"
  },
  "name": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Icon. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { name: 'sparkle', size: 'md' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Names',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon {...args} name="sparkle" />
      <Icon {...args} name="check" />
      <Icon {...args} name="close" />
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon {...args} name="sparkle" size="sm" />
      <Icon {...args} name="sparkle" size="md" />
      <Icon {...args} name="sparkle" size="lg" />
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
          <Icon
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
