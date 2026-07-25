import { Item } from '../components/data/Item.jsx';
import { Switch } from '../components/forms/Switch.jsx';
import { Badge } from '../components/feedback/Badge.jsx';

export default {
  title: 'Components/Data/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Item. Portable consumers use styles.css + bundle, not Storybook.',
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
      <Item {...args} trailing={<Switch defaultChecked />} />
    </div>
  ),
};

export const Matrix = {
  name: 'Matrix / States',
  render: () => (
    <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <Item title="Profile" description="How you appear across the workspace" href="#profile" selected />
      <Item title="Notifications" description="Quiet by default" onClick={() => {}} trailing={<Badge variant="ochre">Now</Badge>} />
      <Item title="Billing" description="Unavailable in this workspace" disabled />
      <Item title="Release notes" description="Bilingual digest" trailing={<Switch defaultChecked />} />
    </div>
  ),
};
