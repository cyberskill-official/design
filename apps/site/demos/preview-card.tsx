'use client';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@cyberskill/design';

const avatar = {
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'var(--accent)',
  color: 'var(--accent-foreground)',
  font: '700 15px/1 var(--font-display)',
} as const;

export function PersonPreviewCard() {
  return (
    <p className="cs-body" style={{ margin: 0, maxWidth: 480 }}>
      This answer was reviewed by{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#lan">Nguyễn Thị Lan</PreviewCardTrigger>
        <PreviewCardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={avatar} aria-hidden="true">L</span>
            <div style={{ display: 'grid' }}>
              <strong>Nguyễn Thị Lan</strong>
              <span style={{ color: 'var(--muted)' }}>Support lead, Hà Nội</span>
            </div>
          </div>
          <span>Reviews agent answers for billing and refunds. 42 agents reviewed this quarter.</span>
        </PreviewCardContent>
      </PreviewCard>{' '}
      before it went live.
    </p>
  );
}

export function FastPreviewCard() {
  return (
    <p className="cs-body" style={{ margin: 0 }}>
      Trained on{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#refunds" delay={200} closeDelay={100}>refund-policy.pdf</PreviewCardTrigger>
        <PreviewCardContent side="top">
          <strong>refund-policy.pdf</strong>
          <span style={{ color: 'var(--muted)' }}>12 pages · added 3 days ago · used in 318 answers</span>
        </PreviewCardContent>
      </PreviewCard>
      .
    </p>
  );
}
