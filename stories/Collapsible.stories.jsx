import { Collapsible } from '../components/data/Collapsible.jsx';

export default {
  title: 'Components/Data/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: { control: 'boolean' },
    title: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Collapsible. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { title: 'Advanced preferences', defaultOpen: false },
};

export const Default = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Collapsible {...args}>
        <p>Quiet by default — only release notes and blocked-project alerts you opt into.</p>
      </Collapsible>
    </div>
  ),
};

export const Matrix = {
  name: 'Matrix / Open state',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <Collapsible title="Closed by default" defaultOpen={false}>
        <p>Hidden until expanded.</p>
      </Collapsible>
      <Collapsible title="Open by default" defaultOpen>
        <p>Visible on mount — still toggles via the trigger.</p>
      </Collapsible>
    </div>
  ),
};
