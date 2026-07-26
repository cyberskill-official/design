import { TagInput } from '../components/forms/TagInput.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'object' },
    defaultValue: { control: 'object' },
    placeholder: { control: 'text' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting TagInput. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { label: 'Tags', defaultValue: ['design', 'vn'] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Tags',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <TagInput {...args} label="Tags" defaultValue={['one']} />
      <TagInput {...args} label="Tags" defaultValue={['one', 'two', 'three']} />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <TagInput {...args} />
      <TagInput {...args} disabled />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: (args) => {
    const cells = cartesian({}).flatMap((combo) =>
      stateCombos(['disabled']).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled']);
        return <TagInput key={label} {...args} disabled={!!state.disabled} />;
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={140}>
        {cells}
      </MatrixGrid>
    );
  },
};
