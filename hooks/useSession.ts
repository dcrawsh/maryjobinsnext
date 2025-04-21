// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import type { Session } from "@supabase/supabase-js";

/**
 * Hook that
 * 1. Grabs the current Supabase session on mount.
 * 2. Redirects to /auth if no session.
 * 3. Listens for future auth changes.
 * 4. Exposes signOut().
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. initial check
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth");
      } else {
        setSession(data.session);
      }
    });

    // 2. subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession) {
        router.replace("/auth");
      }
      setSession(newSession);
    });

    // 3. clean up on unmount
    return () => subscription.unsubscribe();
  }, [router]);

  /** Sign out helper */
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return { session, signOut };
}
