import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
// Default entry is precompiled ESM. The subpath is compiled ESM too; both must
// share the package's actual FormField association module, not duplicate it.
import { Button, Form, FormField, NumberField } from '@cyberskill/design';
import { Combobox } from '@cyberskill/design/components/forms/Combobox.jsx';
import '@cyberskill/design/styles.min.css';
import './styles.css';

function App() {
  const [submitted, setSubmitted] = useState(null);
  return (
    <main className="consumer-page">
      <h1>Plan a workshop</h1>
      <p>Choose a city and reserve seats.</p>
      <Form initialValues={{ city: '', seats: 2 }} rules={{ city: 'required' }} onSubmit={setSubmitted}>
        <FormField label="City" name="city" required hint="Choose the workshop location.">
          <Combobox lang="en" options={[
            { value: 'hanoi', label: 'Hanoi' },
            { value: 'hcm', label: 'Ho Chi Minh City' },
          ]} controlProps={{ id: 'workshop-city' }} />
        </FormField>
        <FormField label="Seats" name="seats" hint="Reserve between one and ten seats.">
          <NumberField lang="en" min={1} max={10} />
        </FormField>
        <Button type="submit">Reserve seats</Button>
      </Form>
      <output aria-live="polite" data-testid="submission">
        {submitted ? `Reserved ${submitted.seats} seats in ${submitted.city === 'hcm' ? 'Ho Chi Minh City' : 'Hanoi'}.` : 'No reservation yet.'}
      </output>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
