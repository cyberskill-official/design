import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { FloatingActionButton } from '../components/button/FloatingActionButton.jsx';

export default {
  title: 'Components/Button/FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.FloatingActionButton["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "icon": {
    "control": "object"
  },
  "label": {
    "control": "text"
  },
  "actions": {
    "control": "object"
  },
  "position": {
    "control": "select",
    "options": DECLARED_DOMAINS.FloatingActionButton["position"]
  }
},
  args: { portal: true, label: 'New wish', icon: '+', position: 'static' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Labels',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <FloatingActionButton {...args} label="Add" icon="+" />
      <FloatingActionButton {...args} label="Wish" icon="✦" />
    </div>
  ),
};
