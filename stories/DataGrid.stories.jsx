import { DataGrid } from '../components/datatable/DataGrid.jsx';

export default {
  title: 'Components/Data/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "columns": {
    "control": "object"
  },
  "rows": {
    "control": "object"
  },
  "rowKey": {
    "control": "text"
  },
  "selectable": {
    "control": "boolean"
  },
  "selected": {
    "control": "text"
  },
  "onSelect": {
    "control": false
  },
  "height": {
    "control": "number"
  },
  "caption": {
    "control": "object"
  },
  "empty": {
    "control": "object"
  },
  "filterText": {
    "control": "text"
  },
  "filterKeys": {
    "control": "text"
  },
  "virtual": {
    "control": "boolean"
  },
  "virtualThreshold": {
    "control": "number"
  },
  "rowHeight": {
    "control": "number"
  },
  "persistKey": {
    "control": "text"
  },
  "lang": {
    "control": "text"
  }
},
  args: { columns: [{ key: 'name', header: 'Name' }, { key: 'status', header: 'Status' }], rows: [{ id: 1, name: 'Alpha wish', status: 'Open' }, { id: 2, name: 'Beta wish', status: 'Done' }], caption: 'Wishes' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Selectable',
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <DataGrid {...args} />
      <DataGrid {...args} selectable selected={[1]} />
    </div>
  ),
};

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioDataGridEmpty = {
  name: "DataGrid: Empty collection",
  args: {
  "columns": [
    {
      "key": "name",
      "header": "Name"
    }
  ],
  "rows": []
},
  render: args => renderComponentScenario("DataGrid--empty",args),
  play: ({canvasElement}) => playComponentScenario("DataGrid--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
