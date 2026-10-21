import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { HoverCard } from '../components/overlays/HoverCard.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  args: { portal: true, className: '' },
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.HoverCard["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "trigger": {
    "control": "object"
  },
  "openDelay": {
    "control": "number"
  },
  "closeDelay": {
    "control": "number"
  }
},
};

export const Default = { render: (args) => (<HoverCard aria-label="Lumi the golden genie" trigger={<Button variant="ghost">Hover</Button>} {...args} portal={args.portal} placement={args.placement} >Lumi the golden genie</HoverCard>) };

export const Matrix = {
  name: 'Matrix / Content',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <HoverCard aria-label="Short" trigger={<Button variant="ghost">A</Button>}>Short</HoverCard>
      <HoverCard aria-label="Longer preview body" trigger={<Button variant="ghost">B</Button>}>Longer preview body</HoverCard>
    </div>
  ),
};
