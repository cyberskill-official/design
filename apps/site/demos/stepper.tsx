'use client';
import { Stepper, type StepperStep } from '@cyberskill/design';

const steps: StepperStep[] = [
  { title: 'Connect sources', description: '14 documents synced', status: 'complete' },
  { title: 'Train agent', description: 'About 5 minutes', status: 'current' },
  { title: 'Test answers', description: 'Try it in the playground', status: 'upcoming' },
  { title: 'Go live', status: 'upcoming' },
];

export function StepperHorizontal() {
  return <Stepper steps={steps} aria-label="Agent setup" style={{ width: '100%' }} />;
}

export function StepperVertical() {
  return <Stepper steps={steps} orientation="vertical" aria-label="Agent setup" style={{ maxWidth: 320 }} />;
}
