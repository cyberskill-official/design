import React from 'react';
import { SegmentedControl } from '../components/forms/SegmentedControl.jsx';

export default {
  title: 'Components/Forms/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
  "options": {
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
        component: 'Host Live CSF — Default plus honest control matrix mounting SegmentedControl. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: function S() { const [v, setV] = React.useState('en'); return (<SegmentedControl value={v} onChange={setV} options={[{ value: 'en', label: 'EN' }, { value: 'vi', label: 'VI' }]} />); } };

export const Matrix = {
  name: 'Matrix / Options',
  render: function S() {
    const [v, setV] = React.useState('en');
    return (
      <SegmentedControl
        value={v}
        onChange={setV}
        options={[
          { value: 'en', label: 'EN' },
          { value: 'vi', label: 'VI' },
          { value: 'both', label: 'Both' },
        ]}
      />
    );
  },
};

export const WithPanels = {
  render: function LinkedPanels() {
    const prefix = React.useId();
    const [value, setValue] = React.useState('a');
    const items = [{value:'a',label:'Overview'},{value:'b',label:'Activity'}].map(item => ({
      ...item, id:prefix+'-'+item.value+'-tab', 'aria-controls':prefix+'-'+item.value+'-panel',
    }));
    return <div>
      <SegmentedControl options={items} value={value} onChange={setValue} aria-label="Workspace views" />
      {items.map(item => <section key={item.value} id={item['aria-controls']} role="tabpanel"
        aria-labelledby={item.id} hidden={value!==item.value} tabIndex={0}>
        <p>{item.label} content</p>
      </section>)}
    </div>;
  },
};
