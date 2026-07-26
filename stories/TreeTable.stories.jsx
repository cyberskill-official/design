import { TreeTable } from '../components/datatable/TreeTable.jsx';

const COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'kind', header: 'Kind' },
];

const NODES = [
  {
    key: '1',
    name: 'Root',
    kind: 'folder',
    children: [{ key: '1a', name: 'Child', kind: 'file' }],
  },
];

export default {
  title: 'Components/Data/TreeTable',
  component: TreeTable,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    nodes: { control: 'object' },
    caption: { control: 'text' },
    defaultExpanded: { control: 'object' },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting TreeTable. Portable consumers use styles.css + bundle, not Storybook. Rows are `nodes` with `key` (not `rows`/`id`).',
      },
    },
  },
  args: {
    columns: COLUMNS,
    nodes: NODES,
    defaultExpanded: ['1'],
    caption: 'Workspace tree',
    lang: 'en',
  },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Expand',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TreeTable
        {...args}
        caption="Collapsed"
        columns={[{ key: 'name', header: 'Name' }]}
        nodes={[{ key: '1', name: 'Root', children: [{ key: '1a', name: 'Child' }] }]}
        defaultExpanded={[]}
      />
      <TreeTable
        {...args}
        caption="Expanded"
        columns={COLUMNS}
        nodes={NODES}
        defaultExpanded={['1']}
      />
    </div>
  ),
};
