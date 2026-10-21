import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { NavigationMenu } from '../components/navigation/NavigationMenu.jsx';

export default {
  title: 'Components/Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.NavigationMenu["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "items": {
    "control": "object"
  }
},
  args: { portal: true, items: [{ label: 'Product', href: '#' }, { label: 'Docs', href: '#' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <NavigationMenu {...args} items={[{ label: 'Product', href: '#' }]} />
      <NavigationMenu {...args} items={[{ label: 'Product', href: '#' }, { label: 'Docs', href: '#' }]} />
    </div>
  ),
};
