import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsList, TabsPanel, TabsTab } from './Tabs';
import { expectAccessibleInThemes } from '../test/a11y';

function Example({ onValueChange }: { onValueChange?: (value: unknown) => void }) {
  return (
    <Tabs defaultValue="overview" onValueChange={onValueChange}>
      <TabsList aria-label="Agent">
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="sources">Sources</TabsTab>
        <TabsTab value="billing" disabled>Billing</TabsTab>
        <TabsTab value="settings">Settings</TabsTab>
      </TabsList>
      <TabsPanel value="overview">Answers 1,284 questions a week.</TabsPanel>
      <TabsPanel value="sources">14 training sources.</TabsPanel>
      <TabsPanel value="billing">Billing</TabsPanel>
      <TabsPanel value="settings">Model and tone.</TabsPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tablist with the default tab selected and its panel labelled by it', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Agent' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Answers 1,284 questions a week.');
  });

  it('clicking a tab shows its panel', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Sources' }));
    expect(onValueChange).toHaveBeenCalledWith('sources', expect.anything());
    expect(screen.getByRole('tabpanel', { name: 'Sources' })).toBeVisible();
  });

  it('arrow keys move between tabs, disabled ones stay discoverable but inert, and Enter activates', async () => {
    render(<Example />);
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Sources' }));
    await userEvent.keyboard('{ArrowRight}{Enter}');
    const billing = screen.getByRole('tab', { name: 'Billing' });
    expect(document.activeElement).toBe(billing);
    expect(billing).toHaveAttribute('aria-disabled', 'true');
    expect(billing).toHaveAttribute('aria-selected', 'false');
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Settings' }));
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Overview' }));
  });

  it('draws the underline indicator under the active tab', () => {
    const { container } = render(<Example />);
    const indicator = container.querySelector('.cs-tabs-indicator')!;
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(indicator.getBoundingClientRect().width).toBeCloseTo(tab.getBoundingClientRect().width, 0);
    expect(getComputedStyle(indicator).height).toBe('2px');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Example />);
  });
});
