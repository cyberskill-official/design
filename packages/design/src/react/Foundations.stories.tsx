import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import foundations from '../../tokens/foundations.json';
import { Button } from './Button';
import { Card, CardDescription, CardHeader, CardTitle } from './Card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './Dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from './Drawer';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Reveal } from './Reveal';
import { Switch } from './Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import type { Tone } from './tone';

type Spring = { duration: number; bounce: number };
const F = foundations as unknown as {
  duration: Record<string, string>;
  spring: Record<string, Spring>;
  motion: Record<string, string | [string, string]>;
  'motion-value': Record<string, string>;
};

/** A recipe's value as the tokens define it, e.g. "snappy spring: 0.3s, bounce 0.15" or "180ms on the enter curve". */
function recipeValue(name: string) {
  const v = F.motion[name]!;
  if (typeof v === 'string') return `${v} spring: ${F.spring[v]!.duration}s, bounce ${F.spring[v]!.bounce}`;
  return `${F.duration[v[0]]} on the ${v[1]} curve`;
}

function Sample({ recipes, values = [], children }: { recipes: string[]; values?: string[]; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border)' }}>
      <dl style={{ margin: 0, display: 'grid', gap: 'var(--space-1)' }}>
        {recipes.map(r => (
          <div key={r}>
            <dt className="cs-code">--motion-{r}</dt>
            <dd className="cs-caption" style={{ margin: 0, color: 'var(--muted)' }}>{recipeValue(r)}</dd>
          </div>
        ))}
        {values.map(v => (
          <div key={v}>
            <dt className="cs-code">--motion-{v}</dt>
            <dd className="cs-caption" style={{ margin: 0, color: 'var(--muted)' }}>{F['motion-value'][v]}</dd>
          </div>
        ))}
      </dl>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function MotionRecipes() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ maxWidth: '48rem' }}>
      <Sample recipes={['press', 'release']} values={['press-scale']}>
        <Button variant="secondary">Press and hold</Button>
      </Sample>
      <Sample recipes={['move']}>
        <Switch label="Move the thumb" />
      </Sample>
      <Sample recipes={['pop-in', 'pop-out']} values={['pop-scale']}>
        <Popover>
          <PopoverTrigger render={<Button variant="secondary" />}>Open popover</PopoverTrigger>
          <PopoverContent title="Pop" description="Grows from its trigger, leaves faster than it came." />
        </Popover>
      </Sample>
      <Sample recipes={['modal-in', 'modal-out']} values={['modal-scale']}>
        <Dialog>
          <DialogTrigger render={<Button variant="secondary" />}>Open dialog</DialogTrigger>
          <DialogContent title="Modal" description="Scales in on the smooth spring, with no slide.">
            <DialogFooter><DialogClose render={<Button variant="secondary" />}>Close dialog</DialogClose></DialogFooter>
          </DialogContent>
        </Dialog>
      </Sample>
      <Sample recipes={['sheet-in', 'sheet-out']}>
        <Drawer>
          <DrawerTrigger render={<Button variant="secondary" />}>Open sheet</DrawerTrigger>
          <DrawerContent title="Sheet" description="Slides in from the edge; with reduced motion it fades." footer={<DrawerClose render={<Button variant="secondary" />}>Close sheet</DrawerClose>} />
        </Drawer>
      </Sample>
      <Sample recipes={['reveal']} values={['rise', 'stagger']}>
        <Reveal key={run} style={{ flex: '1 1 12rem' }}>
          <Card><CardHeader><CardTitle render={<h3 />}>Revealed</CardTitle><CardDescription>Fades in and rises, once.</CardDescription></CardHeader></Card>
        </Reveal>
        <Button variant="secondary" onClick={() => setRun(r => r + 1)}>Replay reveal</Button>
      </Sample>
    </div>
  );
}

const TONES = ['primary', 'accent', 'success', 'warning', 'danger', 'info', 'blue', 'amber', 'teal', 'magenta', 'violet'] as const satisfies readonly Tone[];
const swatch = { padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', color: 'var(--tone-text)' } as const;

function ColorRoleTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Tone</TableHead><TableHead>soft</TableHead><TableHead>soft-hover</TableHead><TableHead>line</TableHead><TableHead>text</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {TONES.map(tone => (
          // primary is the tone map's default: .cs-tone without data-tone
          <TableRow key={tone} className="cs-tone" data-tone={tone === 'primary' ? undefined : tone}>
            <TableHead scope="row">{tone}</TableHead>
            <TableCell><div style={{ ...swatch, background: 'var(--tone-soft)' }}>Soft tint</div></TableCell>
            <TableCell><div style={{ ...swatch, background: 'var(--tone-soft-hover)' }}>Hovered tint</div></TableCell>
            <TableCell><div style={{ ...swatch, background: 'var(--tone-soft)', border: '1px solid var(--tone-line)' }}>Tinted edge</div></TableCell>
            <TableCell><div style={{ ...swatch, background: 'var(--panel)' }}>Text on panel</div></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: 'Foundations',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each motion recipe on a sample you can replay, with its value read from the tokens. With reduced motion, movement becomes a fade or ends at once. */
export const Motion: Story = {
  render: () => <MotionRecipes />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // every sample is reachable with Tab, in reading order
    for (const [role, name] of [['button', 'Press and hold'], ['switch', 'Move the thumb'], ['button', 'Open popover'], ['button', 'Open dialog'], ['button', 'Open sheet'], ['button', 'Replay reveal']] as const) {
      await userEvent.tab();
      await expect(canvas.getByRole(role, { name })).toHaveFocus();
    }
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(getComputedStyle(canvasElement.querySelector('.cs-reveal')!).opacity).toBe('1'));
  },
};

/** Every tone's soft, soft-hover, line and text roles through the tone map (`.cs-tone` with `data-tone`), in the current theme. */
export const ColorRoles: Story = {
  name: 'Color roles',
  render: () => <ColorRoleTable />,
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('row');
    await expect(rows).toHaveLength(TONES.length + 1);
    // each row resolves its own tint, so no tone silently falls back to primary
    const tints = new Set(rows.slice(1).map(r => getComputedStyle(r.querySelector('td div')!).backgroundColor));
    await expect(tints.size).toBe(TONES.length);
  },
};
