'use client';
import { Switch } from '@cyberskill/design';
import { useState } from 'react';

export function SwitchSettings() {
  const [autoDeploy, setAutoDeploy] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 440 }}>
      <Switch label="Auto-deploy main" description={autoDeploy ? 'Every push to main deploys to production.' : 'Deploys only when you press Deploy.'} checked={autoDeploy} onCheckedChange={setAutoDeploy} />
      <Switch label="Two-factor authentication" description="Ask for a code from your authenticator app at sign-in." defaultChecked />
      <Switch label="Single sign-on" description="Available on the Business plan." disabled />
    </div>
  );
}
