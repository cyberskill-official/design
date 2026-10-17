import { HoverCard } from '../components/overlays/HoverCard.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {
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
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting HoverCard. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: () => (<HoverCard aria-label="Lumi the golden genie" trigger={<Button variant="ghost">Hover</Button>}>Lumi the golden genie</HoverCard>) };

export const Matrix = {
  name: 'Matrix / Content',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <HoverCard aria-label="Short" trigger={<Button variant="ghost">A</Button>}>Short</HoverCard>
      <HoverCard aria-label="Longer preview body" trigger={<Button variant="ghost">B</Button>}>Longer preview body</HoverCard>
    </div>
  ),
};
