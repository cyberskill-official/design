import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { ProgressBar } from '../components/feedback/ProgressBar.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = DECLARED_DOMAINS.ProgressBar["variant"];

export default {
  title: 'Components/Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

    value: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    label: {
      control: 'text',
    },
  },
  args: { lang: 'vi', value: 45, label: 'Build progress' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / All variants',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <ProgressBar key={variant} {...args} variant={variant} value={45} label={variant} />
      ))}
      <ProgressBar {...args} value={20} label="20%" />
      <ProgressBar {...args} value={80} label="80%" />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / variant',
  render: (args) => {
    const cells = cartesian({ variant: DECLARED_DOMAINS.ProgressBar["variant"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['variant']);
        return (
          <ProgressBar
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
