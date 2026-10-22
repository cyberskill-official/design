import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Result } from '../components/feedback/Result.jsx';
import { Button } from '../components/button/Button.jsx';

const STATUSES = DECLARED_DOMAINS.Result["status"];

export default {
  title: 'Components/Feedback/Result',
  component: Result,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    status: { control: 'select', options: STATUSES },
    title: { control: 'text' },
    children: { control: 'text' },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  args: { status: 'success', title: 'Wish shipped', children: 'All gates green.', lang: 'en' },
};

export const Default = {
  render: (args) => (
    <Result {...args} actions={<Button size="sm">Back to hub</Button>} />
  ),
};

export const Matrix = {
  name: 'Matrix / Status',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {STATUSES.map((status) => (
        <Result
          key={status}
          {...args}
          status={status}
          title={status}
          actions={<Button size="sm" variant="secondary">Continue</Button>}
        >
          Body for {status}
        </Result>
      ))}
    </div>
  ),
};
