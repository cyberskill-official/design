import { Skeleton } from '../components/feedback/Skeleton.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = ['block', 'circle'];

export default {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    width: {
      control: 'number',
    },
    height: {
      control: 'number',
    },
    lines: {
      control: 'number',
    },
    radius: {
      control: 'number',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus exhaustive variant matrix mounting Skeleton. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { width: 200, height: 16 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / All variants',
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Skeleton {...args} variant="block" width={120} height={12} />
      <Skeleton {...args} variant="block" width={240} height={16} />
      <Skeleton {...args} variant="circle" width={40} height={40} />
      <Skeleton {...args} lines={3} />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / variant',
  render: (args) => {
    const cells = cartesian({ variant: ["block","circle"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['variant']);
        return (
          <Skeleton
            key={label}
            {...args}
            variant={combo.variant}
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
