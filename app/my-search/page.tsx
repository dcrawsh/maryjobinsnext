'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, LogOut } from 'lucide-react';
import JobSearchForm, { FormValues } from '@/app/my-search/JobSearchForm';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';

export default function Home() {
  const { session, signOut } = useSession();
  const [initialValues, setInitialValues] = useState<Partial<FormValues> | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    (async () => {
      const res = await fetch(`/api/latest-search?user_id=${session.user.id}`);
      const body = await res.json();
      setInitialValues(body.data); // may be null
    })();
  }, [session?.user?.id]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-4">


        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary rounded-full w-12 h-12 flex items-center justify-center">
              <Briefcase className="text-primary-foreground w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Your Job Search</CardTitle>
            <p className="text-muted-foreground text-sm italic">
              This is your most recent job search from the quiz. Make quick updates here, 
              or return to the quiz to explore more skills and alternate title suggestions.
            </p>
            <div className="mt-2">
              <Link href="/job-search-quiz">
                <Button variant="link" className="text-sm text-primary">
                  Return to Quiz
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {initialValues === null ? (
              <p className="text-center text-sm text-muted-foreground">Loading…</p>
            ) : (
              <JobSearchForm initialValues={initialValues} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
