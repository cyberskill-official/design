import { Checkbox } from '../components/forms/Checkbox.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
  "required": {"control":"boolean"},
  "label": {
    "control": "object"
  },
  "description": {
    "control": "object"
  },
  "disabled": {
    "control": "boolean"
  }
},
  args: { label: 'Remember this wish', defaultChecked: true },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Checkbox {...args} label="Off" />
      <Checkbox {...args} label="On" defaultChecked />
      <Checkbox {...args} label="Disabled" disabled />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: (args) => {
    const cells = cartesian({  }).flatMap((combo) =>
      stateCombos(["disabled"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled']);
        return (
          <Checkbox
            key={label}
            {...args}
            disabled={!!state.disabled}
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
