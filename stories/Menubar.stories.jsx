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
    menus: { control: 'object' },
    className: {
      control: 'text',
      description: 'Optional className on root',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Menubar. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { menus: MENUS },
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
