import { DECLARED_DOMAINS } from './declared-domains.mjs';
import React from 'react';
import { Tabs, Tab } from '../components/navigation/Tabs.jsx';

export default {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { className: '', 'aria-orientation': 'horizontal' },
  argTypes: {
    'aria-orientation': { control: 'select', options: DECLARED_DOMAINS.Tabs["aria-orientation"] },
    lang: { control: 'select', options: ['en', 'vi'] },

  "tabs": {
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

export const Default = { render: function T(args) { const [v, setV] = React.useState('a'); return (<Tabs value={v} onChange={setV} tabs={[{ value: 'a', label: 'Overview' }, { value: 'b', label: 'Activity', count: 3 }]}  {...args} style={{ ...args.style, flexDirection: args['aria-orientation'] === 'vertical' ? 'column' : 'row' }}/>); } };

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

export const WithPanels = {
  render: function LinkedPanels() {
    const prefix = React.useId();
    const [value, setValue] = React.useState('a');
    const items = [{value:'a',label:'Overview'},{value:'b',label:'Activity'}].map(item => ({
      ...item, id:prefix+'-'+item.value+'-tab', 'aria-controls':prefix+'-'+item.value+'-panel',
    }));
    return <div>
      <Tabs tabs={items} value={value} onChange={setValue} aria-label="Workspace views" />
      {items.map(item => <section key={item.value} id={item['aria-controls']} role="tabpanel"
        aria-labelledby={item.id} hidden={value!==item.value} tabIndex={0}>
        <p>{item.label} content</p>
      </section>)}
    </div>;
  },
};

export const ComposedTab = {
  render: function ComposedTabStory() {
    const [selected, setSelected] = React.useState('overview');
    return <div role="tablist" aria-label="Workspace views" onKeyDown={event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const values = ['overview', 'activity'];
      const current = values.indexOf(selected);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : (current + 1) % 2;
      setSelected(values[next]);
      event.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus();
    }}>
      <Tab selected={selected === 'overview'} tabIndex={selected === 'overview' ? 0 : -1} onClick={() => setSelected('overview')}>Overview</Tab>
      <Tab selected={selected === 'activity'} tabIndex={selected === 'activity' ? 0 : -1} onClick={() => setSelected('activity')}>Activity</Tab>
    </div>;
  },
};
