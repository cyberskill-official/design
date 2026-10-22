import { HotKeys } from '../components/navigation/HotKeys.jsx';
import { Kbd } from '../components/data/Kbd.jsx';

export default {
  title: 'Components/Navigation/HotKeys',
  component: HotKeys,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    bindings: { control: 'object' },
    help: { control: 'boolean' },
    lang: { control: 'text' },
  },
  args: {
    bindings: [
      { keys: 'mod+k', description: 'Command palette' },
      { keys: 'mod+/', description: 'Help' },
    ],
    help: true,
  },
};

export const Default = {
  render: (args) => (
    <HotKeys {...args}>
      <span style={{ fontSize: 13, color: 'var(--cs-color-text-muted)' }}>
        Press <Kbd>?</Kbd> for the shortcut sheet.
      </span>
    </HotKeys>
  ),
};

export const Matrix = {
  name: 'Matrix / Bindings',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <HotKeys {...args} bindings={[{ keys: 'mod+k', description: 'Palette' }]}>
        <span>One binding</span>
      </HotKeys>
      <HotKeys
        {...args}
        bindings={[
          { keys: 'mod+k', description: 'Palette' },
          { keys: 'mod+/', description: 'Help' },
        ]}
      >
        <span>Two bindings</span>
      </HotKeys>
    </div>
  ),
};
