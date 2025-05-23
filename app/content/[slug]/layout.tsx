// app/content/[slug]/layout.tsx

import styles from './layout.module.css';
import type { ReactNode } from 'react';

export const metadata = { /* … any route metadata … */ };

export default function SlugLayout({ children }: { children: ReactNode }) {
  // Include your normal prose classes plus our module wrapper
  return (
    <section className={`prose prose-lg mx-auto py-12 px-6 ${styles.wrapper}`}>
      {children}
    </section>
  );
}
