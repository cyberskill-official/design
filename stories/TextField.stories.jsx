import { TextField } from '../components/textfield/TextField.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
  "required": {"control":"boolean"},
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

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioTextFieldError = {
  name: "TextField: Validation error",
  args: {
  "label": "Name",
  "defaultValue": "Alpha",
  "description": "Reference hint",
  "error": "TextField scenario validation error"
},
  render: args => renderComponentScenario("TextField--error",args),
  play: ({canvasElement}) => playComponentScenario("TextField--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
