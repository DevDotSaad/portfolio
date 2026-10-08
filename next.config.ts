import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root (a stray lockfile higher up would otherwise be picked).
  turbopack: { root: process.cwd() },
};

export default config;
