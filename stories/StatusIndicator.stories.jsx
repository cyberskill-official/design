import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { StatusIndicator } from '../components/feedback/StatusIndicator.jsx';

const STATUSES = DECLARED_DOMAINS.StatusIndicator["status"];

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
