// app/pages/[slug]/page.tsx
import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';

const DIR = path.join(process.cwd(), 'content/pages');

// ── 1. tell Next which slugs to prerender ──────────────────────────
export async function generateStaticParams() {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith('.mdx'));
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, '') }));
}

// ── 2. render a single MDX file ────────────────────────────────────
export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(DIR, `${params.slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    notFound();
  }

  // compile MDX -> { content, frontmatter }
const { content, frontmatter } = await (compileMDX as any)({
    source: raw,
    components: {},
    options: { parseFrontmatter: true },
  });

  return (
    <article className="prose prose-neutral mx-auto px-4 py-12">
      {/* If the file itself didn't start with # Heading, inject one from front‑matter */}
      {!raw.startsWith('#') && frontmatter?.title && (
        <h1 className="text-3xl font-bold">{String(frontmatter.title)}</h1>
      )}

      {content /* already a React element */}
    </article>
  );
}
