import { Mentions } from '../components/forms/Mentions.jsx';

export default {
  title: 'Components/Forms/Mentions',
  component: Mentions,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text' },
    users: { control: 'object' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Mentions. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { users: ['lumi', 'anle'], defaultValue: 'Thanks @', placeholder: 'Mention a teammate…', rows: 2 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Users',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Mentions {...args} users={['lumi']} defaultValue="Hi @" />
      <Mentions {...args} users={['lumi', 'stephen', 'anle']} defaultValue="Ping @" />
    </div>
  ),
};
