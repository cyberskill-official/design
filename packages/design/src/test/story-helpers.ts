import { expect, screen, userEvent, waitFor } from 'storybook/test';

/** Clicks a listbox option once its popup has finished opening, so the click lands where the option stays. */
export async function clickOption(name: string | RegExp): Promise<void> {
  const option = await screen.findByRole('option', { name });
  await waitFor(() => {
    expect(document.querySelector('[data-starting-style]')).toBeNull();
    expect(option).toBeVisible();
  });
  await userEvent.click(option);
}
