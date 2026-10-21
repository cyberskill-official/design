import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { DatePicker } from '../components/forms/DatePicker.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.DatePicker["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": false
  },
  "placeholder": {
    "control": "text"
  },
  "label": {
    "control": "text"
  },
  "disabled": {
    "control": "boolean"
  },
  "lang": {
    "control": "text"
  }
},
  args: { portal: true, label: 'Due date' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Labels',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <DatePicker {...args} label="Start" />
      <DatePicker {...args} label="Due" />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <DatePicker {...args} />
      <DatePicker {...args} disabled />
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
          <DatePicker
            key={label}
            {...args}
            disabled={!!state.disabled}
           error={state.error ? "Example field error" : undefined}
           portal={args.portal} placement={args.placement} />
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
export const ScenarioDatePickerError = {
  name: "DatePicker: Validation error",
  args: {
  "value": "2026-10-20",
  "label": "Date",
  "error": "DatePicker scenario validation error"
},
  render: args => renderComponentScenario("DatePicker--error",args),
  play: ({canvasElement}) => playComponentScenario("DatePicker--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
