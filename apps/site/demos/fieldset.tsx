'use client';
import { Fieldset, TextField } from '@cyberskill/design';

export function FieldsetDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Fieldset legend="Billing address" description="Printed on every invoice.">
        <TextField label="Company" name="company" defaultValue="Acme Vietnam JSC" />
        <TextField label="Tax code" name="taxCode" defaultValue="0312345678" />
        <TextField label="Address" name="address" />
      </Fieldset>
    </div>
  );
}

export function FieldsetDisabled() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Fieldset legend="Single sign-on" description="Available on the Enterprise plan." disabled>
        <TextField label="Identity provider URL" name="idpUrl" placeholder="https://login.company.vn" />
      </Fieldset>
    </div>
  );
}
