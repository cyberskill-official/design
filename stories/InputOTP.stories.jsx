import { InputOTP } from '../components/forms/InputOTP.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
  "length": {
    "control": "number"
  },
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": "text"
  },
  "onComplete": {
    "control": "text"
  },
  "label": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  },
  "disabled": {
    "control": "boolean"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting InputOTP. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { length: 6, label: 'One-time code' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Length',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <InputOTP {...args} length={4} label="4-digit" />
      <InputOTP {...args} length={6} label="6-digit" />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <InputOTP {...args} />
      <InputOTP {...args} disabled />
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
          <InputOTP
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
