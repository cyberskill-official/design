import { Result } from '../components/feedback/Result.jsx';

const STATUSES = ['success', 'error', 'warning', 'info'];

export default {
  title: 'Components/Feedback/Result',
  component: Result,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: STATUSES },
    title: { control: 'text' },
    children: { control: 'text' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Result. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { status: 'success', title: 'Wish shipped', children: 'All gates green.' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Status',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {STATUSES.map((status) => (
        <Result key={status} {...args} status={status} title={status}>
          Body for {status}
        </Result>
      ))}
    </div>
  ),
};
