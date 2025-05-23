// app/content/[slug]/page.tsx
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function generateStaticParams() {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) =>
    f.endsWith('.md')
  )
  return files.map((file) => ({ slug: file.replace(/\.md$/, '') }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, `${params.slug}.md`),
      'utf8'
    )
    const { data } = matter(raw)
    return { title: data.title, description: data.description || '' }
  } catch {
    return {}
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  let rawMd: string
  try {
    rawMd = await fs.readFile(
      path.join(CONTENT_DIR, `${params.slug}.md`),
      'utf8'
    )
  } catch {
    notFound()
  }

  const { data: fm, content } = matter(rawMd)

  const processed = await unified()
    .use(remarkParse as any)
    .use(remarkRehype as any, { allowDangerousHtml: true } as any)
    .use(rehypeRaw as any)
    .use(rehypeStringify as any)
    .process(content)

  const html = processed.toString()

  return (
    <article className="prose prose-lg mx-auto py-12 px-6">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
