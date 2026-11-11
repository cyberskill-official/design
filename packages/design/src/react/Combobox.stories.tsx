import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Combobox, ComboboxField, type ComboboxItem } from './Combobox';
import { clickOption } from '../test/story-helpers';

const regions: ComboboxItem[] = [
  { value: 'sgn', label: 'Ho Chi Minh City', description: 'ap-southeast-1' },
  { value: 'han', label: 'Hanoi', description: 'ap-southeast-2' },
  { value: 'dad', label: 'Da Nang', description: 'ap-southeast-3' },
  { value: 'sin', label: 'Singapore', description: 'ap-southeast-4' },
  { value: 'tyo', label: 'Tokyo', description: 'Coming soon', disabled: true },
];

const people: ComboboxItem[] = ['Linh Nguyen', 'Minh Tran', 'An Pham', 'Bao Le', 'Chi Vo', 'Duc Hoang'].map(name => ({ value: name.toLowerCase().replace(' ', '-'), label: name }));

/** Waits for the open list to finish its fade-in, so the story's axe check sees final colors. */
async function settle() {
  const popup = await waitFor(() => document.querySelector('.cs-combobox-popup') ?? Promise.reject(new Error('no popup')));
  await waitFor(() => expect(getComputedStyle(popup).opacity).toBe('1'));
}

const meta = {
  title: 'Pickers/Combobox',
  component: ComboboxField,
  tags: ['autodocs'],
  args: { label: 'Region', items: regions, placeholder: 'Search regions', onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <ComboboxField {...args} />
    </div>
  ),
} satisfies Meta<typeof ComboboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Region' });
    await userEvent.type(input, 'sing');
    await settle();
    await clickOption(/Singapore/);
    await expect(args.onValueChange).toHaveBeenCalledWith('sin', expect.anything());
    await expect(input).toHaveValue('Singapore');
  },
};

export const Open: Story = {
  args: { defaultValue: 'han' },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Region' }));
    await settle();
    await expect(screen.getByRole('option', { name: /Hanoi/ })).toHaveAttribute('aria-selected', 'true');
  },
};

export const NoResults: Story = {
  args: { emptyText: 'Không tìm thấy khu vực' },
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox', { name: 'Region' }), 'Paris');
    await settle();
    await expect(screen.getByText('Không tìm thấy khu vực')).toBeVisible();
  },
};

export const WithHelpAndError: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 360 }}>
      <ComboboxField label="Region" items={regions} description="Where your data is stored." />
      <ComboboxField label="Backup region" items={regions} error="Choose a different region from the primary." defaultValue="sgn" />
      <ComboboxField label="Locked" items={regions} defaultValue="han" disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Combobox aria-label="Small" items={regions} size="sm" placeholder="Small" />
      <Combobox aria-label="Medium" items={regions} placeholder="Medium" />
      <Combobox aria-label="Large" items={regions} size="lg" placeholder="Large" />
    </div>
  ),
};

export const CustomOptions: Story = {
  args: { label: 'Assignee', items: people, placeholder: 'Search people', children: item => <span style={{ fontWeight: 500 }}>@{item.value}</span> },
};

function AsyncSearch() {
  const [items, setItems] = useState<ComboboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div style={{ maxWidth: 360 }}>
      <ComboboxField
        label="Assignee"
        placeholder="Type a name"
        items={items}
        loading={loading}
        loadingText="Searching…"
        filter={null}
        onInputValueChange={(query, { reason }) => {
          if (reason === 'item-press') return;
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            setItems(people.filter(p => p.label.toLowerCase().includes(query.trim().toLowerCase())));
            setLoading(false);
          }, 400);
        }}
      />
    </div>
  );
}

export const Async: Story = {
  render: () => <AsyncSearch />,
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox', { name: 'Assignee' }), 'minh');
        await screen.findByRole('option', { name: 'Minh Tran' }, { timeout: 4000 });
    await settle();
  },
};
