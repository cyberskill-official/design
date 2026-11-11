import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { TextField } from './Field';
import { Fieldset } from './Fieldset';
import { Form } from './Form';

type SignUpValues = { name: string; email: string; password: string };

function SignUp() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  return (
    <Form
      aria-label="Create your account"
      errors={errors}
      style={{ maxWidth: 400 }}
      onFormSubmit={async (values: SignUpValues) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 300)); // stand-in for the server
        setLoading(false);
        if (values.email.toLowerCase().endsWith('@acme.vn')) setErrors({ email: 'An account with this email already exists. Sign in instead.' });
        else setDone(values.name);
      }}
    >
      <TextField label="Full name" name="name" autoComplete="name" required />
      <TextField label="Work email" name="email" type="email" autoComplete="email" required description="Try linh@acme.vn to see a server error." />
      <TextField label="Password" name="password" type="password" autoComplete="new-password" required minLength={8} description="At least 8 characters." />
      <Button type="submit" loading={loading}>Create account</Button>
      {done && <p role="status" className="cs-ui" style={{ margin: 0 }}>Welcome, {done}.</p>}
    </Form>
  );
}

const meta = {
  title: 'Structure/Form',
  component: Form,
  tags: ['autodocs'],
  render: () => <SignUp />,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignUpForm: Story = {};

export const NativeErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    const name = canvas.getByRole('textbox', { name: 'Full name' });
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveFocus();
  },
};

export const ServerError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Full name' }), 'Linh Tran');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Work email' }), 'linh@acme.vn');
    await userEvent.type(canvas.getByLabelText(/^Password/), 'correct-horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(canvas.getByText('An account with this email already exists. Sign in instead.')).toBeVisible());
    await expect(canvas.getByRole('textbox', { name: 'Work email' })).toHaveAttribute('aria-invalid', 'true');
  },
};

export const GroupedWithFieldsets: Story = {
  render: () => (
    <Form aria-label="Workspace settings" style={{ maxWidth: 420 }} onFormSubmit={() => {}}>
      <Fieldset legend="Workspace" description="Shown to everyone you invite.">
        <TextField label="Name" name="workspace" defaultValue="Acme Support" required />
        <TextField label="Address" name="slug" startAdornment="https://" endAdornment=".cyberskill.world" defaultValue="acme" />
      </Fieldset>
      <Fieldset legend="Billing contact">
        <TextField label="Email" name="billingEmail" type="email" defaultValue="finance@acme.vn" />
      </Fieldset>
      <Button type="submit">Save changes</Button>
    </Form>
  ),
};
