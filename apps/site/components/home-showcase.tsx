'use client';
import { Sparkle } from '@phosphor-icons/react';
import { Button, TextField } from '@cyberskill/design';

/** The same small composition in both themes, side by side. Extended as components land. */
export function HomeShowcase() {
  return (
    <section className="home-showcase" aria-label="Components in light and dark">
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} className="home-panel" data-theme={theme}>
          <p className="cs-overline">{theme === 'light' ? 'Light' : 'Dark'}</p>
          <p className="cs-h4">Support Copilot</p>
          <TextField label="Ask the copilot" placeholder="Summarise last week's escalations" />
          <div className="home-row">
            <Button>Deploy</Button>
            <Button variant="secondary">Share</Button>
            <Button variant="accent" iconStart={<Sparkle />}>Ask AI</Button>
          </div>
        </div>
      ))}
    </section>
  );
}
