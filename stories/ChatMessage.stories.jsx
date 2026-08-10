import { ChatMessage } from '../components/ai/ChatMessage.jsx';

export default {
  title: 'Components/AI/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "role": {
    "control": "select",
    "options": [
      "lumi",
      "user"
    ]
  },
  "name": {
    "control": "object"
  },
  "avatar": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting ChatMessage. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { lang: 'vi', role: 'lumi', children: 'Turn your will into real.' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Roles',
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ChatMessage role="lumi">From Lumi</ChatMessage>
      <ChatMessage role="user">From you</ChatMessage>
    </div>
  ),
};
