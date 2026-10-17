import React from 'react';
import {
  useLiveTokenValues,
  apcaLc,
  resolveColorToRgb,
  rgbToHex,
  PageTitle,
  Lede,
  SectionTitle,
  Mono,
} from '../lib/live-tokens.jsx';

/**
 * A11y/Contrast — the APCA floors, demonstrated on the key token pairings with the
 * SAME SAPC-4g math the audit harness uses (_audit/apca-dark-preview.html).
 *
 * Measurement reads the sample chip’s computed color/background-color
 * are fully resolved by the browser (element scopes wash surfaces via color-mix, so
 * reading the raw custom property string would not be measurable). These color-pair
 * readings do not inspect raster paint, clipping or every product backdrop. Flip Theme or
 * Element toolbar and every row re-audits itself.
 */

// Theme-symmetric pairings. The elemental CTA ink pairing is theme-dependent by
// design (light packs validate on/bright; the APCA-derived dark packs re-solve
// on/strong at Lc >= 75), so its bg token is chosen per resolved theme below.
const PAIRS = [
  { fg: '--cs-color-text-primary', bg: '--cs-color-surface-page', role: 'Body text on page', floor: 75 },
  { fg: '--cs-color-text-primary', bg: '--cs-color-surface-panel', role: 'Body text on panel', floor: 75 },
  { fg: '--cs-color-text-primary', bg: '--cs-color-surface-raised', role: 'Body text on raised', floor: 75 },
  { fg: '--cs-color-text-muted', bg: '--cs-color-surface-page', role: 'Muted / secondary text', floor: 60 },
  { fg: '--cs-color-link', bg: '--cs-color-surface-page', role: 'Link on page', floor: 60 },
  { fg: '--cs-color-text-accent', bg: '--cs-color-surface-page', role: 'Accent text on page', floor: 60 },
  {
    fg: '--cs-component-button-primary-fg',
    bg: '--cs-component-button-primary-bg',
    role: 'Primary button ink',
    floor: 60,
    note: 'button labels are semibold — APCA fluent-text floor 60',
  },
  {
    fg: '--cs-accent-on',
    bgLight: '--cs-accent-bright',
    bgDark: '--cs-accent-strong',
    role: 'Elemental CTA ink',
    floor: 60,
    floorDark: 75,
    note: 'light packs validate on/bright ≥ 60; dark packs re-solve on/strong ≥ 75',
  },
  { fg: '--cs-accent-ink', bg: '--cs-accent-tint', role: 'Ink on tint chip', floor: 75 },
];

const td = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--cs-color-border-default)',
  verticalAlign: 'middle',
};

