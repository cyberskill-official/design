import React from 'react';
import { Button } from '../../components/button/Button.jsx';
import { TextField } from '../../components/textfield/TextField.jsx';
import { Switch } from '../../components/forms/Switch.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { Link } from '../../components/navigation/Link.jsx';
import {
  useLiveTokenValues,
  PageTitle,
  Lede,
  SectionTitle,
  Mono,
} from '../lib/live-tokens.jsx';

function FocusRingPage() {
  const [ref, values] = useLiveTokenValues(['--cs-color-text-primary', '--cs-color-accent-ochre']);
  return (
    <div ref={ref} style={{ maxWidth: 920 }}>
      <PageTitle>Focus ring</PageTitle>
      <Lede>
        The composite focus indicator combines a 2px text-primary contour at a 2px
        offset with a 5px Ochre halo. The contour follows the theme; the halo keeps
        the brand anchor across element packs. Native controls use a filter fallback
        where their browser appearance does not paint a box shadow.
      </Lede>
      <p className="cs-caption" style={{ margin: '0 0 16px' }}>
        Contour, live from the cascade: <Mono>--cs-color-text-primary</Mono> ={' '}
        <Mono muted>{values['--cs-color-text-primary']}</Mono>; halo: <Mono>--cs-color-accent-ochre</Mono> ={' '}
        <Mono muted>{values['--cs-color-accent-ochre']}</Mono>. Computed-style checks
        cover the authored selectors; visible paint, clipping and keyboard behavior
        still require review in the rendered product.
      </p>

      <SectionTitle>Keyboard walkthrough</SectionTitle>
      <ol className="cs-body" style={{ maxWidth: '72ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li>Click once in this preview area (or press Tab from the address bar) to move focus into the story.</li>
        <li>Press <kbd className="cs-kbd">Tab</kbd> to walk forward through the samples below — check the composite indicator at each stop.</li>
        <li>Press <kbd className="cs-kbd">Shift</kbd>+<kbd className="cs-kbd">Tab</kbd> to walk backwards.</li>
        <li>On buttons, <kbd className="cs-kbd">Enter</kbd> or <kbd className="cs-kbd">Space</kbd> activates; on the switch and checkbox, <kbd className="cs-kbd">Space</kbd> toggles.</li>
        <li>The indicator follows focus-visible. Browsers may also show it after pointer focus on text-entry controls.</li>
      </ol>

      <SectionTitle>Real components — Tab through them</SectionTitle>
      <div style={{ display: 'grid', gap: 20, padding: 20, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button variant="primary">Make a wish</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div style={{ maxWidth: 360 }}>
          <TextField label="Your name" placeholder="Nguyễn Hoàng Vũ" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <Switch label="Notifications" defaultChecked />
          <Checkbox label="I agree" />
          <Link href="#focus-ring-demo" onClick={(e) => e.preventDefault()}>
            A focusable link
          </Link>
        </div>
      </div>

      <SectionTitle>Rules</SectionTitle>
      <ul className="cs-body" style={{ maxWidth: '72ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li>Preserve the composite indicator — <Mono>outline: none</Mono> without a replacement is a defect.</li>
        <li>The halo is never elemental; the text-primary contour follows the resolved theme. Flip the Theme and Element toolbar items and review each focused sample.</li>
        <li>Wrapper controls may show the indicator through focus-within. Check that the focused control remains identifiable.</li>
      </ul>
    </div>
  );
}

export default {
  title: 'A11y/Focus ring',
  parameters: {
    docs: {
      description: {
        component:
          'The composite text-primary contour and Ochre halo on real components, with a keyboard review walkthrough.',
      },
    },
  },
};

export const KeyboardWalkthrough = {
  name: 'Keyboard walkthrough',
  render: () => <FocusRingPage />,
};
