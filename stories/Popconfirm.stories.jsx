import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Popconfirm } from '../components/overlays/Popconfirm.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/Popconfirm',
  component: Popconfirm,
  tags: ['autodocs'],
  args: { portal: true, className: '' },
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Popconfirm["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "trigger": {
    "control": "object"
  },
  "title": {
    "control": "object"
  },
  "okLabel": {
    "control": "text"
  },
  "cancelLabel": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<Popconfirm title="Delete this wish?" onConfirm={() => {}} trigger={<Button variant="danger">Delete</Button>} {...args}  portal={args.portal} placement={args.placement} />) };

export const Matrix = {
  name: 'Matrix / Actions',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Popconfirm title="Delete?" onConfirm={() => {}} trigger={<Button variant="danger">Delete</Button>} />
      <Popconfirm title="Archive?" onConfirm={() => {}} trigger={<Button variant="secondary">Archive</Button>} />
    </div>
  ),
};
