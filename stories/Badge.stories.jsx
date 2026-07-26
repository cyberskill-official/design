import { Badge } from '../components/feedback/Badge.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = ['neutral', 'solid', 'ochre', 'success', 'danger', 'warning', 'info'];

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
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus exhaustive variant matrix mounting Badge. Portable consumers use styles.css + bundle, not Storybook.',
      },
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
    const cells = cartesian({ variant: ["neutral","solid","ochre","success","danger","warning","info"] }).flatMap((combo) =>
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
