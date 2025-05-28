import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Nav from '../components/Nav';

const inter = Inter({ subsets: ['latin'] });

// app/layout.tsx or app/page.tsx

export const metadata: Metadata = {
  title: 'MaryJobins – Your AI-Powered Job Search Assistant',
  description:
    'MaryJobins helps you streamline your job hunt with AI-powered matching, a personalized dashboard, and built-in application tracking.',
  icons: {
    icon: '/favicon.png', // You can also add appleIcon, shortcut, etc.
  },
  openGraph: {
    title: 'MaryJobins – Your AI Job Assistant',
    description:
      'Smart job search powered by AI. Track applications, discover matches, and never miss an opportunity again.',
    url: 'https://www.maryjobins.com',
    siteName: 'MaryJobins',
    images: [
      {
        url: '/og-image.png', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'MaryJobins Dashboard Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MaryJobins – Your AI-Powered Job Search Assistant',
    description:
      'Streamline your job search with MaryJobins. Discover tailored opportunities, manage your progress, and land your next role effortlessly.',
    images: ['/og-image.png'], // Replace with real image path
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* explicit favicon link */}
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
