import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Fieldset } from './Fieldset';
import { TextField } from './Field';
import { expectAccessibleInThemes } from '../test/a11y';

function Example({ disabled }: { disabled?: boolean }) {
  return (
    <Fieldset legend="Billing address" description="Printed on every invoice." disabled={disabled}>
      <TextField label="Company" name="company" />
      <TextField label="Tax code" name="taxCode" />
    </Fieldset>
  );
}

describe('Fieldset', () => {
  it('renders a group named by its legend and described by its help text', () => {
    render(<Example />);
    const group = screen.getByRole('group', { name: 'Billing address' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group).toHaveAccessibleDescription('Printed on every invoice.');
    expect(screen.getByLabelText('Company')).toBeVisible();
  });

  it('disables every control inside', () => {
    render(<Example disabled />);
    expect(screen.getByLabelText('Company')).toBeDisabled();
    expect(screen.getByLabelText('Tax code')).toBeDisabled();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Example />);
  });
});
