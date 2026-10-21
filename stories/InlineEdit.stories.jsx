import { InlineEdit } from '../components/forms/InlineEdit.jsx';

export default {
  title: 'Components/Forms/InlineEdit',
  component: InlineEdit,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "value": {
    "control": "text"
  },
  "defaultValue": {
    "control": "text"
  },
  "onChange": {
    "control": false
  },
  "label": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
  args: { defaultValue: 'Editable title' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Values',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <InlineEdit {...args} defaultValue="Title A" />
      <InlineEdit {...args} defaultValue="Title B" />
    </div>
  ),
};
