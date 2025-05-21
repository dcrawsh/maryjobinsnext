import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

const DIR = path.join(process.cwd(), "content/pages");

export async function generateStaticParams() {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

// ✅ Add this
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const filePath = path.join(DIR, `${params.slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }
  const { data: fm } = matter(raw);

  return {
    title: fm.title,
    description: fm.description,
    openGraph: fm.ogImage ? { images: [{ url: fm.ogImage }] } : undefined,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const filePath = path.join(DIR, `${params.slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const { data: fm } = matter(raw);

  const { content } = await (compileMDX as any)({
    source: raw,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="prose prose-neutral mx-auto px-4 py-12">
      {!raw.trimStart().startsWith("#") && fm.title && (
        <h1 className="text-3xl font-bold">{fm.title}</h1>
      )}
      {content}
    </article>
  );
}
