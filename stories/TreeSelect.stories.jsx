import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { TreeSelect } from '../components/forms/TreeSelect.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const NODES = [
  {
    key: 'root',
    label: 'Root',
    children: [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B', children: [{ key: 'b1', label: 'B1' }] },
    ],
  },
];

export default {
  title: 'Components/Forms/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.TreeSelect["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
    nodes: { control: 'object' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    lang: { control: 'text' },
  },
  args: { portal: true, label: 'Folder', nodes: NODES, placeholder: 'Select…' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Trees',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <TreeSelect {...args} label="Flat" nodes={[{ key: 'r', label: 'Root' }]} />
      <TreeSelect
        {...args}
        label="Nested"
        nodes={[{ key: 'r', label: 'Root', children: [{ key: 'c', label: 'Child' }] }]}
      />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <TreeSelect {...args} />
      <TreeSelect {...args} disabled />
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
        return <TreeSelect key={label} {...args} disabled={!!state.disabled}  error={state.error ? "Example field error" : undefined}
           portal={args.portal} placement={args.placement} />;
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
export const ScenarioTreeSelectError = {
  name: "TreeSelect: Validation error",
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
  "value": "a",
  "label": "Region",
  "error": "TreeSelect scenario validation error"
},
  render: args => renderComponentScenario("TreeSelect--error",args),
  play: ({canvasElement}) => playComponentScenario("TreeSelect--error",canvasElement),
};

export const ScenarioTreeSelectEmpty = {
  name: "TreeSelect: Empty collection",
  args: {
  "nodes": [],
  "value": "a",
  "label": "Region",
  "portal": false
},
  render: args => renderComponentScenario("TreeSelect--empty",args),
  play: ({canvasElement}) => playComponentScenario("TreeSelect--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
