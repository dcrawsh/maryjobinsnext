import type { ReactNode } from "react";
import MDXClientProvider from "@/components/MDXClientProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white font-sans text-gray-800 antialiased">
        <main className="prose prose-neutral mx-auto px-4 py-12">
          <MDXClientProvider>{children}</MDXClientProvider>
        </main>
      </body>
    </html>
  );
}
