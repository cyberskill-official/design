import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Alert } from '../components/feedback/Alert.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    onDismiss: { action: 'dismiss' },
    lang: { control: 'select', options: ['en', 'vi'] },

  "variant": {
    "control": "select",
    "options": DECLARED_DOMAINS.Alert["variant"]
  },
  "title": {
    "control": "object"
  },
  "icon": {
    "control": "object"
  }
},
  args: { lang: 'vi', children: 'Your wish is in review.', variant: 'info' },
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
    const cells = cartesian({ variant: DECLARED_DOMAINS.Alert["variant"] }).flatMap((combo) =>
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
