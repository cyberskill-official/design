'use client';
import { ArrowClockwise, CaretDown, Copy, PencilSimple, ShareNetwork, Sparkle, Trash } from '@phosphor-icons/react';
import {
  Button, Card, CardDescription, CardTitle, Checkbox, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, Drawer, DrawerClose, DrawerContent, DrawerTrigger,
  Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger, Reveal, SegmentedControl, Stagger, Stat, Switch, Tabs, TabsList, TabsPanel, TabsTab, ToastProvider, useToast,
} from '@cyberskill/design';
import { AnimatedNumber } from '@cyberskill/design/motion';
import { useState, type ReactNode } from 'react';
import { SpeedToggle } from './motion-lab';
import { recipe } from './motion-math';

// Durations in the notes come from the tokens, so the copy cannot drift from what runs.
const ms = (name: string) => `${recipe(name)[0]} ms`;

function Stage({ title, recipes, note, layout, children }: { title: string; recipes: string; note: ReactNode; layout?: 'col' | 'start'; children: ReactNode }) {
  return (
    <article className="fd-stage">
      <header className="fd-stage-head">
        <h3>{title}</h3>
        <span className="fd-recipe">{recipes}</span>
      </header>
      <div className="fd-stage-area" data-layout={layout}>{children}</div>
      <p className="fd-stage-note">{note}</p>
    </article>
  );
}

function ToastStage() {
  const { toast } = useToast();
  return (
    <Stage title="Toast" recipes="move · fade · modal-out" note={<>Rises from just below on the snappy spring while it fades in, and leaves in {ms('modal-out')}. Swipe it away to dismiss.</>}>
      <Button onClick={() => toast({ tone: 'success', title: 'Changes saved', description: 'The pass mark for CCAF is now 72%.' })}>Save changes</Button>
    </Stage>
  );
}

const LEARNERS = [['Nguyễn Minh Anh', '86%'], ['Lê Thu Hà', '91%'], ['Võ Ngọc Mai', '74%']] as const;

function FirstLoadStage() {
  const [run, setRun] = useState(0);
  return (
    <Stage
      title="First load"
      recipes="reveal · stagger"
      layout="col"
      note={<><code>Stagger</code> and <code>Reveal</code> are plain CSS: up to six blocks rise 8 px, one after another, on <code>--motion-reveal</code> ({ms('reveal')}). <code>AnimatedNumber</code> from the motion entry counts the headline up. Once per page load, never on scroll.</>}
    >
      <Stagger key={run} className="fd-reveal">
        <Reveal>
          <Stat label="Active learners" value={<AnimatedNumber value={1284} from={0} locale="en-US" />} delta={{ value: '+12.4%', trend: 'up' }} hint="vs last month" />
        </Reveal>
        {LEARNERS.map(([name, score]) => (
          <Reveal key={name}>
            <div className="fd-row"><span>{name}</span><span className="fd-num">{score}</span></div>
          </Reveal>
        ))}
      </Stagger>
      <Button variant="ghost" size="sm" iconStart={<ArrowClockwise />} onClick={() => setRun(run + 1)} style={{ alignSelf: 'center' }}>Replay</Button>
    </Stage>
  );
}

