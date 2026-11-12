'use client';
import { Kbd } from '@cyberskill/design';

export function KbdDemo() {
  return (
    <p className="cs-ui" style={{ margin: 0 }}>
      Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to search, or <Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd> for commands. <Kbd>Esc</Kbd> closes.
    </p>
  );
}
