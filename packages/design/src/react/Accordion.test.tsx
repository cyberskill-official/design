import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from './Accordion';
import { expectAccessibleInThemes } from '../test/a11y';

function Example(props: { multiple?: boolean; defaultValue?: string[] }) {
  return (
    <Accordion {...props}>
      <AccordionItem value="billing">
        <AccordionTrigger>How is usage billed?</AccordionTrigger>
        <AccordionPanel>Per message, at the end of each month.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="data">
        <AccordionTrigger>Where is my data stored?</AccordionTrigger>
        <AccordionPanel>In the region you pick when you create the workspace.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="sso" disabled>
        <AccordionTrigger>Can I use SSO?</AccordionTrigger>
        <AccordionPanel>On the Enterprise plan.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders each trigger as a button inside a heading, collapsed by default', () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'How is usage billed?' });
    expect(trigger.closest('h3')).not.toBeNull();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Per message, at the end of each month.')).toBeNull();
  });

  it('opens one section at a time and the keyboard toggles it', async () => {
    render(<Example />);
    const billing = screen.getByRole('button', { name: 'How is usage billed?' });
    await userEvent.click(billing);
    expect(billing).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByRole('region', { name: 'How is usage billed?' })).toHaveTextContent('Per message, at the end of each month.');

    const data = screen.getByRole('button', { name: 'Where is my data stored?' });
    data.focus();
    await userEvent.keyboard('{Enter}');
    expect(data).toHaveAttribute('aria-expanded', 'true');
    expect(billing).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => screen.queryByText('Per message, at the end of each month.')).toBeNull();
  });

  it('keeps several sections open with multiple', async () => {
    render(<Example multiple defaultValue={['billing']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Where is my data stored?' }));
    expect(screen.getByRole('button', { name: 'How is usage billed?' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Where is my data stored?' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('a disabled section does not open', async () => {
    render(<Example />);
    const sso = screen.getByRole('button', { name: 'Can I use SSO?' });
    await userEvent.click(sso, { force: true });
    expect(sso).toHaveAttribute('aria-expanded', 'false');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Example defaultValue={['billing']} />);
  });
});
