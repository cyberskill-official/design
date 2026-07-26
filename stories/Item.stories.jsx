import { Item } from '../components/data/Item.jsx';
import { Switch } from '../components/forms/Switch.jsx';
import { Badge } from '../components/feedback/Badge.jsx';
import { Icon } from '../components/icon/Icon.jsx';
import { cartesian, comboLabel, MatrixGrid, stateCombos } from './lib/matrix.jsx';

export default {
  title: 'Components/Data/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    href: { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Item. Portable consumers use styles.css + bundle, not Storybook. Leading / trailing are composition slots; `href` renders as a link.',
      },
    },
  },
  args: {
    title: 'Release notes',
    description: 'A summary each time a project ships. Bilingual.',
  },
};

export const Default = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Item
        {...args}
        leading={<Icon name="copy" size="sm" />}
        trailing={<Switch defaultChecked />}
      />
    </div>
  ),
};

export const Matrix = {
  name: 'Matrix / States',
  render: () => (
    <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <Item
        title="Profile"
        description="How you appear across the workspace"
        href="#profile"
        leading={<Icon name="user" size="sm" />}
        selected
      />
      <Item
        title="Notifications"
        description="Quiet by default"
        onClick={() => {}}
        trailing={<Badge variant="ochre">Now</Badge>}
      />
      <Item title="Billing" description="Unavailable in this workspace" disabled />
      <Item title="Release notes" description="Bilingual digest" trailing={<Switch defaultChecked />} />
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
        return (
          <Item
            key={label}
            {...args}
            title={label || args.title}
            leading={<Icon name="copy" size="sm" />}
            disabled={!!state.disabled}
          />
        );
      }),
    );
    return (
      <MatrixGrid gap={10} minWidth={240}>
        {cells}
      </MatrixGrid>
    );
  },
};
