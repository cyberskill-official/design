import { Select } from '../components/forms/Select.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
  "required": {"control":"boolean"},
    lang: { control: 'select', options: ['en', 'vi'] },

    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    options: { control: 'object' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { lang: 'vi', label: 'Element', options: [{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }], defaultValue: 'tho' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Select {...args} label="Default" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />
      <Select {...args} label="Disabled" disabled options={[{ value: 'a', label: 'A' }]} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <Select {...args} />
      <Select {...args} label="Error" error="Required" />
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
          <Select
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
export const ScenarioSelectError = {
  name: "Select: Validation error",
  args: {
  "label": "Project",
  "options": [
    {
      "value": "a",
      "label": "Alpha"
    },
    {
      "value": "b",
      "label": "Beta"
    }
  ],
  "defaultValue": "a",
  "error": "Select scenario validation error"
},
  render: args => renderComponentScenario("Select--error",args),
  play: ({canvasElement}) => playComponentScenario("Select--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
