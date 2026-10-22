import { DECLARED_DOMAINS } from './declared-domains.mjs';
import React from 'react';
import { Combobox } from '../components/forms/Combobox.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { portal: true, className: '' },
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Combobox["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
  "options": {
    "control": "object"
  },
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
};

export const Default = { render: function C(args) { const [v, setV] = React.useState('tho'); return (<Combobox label="Element" value={v} onChange={setV} options={[{ value: 'tho', label: 'Thổ · studio' }, { value: 'hoa', label: 'Hỏa · ember' }]}  {...args} portal={args.portal} placement={args.placement} />); } };

export const Matrix = {
  name: 'Matrix / Options',
  render: function C() {
    const [v, setV] = React.useState('tho');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Combobox label="Element" value={v} onChange={setV} options={[{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }]} />
        <Combobox label="Element+" value={v} onChange={setV} options={[{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }, { value: 'thuy', label: 'Thủy' }]} />
      </div>
    );
  },
};

export const States = {
  name: 'States',
  render: function C() {
    const [v, setV] = React.useState('tho');
    const options = [{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }];
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <Combobox label="Element" value={v} onChange={setV} options={options} />
        <Combobox label="Element" value={v} onChange={setV} options={options} disabled />
      </div>
    );
  },
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: function FullMatrixRender(args = {}) {
    const [v, setV] = React.useState('tho');
    const options = [{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }];
    const cells = cartesian({}).flatMap((combo) =>
      stateCombos(["disabled","error"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ["disabled","error"]);
        return (
          <Combobox
            key={label}
            label={label || 'Element'}
            value={v}
            onChange={setV}
            options={options}
            disabled={!!state.disabled}
           error={state.error ? "Example field error" : undefined}
           portal={args.portal} placement={args.placement} />
        );
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={200}>
        {cells}
      </MatrixGrid>
    );
  },
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioComboboxError = {
  name: "Combobox: Validation error",
  args: {
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
  "label": "Project",
  "value": "a",
  "error": "Combobox scenario validation error"
},
  render: args => renderComponentScenario("Combobox--error",args),
  play: ({canvasElement}) => playComponentScenario("Combobox--error",canvasElement),
};

export const ScenarioComboboxEmpty = {
  name: "Combobox: Empty collection",
  args: {
  "options": [],
  "label": "Project",
  "value": "a",
  "portal": false
},
  render: args => renderComponentScenario("Combobox--empty",args),
  play: ({canvasElement}) => playComponentScenario("Combobox--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
