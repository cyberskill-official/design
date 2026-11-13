'use client';
import { Sparkle, Trophy, Users } from '@phosphor-icons/react';
import { Badge, Button, Link, Meter, Stat, Switch } from '@cyberskill/design';
import NextLink from 'next/link';
import './foundations.css';

/** One product screen built from the components, shown in both themes. */
export function HomeShowcase() {
  return (
      <section className="fd-home" aria-labelledby="home-preview">
        <div className="fd-home-head">
          <div>
            <h2 id="home-preview">Real components, light and dark</h2>
            <p>One screen built from the package, with nothing custom. Every component ships both themes.</p>
          </div>
          <Link render={<NextLink href="/docs/components" />}>All components</Link>
        </div>
        <div className="home-showcase">
          {(['light', 'dark'] as const).map((theme) => (
            <div key={theme} className="home-panel" data-theme={theme}>
              <div className="fd-home-top">
                <div>
                  <p className="cs-overline">{theme === 'light' ? 'Light' : 'Dark'}</p>
                  <p className="cs-h4">Team Hoa Sen</p>
                </div>
                <Button variant="accent" size="sm" iconStart={<Sparkle />}>Ask AI</Button>
              </div>
              <div className="fd-home-stats">
                <Stat label="Active learners" value="1,284" icon={<Users />} tone="blue" delta={{ value: '+12.4%', trend: 'up' }} />
                <Stat label="Pass rate" value="86.4%" icon={<Trophy />} tone="teal" delta={{ value: '+2.1 pts', trend: 'up' }} />
              </div>
              <Meter label="Seats" value={42} max={50} valueLabel="42 of 50" />
              <Switch label="Weekly summary email" defaultChecked />
              <div className="home-row">
                <Button>Invite learner</Button>
                <Button variant="secondary">Export</Button>
                <Badge tone="success">Passed</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
  );
}
