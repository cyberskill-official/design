'use client';
import { ArrowLeft, ArrowRight, ChartBar, Database, Gear, Plus, Robot, RocketLaunch, UserPlus } from '@phosphor-icons/react';
import {
  Alert,
  Button,
  CommandGroup,
  CommandItem,
  CommandMenu,
  EmptyState,
  FileUpload,
  Kbd,
  Progress,
  Stepper,
  Switch,
  TextField,
  type FileUploadItem,
  type StepperStep,
} from '@cyberskill/design';
import { useEffect, useState } from 'react';

export function OnboardingEmptyPattern() {
  const [open, setOpen] = useState(false);
  const [ran, setRan] = useState<string | null>(null);
  const run = (what: string) => () => setRan(what);
  return (
    <div className="pt-app">
      <div className="pt-onboarding" style={{ maxWidth: 'none' }}>
        <EmptyState
          size="lg"
          headingLevel={2}
          icon={<Robot />}
          title="No agents yet"
          description="An agent answers customers from your help center and hands the hard questions to your team. Setup takes about 10 minutes."
          action={<Button iconStart={<Plus />}>Create your first agent</Button>}
        />
        <p className="pt-tip">
          Tip: press <span><Kbd>⌘</Kbd><Kbd>K</Kbd></span> to jump anywhere.
          <Button variant="link" size="sm" onClick={() => setOpen(true)}>Open the command menu</Button>
        </p>
        {ran && <p className="pt-tip" role="status" style={{ margin: 0 }}>Ran: {ran}</p>}
        {/* ⌘K opens this site's search, so the demo turns the shortcut off; an app keeps the default */}
        <CommandMenu open={open} onOpenChange={setOpen} shortcut={false} placeholder="Search pages and actions…">
          <CommandGroup label="Get started">
            <CommandItem icon={<Plus />} shortcut="⌘N" onSelect={run('New agent')}>New agent</CommandItem>
            <CommandItem icon={<Database />} keywords={['upload', 'documents', 'help center']} onSelect={run('Add training source')}>Add training source</CommandItem>
            <CommandItem icon={<UserPlus />} keywords={['team', 'member']} onSelect={run('Invite teammate')}>Invite teammate</CommandItem>
          </CommandGroup>
          <CommandGroup label="Go to">
            <CommandItem icon={<ChartBar />} onSelect={run('Analytics')}>Analytics</CommandItem>
            <CommandItem icon={<Gear />} keywords={['preferences', 'billing']} onSelect={run('Settings')}>Settings</CommandItem>
          </CommandGroup>
        </CommandMenu>
      </div>
    </div>
  );
}

const stepTitles = ['Connect data', 'Train agent', 'Go live'] as const;
const stepHints = ['Help-center articles and files', 'About 5 minutes', 'Publish to your website'];

export function OnboardingWizardPattern() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<FileUploadItem[]>([
    { id: 'f1', name: 'refund-policy.pdf', size: 482_000 },
    { id: 'f2', name: 'pricing-faq.docx', size: 126_000 },
  ]);
  const [training, setTraining] = useState(0);
  const [live, setLive] = useState(false);

  // Fake upload progress for newly added files; at 100 the list shows them as uploaded
  const uploading = files.some((f) => f.progress != null && f.progress < 100);
  useEffect(() => {
    if (!uploading) return;
    const t = setTimeout(() => setFiles((fs) => fs.map((f) => (f.progress == null ? f : { ...f, progress: Math.min(100, f.progress + 20) }))), 300);
    return () => clearTimeout(t);
  }, [files, uploading]);

  // Fake training run while on step 2
  useEffect(() => {
    if (step !== 1 || training >= 100) return;
    const t = setTimeout(() => setTraining((v) => Math.min(100, v + 8)), 250);
    return () => clearTimeout(t);
  }, [step, training]);

  const steps: StepperStep[] = stepTitles.map((title, i) => ({
    title,
    description: i === 0 && step > 0 ? `${files.length} files` : stepHints[i],
    status: i < step || (i === 2 && live) ? 'complete' : i === step ? 'current' : 'upcoming',
  }));
  const canContinue = step === 0 ? files.length > 0 && !uploading : step === 1 ? training >= 100 : false;

  return (
    <div className="pt-app">
      <div className="pt-onboarding">
        <div className="pt-stack" style={{ gap: 4 }}>
          <h2 className="pt-title">Set up Support Copilot</h2>
          <p className="pt-subtitle">Step {step + 1} of 3</p>
        </div>
        <Stepper aria-label="Agent setup" steps={steps} />

        {step === 0 && (
          <div className="pt-stack">
            <FileUpload
              label="Training files"
              hint="PDF, DOCX, Markdown or CSV, up to 20 MB each"
              accept=".pdf,.docx,.md,.csv"
              multiple
              maxSize={20_000_000}
              files={files}
              onAdd={(added) => setFiles((fs) => [...fs, ...added.map((f) => ({ id: `${f.name}-${f.lastModified}`, name: f.name, size: f.size, progress: 0 }))])}
              onRemove={(item) => setFiles((fs) => fs.filter((f) => f.id !== item.id))}
            />
            <TextField label="Help-center URL" type="url" placeholder="https://help.example.com" optionalLabel="Optional" description="We re-read it every night." />
          </div>
        )}

        {step === 1 && (
          <div className="pt-stack">
            <Progress label={training < 100 ? 'Training on 2 files and 142 articles' : 'Training complete'} value={training} />
            {training >= 100 && (
              <Alert tone="success" title="Support Copilot is ready to test" description="It answered 47 of 50 sample questions from your sources." />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="pt-stack">
            <Switch label="Show the chat widget on northwind.io" description="Visitors see it in the bottom-right corner." checked={live} onCheckedChange={setLive} />
            {live && <Alert tone="success" title="Support Copilot is live" description="New conversations show up in Inbox." />}
          </div>
        )}

        <div className="pt-row">
          {step > 0 && <Button variant="ghost" iconStart={<ArrowLeft />} onClick={() => setStep((s) => s - 1)}>Back</Button>}
          <span className="pt-spacer" />
          {step < 2 ? (
            <Button iconEnd={<ArrowRight />} disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button variant="accent" iconStart={<RocketLaunch />} disabled={!live}>Open Inbox</Button>
          )}
        </div>
      </div>
    </div>
  );
}

