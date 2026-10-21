import React from 'react';
import { Calendar } from '../components/forms/Calendar.jsx';

export default {
  title: 'Components/Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": false
  },
  "lang": {
    "control": "select",
    "options": [
      "en",
      "vi"
    ]
  }
},
};

export const Default = { render: function C(args) { const [v, setV] = React.useState(new Date(2026, 6, 22)); return <Calendar value={v} onChange={setV}  {...args}/>; } };

export const Matrix = {
  name: 'Matrix / Languages',
  render: () => {
    const [en, setEn] = React.useState(new Date(2026, 6, 22));
    const [vi, setVi] = React.useState(new Date(2026, 6, 22));
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Calendar value={en} onChange={setEn} lang="en" />
        <Calendar value={vi} onChange={setVi} lang="vi" />
      </div>
    );
  },
};
