import { InputGroup } from '../components/forms/InputGroup.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    clearable: { control: 'boolean' },
    password: { control: 'boolean' },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    onChange: { control: false },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting InputGroup. Portable consumers use styles.css + bundle, not Storybook. Prefix/suffix addons, clearable ×, and password reveal — not a TextField wrapper.',
      },
    },
  },
  args: {
    label: 'Amount',
    prefix: '₫',
    defaultValue: '100',
    placeholder: '0',
    clearable: true,
    lang: 'en',
  },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Addons',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <InputGroup {...args} label="Amount" prefix="₫" defaultValue="100" clearable />
      <InputGroup {...args} label="Domain" suffix=".cyberskill.world" defaultValue="app" />
      <InputGroup {...args} label="Password" password defaultValue="secret" />
      <InputGroup {...args} label="Disabled" defaultValue="100" disabled />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <InputGroup label="Amount" placeholder="Amount" defaultValue="100" />
      <InputGroup label="Amount" placeholder="Amount" defaultValue="100" disabled />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: () => {
    const cells = cartesian({}).flatMap((combo) =>
      stateCombos(['disabled']).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled']);
        return (
          <InputGroup
            key={label}
            label={label || 'Amount'}
            placeholder="Amount"
            defaultValue="100"
            disabled={!!state.disabled}
          />
        );
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={200}>
        {cells}
      </MatrixGrid>
    );
  },
};
