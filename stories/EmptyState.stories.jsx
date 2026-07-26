import { EmptyState } from '../components/feedback/EmptyState.jsx';

export default {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting EmptyState. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { title: 'No wishes yet', children: 'Capture the first one.' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Copy',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <EmptyState {...args} title="Empty A">
        Desc A
      </EmptyState>
      <EmptyState {...args} title="Empty B">
        Desc B
      </EmptyState>
    </div>
  ),
};
