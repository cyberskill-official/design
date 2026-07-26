import React from 'react';
import { Combobox } from '../components/forms/Combobox.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
  "options": {
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
        component: 'Host Live CSF — Default plus honest control matrix mounting Combobox. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: function C() { const [v, setV] = React.useState('tho'); return (<Combobox label="Element" value={v} onChange={setV} options={[{ value: 'tho', label: 'Thổ · studio' }, { value: 'hoa', label: 'Hỏa · ember' }]} />); } };

export const Matrix = {
  name: 'Matrix / Options',
  render: function C() {
    const [v, setV] = React.useState('tho');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Combobox label="Element" value={v} onChange={setV} options={[{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }]} />
        <Combobox label="Element+" value={v} onChange={setV} options={[{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }, { value: 'thuy', label: 'Thủy' }]} />
      </div>
    );
  },
};

export const States = {
  name: 'States',
  render: function C() {
    const [v, setV] = React.useState('tho');
    const options = [{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }];
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <Combobox label="Element" value={v} onChange={setV} options={options} />
        <Combobox label="Element" value={v} onChange={setV} options={options} disabled />
      </div>
    );
  },
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: function FullMatrixRender() {
    const [v, setV] = React.useState('tho');
    const options = [{ value: 'tho', label: 'Thổ' }, { value: 'hoa', label: 'Hỏa' }];
    const cells = cartesian({}).flatMap((combo) =>
      stateCombos(["disabled"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled']);
        return (
          <Combobox
            key={label}
            label={label || 'Element'}
            value={v}
            onChange={setV}
            options={options}
            disabled={!!state.disabled}
          />
        );
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={200}>
        {cells}
      </MatrixGrid>
    );
  },
};
