import { TextField } from '../components/textfield/TextField.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
  "label": {
    "control": "object"
  },
  "description": {
    "control": "object"
  },
  "error": {
    "control": "object"
  },
  "disabled": {
    "control": "boolean"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting TextField. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { label: 'Work email', placeholder: 'you@cyberskill.world' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <TextField {...args} label="Default" />
      <TextField {...args} label="Error" error="Required" />
      <TextField {...args} label="Disabled" disabled />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: (args) => {
    const cells = cartesian({  }).flatMap((combo) =>
      stateCombos(["disabled","error"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled', 'error']);
        return (
          <TextField
            key={label}
            {...args}
            disabled={!!state.disabled}
            error={state.error ? 'Required' : undefined}
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
