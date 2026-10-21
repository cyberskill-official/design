import { TagInput } from '../components/forms/TagInput.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
    label: { control: 'text' },
    value: { control: 'object' },
    defaultValue: { control: 'object' },
    placeholder: { control: 'text' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
    lang: { control: 'text' },
  },
  args: { label: 'Tags', defaultValue: ['design', 'vn'] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Tags',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <TagInput {...args} label="Tags" defaultValue={['one']} />
      <TagInput {...args} label="Tags" defaultValue={['one', 'two', 'three']} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <TagInput {...args} />
      <TagInput {...args} disabled />
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
        return <TagInput key={label} {...args} disabled={!!state.disabled}  error={state.error ? "Example field error" : undefined}
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
export const ScenarioTagInputError = {
  name: "TagInput: Validation error",
  args: {
  "label": "Tags",
  "defaultValue": [
    "Alpha"
  ],
  "error": "TagInput scenario validation error"
},
  render: args => renderComponentScenario("TagInput--error",args),
  play: ({canvasElement}) => playComponentScenario("TagInput--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
