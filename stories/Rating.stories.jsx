import { Rating } from '../components/forms/Rating.jsx';

export default {
  title: 'Components/Forms/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "controlProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "description": {"control":"text"},
  "error": {"control":"text"},
  "required": {"control":"boolean"},
  "value": {
    "control": "number"
  },
  "defaultValue": {
    "control": "number"
  },
  "onChange": {
    "control": false
  },
  "max": {
    "control": "number"
  },
  "readOnly": {
    "control": "boolean"
  },
  "label": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
  args: { value: 4, max: 5, label: 'Satisfaction' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Values',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Rating {...args} value={1} max={5} label="Low" />
      <Rating {...args} value={5} max={5} label="High" />
    </div>
  ),
};

/** Both error states are rendered as actual field messages. */
export const FullMatrix = {
  name: 'Full matrix / error',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Rating {...args} error={undefined} />
      <Rating {...args} error="Example field error" />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioRatingError = {
  name: "Rating: Validation error",
  args: {
  "label": "Rating",
  "defaultValue": 3,
  "error": "Rating scenario validation error"
},
  render: args => renderComponentScenario("Rating--error",args),
  play: ({canvasElement}) => playComponentScenario("Rating--error",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
