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

export const TemplateGrammar = {
  name: 'Template grammar',
  render: () => <Page path="docs/template-grammar.md" title="Template grammar" />,
};

export const ComponentAPI = {name: 'Component API', render: () => <Page path="docs/component-api.md" title="Component API" />};
export const RuntimeAPI = {name: 'Runtime API', render: () => <Page path="docs/runtime-api.md" title="Runtime API" />};

export const BrowserSupport = {name: 'Browser support', render: () => <Page path="docs/browser-support.md" title="Browser support" />};

export const StaticHTMLReference = {name: "Static HTML reference", render: () => <Page path="docs/static-html-reference.md" title="Static HTML reference" />};

export const UIMessages = {name: "UI messages", render: () => <Page path="docs/locale-messages.md" title="UI messages" />};

export const ComponentSemantics = {name: "Component semantics", render: () => <Page path="docs/component-semantics.md" title="Component semantics" />};

export const NativeRefs = {name: "Native refs", render: () => <Page path="docs/native-refs.md" title="Native refs" />};

export const TemplateContent = {name: "Template content", render: () => <Page path="docs/template-content.md" title="Template content" />};

export const FloatingPanels = {name: "Floating panels", render: () => <Page path="docs/floating-panels.md" title="Floating panels" />};

export const LayeredCSS = { name: "Layered CSS", render: () => <Page path="docs/layered-css.md" title="Layered CSS" /> };

export const ComponentCSS = { name: "Component CSS", render: () => <Page path="docs/component-css.md" title="Component CSS" /> };

export const GuidelineLanguage = { name: "Guideline language", render: () => <Page path="docs/guideline-language.md" title="Guideline language" /> };

export const ComponentScenarios = { name: "Component state scenarios", render: () => <Page path="docs/component-scenarios.md" title="Component state scenarios" /> };

export const TemplateArchetypes = { name: "Template archetypes", render: () => <Page path="docs/template-archetypes.md" title="Template archetypes" /> };

export const ComponentSemanticContracts = { name: "Component semantic contracts", render: () => <Page path="docs/component-semantic-contracts.md" title="Component semantic contracts" /> };

export const TemplateSharedLayouts = { name: "Shared template layouts", render: () => <Page path="docs/template-shared-layouts.md" title="Shared template layouts" /> };
