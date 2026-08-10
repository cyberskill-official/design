import { Menu, MenuItem } from '../components/navigation/Menu.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "trigger": {
    "control": "object"
  },
  "align": {
    "control": "select",
    "options": [
      "start",
      "end"
    ]
  },
  "open": {
    "control": "boolean"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Menu. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: () => (<Menu trigger={<Button variant="secondary">Open menu</Button>}><MenuItem>Edit</MenuItem><MenuItem>Duplicate</MenuItem></Menu>) };

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
