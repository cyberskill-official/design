'use client';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger, TextField } from '@cyberskill/design';

export function CollapsibleDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Collapsible>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsiblePanel>
          <div style={{ display: 'grid', gap: 12, padding: '4px 2px 8px' }}>
            <TextField label="Temperature" type="number" defaultValue="0.2" />
            <TextField label="Max tokens" type="number" defaultValue="800" />
          </div>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  );
}
