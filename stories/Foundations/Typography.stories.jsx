import React from 'react';
import { tokens } from '../../tokens/tokens.js';
import {
  useLiveTokenValues,
  TokenTable,
  PageTitle,
  Lede,
  SectionTitle,
  LiveNote,
  Mono,
} from '../lib/live-tokens.jsx';

const FONT_NAMES = Object.keys(tokens.root.font);
const TEXT_ROLE_NAMES = Object.keys(tokens.root.text);
const LETTER_NAMES = Object.keys(tokens.root.letter);

const FAMILY_NAMES = FONT_NAMES.filter((n) => n.includes('-family-'));
const WEIGHT_NAMES = FONT_NAMES.filter((n) => n.includes('-weight-'));
const SIZE_NAMES = FONT_NAMES.filter((n) => n.includes('-size-'));
const LINEHEIGHT_NAMES = FONT_NAMES.filter((n) => n.includes('-lineHeight-'));

const ALL_NAMES = [...FONT_NAMES, ...TEXT_ROLE_NAMES, ...LETTER_NAMES];

const DIACRITIC_SAMPLE = 'Hiện Thực Hoá Ý Chí';

function remToPx(rem) {
  const m = /^([\d.]+)rem$/.exec(String(rem).trim());
  return m ? `${parseFloat(m[1]) * 16}px` : '';
}

