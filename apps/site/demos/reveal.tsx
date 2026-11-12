'use client';
import { Button, Card, CardDescription, CardHeader, CardTitle, Reveal, Stagger } from '@cyberskill/design';
import { useState, type ReactNode } from 'react';

const lessons = ['Welcome', 'Your first project', 'Working with data', 'Sharing your work', 'Feedback', 'Next steps', 'Certificate', 'Bonus material'];

/** Remounts its content, so a reveal can be watched again. */
function Replay({ children }: { children: (run: number) => ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 480 }}>
      {children(run)}
      <div><Button variant="secondary" size="sm" onClick={() => setRun(r => r + 1)}>Replay</Button></div>
    </div>
  );
}

export function RevealDemo() {
  return (
    <Replay>
      {run => (
        <Reveal key={run}>
          <Card>
            <CardHeader>
              <CardTitle>Team plan</CardTitle>
              <CardDescription>Shared projects, reviews and progress reports for up to 50 learners.</CardDescription>
            </CardHeader>
          </Card>
        </Reveal>
      )}
    </Replay>
  );
}

export function StaggerDemo() {
  return (
    <Replay>
      {run => (
        <Stagger key={run} render={<ul style={{ display: 'grid', gap: 8, margin: 0, padding: 0, listStyle: 'none' }} />}>
          {lessons.map(lesson => (
            <Reveal key={lesson} render={<li />}>
              <Card><CardHeader><CardTitle>{lesson}</CardTitle></CardHeader></Card>
            </Reveal>
          ))}
        </Stagger>
      )}
    </Replay>
  );
}
