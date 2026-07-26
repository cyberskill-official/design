import { PromptSuggestions } from '../components/ai/PromptSuggestions.jsx';

export default {
  title: 'Components/AI/PromptSuggestions',
  component: PromptSuggestions,
  tags: ['autodocs'],
  argTypes: {
    suggestions: { control: 'object' },
    onSelect: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting PromptSuggestions. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
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
