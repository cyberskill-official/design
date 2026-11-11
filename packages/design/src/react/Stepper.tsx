import { Check } from '@phosphor-icons/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export type StepStatus = 'complete' | 'current' | 'upcoming';
export type StepperStep = { title: ReactNode; description?: ReactNode; status: StepStatus };

export type StepperProps = HTMLAttributes<HTMLOListElement> & {
  className?: string;
  steps: StepperStep[];
  orientation?: 'horizontal' | 'vertical';
  /** Status read by screen readers after each title. Pass Vietnamese strings in Vietnamese UIs. */
  statusLabels?: Record<StepStatus, string>;
};

const defaultStatusLabels: Record<StepStatus, string> = { complete: 'Completed', current: 'Current step', upcoming: 'Not started' };

/** Progress through a fixed sequence (onboarding, a setup wizard). Display only: steps are not links. */
export function Stepper({ steps, orientation = 'horizontal', statusLabels = defaultStatusLabels, className, ...props }: StepperProps) {
  return (
    <ol {...props} data-orientation={orientation} className={cx('cs-stepper', className)}>
      {steps.map((step, i) => (
        <li key={i} className="cs-stepper-step" data-status={step.status} aria-current={step.status === 'current' ? 'step' : undefined}>
          <span className="cs-stepper-bar" aria-hidden="true" />
          <span className="cs-stepper-title">
            {step.status === 'complete' && <Check className="cs-stepper-check" aria-hidden="true" />}
            {step.title}
            <span className="cs-visually-hidden">, {statusLabels[step.status]}</span>
          </span>
          {step.description && <span className="cs-stepper-description">{step.description}</span>}
        </li>
      ))}
    </ol>
  );
}