/** The eight stages, built from the real components. Every one animates through the --motion-* recipes. */
export function MotionStages() {
  return (
    <ToastProvider>
      <div className="fd-block not-prose">
        <div className="fd-panel-head">
          <p className="fd-note">Press, open and toggle each one. Slow them down to study a curve.</p>
          <SpeedToggle />
        </div>
        <div className="fd-stages">
          <Stage title="Press and hover" recipes="press · release · state" note={<>Buttons scale to 0.97 in {ms('press')} when the pointer goes down and spring back on release. Hover colors change on <code>--motion-state</code> ({ms('state')}), and the card lifts 2 px on hover, on pointer devices only.</>}>
            <Button>Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="accent" iconStart={<Sparkle />}>Ask AI</Button>
            <Card interactive render={<a href="#components-in-motion" />}>
              <CardTitle render={<span />}>CCAF mock 3</CardTitle>
              <CardDescription>40 questions · 60 min</CardDescription>
            </Card>
          </Stage>

          <Stage title="Switch and checkbox" recipes="move · state" layout="start" note={<>The thumb travels on the snappy spring (<code>--motion-move</code>). The gold fill arrives on <code>--motion-state</code>.</>}>
            <div className="fd-choices">
              <Switch label="Weekly summary email" defaultChecked />
              <Switch label="Show me on the leaderboard" />
              <Checkbox label="Shuffle the answer order" defaultChecked />
              <Checkbox label="Timed mode" />
            </div>
          </Stage>

          <Stage title="Tabs and segments" recipes="move" layout="col" note={<>The tab line and the segment thumb are one object that travels on <code>--motion-move</code>, so the eye follows the change.</>}>
            <Tabs defaultValue="overview">
              <TabsList aria-label="Exam sections">
                <TabsTab value="overview">Overview</TabsTab>
                <TabsTab value="results">Results</TabsTab>
                <TabsTab value="members">Members</TabsTab>
              </TabsList>
              <TabsPanel value="overview" className="fd-note">CCAF · 40 questions · pass mark 72%</TabsPanel>
              <TabsPanel value="results" className="fd-note">312 sittings this week, 86.4% passed</TabsPanel>
              <TabsPanel value="members" className="fd-note">42 learners in Team Hoa Sen</TabsPanel>
            </Tabs>
            <SegmentedControl label="Period" items={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} style={{ alignSelf: 'center' }} />
          </Stage>

          <Stage title="Menu" recipes="pop-in · pop-out" note={<>Grows from its button, from 96% and transparent, in {ms('pop-in')} and leaves in {ms('pop-out')}. A small move on purpose: menus open all day.</>}>
            <Menu>
              <MenuTrigger render={<Button variant="secondary" iconEnd={<CaretDown />} />}>Actions</MenuTrigger>
              <MenuContent>
                <MenuItem icon={<PencilSimple />} shortcut="R">Rename</MenuItem>
                <MenuItem icon={<Copy />} shortcut="D">Duplicate</MenuItem>
                <MenuItem icon={<ShareNetwork />}>Share with team</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<Trash />} tone="danger">Delete</MenuItem>
              </MenuContent>
            </Menu>
          </Stage>

          <Stage title="Dialog" recipes="modal-in · modal-out" note={<>Scales up from 96% on the smooth spring, with no slide, and leaves in {ms('modal-out')}. The backdrop fades.</>}>
            <Dialog>
              <DialogTrigger render={<Button variant="secondary" iconStart={<Trash />} />}>Delete exam…</DialogTrigger>
              <DialogContent size="sm" icon={<Trash />} tone="danger" title="Delete “CCAF mock 3”?" description="12 learners have results on it. This cannot be undone.">
                <DialogFooter>
                  <DialogClose render={<Button variant="secondary" />}>Keep it</DialogClose>
                  <DialogClose render={<Button variant="danger" />}>Delete</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Stage>

          <Stage title="Sheet" recipes="sheet-in · sheet-out" layout="start" note={<>Rises in {ms('sheet-in')} on the sheet curve and leaves in {ms('sheet-out')}. Swipe it down to dismiss.</>}>
            <span className="cs-caption">Sitting · CCAF</span>
            <strong>Question 14 of 40</strong>
            <Drawer side="bottom">
              <DrawerTrigger render={<Button variant="secondary" size="sm" />}>Review answers</DrawerTrigger>
              <DrawerContent title="Review answers" description="CCAF mock 3 · 40 questions" size="sm" footer={<DrawerClose render={<Button fullWidth />}>Done</DrawerClose>}>
                <ul className="fd-rows">
                  <li><span>Answered</span><span className="fd-num">11</span></li>
                  <li><span>Flagged</span><span className="fd-num">2</span></li>
                  <li><span>Not answered</span><span className="fd-num">27</span></li>
                </ul>
              </DrawerContent>
            </Drawer>
          </Stage>

          <ToastStage />
          <FirstLoadStage />
        </div>
      </div>
    </ToastProvider>
  );
}
