/* components/Nav.tsx */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sleek MaryJobins navigation bar
 */
export default function Nav() {
  const pathname = usePathname();
  const items = [
    { label: 'Account', href: '/account' },
    { label: 'Job Search', href: '/' },
    { label: 'Job Listings', href: '/my-jobs' },
    { label: 'Quiz', href: '/job-search-quiz' }
  ];

  return (
    <nav className="bg-deep-navy border-b border-charcoal/20">
      <div className="max-w-5xl mx-auto flex items-center px-6 py-3 space-x-10">
        {items.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                `font-gibson text-base transition-all duration-200 text-cream ` +
                (isActive
                  ? 'underline underline-offset-4 decoration-charcoal'
                  : 'hover:underline hover:decoration-charcoal')
              }
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
