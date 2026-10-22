import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { AIDisclosureBadge } from '../components/ai/AIDisclosureBadge.jsx';

export default {
  title: 'Components/AI/AIDisclosureBadge',
  component: AIDisclosureBadge,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.AIDisclosureBadge["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  lang: { control: "select", options: [undefined, "en", "vi"] },
  "label": {
    "control": "text"
  },
  "details": {
    "control": "object"
  },
  "sources": {
    "control": "text"
  }
},
  args: { portal: true,},
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Instances',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <AIDisclosureBadge />
      <AIDisclosureBadge />
    </div>
  ),
};
