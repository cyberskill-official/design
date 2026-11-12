'use client';
import { Button, Meter, Progress } from '@cyberskill/design';
import { useEffect, useState } from 'react';

export function ProgressUpload() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setValue((v) => Math.min(100, v + 8)), 300);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => { if (value >= 100) setRunning(false); }, [value]);
  return (
    <div style={{ display: 'grid', gap: 16, width: 360, maxWidth: '100%' }}>
      <Progress label="Uploading 3 files" value={value} />
      <Button variant="secondary" size="sm" style={{ justifySelf: 'start' }} disabled={running} onClick={() => { setValue(0); setRunning(true); }}>
        {value >= 100 ? 'Upload again' : 'Start upload'}
      </Button>
    </div>
  );
}

export function ProgressStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: 360, maxWidth: '100%' }}>
      <Progress label="Importing contacts" value={64} />
      <Progress label="Syncing calendar" value={48} tone="primary" />
      <Progress label="Storage" value={86} warnAt={80} />
      <Progress label="Import stopped" value={30} tone="danger" />
      <Progress label="Preparing export" value={null} />
      <Progress label="Retrying sync" value={null} tone="danger" />
    </div>
  );
}

export function MeterUsage() {
  return (
    <div style={{ display: 'grid', gap: 20, width: 360, maxWidth: '100%' }}>
      <Meter label="API calls this month" value={720_000} max={1_000_000} valueLabel="720K of 1M" warnAt={800_000} />
      <Meter label="Storage" value={8.6} max={10} valueLabel="8.6 of 10 GB" warnAt={8} />
      <Meter label="Seats" value={10} max={10} valueLabel="10 of 10" tone="danger" />
    </div>
  );
}
