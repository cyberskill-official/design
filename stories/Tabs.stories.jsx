import React from 'react';
import { Tabs, Tab } from '../components/navigation/Tabs.jsx';

export default {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "tabs": {
    "control": "object"
  },
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Tabs. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: function T() { const [v, setV] = React.useState('a'); return (<Tabs value={v} onChange={setV} tabs={[{ value: 'a', label: 'Overview' }, { value: 'b', label: 'Activity', count: 3 }]} />); } };

export const Matrix = {
  name: 'Matrix / Counts',
  render: function T() {
    const [v, setV] = React.useState('a');
    return (
      <Tabs
        value={v}
        onChange={setV}
        tabs={[
          { value: 'a', label: 'Overview' },
          { value: 'b', label: 'Activity', count: 12 },
          { value: 'c', label: 'Settings' },
        ]}
      />
    );
  },
};
