import { RadioGroup, Radio } from '../components/forms/RadioGroup.jsx';

export default {
  title: 'Components/Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "legend": {
    "control": "object"
  },
  "name": {
    "control": "text"
  },
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": false
  },
  "options": {
    "control": "object"
  },
  "label": {
    "control": "text"
  },
  "description": {
    "control": "text"
  }
},
  args: {
    name: 'theme',
    legend: 'Theme',
    value: 'light',
    options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }],
  },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Options',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <RadioGroup {...args} name="t1" legend="Theme" value="light" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      <RadioGroup {...args} name="t2" legend="Density" value="comfy" options={[{ value: 'comfy', label: 'Comfy' }, { value: 'compact', label: 'Compact' }]} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <RadioGroup {...args} name="s1" legend="Theme" value="light" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      <RadioGroup {...args} name="s2" legend="Theme" value="light" options={[{ value: 'light', label: 'Light', disabled: true }, { value: 'dark', label: 'Dark' }]} />
      <Radio name="solo" value="a" label="Companion Radio" />
      <Radio name="solo" value="b" label="Disabled Radio" disabled />
    </div>
  ),
};
