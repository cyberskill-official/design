import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { MultiSelect, MultiSelectField } from './MultiSelect';

const skills = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'python', label: 'Python' },
  { value: 'figma', label: 'Figma', description: 'Design' },
];

/** Waits for the open list to finish its fade-in, so the story's axe check sees final colors. */
async function settle() {
  const popup = await waitFor(() => document.querySelector('.cs-combobox-popup') ?? Promise.reject(new Error('no popup')));
  await waitFor(() => expect(getComputedStyle(popup).opacity).toBe('1'));
}

const meta = {
  title: 'Pickers/MultiSelect',
  component: MultiSelectField,
  tags: ['autodocs'],
  args: { label: 'Skills', items: skills, placeholder: 'Add skills', onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 400 }}>
      <MultiSelectField {...args} />
    </div>
  ),
} satisfies Meta<typeof MultiSelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Skills' });
    await userEvent.type(input, 'ty');
    // Click only once the list has finished opening and filtering, so the option is where it will stay.
    const option = await screen.findByRole('option', { name: 'TypeScript' });
    await waitFor(() => {
      expect(document.querySelector('.cs-combobox-popup[data-starting-style]')).toBeNull();
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });
    await userEvent.click(option);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['ts'], expect.anything());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await waitFor(() => expect(within(canvasElement).getByRole('button', { name: 'Remove TypeScript' })).toBeVisible());
  },
};

export const Selected: Story = {
  args: { defaultValue: ['react', 'ts', 'go'], description: 'Shown on your public profile.' },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Remove Go' }));
    await expect(args.onValueChange).toHaveBeenCalledWith(['react', 'ts'], expect.anything());
  },
};

export const MaxAndOverflow: Story = {
  args: { label: 'Reviewers', defaultValue: ['react', 'ts', 'node', 'go'], max: 4, maxChips: 2, description: 'Up to 4 reviewers.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('+2')).toBeVisible();
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Reviewers' }));
    await settle();
    await expect(screen.getByRole('option', { name: 'Rust' })).toHaveAttribute('aria-disabled', 'true');
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 400 }}>
      <MultiSelectField label="Tags" items={skills} defaultValue={['react']} error="Add at least two tags." />
      <MultiSelectField label="Locked" items={skills} defaultValue={['ts', 'go']} disabled />
      <MultiSelect aria-label="Small" items={skills} defaultValue={['node']} size="sm" />
      <MultiSelect aria-label="Large" items={skills} defaultValue={['node']} size="lg" removeLabel={l => `Bỏ ${l}`} />
    </div>
  ),
};
