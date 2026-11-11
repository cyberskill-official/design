import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger, type DrawerSide } from './Drawer';
import { TextField } from './Field';
import { expectNoA11yViolations } from '../test/a11y';

function Example({ side = 'right' }: { side?: DrawerSide }) {
  return (
    <Drawer side={side}>
      <DrawerTrigger render={<Button variant="secondary" />}>Edit agent</DrawerTrigger>
      <DrawerContent
        title="Edit Support Copilot"
        description="Changes apply to new conversations."
        footer={
          <>
            <DrawerClose render={<Button variant="secondary" />}>Cancel</DrawerClose>
            <Button>Save</Button>
          </>
        }
      >
        <TextField label="Name" defaultValue="Support Copilot" />
      </DrawerContent>
    </Drawer>
  );
}

const open = async () => {
  const trigger = screen.getByRole('button', { name: 'Edit agent' });
  await userEvent.click(trigger);
  const drawer = await screen.findByRole('dialog', { name: 'Edit Support Copilot' });
  await expect.poll(() => getComputedStyle(drawer).transform).toBe('matrix(1, 0, 0, 1, 0, 0)'); // slid fully in
  return { trigger, drawer };
};

describe('Drawer', () => {
  it('opens as a labelled modal dialog, moves focus in and restores it on Escape', async () => {
    render(<Example />);
    const { trigger, drawer } = await open();
    expect(drawer).toHaveAccessibleDescription('Changes apply to new conversations.');
    expect(drawer.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes from the × button, a footer DrawerClose and a click outside', async () => {
    render(<Example />);
    await open();
    await userEvent.click(document.body, { position: { x: 10, y: 10 } });
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('docks to the requested edge, with a grab handle only on bottom sheets', async () => {
    for (const side of ['right', 'left', 'bottom'] as const) {
      const { unmount } = render(<Example side={side} />);
      const { drawer } = await open();
      const box = drawer.getBoundingClientRect();
      if (side === 'right') expect(Math.round(box.right)).toBe(window.innerWidth);
      if (side === 'left') expect(Math.round(box.left)).toBe(0);
      if (side === 'bottom') expect(Math.round(box.bottom)).toBe(window.innerHeight);
      expect(getComputedStyle(drawer.querySelector('.cs-drawer-handle')!).display).toBe(side === 'bottom' ? 'block' : 'none');
      unmount();
    }
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { unmount } = render(<Example side="bottom" />);
      await open();
      await expectNoA11yViolations(document.body);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
