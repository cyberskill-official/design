import { NumberField } from '../components/forms/NumberField.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting NumberField. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { label: 'Quantity', min: 0, step: 1 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Bounds',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 240 }}>
      <NumberField {...args} label="Min0" min={0} value={0} />
      <NumberField {...args} label="Max10" min={0} max={10} value={10} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <NumberField {...args} />
      <NumberField {...args} disabled />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: (args) => {
    const cells = cartesian({}).flatMap((combo) =>
      stateCombos(['disabled']).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled']);
        return <NumberField key={label} {...args} disabled={!!state.disabled} />;
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={140}>
        {cells}
      </MatrixGrid>
    );
  },
};
