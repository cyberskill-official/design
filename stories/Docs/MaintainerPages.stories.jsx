import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

function Page({ path, title }) {
  return (
    <IframeSurface src={`/docs/viewer.html?embed=1#${path}`} title={title} fullBleed />
  );
}

export default {
  title: 'Docs/Maintainers',
  parameters: { layout: 'fullscreen' },
};

export const Doctrine = {
  name: 'Doctrine',
  render: () => <Page path="docs/doctrine.md" title="Doctrine" />,
};

export const Decisions = {
  name: 'Decisions',
  render: () => <Page path="docs/decisions.md" title="Decisions" />,
};

export const CICD = {
  name: 'CI/CD',
  render: () => <Page path="docs/ci-cd.md" title="CI/CD" />,
};

export const QualityGates = {
  name: 'Quality gates',
  render: () => <Page path="docs/quality-gates.md" title="Quality gates" />,
};

export const Sync = {
  name: 'Sync',
  render: () => <Page path="docs/sync.md" title="Sync" />,
};
