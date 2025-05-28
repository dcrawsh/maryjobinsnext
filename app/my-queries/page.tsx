'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyQueriesPage() {
  const { session } = useSession({ isProtectedRoute: true });
  const [queries, setQueries] = useState<string[]|null>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/my-queries?user_id=${session.user.id}`)
      .then((r) => r.json())
      .then((b) => setQueries(b.queries))
      .catch(() => setQueries([]));
  }, [session?.user]);

  if (!session) return null;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Most Recent Queries</CardTitle>
          </CardHeader>
          <CardContent>
            {queries === null ? (
              <p>Loading…</p>
            ) : queries.length === 0 ? (
              <p>No queries found for your latest search.</p>
            ) : (
                <ol className="list-decimal list-inside pl-5 space-y-2">
                {queries.map((q, i) => (
                  <li key={i} className="break-all">
                    {q}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
        <div className="text-center">
          <Link href="/my-jobs">
            <Button variant="link">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
