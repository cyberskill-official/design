import { llms, loader } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { remarkLazyDemos } from './remark-lazy-demos.mjs';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: { includeProcessedMarkdown: true },
    // the -default GitHub themes: github-light's orange (3.5:1) and github-dark's comment gray (3.6:1) fail 4.5:1 (forensic audit)
    mdxOptions: applyMdxPreset({ remarkPlugins: [remarkLazyDemos], rehypeCodeOptions: { themes: { light: 'github-light-default', dark: 'github-dark-default' } } }),
  },
  meta: { schema: metaSchema },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
