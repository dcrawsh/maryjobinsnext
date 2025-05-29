'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseBrowser';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const { session, signOut } = useSession();
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow space-y-8">
        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-deep-navy">
            Welcome back
          </h1>
          <p className="text-lg font-medium text-gray-800">
            {session?.user?.email}
          </p>
          <p className="text-sm text-charcoal/70">
            Your MaryJobins hub for account and subscription management.
          </p>
        </header>

        {/* Cards */}
        <div className="space-y-6">
          {/* Subscription (preserved as-is, just visually separated) */}
          {/* 
          <div className="bg-white p-6 rounded-xl ring-1 ring-border hover:ring-charcoal/20 transition">
            <h2 className="font-gibson text-lg text-deep-navy mb-2">
              Subscription
            </h2>
            <p className="text-sm mb-4">
              {subscriptionStatus === null
                ? 'Loading status…'
                : hasSubscription
                ? 'Premium access active'
                : 'Free tier – upgrade available'}
            </p>
            {subscriptionStatus !== null && (
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
            )}
          </div> 
          */}

          {/* Security Card */}
          <div className="bg-white p-6 rounded-xl ring-1 ring-border hover:ring-charcoal/20 transition">
            <h2 className="text-lg font-semibold text-deep-navy mb-2">
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

          {/* Sign Out Button */}
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
