/* components/Nav.tsx */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseBrowser';

/**
 * Sleek MaryJobins navigation bar with real-time new job count badge
 */
export default function Nav() {
  const pathname = usePathname();
  const { session } = useSession({ isProtectedRoute: false });
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    // 1) helper to load the current count
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('user_jobs')
        .select('job_id', { head: true, count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'new');
      if (!error) setNewCount(count ?? 0);
    };
    fetchCount();

    // 2) subscribe to INSERT / UPDATE / DELETE on this user's jobs,
    //    and on every change simply re-fetch the count.
    const channel = supabase
      .channel(`realtime:user_jobs_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_jobs',
          filter: `user_id=eq.${userId}`,
        },
        fetchCount
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_jobs',
          filter: `user_id=eq.${userId}`,
        },
        fetchCount
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'user_jobs',
          filter: `user_id=eq.${userId}`,
        },
        fetchCount
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const items = [
    { label: 'Account', href: '/account' },
    { label: 'Job Search', href: '/' },
    { label: 'Job Listings', href: '/my-jobs', badge: newCount },
    { label: 'Quiz', href: '/job-search-quiz' },
  ];

  return (
    <nav id="mary-jobins-nav" className="bg-deep-navy border-b border-charcoal/20">
      <div className="max-w-5xl mx-auto flex items-center px-6 py-3 space-x-10">
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
