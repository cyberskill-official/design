import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

function Page({ path, title }) {
  return (
    <IframeSurface
      src={path ? `/docs/viewer.html#${path}` : '/docs/viewer.html'}
      title={title}
      fullBleed
    />
  );
}

export default {
  title: 'Docs/Start',
  parameters: { layout: 'fullscreen' },
};

export const README = {
  name: 'README',
  render: () => <Page path="README.md" title="README" />,
};

export const SKILL = {
  name: 'SKILL',
  render: () => <Page path="SKILL.md" title="SKILL" />,
};

export const LlmsTxt = {
  name: 'llms.txt',
  render: () => <Page path="llms.txt" title="llms.txt" />,
};

export const Contributing = {
  name: 'Contributing',
  render: () => <Page path="CONTRIBUTING.md" title="Contributing" />,
};

export const Library = {
  name: 'Library',
  render: () => <Page path="" title="Documentation Library" />,
};
