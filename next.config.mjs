// next.config.mjs   (ESM)

import withMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

// ── MDX wrapper ─────────────────────────────────────────────
const mdx = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

export default mdx({
  // env vars for Supabase
  env: {
    NEXT_PUBLIC_SUPABASE_URL:       process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  eslint:  { ignoreDuringBuilds: true },
  images:  { unoptimized: true },

  // recognise .mdx as a valid page/route file
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // custom webpack tweaks
  webpack(config, { isServer }) {
    if (!isServer) {
      // prevent webpack from trying to polyfill these native deps
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }
    return config;
  },
});
