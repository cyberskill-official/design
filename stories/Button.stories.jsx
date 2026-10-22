import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Button } from '../components/button/Button.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = DECLARED_DOMAINS.Button["variant"];
const SIZES = DECLARED_DOMAINS.Button["size"];
const STATE_KEYS = ['loading', 'disabled'];

export default {
  title: 'Components/Button/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    size: {
      control: 'select',
      options: SIZES,
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    icon: {
      control: 'object',
    },
    type: {
      control: 'text',
    },
  },
  args: { children: 'Make a wish', variant: 'primary', size: 'md' },
};

export const Default = {};

export const AllVariants = {
  name: 'Matrix / All variants',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button {...args}>default</Button>
      <Button {...args} loading>
        loading
      </Button>
      <Button {...args} disabled>
        disabled
      </Button>
    </div>
  ),
};

/** Exhaustive size × variant × key-state product (closes the old N-dim non-goal). */
export const FullMatrix = {
  name: 'Full matrix / size × variant × state',
  render: (args) => {
    const cells = cartesian({ size: SIZES, variant: VARIANTS }).flatMap((combo) =>
      stateCombos(STATE_KEYS).map((state) => {
        const props = { size: combo.size, variant: combo.variant, ...state };
        const label = comboLabel(props, ['variant', 'size', 'loading', 'disabled']);
        return (
          <Button
            key={label}
            {...args}
            size={combo.size}
            variant={combo.variant}
            loading={!!state.loading}
            disabled={!!state.disabled}
          >
            {label}
          </Button>
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
