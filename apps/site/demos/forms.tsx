'use client';
import { Button, Checkbox, Radio, RadioGroup, SelectField, TextField } from '@cyberskill/design';
import { FormField } from '@cyberskill/design/forms';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Values = { email: string; plan: string | null; billing: string | null; terms: boolean };

const plans = [
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
];

export function FormFieldDemo() {
  const [sent, setSent] = useState<Values | null>(null);
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { email: '', plan: null, billing: null, terms: false } });
  return (
    <form noValidate onSubmit={handleSubmit(setSent)} style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <FormField
        control={control}
        name="email"
        rules={{ required: 'Enter a work email.', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email, like name@company.vn.' } }}
        render={({ field, error }) => <TextField label="Work email" type="email" placeholder="name@company.vn" {...field} error={error} />}
      />
      <FormField
        control={control}
        name="plan"
        rules={{ required: 'Choose a plan.' }}
        render={({ field, error }) => (
          <SelectField label="Plan" placeholder="Choose a plan" items={plans} name={field.name} value={field.value} onValueChange={field.onChange} onBlur={field.onBlur} ref={field.ref} error={error} />
        )}
      />
      <FormField
        control={control}
        name="billing"
        rules={{ required: 'Choose a billing cycle.' }}
        render={({ field, error }) => (
          <RadioGroup label="Billing cycle" name={field.name} value={field.value} onValueChange={field.onChange} inputRef={field.ref} error={error}>
            <Radio value="monthly" label="Monthly" />
            <Radio value="yearly" label="Yearly" description="Two months free." />
          </RadioGroup>
        )}
      />
      <FormField
        control={control}
        name="terms"
        rules={{ validate: (accepted) => accepted || 'Accept the terms to continue.' }}
        render={({ field, error }) => (
          <Checkbox label="I accept the terms of service" name={field.name} checked={field.value} onCheckedChange={field.onChange} inputRef={field.ref} error={error} />
        )}
      />
      <div>
        <Button type="submit">Start trial</Button>
      </div>
      {sent && <pre className="cs-code" style={{ margin: 0 }}>{JSON.stringify(sent, null, 2)}</pre>}
    </form>
  );
}
