import { Timeline } from '../components/data/Timeline.jsx';

export default {
  title: 'Components/Data/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "items": {
    "control": "object"
  }
},
  args: { items: [{ title: 'Wish captured', time: '09:00' }, { title: 'Shipped', time: '16:00' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Length',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Timeline {...args} items={[{ title: 'One', time: '09:00' }]} />
      <Timeline {...args} items={[{ title: 'One', time: '09:00' }, { title: 'Two', time: '12:00' }, { title: 'Three', time: '16:00' }]} />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioTimelineEmpty = {
  name: "Timeline: Empty collection",
  args: {
  "items": []
},
  render: args => renderComponentScenario("Timeline--empty",args),
  play: ({canvasElement}) => playComponentScenario("Timeline--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
