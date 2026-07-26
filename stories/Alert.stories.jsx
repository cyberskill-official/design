import { Alert } from '../components/feedback/Alert.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
  "variant": {
    "control": "select",
    "options": [
      "info",
      "success",
      "warning",
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
        component: 'Host Live CSF — Default plus honest control matrix mounting Alert. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { children: 'Your wish is in review.', variant: 'info' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Variants',
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Alert {...args} variant="info">Info</Alert>
      <Alert {...args} variant="success">Success</Alert>
      <Alert {...args} variant="warning">Warning</Alert>
      <Alert {...args} variant="danger">Danger</Alert>
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / variant',
  render: (args) => {
    const cells = cartesian({ variant: ["info","success","warning","danger"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['variant']);
        return (
          <Alert
            key={label}
            {...args}
            variant={combo.variant}
          >
            {label}
          </Alert>
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
