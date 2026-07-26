import { NativeSelect } from '../components/forms/NativeSelect.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting NativeSelect. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: {
    label: 'Squad',
    size: 'md',
    options: [
      { value: 'plat', label: 'Platform' },
      { value: 'ai', label: 'AI' },
      { value: 'growth', label: 'Growth' },
    ],
    defaultValue: 'ai',
  },
};

export const Default = {};

export const AllSizes = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      {['sm', 'md'].map((size) => (
        <NativeSelect key={size} {...args} label={`Size ${size}`} size={size} />
      ))}
    </div>
  ),
};

export const Matrix = {
  name: 'Matrix / Sizes & states',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <NativeSelect {...args} label="Default (md)" size="md" />
      <NativeSelect {...args} label="Compact (sm)" size="sm" />
      <NativeSelect {...args} label="Disabled" disabled />
      <NativeSelect {...args} label="Invalid" error="Pick a squad." />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <NativeSelect {...args} />
      <NativeSelect {...args} disabled />
      <NativeSelect {...args} error="Pick a squad." />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / size',
  render: (args) => {
    const cells = cartesian({ size: ["sm","md"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['size']);
        return (
          <NativeSelect
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
