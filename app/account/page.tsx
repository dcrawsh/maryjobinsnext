/* app/account/page.tsx */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseBrowser';
import { Button } from '@/components/ui/button';

/**
 * Route: /account
 * A refined, sleek MaryJobins dashboard:
 * - Subscription overview
 * - Security actions
 * - Sign Out
 */
export default function AccountPage() {
  const { session, signOut } = useSession( { isProtectedRoute: false } );
  const userId = session?.user?.id;

  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userId)
        .single();
      if (!error && data) setSubscriptionStatus(data.subscription_status);
    })();
  }, [userId]);

  const hasSubscription = subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-white font-body text-charcoal">
      <div className="max-w-3xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-gibson text-4xl tracking-tight text-deep-navy">
            Welcome back,
          </h1>
          <p className="font-gibson text-2xl tracking-tight mb-2">
            {session?.user?.email}
          </p>
          <p className="text-sm text-charcoal/70">
            Your MaryJobins hub for account and subscription management.
          </p>
        </header>

        {/* Cards */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Subscription */}
            {/* <div className="flex-1 bg-white p-6 rounded-2xl ring-1 ring-border hover:ring-charcoal/20 transition"> */}
              {/* <h2 className="font-gibson text-xl text-deep-navy mb-1">
                Subscription
              </h2>
              <p className="text-sm mb-4">
                {subscriptionStatus === null
                  ? 'Loading status…'
                  : hasSubscription
                  ? 'Premium access active'
                  : 'Free tier – upgrade available'}
              </p> */}
              {/* {subscriptionStatus !== null && (
                hasSubscription ? (
                  <Link href="https://billing.stripe.com/p/login/test_28o16A2zKd9X1HicMM">
                    <Button className="w-full bg-deep-navy hover:bg-deep-navy/90 text-cream">
                      Manage Subscription
                    </Button>
                  </Link>
                ) : (
                  <Link href="/api/checkout">
                    <Button className="w-full bg-cherry-red hover:bg-cherry-red/90 text-cream">
                      Upgrade to Premium
                    </Button>
                  </Link>
                )
              )} */}
            {/* </div> */}

            {/* Security */}
            <div className="flex-1 bg-white p-6 rounded-2xl ring-1 ring-border hover:ring-charcoal/20 transition">
              <h2 className="font-gibson text-xl text-deep-navy mb-1">
                Security
              </h2>
              <p className="text-sm mb-4">
                Change your password or sign out from this session.
              </p>
              <Link href="/update-password">
              <Button className="w-full bg-deep-navy hover:bg-deep-navy/90 text-cream">
                  Change Password
                </Button>
              </Link>
            </div>
          </div>

          {/* Sign Out */}
          <div>
            <Button
              onClick={signOut}
              className="w-full bg-charcoal hover:bg-charcoal/90 text-cream"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}