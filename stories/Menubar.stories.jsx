import { DECLARED_DOMAINS } from './declared-domains.mjs';
import { Menubar } from '../components/navigation/Menubar.jsx';

const MENUS = [
  { label: 'File', items: [{ label: 'New' }] },
  { label: 'Edit', items: [{ label: 'Undo' }] },
];

export default {
  title: 'Components/Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  argTypes: {
    portal: {control: 'boolean', description: 'Body portal after client mount by default; false keeps inline/server markup and ancestor clipping.'},
    placement: {control: 'select', options: DECLARED_DOMAINS.Menubar["placement"], description: 'Preferred physical side; flips/shifts within the visual viewport. Top/bottom start/end follow inline direction.'},
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    menus: { control: 'object' },
    className: {
      control: 'text',
      description: 'Optional className on root',
    },
  },
  args: { portal: true, menus: MENUS },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Menus',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Menubar {...args} menus={[{ label: 'File', items: [{ label: 'New' }] }]} />
      <Menubar {...args} menus={MENUS} />
    </div>
  ),
};
