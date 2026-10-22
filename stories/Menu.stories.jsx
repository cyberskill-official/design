import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Menu, MenuItem } from '../components/navigation/Menu.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: { portal: true, className: '' },
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Menu["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "trigger": {
    "control": "object"
  },
  "align": {
    "control": "select",
    "options": DECLARED_DOMAINS.Menu["align"]
  },
  "open": {
    "control": "boolean"
  }
},
};

export const Default = { render: (args) => (<Menu trigger={<Button variant="secondary">Open menu</Button>} {...args} portal={args.portal} placement={args.placement} ><MenuItem>Edit</MenuItem><MenuItem>Duplicate</MenuItem></Menu>) };

export const Matrix = {
  name: 'Matrix / Align',
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Menu trigger={<Button variant="secondary">Start</Button>} align="start" open>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </Menu>
      <Menu trigger={<Button variant="secondary">End</Button>} align="end" open>
        <MenuItem danger>Delete</MenuItem>
      </Menu>
    </div>
  ),
};
