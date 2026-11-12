import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Autocomplete } from './Autocomplete';
import { Field } from './Field';
import { clickOption } from '../test/story-helpers';

const cities = ['Hà Nội', 'Hải Phòng', 'Huế', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh', 'Cần Thơ'];

/** Waits for the open list to finish its fade-in, so the story's axe check sees final colors. */
async function settle() {
  const popup = await waitFor(() => document.querySelector('.cs-combobox-popup') ?? Promise.reject(new Error('no popup')));
  await waitFor(() => expect(getComputedStyle(popup).opacity).toBe('1'));
}

const meta = {
  title: 'Pickers/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: { 'aria-label': 'Search cities', items: cities, placeholder: 'Search cities', onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <Autocomplete {...args} />
    </div>
  ),
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Search cities' });
    await userEvent.type(input, 'ha');
    await settle();
    await clickOption('Hải Phòng');
    await expect(input).toHaveValue('Hải Phòng');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Hải Phòng', expect.anything());
  },
};

export const Grouped: Story = {
  args: {
    'aria-label': 'Search workspace',
    placeholder: 'Search pages and people',
    items: [
      { label: 'Pages', items: [{ value: 'billing', label: 'Billing', description: 'Settings › Billing' }, { value: 'members', label: 'Members', description: 'Settings › Team' }] },
      { label: 'People', items: ['Linh Nguyen', 'Minh Tran', 'An Pham'] },
    ],
  },
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox', { name: 'Search workspace' }), 'in');
    await settle();
    await expect(screen.getByRole('group', { name: 'People' })).toBeVisible();
  },
};

export const InField: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Field label="City" description="Free text is fine if your city is not listed.">
        <Autocomplete items={cities} icon={null} placeholder="e.g. Đà Lạt" emptyText={null} />
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Autocomplete aria-label="Small" items={cities} size="sm" placeholder="Small" />
      <Autocomplete aria-label="Medium" items={cities} placeholder="Medium" />
      <Autocomplete aria-label="Large" items={cities} size="lg" placeholder="Large" />
    </div>
  ),
};
