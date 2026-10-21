import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { ColorPicker } from '../components/forms/ColorPicker.jsx';

export default {
  title: 'Components/Forms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.ColorPicker["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
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
  "swatches": {
    "control": "text"
  },
  "label": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
  args: { portal: true, label: 'Accent', defaultValue: '#F4BA17' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Colors',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ColorPicker {...args} label="Umber" defaultValue="#45210E" />
      <ColorPicker {...args} label="Ochre" defaultValue="#F4BA17" />
    </div>
  ),
};

/** Both error states are rendered as actual field messages. */
export const FullMatrix = {
  name: 'Full matrix / error',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ColorPicker {...args} error={undefined}  portal={args.portal} placement={args.placement} />
      <ColorPicker {...args} error="Example field error"  portal={args.portal} placement={args.placement} />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioColorPickerError = {
  name: "ColorPicker: Validation error",
  args: {
  "label": "Accent",
  "value": "#F4BA17",
  "error": "ColorPicker scenario validation error"
},
  render: args => renderComponentScenario("ColorPicker--error",args),
  play: ({canvasElement}) => playComponentScenario("ColorPicker--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
