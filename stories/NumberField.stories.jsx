import { NumberField } from '../components/forms/NumberField.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
    label: { control: 'text' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    lang: { control: 'text' },
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
      stateCombos(["disabled","error"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ["disabled","error"]);
        return <NumberField key={label} {...args} disabled={!!state.disabled}  error={state.error ? "Example field error" : undefined}
          />;
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
export const ScenarioNumberFieldError = {
  name: "NumberField: Validation error",
  args: {
  "label": "Quantity",
  "defaultValue": 3,
  "error": "NumberField scenario validation error"
},
  render: args => renderComponentScenario("NumberField--error",args),
  play: ({canvasElement}) => playComponentScenario("NumberField--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
