'use client';
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@cyberskill/design';

const faq = [
  { value: 'billing', q: 'How is usage billed?', a: 'Per message, at the end of each month. You can set a monthly cap in workspace settings.' },
  { value: 'data', q: 'Where is my data stored?', a: 'In the region you pick when you create the workspace. It never leaves that region.' },
  { value: 'sso', q: 'Can I use single sign-on?', a: 'Yes, with any SAML 2.0 or OIDC provider on the Business and Enterprise plans.' },
];

export function AccordionSingle() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Accordion defaultValue={['billing']}>
        {faq.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionPanel>{item.a}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function AccordionMultiple() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Accordion multiple>
        <AccordionItem value="plan">
          <AccordionTrigger>Plan and seats</AccordionTrigger>
          <AccordionPanel>Business plan, 24 of 30 seats used. Renews on 1 December.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="usage">
          <AccordionTrigger>Usage this month</AccordionTrigger>
          <AccordionPanel>184,200 messages of 250,000 included.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="audit" disabled>
          <AccordionTrigger>Audit log (Enterprise)</AccordionTrigger>
          <AccordionPanel>Every change in your workspace.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
