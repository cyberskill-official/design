import { Toggle } from '../components/forms/Toggle.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
  "pressed": {
    "control": "boolean"
  },
  "defaultPressed": {
    "control": "boolean"
  },
  "icon": {
    "control": "object"
  },
  "disabled": {
    "control": "boolean"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Toggle. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { label: 'Notifications', defaultPressed: true },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Pressed',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Toggle {...args} label="Off" defaultPressed={false} />
      <Toggle {...args} label="On" defaultPressed />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <Toggle {...args} />
      <Toggle {...args} disabled />
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
          <Toggle
            key={label}
            {...args}
            disabled={!!state.disabled}
          >
            {label}
          </Toggle>
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
