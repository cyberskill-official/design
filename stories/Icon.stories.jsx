import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Icon, CS_ICONS } from '../components/icon/Icon.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Brand/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
  "size": {
    "control": "select",
    "options": DECLARED_DOMAINS.Icon["size"]
  },
  "label": {
    "control": "text"
  },
  "strokeWidth": {
    "control": "number"
  },
  "name": {
    "control": "select",
    "options": Object.keys(CS_ICONS)
  }
},
  args: { name: 'sparkle', size: 'md' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Names',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {Object.keys(CS_ICONS).map(name => <Icon key={name} {...args} name={name} label={name} />)}
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon {...args} name="sparkle" size="sm" />
      <Icon {...args} name="sparkle" size="md" />
      <Icon {...args} name="sparkle" size="lg" />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / size',
  render: (args) => {
    const cells = cartesian({ size: DECLARED_DOMAINS.Icon["size"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['size']);
        return (
          <Icon
            key={label}
            {...args}
            size={combo.size}
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
