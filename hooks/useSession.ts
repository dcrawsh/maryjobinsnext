// hooks/useSession.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseBrowser';
import type { Session } from '@supabase/supabase-js';

type UseSessionOptions = {
  isProtectedRoute?: boolean;
};

/**
 * Hook that:
 * - Retrieves the Supabase session.
 * - Optionally redirects to /auth if unauthenticated.
 * - Listens for future auth changes.
 * - Exposes `signOut()` and `session`.
 */
export function useSession(options?: UseSessionOptions) {
  const isProtectedRoute = options?.isProtectedRoute !== false;
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    let initialCheckComplete = false;

    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data.session;
      if (!currentSession && isProtectedRoute) {
        router.replace('/auth');
      }
      setSession(currentSession);
      initialCheckComplete = true;
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession && isProtectedRoute && initialCheckComplete) {
        router.replace('/auth');
      }
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [router, isProtectedRoute]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  return { session, signOut };
}
