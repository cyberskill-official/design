import { Toast, ToastStack } from '../components/feedback/Toast.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
  "variant": {
    "control": "select",
    "options": [
      "default",
      "success",
      "danger"
    ]
  },
  "title": {
    "control": "object"
  },
  "icon": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Toast. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: () => (<ToastStack><Toast title="Wish accepted">Lumi is on it.</Toast></ToastStack>) };

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
    const cells = cartesian({ variant: ["default","success","danger"] }).flatMap((combo) =>
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
