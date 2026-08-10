import { Slider } from '../components/forms/Slider.jsx';

export default {
  title: 'Components/Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "min": {
    "control": "number"
  },
  "max": {
    "control": "number"
  },
  "step": {
    "control": "number"
  },
  "defaultValue": {
    "control": "number"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Slider. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { lang: 'vi', 'aria-label': 'Opacity', defaultValue: 50, min: 0, max: 100, step: 1 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Ranges',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <Slider {...args} min={0} max={100} defaultValue={25} aria-label="Low" />
      <Slider {...args} min={0} max={100} defaultValue={75} step={5} aria-label="High" />
    </div>
  ),
};
