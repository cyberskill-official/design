import { StatusIndicator } from '../components/feedback/StatusIndicator.jsx';

const STATUSES = ['online', 'busy', 'offline', 'error'];

export default {
  title: 'Components/Feedback/StatusIndicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: STATUSES,
    },
    pulse: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting StatusIndicator. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { status: 'online', children: 'All systems go', pulse: true },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Status',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {STATUSES.map((status) => (
        <StatusIndicator key={status} {...args} status={status} pulse={status === 'online'}>
          {status}
        </StatusIndicator>
      ))}
    </div>
  ),
};
