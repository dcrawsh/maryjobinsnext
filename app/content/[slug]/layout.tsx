// app/layout.tsx
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Your Site Title',
  description: 'Your site description',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white font-sans text-gray-800 antialiased">
        {/* root container — pages supply their own <main>/<article> */}
        <div className="mx-auto px-4 py-12 max-w-3xl">
          {children}
        </div>
      </body>
    </html>
  );
}