function TypographyPage() {
  const [ref, values] = useLiveTokenValues(ALL_NAMES);
  return (
    <div ref={ref} style={{ maxWidth: 920 }}>
      <PageTitle>Typography</PageTitle>
      <Lede>
        UI: Be Vietnam Pro — a Vietnamese-first Google family. Display/headline: Space
        Grotesk, opt-in. Code and data: JetBrains Mono. All three are self-hosted in fonts/
        (latin · latin-ext · vietnamese subsets). Line-heights are Vietnamese-safe: stacked
        diacritics never clip.
      </Lede>
      <LiveNote />

      <SectionTitle>Families</SectionTitle>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        <div style={{ padding: 16, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)' }}>
          <div style={{ fontFamily: 'var(--cs-font-family-ui)', fontSize: 'var(--cs-font-size-xl)', fontWeight: 700 }}>
            Be Vietnam Pro — {DIACRITIC_SAMPLE}
          </div>
          <div className="cs-caption" style={{ marginTop: 6 }}>
            <Mono>--cs-font-family-ui</Mono> · <Mono muted>{values['--cs-font-family-ui']}</Mono>
          </div>
        </div>
        <div style={{ padding: 16, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)' }}>
          <div style={{ fontFamily: 'var(--cs-font-family-display)', fontSize: 'var(--cs-font-size-xl)', fontWeight: 700 }}>
            Space Grotesk — {DIACRITIC_SAMPLE}
          </div>
          <div className="cs-caption" style={{ marginTop: 6 }}>
            <Mono>--cs-font-family-display</Mono> ·{' '}
            <Mono muted>{values['--cs-font-family-display']}</Mono>
          </div>
        </div>
        <div style={{ padding: 16, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)' }}>
          <div style={{ fontFamily: 'var(--cs-font-family-mono)', fontSize: 'var(--cs-font-size-lg)' }}>
            JetBrains Mono — const wish = "granted";
          </div>
          <div className="cs-caption" style={{ marginTop: 6 }}>
            <Mono>--cs-font-family-mono</Mono> · <Mono muted>{values['--cs-font-family-mono']}</Mono>
          </div>
        </div>
      </div>

      <SectionTitle>Display face</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        Nothing points at the display face by default — headings stay on
        <Mono> --cs-heading-family</Mono>, which resolves to the UI family. A product opts a
        subtree in with <Mono>.cs-display-face</Mono> (or by setting
        <Mono> --cs-heading-family: var(--cs-font-family-display)</Mono>), and every heading
        utility follows while body copy stays on Be Vietnam Pro. Space Grotesk has no 800, so
        the extrabold heading weight falls back to Be Vietnam Pro.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {[
          { label: 'Default — UI face', className: '' },
          { label: 'Opted in — .cs-display-face', className: 'cs-display-face' },
        ].map((scope) => (
          <div
            key={scope.label}
            className={scope.className}
            style={{ padding: 16, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)' }}
          >
            <div className="cs-caption" style={{ marginBottom: 8 }}>{scope.label}</div>
            <div className="cs-h2" style={{ margin: 0 }}>{DIACRITIC_SAMPLE}</div>
            <p className="cs-body" style={{ margin: '6px 0 0' }}>
              Body copy stays on the UI face in both scopes.
            </p>
          </div>
        ))}
      </div>

      <SectionTitle>Weights</SectionTitle>
      <TokenTable
        previewHeader="Sample"
        rows={WEIGHT_NAMES.map((n) => ({
          name: n,
          value: values[n],
          preview: (
            <span style={{ fontWeight: values[n] || 400, whiteSpace: 'nowrap' }}>Ý Chí</span>
          ),
        }))}
      />

      <SectionTitle>Size ramp</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        xs 12 → 5xl 60 on a 16px base. Live rem value with its px equivalent.
      </p>
      <div style={{ display: 'grid', gap: 4, padding: 16, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)', overflow: 'hidden' }}>
        {SIZE_NAMES.map((n) => (
          <div key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid var(--cs-color-border-default)', padding: '6px 0' }}>
            <span style={{ width: 210, flex: 'none' }}>
              <Mono>{n}</Mono>
              <span className="cs-caption" style={{ display: 'block' }}>
                {values[n]} {remToPx(values[n]) ? `= ${remToPx(values[n])}` : ''}
              </span>
            </span>
            <span style={{ fontSize: values[n], lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {DIACRITIC_SAMPLE}
            </span>
          </div>
        ))}
      </div>

      <SectionTitle>Semantic roles</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        Role aliases point into the ramp; utilities .cs-display / .cs-h1 … .cs-caption in
        base/typography.css consume them.
      </p>
      <TokenTable rows={TEXT_ROLE_NAMES.map((n) => ({ name: n, value: values[n] }))} />

      <SectionTitle>Vietnamese-safe line-heights</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        Body 1.5 / heading 1.35 / tight 1.15 leave room for stacked marks (ệ, ộ, ữ). The
        boxes below use the live tokens — marks must never clip against the line above.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {LINEHEIGHT_NAMES.map((n) => (
          <div key={n} style={{ padding: 16, background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)' }}>
            <div className="cs-caption" style={{ marginBottom: 8 }}>
              <Mono>{n}</Mono> · <Mono muted>{values[n]}</Mono>
            </div>
            <div style={{ fontSize: 'var(--cs-font-size-md)', lineHeight: values[n] || 1.5, fontWeight: n.includes('body') ? 400 : 700 }}>
              {DIACRITIC_SAMPLE}. Điều ước rõ ràng — chúng tôi biến nó thành phần mềm chạy thật.
              Nguyễn Hoàng Vũ đọc kỹ từng dòng chữ tiếng Việt có dấu.
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Letter spacing</SectionTitle>
      <TokenTable
        previewHeader="Sample"
        rows={LETTER_NAMES.map((n) => ({
          name: n,
          value: values[n],
          preview: (
            <span
              style={{
                letterSpacing: values[n] || 0,
                textTransform: n.includes('caps') ? 'uppercase' : 'none',
                fontSize: n.includes('caps') ? 'var(--cs-font-size-xs)' : 'var(--cs-font-size-base)',
                fontWeight: n.includes('caps') ? 700 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              Eyebrow
            </span>
          ),
        }))}
      />
    </div>
  );
}

export default {
  title: 'Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Be Vietnam Pro / Space Grotesk (opt-in display) / JetBrains Mono, weights, size ramp, Vietnamese-safe line-heights — names from tokens.js, values live from the cascade.',
      },
    },
  },
};

export const TypeSystem = {
  name: 'Type system',
  render: () => <TypographyPage />,
};
