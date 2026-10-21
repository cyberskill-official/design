import { PromptInput } from '../components/ai/PromptInput.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/AI/PromptInput',
  component: PromptInput,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "value": {
    "control": "text"
  },
  "onChange": {
    "control": false
  },
  "onSubmit": {
    "control": false
  },
  "placeholder": {
    "control": "text"
  },
  "sendLabel": {
    "control": "text"
  },
  "hint": {
    "control": "object"
  },
  "disabled": {
    "control": "boolean"
  },
  "busy": {
    "control": "boolean"
  }
},
  args: { lang: 'vi', placeholder: 'Describe your wish…' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Placeholders',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <PromptInput {...args} placeholder="Wish A…" />
      <PromptInput {...args} placeholder="Wish B…" />
    </div>
  ),
};

export const States = {
  name: 'States',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <PromptInput {...args} />
      <PromptInput {...args} disabled />
      <PromptInput {...args} busy />
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / state',
  render: (args) => {
    const cells = cartesian({  }).flatMap((combo) =>
      stateCombos(["disabled","busy"]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['disabled', 'busy']);
        return (
          <PromptInput
            key={label}
            {...args}
            disabled={!!state.disabled}
            busy={!!state.busy}
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
