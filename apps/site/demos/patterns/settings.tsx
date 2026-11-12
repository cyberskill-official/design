'use client';
import { Trash } from '@phosphor-icons/react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Fieldset,
  Form,
  Meter,
  Radio,
  RadioGroup,
  SelectField,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  TextField,
  ToastProvider,
  useToast,
} from '@cyberskill/design';
import { useState } from 'react';

const timezones = [
  { value: 'Asia/Ho_Chi_Minh', label: '(UTC+07:00) Ho Chi Minh City' },
  { value: 'Asia/Singapore', label: '(UTC+08:00) Singapore' },
  { value: 'Europe/London', label: '(UTC+00:00) London' },
  { value: 'America/New_York', label: '(UTC−05:00) New York' },
];
const languages = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'ja', label: '日本語' },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The site has no app-wide ToastProvider, so the demo brings its own. In an app, wrap the root once.
export function SettingsPattern() {
  return (
    <ToastProvider>
      <Settings />
    </ToastProvider>
  );
}

function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function save(values: Record<string, unknown>, what: string) {
    setSaving(true);
    await wait(700);
    setSaving(false);
    if (String(values.email ?? '').endsWith('@example.com')) {
      setErrors({ email: 'Use your work email, not a personal one.' });
      return;
    }
    toast({ tone: 'success', title: `${what} saved` });
  }

  return (
    <div className="pt-app">
      <div className="pt-settings">
        <div className="pt-stack" style={{ gap: 4 }}>
          <h2 className="pt-title">Settings</h2>
          <p className="pt-subtitle">Northwind workspace</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList aria-label="Settings">
            <TabsTab value="profile">Profile</TabsTab>
            <TabsTab value="notifications">Notifications</TabsTab>
            <TabsTab value="billing">Billing</TabsTab>
            <TabsTab value="danger">Danger zone</TabsTab>
          </TabsList>

          <TabsPanel value="profile">
            <Form className="pt-panel" errors={errors} onFormSubmit={(v) => save(v, 'Profile')} aria-label="Profile">
              <Fieldset legend="Personal details" description="Shown to teammates in conversations and audit logs.">
                <div className="pt-two">
                  <TextField label="Full name" name="name" defaultValue="Linh Tran" required autoComplete="name" />
                  <TextField label="Work email" name="email" type="email" defaultValue="linh@northwind.io" required autoComplete="email" />
                </div>
                <TextField label="Job title" name="title" defaultValue="Support lead" optionalLabel="Optional" />
              </Fieldset>
              <Fieldset legend="Regional">
                <div className="pt-two">
                  <SelectField label="Time zone" name="timezone" items={timezones} defaultValue="Asia/Ho_Chi_Minh" />
                  <SelectField label="Language" name="language" items={languages} defaultValue="en" description="Used for emails and the dashboard." />
                </div>
              </Fieldset>
              <div className="pt-form-actions">
                <Button type="reset" variant="ghost">Discard</Button>
                <Button type="submit" loading={saving}>Save profile</Button>
              </div>
            </Form>
          </TabsPanel>

          <TabsPanel value="notifications">
            <div className="pt-panel">
              {/* Switches apply at once, so this panel has no save button */}
              <Fieldset legend="Email me when" description="Changes apply right away.">
                <Switch label="A conversation is handed to a person" description="Only for conversations assigned to you." defaultChecked
                  onCheckedChange={(on) => toast({ title: on ? 'Hand-off emails on' : 'Hand-off emails off' })} />
                <Switch label="An agent fails to answer" description="When the same question goes unanswered 3 times in an hour." defaultChecked />
                <Switch label="Product news" description="About one email a month." />
              </Fieldset>
              <RadioGroup label="Summary email" description="A digest of conversations, resolution rate and CSAT." defaultValue="weekly"
                onValueChange={() => toast({ tone: 'success', title: 'Summary email updated' })}>
                <Radio value="daily" label="Daily" description="Every weekday at 9:00." />
                <Radio value="weekly" label="Weekly" description="Mondays at 9:00." />
                <Radio value="never" label="Never" />
              </RadioGroup>
            </div>
          </TabsPanel>

          <TabsPanel value="billing">
            <Form className="pt-panel" onFormSubmit={(v) => save(v, 'Billing details')} aria-label="Billing">
              <Card>
                <CardHeader>
                  <div className="pt-row">
                    <CardTitle>Team plan</CardTitle>
                    <Badge tone="success" size="sm">Active</Badge>
                  </div>
                  <CardDescription>$24 per seat per month · 8 seats · renews on 1 December 2026</CardDescription>
                </CardHeader>
                <Meter label="Messages this month" value={43_000} max={50_000} valueLabel="43,000 of 50,000" warnAt={40_000} />
                <CardFooter>
                  <Button variant="secondary" size="sm">Change plan</Button>
                  <Button variant="ghost" size="sm">Download invoices</Button>
                </CardFooter>
              </Card>
              <RadioGroup label="Billing cycle" name="cycle" defaultValue="monthly">
                <Radio value="monthly" label="Monthly" description="$192 billed on the 1st of each month." />
                <Radio value="yearly" label="Yearly" description="$1,843 billed once a year. Two months free." />
              </RadioGroup>
              <Fieldset legend="Invoice details" description="Printed on every invoice.">
                <div className="pt-two">
                  <TextField label="Company" name="company" defaultValue="Northwind Trading Co." required />
                  <TextField label="Tax ID" name="taxId" defaultValue="0312 456 789" optionalLabel="Optional" />
                </div>
                <TextField label="Billing email" name="billingEmail" type="email" defaultValue="finance@northwind.io" required />
              </Fieldset>
              <div className="pt-form-actions">
                <Button type="submit" loading={saving}>Save billing details</Button>
              </div>
            </Form>
          </TabsPanel>

          <TabsPanel value="danger">
            <div className="pt-panel">
              <Card className="pt-danger">
                <CardHeader>
                  <CardTitle>Delete this workspace</CardTitle>
                  <CardDescription>
                    Removes 3 agents, 24,318 conversations and every training source. Members lose access at once. This cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button variant="danger" iconStart={<Trash />} />}>Delete workspace</AlertDialogTrigger>
                    <AlertDialogContent
                      title="Delete the Northwind workspace?"
                      description="All agents, conversations and training sources are deleted for every member. This cannot be undone."
                      confirmLabel="Delete workspace"
                      onConfirm={async () => {
                        await wait(1200);
                        toast({ tone: 'success', title: 'Workspace deleted', description: 'This is a demo: nothing was deleted.' });
                      }}
                    />
                  </AlertDialog>
                </CardFooter>
              </Card>
            </div>
          </TabsPanel>
        </Tabs>
      </div>
    </div>
  );
}
