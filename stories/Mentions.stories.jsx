import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Mentions } from '../components/forms/Mentions.jsx';

export default {
  title: 'Components/Forms/Mentions',
  component: Mentions,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Mentions["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    onChange: { control: false },
    users: { control: 'object' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  args: { portal: true, users: ['lumi', 'anle'], defaultValue: 'Thanks @', placeholder: 'Mention a teammate…', rows: 2 },
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
