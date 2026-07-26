import { Editor } from '../components/forms/Editor.jsx';

export default {
  title: 'Components/Forms/Editor',
  component: Editor,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text' },
    minHeight: { control: 'number' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Editor. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { defaultValue: '<p>A clear <b>wish</b>…</p>', minHeight: 120 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Content',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Editor {...args} defaultValue="<p>Short</p>" minHeight={80} />
      <Editor {...args} defaultValue="<p>Longer draft body for matrix.</p>" minHeight={160} />
    </div>
  ),
};
