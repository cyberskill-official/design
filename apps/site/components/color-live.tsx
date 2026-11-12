'use client';
import { BookOpen, ChartLineUp, Clock, CreditCard, Exam, Gear, GraduationCap, House, Plus, Sparkle, Trophy, Users } from '@phosphor-icons/react';
import {
  Avatar, Badge, Button, Card, CardDescription, CardFooter, CardTitle, Checkbox, IconTile, Meter, SideNav, SideNavItem, Slider, Stat, Switch,
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Tag, ThemeScope, toneFor, type BadgeTone,
} from '@cyberskill/design';
import type { ReactNode } from 'react';

const STATS = [
  { label: 'Active learners', value: '1,284', icon: <Users />, tone: 'blue', delta: { value: '+12.4%', trend: 'up' } },
  { label: 'Pass rate', value: '86.4%', icon: <Trophy />, tone: 'teal', delta: { value: '+2.1 pts', trend: 'up' } },
  { label: 'Sittings this week', value: '312', icon: <Exam />, tone: 'violet', delta: { value: '−4.0%', trend: 'down' } },
  { label: 'Study time a day', value: '38 min', icon: <Clock />, tone: 'amber', delta: { value: '+6.0%', trend: 'up' } },
] as const;

const SITTINGS: { name: string; exam: string; score: string; result: [BadgeTone, string] }[] = [
  { name: 'Nguyễn Minh Anh', exam: 'CCAF', score: '86%', result: ['success', 'Passed'] },
  { name: 'Trần Quốc Bảo', exam: 'AIFF-F', score: '58%', result: ['danger', 'Below pass'] },
  { name: 'Lê Thu Hà', exam: 'CCAF', score: '91%', result: ['success', 'Passed'] },
  { name: 'Phạm Đức Long', exam: 'AB-100', score: '–', result: ['info', 'In progress'] },
  { name: 'Võ Ngọc Mai', exam: 'CCAR-P', score: '74%', result: ['warning', 'In review'] },
];

const NAV = [['Overview', <House />], ['Courses', <BookOpen />], ['Exams', <Exam />], ['Team', <Users />], ['Billing', <CreditCard />], ['Settings', <Gear />]] as const;

