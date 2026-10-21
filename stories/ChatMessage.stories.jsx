import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { ChatMessage } from '../components/ai/ChatMessage.jsx';

export default {
  title: 'Components/AI/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "role": {
    "control": "select",
    "options": DECLARED_DOMAINS.ChatMessage["role"]
  },
  "name": {
    "control": "object"
  },
  "avatar": {
    "control": "object"
  }
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
