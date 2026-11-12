'use client';
import { Skeleton, SkeletonText } from '@cyberskill/design';

export function SkeletonCard() {
  return (
    <div aria-busy="true" style={{ display: 'grid', gap: 16, width: 360, maxWidth: '100%', padding: 20, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <span role="status" className="cs-visually-hidden">Loading project</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton width={40} height={40} radius="full" />
        <div style={{ display: 'grid', gap: 8, flex: 1 }}>
          <Skeleton width="50%" height={14} />
          <Skeleton width="30%" height={12} />
        </div>
      </div>
      <SkeletonText lines={3} />
      <Skeleton height={120} radius="lg" />
    </div>
  );
}

export function SkeletonShapes() {
  return (
    <>
      <Skeleton width={40} height={40} radius="full" />
      <Skeleton width={96} height={32} />
      <Skeleton width={160} height={16} radius="sm" />
      <div style={{ width: 240 }}>
        <SkeletonText lines={2} />
      </div>
    </>
  );
}
