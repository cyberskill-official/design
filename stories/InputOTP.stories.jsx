import { InputOTP } from '../components/forms/InputOTP.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
  "length": {
    "control": "number"
  },
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": false
  },
  "onComplete": {
    "control": false
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
      stateCombos(["disabled","error"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ["disabled","error"]);
        return (
          <InputOTP
            key={label}
            {...args}
            disabled={!!state.disabled}
           error={state.error ? "Example field error" : undefined}
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
export const ScenarioInputOTPError = {
  name: "InputOTP: Validation error",
  args: {
  "length": 4,
  "value": "1234",
  "label": "Verification",
  "error": "InputOTP scenario validation error"
},
  render: args => renderComponentScenario("InputOTP--error",args),
  play: ({canvasElement}) => playComponentScenario("InputOTP--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
