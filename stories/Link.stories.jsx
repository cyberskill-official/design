import { Link } from '../components/navigation/Link.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

const VARIANTS = ['default', 'muted', 'standalone'];

export default {
  title: 'Components/Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    external: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus exhaustive variant matrix mounting Link. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { href: '#', children: 'Read the doctrine' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / All variants',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <Link key={variant} {...args} href="#" variant={variant}>
          {variant}
        </Link>
      ))}
    </div>
  ),
};

/** Exhaustive discrete-axis product (FullMatrix contract ≥1 axis). */
export const FullMatrix = {
  name: 'Full matrix / variant',
  render: (args) => {
    const cells = cartesian({ variant: ["default","muted","standalone"] }).flatMap((combo) =>
      stateCombos([]).map((state) => {
        const props = { ...combo, ...state };
        const label = comboLabel(props, ['variant']);
        return (
          <Link
            key={label}
            {...args}
            variant={combo.variant}
          >
            {label}
          </Link>
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
