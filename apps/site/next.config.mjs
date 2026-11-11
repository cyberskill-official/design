import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** Static export for GitHub Pages (design.cyberskill.world). */
/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withMDX(config);
