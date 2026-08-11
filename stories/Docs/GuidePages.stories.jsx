import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

function Page({ path, title }) {
  return (
    <IframeSurface src={`/docs/viewer.html#${path}`} title={title} fullBleed />
  );
}

export default {
  title: 'Docs/Guides',
  parameters: { layout: 'fullscreen' },
};

export const ConsumerGrant = {
  name: 'Consumer grant',
  render: () => <Page path="docs/consumer-grant.md" title="Consumer grant" />,
};

export const ReleaseRunbook = {
  name: 'Release runbook',
  render: () => <Page path="docs/release-runbook.md" title="Release runbook" />,
};

export const Storybook = {
  name: 'Storybook',
  render: () => <Page path="docs/storybook.md" title="Storybook" />,
};

export const LiveHub = {
  name: 'Live hub',
  render: () => <Page path="docs/live-hub.md" title="Live hub" />,
};

export const BenchmarkRubric = {
  name: 'Benchmark rubric',
  render: () => <Page path="docs/benchmark-rubric.md" title="Benchmark rubric" />,
};
