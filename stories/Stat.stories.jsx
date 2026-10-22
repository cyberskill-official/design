import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Stat } from '../components/data/Stat.jsx';

export default {
  title: 'Components/Data/Stat',
  component: Stat,
  tags: ['autodocs'],
  argTypes: {
  "label": {
    "control": "object"
  },
  "value": {
    "control": "object"
  },
  "delta": {
    "control": "object"
  },
  "trend": {
    "control": "select",
    "options": DECLARED_DOMAINS.Stat["trend"]
  }
},
  args: { label: 'Open wishes', value: '12', delta: '+2' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Values',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Stat {...args} label="Open" value="12" delta="+2" />
      <Stat {...args} label="Done" value="40" delta="+8" />
    </div>
  ),
};
