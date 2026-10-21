import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Popover } from '../components/overlays/Popover.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: { portal: true, className: '' },
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Popover["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "trigger": {
    "control": "object"
  },
  "align": {
    "control": "select",
    "options": DECLARED_DOMAINS.Popover["align"]
  },
  "open": {
    "control": "boolean"
  }
},
};

export const Default = { render: (args) => (<Popover aria-label="Popover body" trigger={<Button variant="secondary">Open</Button>} {...args} portal={args.portal} placement={args.placement} ><div style={{ padding: 8 }}>Popover body</div></Popover>) };

export const Matrix = {
  name: 'Matrix / Align open',
  render: () => (
    <div style={{ display: 'flex', gap: 24, minHeight: 120 }}>
      <Popover aria-label="Start panel" trigger={<Button variant="secondary">Start</Button>} align="start" open>
        <div style={{ padding: 8 }}>Start panel</div>
      </Popover>
      <Popover aria-label="End panel" trigger={<Button variant="secondary">End</Button>} align="end" open>
        <div style={{ padding: 8 }}>End panel</div>
      </Popover>
    </div>
  ),
};
