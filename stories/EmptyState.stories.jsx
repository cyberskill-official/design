import { EmptyState } from '../components/feedback/EmptyState.jsx';
import { Button } from '../components/button/Button.jsx';
import { Icon } from '../components/icon/Icon.jsx';

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
          'Host Live CSF — Default plus honest control matrix mounting EmptyState. Portable consumers use styles.css + bundle, not Storybook. `icon` and `actions` are composition slots.',
      },
    },
  },
  args: { title: 'No wishes yet', children: 'Capture the first one.' },
};

export const Default = {
  render: (args) => (
    <EmptyState
      {...args}
      icon={<Icon name="sparkle" size="md" />}
      actions={<Button size="sm">Make a wish</Button>}
    />
  ),
};

export const Matrix = {
  name: 'Matrix / Copy · actions',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <EmptyState {...args} title="Empty A" icon={<Icon name="search" size="md" />}>
        Desc A
      </EmptyState>
      <EmptyState
        {...args}
        title="Empty B"
        actions={
          <>
            <Button size="sm" variant="secondary">
              Clear filters
            </Button>
            <Button size="sm">New item</Button>
          </>
        }
      >
        Desc B
      </EmptyState>
    </div>
  ),
};
