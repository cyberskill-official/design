import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { ConfidenceMeter } from '../components/ai/ConfidenceMeter.jsx';

export default {
  title: 'Components/AI/ConfidenceMeter',
  component: ConfidenceMeter,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "value": {
    "control": "number"
  },
  "level": {
    "control": "select",
    "options": DECLARED_DOMAINS.ConfidenceMeter["level"]
  },
  "segments": {
    "control": "number"
  },
  "label": {
    "control": "object"
  }
},
  args: { lang: 'vi', value: 0.82, label: 'Confidence' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Values',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ConfidenceMeter {...args} value={0.3} label="Low" />
      <ConfidenceMeter {...args} value={0.9} label="High" />
    </div>
  ),
};
