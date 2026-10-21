import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Chart } from '../components/data/Chart.jsx';

export default {
  title: 'Components/Data/Chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "type": {
    "control": "select",
    "options": DECLARED_DOMAINS.Chart["type"]
  },
  "data": {
    "control": "object"
  },
  "height": {
    "control": "number"
  },
  "color": {
    "control": "text"
  },
  "showValues": {
    "control": "boolean"
  },
  "lang": {
    "control": "select",
    "options": ["vi", "en"]
  },
  "label": {
    "control": "text"
  }
},
  args: { type: 'bar', data: [{ label: 'Mon', value: 4 }, { label: 'Tue', value: 7 }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Series',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Chart {...args} type="bar" data={[{ label: 'A', value: 2 }]} />
      <Chart {...args} type="bar" data={[{ label: 'A', value: 2 }, { label: 'B', value: 5 }, { label: 'C', value: 3 }]} />
    </div>
  ),
};

export const EmptyData = { args: { data: [] } };
export const WhitespaceLabel = { args: { label: "   " } };