function Dashboard({ theme }: { theme: string }) {
  return (
    <div className="fd-dash-shell">
      <aside className="fd-dash-side">
        <p className="fd-dash-brand"><i aria-hidden="true" />Practice</p>
        <SideNav label={`Sample navigation, ${theme}`}>
          {NAV.map(([name, icon]) => (
            <SideNavItem key={name} href="#color-in-use" icon={icon} active={name === 'Overview'} badge={name === 'Exams' ? 3 : undefined}>{name}</SideNavItem>
          ))}
        </SideNav>
      </aside>
      <div className="fd-dash-main">
        <div className="fd-dash-head">
          <div>
            <h3 className="fd-dash-title">Overview</h3>
            <p className="fd-dash-sub">Team Hoa Sen · 42 learners · sample data</p>
          </div>
          <div className="fd-dash-actions">
            <Button variant="secondary" size="sm">Export</Button>
            <Button size="sm" iconStart={<Plus />}>Invite learner</Button>
          </div>
        </div>
        <div className="fd-dash-stats">
          {STATS.map((s) => <Stat key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone} delta={s.delta} />)}
        </div>
        <div className="fd-dash-cols">
          <Table density="compact">
            <TableCaption>Recent sittings</TableCaption>
            <TableHeader>
              <TableRow><TableHead>Learner</TableHead><TableHead>Exam</TableHead><TableHead numeric>Score</TableHead><TableHead>Result</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {SITTINGS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell><span className="fd-who"><Avatar name={r.name} size="sm" tone={toneFor(r.name)} aria-hidden="true" />{r.name}</span></TableCell>
                  <TableCell className="fd-code">{r.exam}</TableCell>
                  <TableCell numeric>{r.score}</TableCell>
                  <TableCell><Badge tone={r.result[0]} size="sm">{r.result[1]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="fd-dash-right">
            <Card surface="ink">
              <span className="cs-overline">Team plan</span>
              <CardTitle render={<h4 />} className="fd-dash-big">42 of 50 seats in use</CardTitle>
              <Meter label="Seats" value={42} max={50} />
              <CardDescription>Renews 1 Dec 2026</CardDescription>
              <CardFooter>
                <Button variant="accent" size="sm">Add seats</Button>
                <Button variant="ghost" size="sm">Manage</Button>
              </CardFooter>
            </Card>
            <Card tone="accent">
              <div className="fd-dash-card-head">
                <IconTile tone="accent" size="sm"><Sparkle /></IconTile>
                <CardTitle render={<h4 />}>This week, in short</CardTitle>
              </div>
              <CardDescription>Pass rate rose 2.1 points. Most misses are in Domain 3, risk response. Six learners have not practised for 7 days.</CardDescription>
              <CardFooter><Button variant="secondary" size="sm">See weak areas</Button></CardFooter>
            </Card>
            <Card>
              <CardTitle render={<h4 />}>Finish setting up</CardTitle>
              <Meter label="Set-up" value={2} max={3} valueLabel="2 of 3 done" />
              <div className="fd-choices">
                <Checkbox label="Invite your team" defaultChecked />
                <Checkbox label="Pick target exams" defaultChecked />
                <Checkbox label="Set a weekly goal" />
              </div>
              <div className="fd-split"><Switch label="Weekly summary email" defaultChecked /></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The sample screen at the chosen level (tinted + gold controls), in light and in dark. */
export function ColorInUse() {
  return (
    <div className="fd-dash-pair not-prose">
      {(['light', 'dark'] as const).map((theme) => (
        <figure key={theme} className="fd-dash-frame">
          <figcaption>{theme === 'light' ? 'Light' : 'Dark'}</figcaption>
          <ThemeScope theme={theme} className="fd-dash"><Dashboard theme={theme} /></ThemeScope>
        </figure>
      ))}
    </div>
  );
}

const CATEGORIES = [['blue', 'Nguyễn Minh Anh', 'Security', 'CCAF'], ['amber', 'Võ Ngọc Mai', 'Compliance', 'CCAR-P'], ['teal', 'Trần Quốc Bảo', 'Cloud', 'AIFF-F'], ['magenta', 'Lê Thu Hà', 'AI governance', 'AB-100'], ['violet', 'Phạm Đức Long', 'Finance', 'CCAF']] as const;
const TILE_ICONS = { blue: <Users />, amber: <Clock />, teal: <Trophy />, magenta: <GraduationCap />, violet: <Exam /> };

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="fd-g-row"><span className="fd-g-label">{label}</span>{children}</div>;
}

/** Every component that gained a color role, each tone once. */
export function ColorComponents() {
  return (
    <div className="fd-gallery not-prose">
      <Row label="Button">
        <Button size="sm">Save</Button>
        <Button size="sm" variant="secondary">Cancel</Button>
        <Button size="sm" variant="accent" iconStart={<Sparkle />}>Ask AI</Button>
        <Button size="sm" variant="ghost">Skip</Button>
        <Button size="sm" variant="danger">Delete</Button>
      </Row>
      <Row label="Button, soft with a tone">
        <Button size="sm" variant="soft" tone="primary">Save draft</Button>
        <Button size="sm" variant="soft" tone="accent">Ask AI</Button>
        <Button size="sm" variant="soft" tone="success">Approve</Button>
        <Button size="sm" variant="soft" tone="warning">Flag</Button>
        <Button size="sm" variant="soft" tone="danger">Remove</Button>
        <Button size="sm" variant="soft" tone="info">Details</Button>
      </Row>
      <Row label="Icon tile">
        {CATEGORIES.map(([tone]) => <IconTile key={tone} tone={tone}>{TILE_ICONS[tone]}</IconTile>)}
        <IconTile tone="accent"><Sparkle /></IconTile>
        <IconTile tone="primary"><ChartLineUp /></IconTile>
      </Row>
      <Row label="Avatar">
        {CATEGORIES.map(([tone, name]) => <Avatar key={tone} name={name} tone={tone} />)}
      </Row>
      <Row label="Tag">
        {CATEGORIES.map(([tone, , tag]) => <Tag key={tone} tone={tone}>{tag}</Tag>)}
      </Row>
      <Row label="Badge">
        {CATEGORIES.slice(0, 4).map(([tone, , , code]) => <Badge key={tone} tone={tone}>{code}</Badge>)}
        <Badge tone="success">Passed</Badge>
        <Badge tone="warning">In review</Badge>
      </Row>
      <Row label="Gold controls">
        <Switch label="Weekly summary" defaultChecked />
        <Checkbox label="Timed mode" defaultChecked />
        <div className="fd-g-box"><Slider label="Pass mark" defaultValue={72} /></div>
        <div className="fd-g-box"><Meter label="Seats" value={42} max={50} valueLabel="42 of 50" /></div>
      </Row>
    </div>
  );
}
