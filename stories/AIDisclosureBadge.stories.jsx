import { AIDisclosureBadge } from '../components/ai/AIDisclosureBadge.jsx';

export default {
  title: 'Components/AI/AIDisclosureBadge',
  component: AIDisclosureBadge,
  tags: ['autodocs'],
  argTypes: {
  lang: { control: "select", options: [undefined, "en", "vi"] },
  "label": {
    "control": "text"
  },
  "details": {
    "control": "object"
  },
  "sources": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting AIDisclosureBadge. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: {},
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Instances',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <AIDisclosureBadge />
      <AIDisclosureBadge />
    </div>
  ),
};
