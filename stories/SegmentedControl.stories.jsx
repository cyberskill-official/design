import { DECLARED_DOMAINS } from './declared-domains.mjs';
import React from 'react';
import { SegmentedControl } from '../components/forms/SegmentedControl.jsx';

export default {
  title: 'Components/Forms/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: { className: '', 'aria-label': 'Language', 'aria-orientation': 'horizontal', mode: 'radio' },
  argTypes: {
    mode: { control: 'select', options: DECLARED_DOMAINS.SegmentedControl.mode },
    role: { control: 'select', options: DECLARED_DOMAINS.SegmentedControl.role, description: 'Deprecated semantic alias; used only when mode is omitted. Explicit mode takes precedence.' },
    'aria-orientation': { control: 'select', options: DECLARED_DOMAINS.SegmentedControl["aria-orientation"] },
  "options": {
    "control": "object"
  },
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": false
  }
},
};

export const Default = { render: function S(args) { const [v, setV] = React.useState('en'); return (<SegmentedControl value={v} onChange={setV} options={[{ value: 'en', label: 'EN' }, { value: 'vi', label: 'VI' }]}  {...args} style={{ ...args.style, flexDirection: args['aria-orientation'] === 'vertical' ? 'column' : 'row' }}/>); } };

export const Matrix = {
  name: 'Matrix / Options',
  render: function S() {
    const [v, setV] = React.useState('en');
    return (
      <SegmentedControl
        aria-label="Language modes"
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
  args: { mode: 'tabs' },
  render: function LinkedPanels() {
    const prefix = React.useId();
    const [value, setValue] = React.useState('a');
    const items = [{value:'a',label:'Overview'},{value:'b',label:'Activity'}].map(item => ({
      ...item, id:prefix+'-'+item.value+'-tab', 'aria-controls':prefix+'-'+item.value+'-panel',
    }));
    return <div>
      <SegmentedControl mode="tabs" options={items} value={value} onChange={setValue} aria-label="Workspace views" />
      {items.map(item => <section key={item.value} id={item['aria-controls']} role="tabpanel"
        aria-labelledby={item.id} hidden={value!==item.value} tabIndex={0}>
        <p>{item.label} content</p>
      </section>)}
    </div>;
  },
};
