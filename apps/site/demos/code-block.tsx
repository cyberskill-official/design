'use client';
import { ArrowClockwise, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import { CodeBlock, CopyButton, Toolbar, ToolbarButton, ToolbarSeparator } from '@cyberskill/design';

const usage = `import { Button } from '@cyberskill/design';
import '@cyberskill/design/styles.css';

export function Save() {
  return <Button onClick={() => save({ draft: false, notify: ['owner', 'billing'], retryOnConflict: true })}>Save</Button>;
}`;

export function CodeBlockDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <CodeBlock code={usage} title="app/save.tsx" language="tsx" />
    </div>
  );
}

export function CodeBlockVariants() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 560 }}>
      <CodeBlock code="npm install @cyberskill/design" />
      <CodeBlock code={usage} language="tsx" variant="inverted" />
      <CodeBlock code={usage} language="tsx" wrap />
    </div>
  );
}

export function CopyButtonDemo() {
  return (
    <div className="cs-ui" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <code style={{ fontFamily: 'var(--font-mono)' }}>ws_8f3k2q</code>
      <CopyButton value="ws_8f3k2q" label="Copy workspace ID" />
    </div>
  );
}

export function CopyButtonToolbarDemo() {
  return (
    <Toolbar aria-label="Answer actions">
      <ToolbarButton render={<CopyButton value="Refunds go back to the original card within 5 to 10 days." label="Copy answer" />} />
      <ToolbarSeparator />
      <ToolbarButton icon={<ThumbsUp />} label="Good answer" />
      <ToolbarButton icon={<ThumbsDown />} label="Bad answer" />
      <ToolbarButton icon={<ArrowClockwise />}>Regenerate</ToolbarButton>
    </Toolbar>
  );
}
