import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Cascader } from '../components/forms/Cascader.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const REGION_NODES = [
  { key: 'vn', label: 'Vietnam', children: [{ key: 'hcm', label: 'HCMC' }, { key: 'hn', label: 'Hanoi' }] },
  { key: 'sg', label: 'Singapore' },
];

export default {
  title: 'Components/Forms/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Cascader["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
  "nodes": {
    "control": "object"
  },
  "value": {
    "control": "object"
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
  args: { portal: true, nodes: REGION_NODES, label: 'Region', value: [] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Depth',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Cascader {...args} label="Flat" nodes={[{ key: 'vn', label: 'Vietnam' }]} />
      <Cascader {...args} label="Nested" nodes={REGION_NODES} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <Cascader {...args} />
      <Cascader {...args} disabled />
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
          <Cascader
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
export const ScenarioCascaderError = {
  name: "Cascader: Validation error",
  args: {
  "nodes": [
    {
      "key": "a",
      "label": "Alpha"
    },
    {
      "key": "b",
      "label": "Beta"
    }
  ],
  "value": [
    "a"
  ],
  "label": "Region",
  "error": "Cascader scenario validation error"
},
  render: args => renderComponentScenario("Cascader--error",args),
  play: ({canvasElement}) => playComponentScenario("Cascader--error",canvasElement),
};

export const ScenarioCascaderEmpty = {
  name: "Cascader: Empty collection",
  args: {
  "nodes": [],
  "value": [
    "a"
  ],
  "label": "Region",
  "portal": false
},
  render: args => renderComponentScenario("Cascader--empty",args),
  play: ({canvasElement}) => playComponentScenario("Cascader--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
