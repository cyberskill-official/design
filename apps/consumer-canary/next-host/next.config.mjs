/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-canary",
  transpilePackages: ["@cyberskill/react", "@cyberskill/themes", "@cyberskill/tokens"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
