// app/my-jobs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseBrowser';

interface Job {
  job_id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
}

export default function MyJobsPage() {
  const { session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      console.log('[MyJobs] No session yet');
      return;
    }

    console.log('[MyJobs] Current user ID:', session.user.id);

    const fetchJobs = async () => {
      try {
        // 1) fetch intersection rows for this user
        const { data: rows, error: err1 } = await supabase
          .from('user_jobs')
          .select('job_id')
          .eq('user_id', session.user.id);
        console.log('[MyJobs] Intersection rows:', rows, 'error:', err1);
        if (err1) throw err1;

        const jobIds = rows?.map(r => r.job_id) || [];
        console.log('[MyJobs] jobIds found:', jobIds);

        if (jobIds.length === 0) {
          setJobs([]);
          setLoading(false);
          return;
        }

        // 2) fetch job details
        const { data: jobsData, error: err2 } = await supabase
          .from('jobs')
          .select('job_id, title, company_name, location, job_type')
          .in('job_id', jobIds);
        console.log('[MyJobs] Job details:', jobsData, 'error:', err2);
        if (err2) throw err2;

        setJobs(jobsData || []);
      } catch (err: any) {
        console.error('[MyJobs] Error loading jobs:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [session]);

  if (!session) {
    return <div className="p-6">Please sign in to view your jobs.</div>;
  }
  if (loading) {
    return <div className="p-6">Loading your jobs…</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }
  if (jobs.length === 0) {
    return <div className="p-6">You have no saved jobs.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.job_id} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">{job.company_name}</p>
            <p className="text-gray-500">{job.location} · {job.job_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
