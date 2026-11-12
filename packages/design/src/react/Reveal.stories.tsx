import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Reveal, Stagger } from './Reveal';
import { Card, CardDescription, CardHeader, CardTitle } from './Card';

const lessons = ['Welcome', 'Your first project', 'Working with data', 'Sharing your work', 'Feedback', 'Next steps', 'Certificate', 'Bonus material'];

/** Waits until every reveal has finished, so the a11y check measures the settled page. */
async function settled(canvasElement: HTMLElement) {
  await waitFor(() => {
    for (const el of canvasElement.querySelectorAll('.cs-reveal')) expect(getComputedStyle(el).opacity).toBe('1');
  });
}

const meta = {
  title: 'Motion/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  decorators: [Story => <div style={{ maxWidth: 480 }}><Story /></div>],
  args: {
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Team plan</CardTitle>
          <CardDescription>Fades in and rises 8px once, when the page first shows it.</CardDescription>
        </CardHeader>
      </Card>
    ),
  },
  play: async ({ canvasElement }) => settled(canvasElement),
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One block revealed on first load. With reduced motion it appears at once. */
export const Default: Story = {};

/** Starts after an extra wait, in milliseconds. */
export const Delayed: Story = { args: { delay: 200 } };

/** A list revealed 40ms apart; from the seventh item on they appear with the sixth. */
export const StaggeredList: Story = {
  render: () => (
    <Stagger render={<ul style={{ display: 'grid', gap: 8, margin: 0, padding: 0, listStyle: 'none' }} />}>
      {lessons.map(lesson => <Reveal key={lesson} render={<li />}><Card><CardHeader><CardTitle>{lesson}</CardTitle></CardHeader></Card></Reveal>)}
    </Stagger>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(lessons.length);
    await settled(canvasElement);
  },
};
