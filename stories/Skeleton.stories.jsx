import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Skeleton } from '../components/feedback/Skeleton.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = DECLARED_DOMAINS.Skeleton["variant"];

export default {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
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
    const cells = cartesian({ variant: DECLARED_DOMAINS.Skeleton["variant"] }).flatMap((combo) =>
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
