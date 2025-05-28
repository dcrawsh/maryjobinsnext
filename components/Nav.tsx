/* components/Nav.tsx */
'use client';

import Link from 'next/link';
import Image from 'next/image';       // ← add
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseBrowser';

export default function Nav() {
  const pathname = usePathname();
  const { session } = useSession({ isProtectedRoute: false });
  const [newCount, setNewCount] = useState(0);

  /* …realtime code unchanged… */

  const items = [
    { label: 'Account', href: '/account' },
    { label: 'Job Search', href: '/my-search' },
    { label: 'Job Listings', href: '/my-jobs', badge: newCount },
    { label: 'Quiz', href: '/job-search-quiz' },
  ];

  return (
    <nav id="mary-jobins-nav" className="bg-deep-navy border-b border-charcoal/20">
      <div className="max-w-5xl mx-auto flex items-center px-6 py-3 space-x-10">
        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href="/" className="flex items-center">
          {/* Replace /favicon.ico with /logo.svg or whatever asset you prefer */}
          <Image
            src="/img/favicon.png"
            alt="MaryJobins"
            width={32}
            height={32}
            priority
            className="rounded"  // remove if your asset is already square / rounded
          />
        </Link>

        {/* ── Nav links ───────────────────────────────────── */}
        {items.map(({ label, href, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-gibson text-base transition-all duration-200 text-cream ${
                isActive
                  ? 'underline underline-offset-4 decoration-charcoal'
                  : 'hover:underline hover:decoration-charcoal'
              } relative`}
            >
              {label}
              {badge && badge > 0 && (
                <span className="absolute -top-1 -right-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