/** One diagnostic pairing: renders fg on bg, then reads computed colors. */
function PairRow({ fgToken, bgToken, role, tokensLabel, floor, note }) {
  const chipRef = React.useRef(null);
  const [measured, setMeasured] = React.useState({ fg: null, bg: null });
  React.useEffect(() => {
    const chip = chipRef.current;
    if (!chip) return;
    const read = () => {
      const cs = getComputedStyle(chip);
      const fg = resolveColorToRgb(cs.color);
      const bg = resolveColorToRgb(cs.backgroundColor);
      setMeasured((prev) => {
        const same = rgbToHex(prev.fg) === rgbToHex(fg) && rgbToHex(prev.bg) === rgbToHex(bg);
        return same ? prev : { fg, bg };
      });
    };
    read();
    // Theme colors may still be transitioning at the first effect read. This
    // includes the global 0.01ms reduced-motion duration. Refresh after paint
    // and on completion instead of leaving an intermediate pairing displayed.
    const frame = requestAnimationFrame(read);
    chip.addEventListener('transitionend', read);
    chip.addEventListener('transitioncancel', read);
    chip.addEventListener('animationend', read);
    return () => {
      cancelAnimationFrame(frame);
      chip.removeEventListener('transitionend', read);
      chip.removeEventListener('transitioncancel', read);
      chip.removeEventListener('animationend', read);
    };
  });
  const lc = measured.fg && measured.bg ? apcaLc(measured.fg, measured.bg) : null;
  const pass = lc != null && lc >= floor;
  return (
    <tr>
      <td style={{ ...td, width: 150 }}>
        <span
          ref={chipRef}
          style={{
            display: 'inline-block',
            background: `var(${bgToken})`,
            color: `var(${fgToken})`,
            border: '1px solid var(--cs-color-border-default)',
            borderRadius: 'var(--cs-radius-md)',
            padding: '8px 14px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Ý Chí Aa
        </span>
      </td>
      <td style={td}>
        <div style={{ fontWeight: 600 }}>{role}</div>
        <div className="cs-caption" style={{ fontFamily: 'var(--cs-font-family-mono)' }}>{tokensLabel}</div>
        {note ? <div className="cs-caption">{note}</div> : null}
      </td>
      <td style={td}>
        <Mono muted>{measured.fg ? rgbToHex(measured.fg) : '…'}</Mono>
        <br />
        <Mono muted>{measured.bg ? `on ${rgbToHex(measured.bg)}` : '…'}</Mono>
      </td>
      <td style={{ ...td, fontFamily: 'var(--cs-font-family-mono)' }}>{lc == null ? '…' : `Lc ${lc}`}</td>
      <td style={{ ...td, fontFamily: 'var(--cs-font-family-mono)' }}>≥ {floor}</td>
      <td style={{ ...td, fontWeight: 700 }}>{lc == null ? 'measuring' : pass ? 'Pass' : 'Below floor'}</td>
    </tr>
  );
}

function ContrastPage() {
  // ref also detects the resolved theme scope (for the theme-dependent CTA pairing)
  const [ref, , scope] = useLiveTokenValues([]);
  const th = {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: 'var(--cs-font-size-xs)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--cs-letter-spacing-caps)',
    color: 'var(--cs-color-text-muted)',
    borderBottom: '1px solid var(--cs-color-border-default)',
  };
  return (
    <div ref={ref} style={{ maxWidth: 1000 }}>
      <PageTitle>Contrast — APCA</PageTitle>
      <Lede>
        These token-pair diagnostics use APCA (Accessible Perceptual Contrast Algorithm):
        body text holds Lc ≥ 75; secondary text, links and semibold CTA ink hold Lc ≥ 60.
        Verdicts below are stated in words — colour is never the only signal.
      </Lede>
      <p className="cs-caption" style={{ margin: '0 0 16px' }}>
        Each row renders its real token pair, then reads computed colors and computes
        Lc with the same SAPC-4g math as the audit harness. Flip Theme or Element in the
        toolbar and the table re-audits — element scopes wash surfaces via color-mix, and
        the measured values follow.
      </p>

      <SectionTitle>Key pairings, audited live</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={th}>Sample</th>
            <th style={th}>Pairing</th>
            <th style={th}>Measured</th>
            <th style={th}>Lc (live)</th>
            <th style={th}>Floor</th>
            <th style={th}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {PAIRS.map((p) => {
            const bgToken = p.bg || (scope.dark ? p.bgDark : p.bgLight);
            const floor = scope.dark && p.floorDark ? p.floorDark : p.floor;
            return (
              <PairRow
                key={p.role}
                fgToken={p.fg}
                bgToken={bgToken}
                role={p.role}
                tokensLabel={`${p.fg.replace('--cs-', '')} / ${bgToken.replace('--cs-', '')}`}
                floor={floor}
                note={p.note}
              />
            );
          })}
        </tbody>
      </table>

      <SectionTitle>The floors</SectionTitle>
      <ul className="cs-body" style={{ maxWidth: '76ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li><strong>Lc ≥ 75</strong> — body text; ink-on-tint. The anchor immutable (README): APCA Lc ≥ 75 body text.</li>
        <li><strong>Lc ≥ 60</strong> — secondary/muted text, links, accent text and semibold CTA ink; the generated report audits every elemental pairing at this floor.</li>
        <li>Text never sits on the mid-tone accent — CTA ink uses bright in light, strong in dark, or tint (see Foundations/Elements).</li>
        <li>accent-strong as accent text is APCA-validated but WCAG-borderline for a few packs — reserved for semibold/large accent text (conventions decision log).</li>
      </ul>

      <SectionTitle>Canonical reports and gates</SectionTitle>
      <ul className="cs-body" style={{ maxWidth: '76ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li>
          <a href="/docs/contrast-report.md" target="_blank" rel="noreferrer">docs/contrast-report.md</a> — the generated APCA sweep (whole-set: all 15 packs, light + dark).
        </li>
        <li>
          <a href="/_audit/contrast-guard.html" target="_blank" rel="noreferrer">_audit/contrast-guard.html</a> — the deterministic gate: source lint + token-pair matrix in light and dark.
        </li>
        <li>
          <a href="/_audit/apca-dark-preview.html" target="_blank" rel="noreferrer">_audit/apca-dark-preview.html</a> — the SAPC-4g reference implementation + dark-pack regression gate.
        </li>
      </ul>
      <p className="cs-caption">Links resolve on the deployed site (repo files served from the site root).</p>
    </div>
  );
}

export default {
  title: 'A11y/Contrast (APCA)',
  parameters: {
    docs: {
      description: {
        component:
          'APCA floors (body Lc ≥ 75, secondary/CTA Lc ≥ 60) demonstrated on key token pairs — computed-color diagnostics refreshed within the preview scope.',
      },
    },
  },
};

export const Floors = {
  name: 'Floors, audited live',
  render: () => <ContrastPage />,
};
