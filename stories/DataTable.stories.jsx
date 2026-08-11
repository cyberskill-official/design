import { DataTable } from '../components/datatable/DataTable.jsx';

export default {
  title: 'Components/Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
  "header": {
    "control": "object"
  },
  "render": {
    "control": "object"
  },
  "caption": {
    "control": "text"
  },
  "columns": {
    "control": "object"
  },
  "rows": {
    "control": "object"
  },
  "rowKey": {
    "control": "text"
  },
  "emptyState": {
    "control": "text"
  },
  "state": {
    "control": "select",
    "options": ["idle", "loading", "error"]
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting DataTable. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { columns: [{ key: 'name', header: 'Name' }, { key: 'role', header: 'Role' }], rows: [{ id: 1, name: 'Stephen', role: 'Founder' }, { id: 2, name: 'Lumi', role: 'Genie' }], caption: 'Team' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Empty vs filled',
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <DataTable {...args} />
      <DataTable {...args} rows={[]} emptyState="No rows yet" caption="Empty" />
      <DataTable {...args} rows={[]} state="loading" caption="Loading" loadingRows={3} />
      <DataTable {...args} rows={[]} state="error" caption="Error" />
    </div>
  ),
};
