// app/layout.tsx — remains a server component
import type { ReactNode } from "react";
import Head from "next/head";
import MDXClientProvider from "@/components/MDXClientProvider";  // 👈 import

export const metadata = {
  title: "Mary Jobins",
  description: "Find your next role faster with AI‑powered matching …",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <body className="min-h-screen bg-white font-sans text-gray-800 antialiased">
        <main className="prose prose-neutral mx-auto px-4 py-12">
          <MDXClientProvider>{children}</MDXClientProvider>
        </main>
      </body>
    </html>
  );
}
