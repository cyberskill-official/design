'use client';
import { Button, Form, TextField } from '@cyberskill/design';
import { useState } from 'react';

type SignUpValues = { name: string; email: string; password: string };

export function SignUpForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  return (
    <Form
      aria-label="Create your account"
      errors={errors}
      style={{ width: '100%', maxWidth: 400 }}
      onFormSubmit={async (values: SignUpValues) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // stand-in for the server
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
