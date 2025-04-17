/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  // Support API routes & environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
      };
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^bufferutil$/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /^utf-8-validate$/ })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
