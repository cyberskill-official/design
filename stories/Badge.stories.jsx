import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Badge } from '../components/feedback/Badge.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = DECLARED_DOMAINS.Badge["variant"];

export default {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    dot: {
      control: 'boolean',
    },
  },
  args: { children: 'New' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / All variants',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
      <Badge {...args} variant="ochre" dot>
        dot
      </Badge>
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / variant',
  render: (args) => {
    const cells = cartesian({ variant: DECLARED_DOMAINS.Badge["variant"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['variant']);
        return (
          <Badge
            key={label}
            {...args}
            variant={combo.variant}
          >
            {label}
          </Badge>
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
