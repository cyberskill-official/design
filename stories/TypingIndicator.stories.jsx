import { TypingIndicator } from '../components/ai/TypingIndicator.jsx';

export default {
  title: 'Components/AI/TypingIndicator',
  component: TypingIndicator,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "label": {
    "control": "text"
  }
},
  args: { lang: 'vi',},
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Instances',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <TypingIndicator />
      <TypingIndicator />
    </div>
  ),
};
