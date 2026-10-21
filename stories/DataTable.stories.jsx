import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { DataTable } from '../components/datatable/DataTable.jsx';

export default {
  title: 'Components/Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
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
    "options": DECLARED_DOMAINS.DataTable["state"]
  }
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

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioDataTableError = {
  name: "DataTable: Validation error",
  args: {
  "columns": [
    {
      "key": "name",
      "header": "Name"
    }
  ],
  "rows": [
    {
      "id": "a",
      "name": "Alpha"
    }
  ],
  "state": "error",
  "errorState": "DataTable scenario validation error"
},
  render: args => renderComponentScenario("DataTable--error",args),
  play: ({canvasElement}) => playComponentScenario("DataTable--error",canvasElement),
};

export const ScenarioDataTableEmpty = {
  name: "DataTable: Empty collection",
  args: {
  "columns": [
    {
      "key": "name",
      "header": "Name"
    }
  ],
  "rows": []
},
  render: args => renderComponentScenario("DataTable--empty",args),
  play: ({canvasElement}) => playComponentScenario("DataTable--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
