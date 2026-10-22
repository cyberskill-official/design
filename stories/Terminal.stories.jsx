import { Terminal } from '../components/data/Terminal.jsx';

export default {
  title: 'Components/Data/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    title: { control: 'text' },
    welcome: { control: 'text' },
    prompt: { control: 'text' },
    lang: { control: 'text' },
  },
  args: {
    title: 'cyberskill',
    welcome: 'Type `help` for commands.',
    prompt: '$ ',
  },
};

export const Default = {
  render: (args) => (
    <Terminal
      {...args}
      onCommand={(c) => (c === 'help' ? 'wish · status · clear' : `command not found: ${c}`)}
    />
  ),
};

export const Matrix = {
  name: 'Matrix / Welcome',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Terminal {...args} welcome="Ready." onCommand={() => 'ok'} />
      <Terminal {...args} welcome="Type help for commands." prompt="› " onCommand={(c) => `ran ${c}`} />
    </div>
  ),
};
