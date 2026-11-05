import { PromptSuggestions } from '../components/ai/PromptSuggestions.jsx';

export default {
  title: 'Components/AI/PromptSuggestions',
  component: PromptSuggestions,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    suggestions: { control: 'object' },
    onSelect: { control: false },
  },
  args: { suggestions: ['Draft a BOD memo', 'VN labor contract'] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Sets',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <PromptSuggestions {...args} suggestions={['One']} />
      <PromptSuggestions {...args} suggestions={['One', 'Two', 'Three']} />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioPromptSuggestionsEmpty = {
  name: "PromptSuggestions: Empty collection",
  args: {
  "suggestions": []
},
  render: args => renderComponentScenario("PromptSuggestions--empty",args),
  play: ({canvasElement}) => playComponentScenario("PromptSuggestions--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
