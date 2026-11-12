'use client';
import { Check } from '@phosphor-icons/react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SegmentedControl,
} from '@cyberskill/design';
import { useState } from 'react';

type Cycle = 'monthly' | 'yearly';

const plans = [
  {
    name: 'Starter',
    blurb: 'For trying an agent on one channel.',
    price: { monthly: 0, yearly: 0 },
    unit: 'free forever',
    cta: 'Start free',
    features: ['1 agent', '500 messages a month', 'Website chat widget', 'Community support'],
  },
  {
    name: 'Team',
    blurb: 'For support teams handing work to AI.',
    price: { monthly: 24, yearly: 19 },
    unit: 'per seat / month',
    cta: 'Start 14-day trial',
    popular: true,
    features: ['5 agents', '50,000 messages a month', 'Email, chat and WhatsApp', 'Hand-off to your helpdesk', 'Analytics and CSAT'],
  },
  {
    name: 'Business',
    blurb: 'For companies with security reviews.',
    price: { monthly: 49, yearly: 39 },
    unit: 'per seat / month',
    cta: 'Talk to sales',
    features: ['Unlimited agents', '250,000 messages a month', 'SSO and SCIM', 'Audit log and data residency', '99.9% uptime SLA'],
  },
] as const;

const faqs = [
  ['What counts as a message?', 'Every reply an agent sends counts as one message. Messages from customers and from your team are free.'],
  ['Can I change plans later?', 'Yes. Upgrades apply at once and are prorated; downgrades take effect at the next renewal.'],
  ['What happens when I reach my message limit?', 'Agents stop starting new conversations and hand them to your team. We email the workspace owners at 80% and 100%.'],
  ['Do you offer discounts for non-profits?', 'Registered non-profits and schools get 50% off the Team plan. Write to us from your organization’s email.'],
] as const;

export function PricingPattern() {
  const [cycle, setCycle] = useState<Cycle>('monthly');
  return (
    <div className="pt-app">
      <div className="pt-pricing">
        <div className="pt-center">
          <h2 className="pt-title" style={{ fontSize: 30, lineHeight: '36px' }}>Simple plans that grow with your team</h2>
          <p className="pt-subtitle">Every plan includes unlimited conversation history and the website widget.</p>
          <SegmentedControl<Cycle>
            label="Billing cycle"
            items={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly · save 20%' }]}
            value={cycle}
            onValueChange={setCycle}
          />
        </div>

        <div className="pt-plans">
          {plans.map((plan) => {
            const popular = 'popular' in plan && plan.popular;
            const price = plan.price[cycle];
            return (
              <Card key={plan.name} className={popular ? 'pt-plan-featured' : undefined}>
                <CardHeader>
                  <div className="pt-row">
                    <CardTitle>{plan.name}</CardTitle>
                    {popular && <Badge tone="accent" size="sm">Most popular</Badge>}
                  </div>
                  <CardDescription>{plan.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="pt-price" style={{ margin: 0 }}>
                    ${price}
                    <small>{plan.unit}</small>
                  </p>
                  {cycle === 'yearly' && price > 0 && <span className="pt-muted" style={{ fontSize: 13 }}>Billed ${price * 12} a year per seat</span>}
                  <ul className="pt-features" aria-label={`${plan.name} includes`}>
                    {plan.features.map((f) => (
                      <li key={f}><Check size={16} aria-hidden />{f}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button fullWidth variant={popular ? 'primary' : 'secondary'}>{plan.cta}</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <section className="pt-faq pt-stack" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="pt-title" style={{ fontSize: 20 }}>Questions</h2>
          <Accordion>
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionPanel>{a}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
