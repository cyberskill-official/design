import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Tooltip } from '../components/data/Tooltip.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Data/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { portal: true, className: '' },
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Tooltip["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "label": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<Tooltip label="Helpful hint" {...args} portal={args.portal} placement={args.placement} ><Button variant="ghost">Hover me</Button></Tooltip>) };

export const Matrix = {
  name: 'Matrix / Labels',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Tooltip label="Short"><Button variant="ghost">A</Button></Tooltip>
      <Tooltip label="Longer helper copy"><Button variant="ghost">B</Button></Tooltip>
    </div>
  ),
};

export const ExistingDescription = { render: () => (<div><p id="tooltip-story-help">Persistent help remains associated.</p><Tooltip label="Additional detail"><Button aria-describedby="tooltip-story-help">Focus or hover</Button></Tooltip></div>) };
