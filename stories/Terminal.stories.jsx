import { Terminal } from '../components/data/Terminal.jsx';

export default {
  title: 'Components/Data/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    welcome: { control: 'text' },
    prompt: { control: 'text' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Terminal. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
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
