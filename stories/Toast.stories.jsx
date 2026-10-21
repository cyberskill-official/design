import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Toast, ToastStack } from '../components/feedback/Toast.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "variant": {
    "control": "select",
    "options": DECLARED_DOMAINS.Toast["variant"]
  },
  "title": {
    "control": "object"
  },
  "icon": {
    "control": "object"
  }
},
};

export const Default = { render: (args) => (<ToastStack><Toast title="Wish accepted" {...args}>Lumi is on it.</Toast></ToastStack>) };

export const Matrix = {
  name: 'Matrix / All variants',
  render: () => (
    <ToastStack>
      <Toast variant="default" title="Default">Body</Toast>
      <Toast variant="success" title="Success">Saved</Toast>
      <Toast variant="danger" title="Danger">Failed</Toast>
    </ToastStack>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / variant',
  render: () => {
    const cells = cartesian({ variant: DECLARED_DOMAINS.Toast["variant"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['variant']);
        return (
          <Toast key={label} title={label} variant={combo.variant}>
            {label}
          </Toast>
        );
      }),
    );
    return (
      <ToastStack>
        {cells}
      </ToastStack>
    );
  },
};
