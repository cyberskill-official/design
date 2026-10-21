import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

function Page({ path, title }) {
  return (
    <IframeSurface src={`/docs/viewer.html?embed=1#${path}`} title={title} fullBleed />
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

export const Storybook = {
  name: 'Storybook',
  render: () => <Page path="docs/storybook.md" title="Storybook" />,
};

export const LiveHub = {
  name: 'Live hub',
  render: () => <Page path="docs/live-hub.md" title="Live hub" />,
};

export const HrSuiteSources = {
  name: 'HR Suite sources',
  render: () => <Page path="docs/hr-suite-sources.md" title="HR Suite sources" />,
};

export const BenchmarkRubric = {
  name: 'Benchmark rubric',
  render: () => <Page path="docs/benchmark-rubric.md" title="Benchmark rubric" />,
};

export const ComponentApi = {name: "Current component API",render: () => <Page path="docs/component-api.md" title="Current component API" />};

export const LocaleMessages = {name: "Scoped UI messages",render: () => <Page path="docs/locale-messages.md" title="Scoped UI messages" />};

export const RuntimeApi = {name: "Runtime API foundation",render: () => <Page path="docs/runtime-api.md" title="Runtime API foundation" />};
