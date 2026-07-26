import { TreeSelect } from '../components/forms/TreeSelect.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs'],
  argTypes: {
  "nodes": {
    "control": "object"
  },
  "value": {
    "control": "text"
  },
  "onChange": {
    "control": "text"
  },
  "placeholder": {
    "control": "text"
  },
  "label": {
    "control": "text"
  },
  "disabled": {
    "control": "boolean"
  },
  "lang": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting TreeSelect. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { label: 'Folder', options: [{ value: 'root', label: 'Root', children: [{ value: 'a', label: 'A' }] }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Trees',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <TreeSelect {...args} label="A" options={[{ value: 'r', label: 'Root' }]} />
      <TreeSelect {...args} label="B" options={[{ value: 'r', label: 'Root', children: [{ value: 'c', label: 'Child' }] }]} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <TreeSelect {...args} />
      <TreeSelect {...args} disabled />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: (args) => {
    const cells = cartesian({  }).flatMap((combo) =>
      stateCombos(["disabled"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled']);
        return (
          <TreeSelect
            key={label}
            {...args}
            disabled={!!state.disabled}
          />
        );
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={140}>
        {cells}
      </MatrixGrid>
    );
  },
};
