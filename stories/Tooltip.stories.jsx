import { Tooltip } from '../components/data/Tooltip.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Data/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "label": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Tooltip. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: () => (<Tooltip label="Helpful hint"><Button variant="ghost">Hover me</Button></Tooltip>) };

export const Matrix = {
  name: 'Matrix / Labels',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Tooltip label="Short"><Button variant="ghost">A</Button></Tooltip>
      <Tooltip label="Longer helper copy"><Button variant="ghost">B</Button></Tooltip>
    </div>
  ),
};
